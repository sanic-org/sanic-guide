# 백그라운드 작업(Background tasks)

## Creating Tasks
비동기 Python에서 [tasks](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task)을 사용하는 것이 바람직하고 매우 편리합니다. Sanic은 작업을 현재 실행 중인 루프에 추가할 수 있는 편리한 방법을 제공합니다. 이것은 `asyncio.create_task`와 다소 비슷합니다. For adding tasks before the 'App' loop is running, see next section.

```python
async def notify_server_started_after_five_seconds():
    await asyncio.sleep(5)
    print('Server successfully started!')

app.add_task(notify_server_started_after_five_seconds())
```

---:1

Sanic은 자동으로 앱을 주입하여 인수로 작업에 전달합니다. :--:1
```python
async def auto_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(auto_inject)
```
:---

---:1

또는 `app` 인수를 명시적으로 전달할 수 있습니다. :--:1
```python
async def explicit_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(explicit_inject(app))
```
:---

## `app.run` 전에 작업 추가 (Adding tasks before `app.run`)

앱이 실행되기 전에 백그라운드 작업을 추가할 수 있습니다. `app.run` 전에. To add a task before the App is run, it is recommended to not pass the coroutine object (ie. one created by calling the `async` callable), but instead just pass the callable and Sanic will create the coroutine object on **each worker**. 참고: 추가된 작업은 'before_server_start' 작업으로 실행되므로 모든 작업자(메인 프로세스가 아님 에서 실행됩니다.이것은 특정한 결과를 가져옵니다. 자세한 내용은 이 [issue](https://github.com/sanic-org/sanic/issues/2139)에 대한 [comment](https://github.com/sanic-org/sanic/issues/2139#issuecomment-868993668)을 읽으십시오.

메인 프로세스에 작업을 추가하려면 [`@app.main_process_start`](./listeners.md)에 작업을 추가하는 것이 좋습니다. 참고: 작업자는 이 작업이 완료될 때까지 시작되지 않습니다.

---:1

`app.run` 전에 작업을 추가하는 예 :---:1
```python
async def slow_work(...):
   ...

async def even_slower(num):
   ...

app = Sanic(...)
app.add_task(slow_work) # Note: we are passing the callable and not coroutine object `slow_work(...)`
app.run(...)
app.add_task(even_slower(10)) # ... or we can call the function and pass the coroutine.
app.run(...)
```

## Named tasks

_This is only supported in Python 3.8+_

---:1 When creating a task, you can ask Sanic to keep track of it for you by providing a `name`.

:--:1
```python
app.add_task(slow_work, name="slow_task")
```
:---

---:1 You can now retrieve that task instance from anywhere in your application using `get_task`.

:--:1
```python
task = app.get_task("slow_task")
```
:---

---:1 If that task needs to be cancelled, you can do that with `cancel_task`. Make sure that you `await` it.

:--:1
```python
await app.cancel_task("slow_task")
```
:---

---:1 All registered tasks can be found in the `app.tasks` property. To prevent cancelled tasks from filling up, you may want to run `app.purge_tasks` that will clear out any completed or cancelled tasks.

:--:1
```python
app.purge_tasks()
```
:---

This pattern can be particularly useful with `websockets`:

```python async def receiver(ws): while True: message = await ws.recv() if not message: break print(f"Received: {message}")

@app.websocket("/feed") async def feed(request, ws): task_name = f"receiver:{request.id}" request.app.add_task(receiver(ws), name=task_name) try: while True: await request.app.event("my.custom.event") await ws.send("A message") finally: # When the websocket closes, let's cleanup the task await request.app.cancel_task(task_name) request.app.purge_tasks() ::: *Added in v21.12*
