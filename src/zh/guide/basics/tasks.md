# 后台任务(Background tasks)

## 创建任务(Creating Tasks)

在异步 Python 里使用 [任务](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task) 是非常简单方便的，Sanic 提供了一种简单的方法来将任务添加到**当前运行**的 loop 当中, 它有点类似于 `asyncio.create_task`。关于在 "应用程序" loop 运行之前添加任务，请参见下一节。

```python
async def notify_server_started_after_five_seconds():
    await asyncio.sleep(5)
    print('Server successfully started!')

app.add_task(notify_server_started_after_five_seconds())
```

---:1

Sanic 将尝试自动注入该应用程序，并将应用程序作为任务的参数进行传递。

:--:1

```python
async def auto_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(auto_inject)
```
:---

---:1

或者您可以选择显式的将 `app` 作为传递参数。 

:--:1

```python
async def explicit_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(explicit_inject(app))
```

:---

## 在 `app.run` 之前添加任务(Adding tasks before `app.run`)

在 app 运行前是可以添加后台任务的。为了完成这个目的，您应该为 `Sanic.add_task` 方法传入一个可调用的对象，即使用 `async` 定义的函数本身，而不是一个协程对象（调用 `async` 函数后得到的对象），当传入可调用对象之后，Sanic 将为 **每一个** 子程序都创建该任务。

注意：这样添加的任务是在 `before_server_start` 阶段工作的，因此在每个子进程搜会有该任务（而不是在主进程中）。

这将会产生一些后果：请查看[这个问题](https://github.com/sanic-org/sanic/issues/2139)的[这条评论](https://github.com/sanic-org/sanic/issues/2139#issuecomment-868993668)来获取更多信息。

要想只为主进程添加任务，您应该考虑使用 [`@app.main_process_start`](./listeners.md)添加任务。注意：任务没完成子进程将无法启动。

---:1

示例代码：

:---:1

```python
async def slow_work(...):
   ...

app = Sanic(...)
app.add_task(slow_work) # Note: we are passing the callable and not coroutine object `slow_work(...)`
app.run(...)

```
::: tip

如果您想要为 `slow_work` 绑定一些参数，可以使用 `functools.partial`。

:::