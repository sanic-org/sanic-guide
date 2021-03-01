# 后台任务(Background tasks)

在异步 Python 里使用 [任务](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task) 是非常简单方便的，Sanic 提供了一种简单的方法来将 任务 添加到当前运行的 loop 当中, 它有点类似于 `asyncio.create_task`

```python
async def notify_server_started_after_five_seconds():
    await asyncio.sleep(5)
    print('Server successfully started!')

app.add_task(notify_server_started_after_five_seconds())
```

---:1

Sanic将尝试自动注入该应用程序，并将应用程序作为任务的参数进行传递。

:--:1

```python
async def auto_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(auto_inject)
```
:---

---:1

或者您可以选择显式的将`app`作为传递参数。 

:--:1

```python
async def explicit_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(explicit_inject(app))
```
:---
