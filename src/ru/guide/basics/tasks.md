# Фоновые задачи

## Создание задач
Часто в асинхронном Python хочется использовать [задачи](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task), и это очень удобно. Sanic предоставляет удобный метод добавления задач к текущему **запущенному** циклу событий. Он чем-то похож на `asyncio.create_task`. См. следующий раздел для добавления задач до запуска цикла приложения.

```python
async def notify_server_started_after_five_seconds():
    await asyncio.sleep(5)
    print('Server successfully started!')

app.add_task(notify_server_started_after_five_seconds())
```

---:1

Sanic попытается автоматически внедрить приложение в задачу, передав его в качестве аргумента. :--:1
```python
async def auto_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(auto_inject)
```
:---

---:1

Или вы можете передать аргумент `app` явно. :--:1
```python
async def explicit_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(explicit_inject(app))
```
:---

## Добавление задач до `app.run`

Можно добавить фоновые задачи перед запуском приложения, т.е. до `app.run`. Чтобы добавить задачу перед запуском приложения, рекомендуется не передавать объект корутины (т. е. чтобы задача создавалась посредством вызова `асинхронного` вызываемого объекта). Вместо этого просто передавайте сам вызываемый объект, а Sanic создаст объект корутины на **каждый воркер**. Примечание: добавленные задачи выполняются как задачи `before_server_start` и таким образом запускаются в каждом воркере (и не в главном процессе). Это имеет определенные последствия. Пожалуйста, прочитайте [этот комментарий](https://github.com/sanic-org/sanic/issues/2139#issuecomment-868993668) по [этой проблеме](https://github.com/sanic-org/sanic/issues/2139) для получения дополнительной информации.

Чтобы добавить задачу к основному процессу, попробуйте добавить её посредством [`@app.main_process_start`](./listeners.md). Примечание: воркеры не запустятся до тех пор, пока задача не завершится.

---:1

Пример добавления задачи до `app.run` :---:1
```python
async def slow_work():
   ...

async def even_slower(num):
   ...

app = Sanic(...)
app.add_task(slow_work) # Примечание: мы передаем вызываемый объект, а не корутину...
app.add_task(even_slower(10)) # ... или мы можем вызвать функцию и передать корутину.
app.run(...)
```

## Именованные задачи

_Поддерживается только в Python 3.8+_

---:1 При создании задачи вы можете попросить Sanic отслеживать её для вас, указав её `имя`.

:--:1
```python
app.add_task(slow_work, name="slow_task")
```
:---

---:1 Теперь вы можете получить экземпляр этой задачи из любого места в вашем приложении, используя `get_task`.

:--:1
```python
task = app.get_task("slow_task")
```
:---

---:1 Если эта задача должна быть отменена, вы можете это сделать при помощи `cancel_task`. Убедитесь, что вы указали на ней `await`.

:--:1
```python
await app.cancel_task("slow_task")
```
:---

---:1 Все зарегистрированные задачи можно найти в свойстве `app.tasks`. Чтобы предотвратить выполнение отмененных задач, вы можете вызвать `app.purge_tasks`, который очистит все выполненные или отмененные задачи.

:--:1
```python
app.purge_tasks()
```
:---

Этот паттерн может быть особенно полезен с `веб-сокетами`:

```python async def receiver(ws): while True: message = await ws.recv() if not message: break print(f"Received: {message}")

@app.websocket("/feed") async def feed(request, ws): task_name = f"receiver:{request.id}" request.app.add_task(receiver(ws), name=task_name) try: while True: await request.app.event("my.custom.event") await ws.send("A message") finally: # Очистим задачу, когда сокет закроется await request.app.cancel_task(task_name) request.app.purge_tasks() :::
