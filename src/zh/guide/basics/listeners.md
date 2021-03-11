# 监听器(Listeners)

在工作流程的生命周期中，Sanic 为您提供了 4 个切入点来帮助您注入操作，它可以方便您在服务器启动或关闭时挂载/拆卸某些代码。

- `before_server_start`
- `after_server_start`
- `before_server_stop`
- `after_server_stop`

工作流程的生命周期如下：

```text
[event]     |  <worker process starts>
[listener]  |      @app.before_server_start
[event]     |          <server started>
[listener]  |              @app.after_server_start
            |
[event]     |                  <serving requests>
[event]     |                  <graceful shutdown initiated>
[event]     |                  <complete remaining requests>
            |
[listener]  |              @app.before_server_stop
[event]     |          <server stopped>
[listener]  |      @app.after_server_stop
[event]     |  <process exits>
```

## 启用监听器(Attaching a listener)

---:1

将函数设置为侦听器的过程类似于声明路由。

两个注入的参数是当前正在运行 `Sanic()` 的实例和当前正在运行的循环。

:--:1

```python
async def setup_db(app, loop):
    app.db = await db_setup()

app.register_listener(setup_db, "before_server_start")
```
:---

---:1

您也可以通过装饰器的方式来将函数添加为监听器。

:--:1

```python
@app.listener("before_server_start")
async def setup_db(app, loop):
    app.db = await db_setup()
```
:---

---:1
::: new v21.3 新增
您可以进一步缩短该装饰器的调用代码。如果您的IDE有自动补全应该会有很有用。
:::
:--:1
```python
@app.before_server_start
async def setup_db(app, loop):
    app.db = await db_setup()
```
:---

## 执行顺序(Order of execution)

听器按启动期间声明的顺序正向执行，并在拆解期间按照注册顺序反向执行。

|                       | 执行阶段 | 执行顺序 |
| :-------------------: | :------: | :------: |
| `before_server_start` | 启动阶段 | 正向执行 |
| `after_server_start`  | 启动阶段 | 正向执行 |
| `before_server_stop`  | 关闭阶段 | 反向执行 |
|  `after_server_stop`  | 关闭阶段 | 反向执行 |

以下列代码为例，我们在执行之后看到的输出内容应该是这样的：

---:1

```python
@app.listener("before_server_start")
async def listener_1(app, loop):
    print("listener_1")

@app.listener("before_server_start")
async def listener_2(app, loop):
    print("listener_2")

@app.listener("after_server_start")
async def listener_3(app, loop):
    print("listener_3")

@app.listener("after_server_start")
async def listener_4(app, loop):
    print("listener_4")

@app.listener("before_server_stop")
async def listener_5(app, loop):
    print("listener_5")

@app.listener("before_server_stop")
async def listener_6(app, loop):
    print("listener_6")

@app.listener("after_server_stop")
async def listener_7(app, loop):
    print("listener_7")

@app.listener("after_server_stop")
async def listener_8(app, loop):
    print("listener_8")
```
:--:1
```bash
[INFO] Goin' Fast @ http://127.0.0.1:8000
listener_1
listener_2
listener_3
listener_4
[INFO] Starting worker
[INFO] Stopping worker
listener_6
listener_5
listener_8
listener_7
[INFO] Server Stopped
```
:---

::: tip 小提示：

在实际的使用过程中，如果您定义了一个数据库连接函数，并将其注册为 `before_server_start` 的第一个监听器，那么在此之后注册的所有监听器都可以依靠该连接保持活跃状态。

:::

