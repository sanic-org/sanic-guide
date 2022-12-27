# 后台任务(Background tasks)

## 创建任务(Creating Tasks)
在异步 Python 里使用 [任务](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task) 是非常简单方便的，Sanic 提供了一种简单的方法来将任务添加到**当前运行**的 loop 当中, 它有点类似于 `asyncio.create_task`。 Sanic provides a convenient method to add tasks to the currently **running** loop. It is somewhat similar to `asyncio.create_task`. 关于在 "应用程序" loop 运行之前添加任务，请参见下一节。

```python
async def receiver(ws):
    while True:
        message = await ws.recv()
        if not message:
            break
        print(f"Received: {message}")

@app.websocket("/feed")
async def feed(request, ws):
    task_name = f"receiver:{request.id}"
    request.app.add_task(receiver(ws), name=task_name)
    try:
        while True:
            await request.app.event("my.custom.event")
            await ws.send("A message")
    finally:
        # 当 websocket 关闭连接的时候，我们可以清除所有的任务。

await request.app.cancel_task(task_name)
        request.app.purge_tasks()
```

---:1

Sanic 将尝试自动注入该应用程序，并将应用程序作为任务的参数进行传递。 :--:1
```python
async def auto_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(auto_inject)
```
:---

---:1

或者您可以选择显式的将 `app` 作为传递参数。 :--:1
```python
async def explicit_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(explicit_inject(app))
```
:---

## 在 `app.run` 之前添加任务(Adding tasks before `app.run`)

It is possible to add background tasks before the App is run ie. before `app.run`. 在 app 运行前是可以添加后台任务的。 为了完成这个目的，您应该为 `Sanic.add_task` 方法传入一个可调用的对象，即使用 `async` 定义的函数本身，而不是一个协程对象（调用 `async` 函数后得到的对象），当传入可调用对象之后，Sanic 将为 **每一个** 子程序都创建该任务。 Note: the tasks that are added such are run as `before_server_start` jobs and thus run on every worker (and not in the main process). 这将会产生一些后果：请查看[这个问题](https://github.com/sanic-org/sanic/issues/2139)的[这条评论](https://github.com/sanic-org/sanic/issues/2139#issuecomment-868993668)来获取更多信息。

要想只为主进程添加任务，您应该考虑使用 [`@app.main_process_start`](./listeners.md)添加任务。 注意：任务没完成子进程将无法启动。

---:1

注意：这样添加的任务是在 `before_server_start` 阶段工作的，因此在每个子进程都会有该任务（而不是在主进程中）。
```python
async def slow_work():
   ...

async def even_slower(num):
   ...

app = Sanic(...)
async def slow_work(...):
   ...

app = Sanic(...)
app.add_task(slow_work) # Note: we are passing the callable and not coroutine object `slow_work(...)`
app.run(...)
app.add_task(even_slower(10)) # ... or we can call the function and pass the coroutine.
app.run(...)
```

## 命名任务(Named tasks)

_这只适用于 Python3.8 及以上版本_

当您创建任务的时候，您可以为您的任务指定一个名称，方便您后续进行任务追踪。

:--:1
```python
app.add_task(slow_work, name="slow_task")
```
:---

:---:1

:--:1
```python
task = app.get_task("slow_task")
```
:---

如果您想要取消任务，您可以通过 `cacle_task` 来进行操作，当然，该方法也是异步的，请确保使用时添加了 `await`。 Make sure that you `await` it.

:--:1
```python
await app.cancel_task("slow_task")
```
:---

所有注册的任务都可以在 `app.tasks` 属性中找到。 为了防止已取消的任务填满，您可能需要运行 `app.purge_tasks` 来清除所有已完成或已取消的任务。

:--:1
```python
app.purge_tasks()
```
:---

这种模式对于 websocket 来说非常有用：

之后，您可以使用 `get_task` 方法从应用程序的任何地方查看您的任务。

@app.websocket("/feed") async def feed(request, ws): task_name = f"receiver:{request.id}" request.app.add_task(receiver(ws), name=task_name) try: while True: await request.app.event("my.custom.event") await ws.send("A message") finally: # When the websocket closes, let's cleanup the task await request.app.cancel_task(task_name) request.app.purge_tasks() ::: *Added in v21.12*
