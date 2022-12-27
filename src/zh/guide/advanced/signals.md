# 信号(Signals)

信号可以让您应用中的不同部分可以相互通讯。

```python
@app.signal("user.registration.created")
async def send_registration_email(**context):
    await send_email(context["email"], template="registration")

@app.post("/register")
async def handle_registration(request):
    await do_registration(request)
    await request.app.dispatch(
        "user.registration.created",
        context={"email": request.json.email}
    })
```

## 添加信号(Adding a signal)

---:1 如果该信号需要条件参数，请确保在添加信号处理函数的时候加上它。 :--:1
```python
async def my_signal_handler():
    print("something happened")

app.add_signal(my_signal_handler, "something.happened.ohmy")
```
:---

---:1 But, perhaps a slightly more convenient method is to use the built-in decorators. :--:1
```python
@app.signal("something.happened.ohmy")
async def my_signal_handler():
    print("something happened")
```
:---

---:1 If the signal requires conditions, make sure to add them while adding the handler. :--:1
```python
async def my_signal_handler1():
    print("something happened")

app.add_signal(
    my_signal_handler,
    "something.happened.ohmy1",
    conditions={"some_condition": "value"}
)

@app.signal("something.happened.ohmy2", conditions={"some_condition": "value"})
async def my_signal_handler2():
    print("something happened")
```
:---

---:1 Signals can also be declared on blueprints :--:1
```python
bp = Blueprint("foo")

@bp.signal("something.happened.ohmy")
async def my_signal_handler():
    print("something happened")
```
:---

## 内置信号（Built-in signals）

除了创建新信号外，还有许多从 Sanic 自身发出的内置信号。 这些信号的存在为开发人员提供了更多将功能添加到请求和服务器生命周期中的机会。

*Added in v21.9*

---:1 You can attach them just like any other signal to an application or blueprint instance. :--:1
```python
@app.signal("http.lifecycle.complete")
async def my_signal_handler(conn_info):
    print("Connection has been closed")
```
:---

These signals are the signals that are available, along with the arguments that the handlers take, and the conditions that attach (if any).


| Event name                 | Arguments                       | Conditions                                                |
| -------------------------- | ------------------------------- | --------------------------------------------------------- |
| `http.routing.before`      | request                         |                                                           |
| `http.routing.after`       | request, route, kwargs, handler |                                                           |
| `http.handler.before`      | request                         |                                                           |
| `http.handler.after`       | request                         |                                                           |
| `http.lifecycle.begin`     | conn_info                       |                                                           |
| `http.lifecycle.read_head` | head                            |                                                           |
| `http.lifecycle.request`   | request                         |                                                           |
| `http.lifecycle.handle`    | request                         |                                                           |
| `http.lifecycle.read_body` | body                            |                                                           |
| `http.lifecycle.exception` | request, exception              |                                                           |
| `http.lifecycle.response`  | request, response               |                                                           |
| `http.lifecycle.send`      | data                            |                                                           |
| `http.lifecycle.complete`  | conn_info                       |                                                           |
| `http.middleware.before`   | request, response               | `{"attach_to": "request"}` or `{"attach_to": "response"}` |
| `http.middleware.after`    | request, response               | `{"attach_to": "request"}` or `{"attach_to": "response"}` |
| `server.init.before`       | app, loop                       |                                                           |
| `server.init.after`        | app, loop                       |                                                           |
| `server.shutdown.before`   | app, loop                       |                                                           |
| `server.shutdown.after`    | app, loop                       |                                                           |

Version 22.9 added `http.handler.before` and `http.handler.after`.

为了更方便的使用内置信号，Sanic 设置了一个 `Enum` 对象，其中包含了所有允许的内置信号。 您无需记住字符串形式的事件名称即可直接使用。

*Added in v21.12* :--:1
```python
from sanic.signals import Event

@app.signal(Event.HTTP_LIFECYCLE_COMPLETE)
async def my_signal_handler(conn_info):
    print("Connection has been closed")
```
:---

## 事件(Events)

信号是基于一个 _event_ 的一个事件，就是一个简单的字符串，它由以下部分组成如下： An event, is simply a string in the following pattern: :--:1
```
namespace.reference.action
```
:---

事件必须包含三个部分。 如果您不是很清楚怎么声明一个事件，可以看看下面这些例子：

- `my_app.something.happened`
- sanic.notice.hello

### 事件参数(Event parameters)

一个事件可以是“动态的”，其动态的部分使用与 [路由参数](../basics/routing.md#path-parameters) 相同的语法来声明。 这允许事件根据任意值进行匹配。 :--:1
```python
@app.signal("foo.bar.<thing>")
async def signal_handler(thing):
    print(f"[signal_handler] {thing=}")

@app.get("/")
async def trigger(request):
    await app.dispatch("foo.bar.baz")
    return response.text("Done.")
```
:---

查看 [路由参数](../basics/routing.md#path-parameters) 一节来获取更多信息。

只有事件的第三部分（“动作”部分）可以是动态的：

- `foo.bar.<thing>` :ok:
- `foo.<bar>.baz` :x:

### 等待(Waiting)

除了主动分发信号来执行事件的响应函数，您的应用程序还可以被动地等待事件被触发。 :--:1
```python
await app.event("foo.bar.baz")
```
:---

**重要**：等待是一个阻塞的动作。 因此您可能会想使用 [后台任务](../basics/tasks.md) 来实现类型的功能。 :--:1
```python
async def wait_for_event(app):
    while True:
        print("> waiting")
        await app.event("foo.bar.baz")
        print("> event found\n")

@app.after_server_start
async def after_server_start(app, loop):
    app.add_task(wait_for_event(app))
```
:---

---:1 If your event was defined with a dynamic path, you can use `*` to catch any action. :--:1
```python
@app.signal("foo.bar.<thing>")

...

@app.signal("foo.bar.<thing>")

...

await app.event("foo.bar.*")
```
:---

## 分发(Dispatching)

*未来，Sanic 将自动分发一些事件，以帮助开发人员注入程序和请求生命周期。*

:::

1. 执行所有和该事件绑定的响应函数。
2. 触发任何正在“等待”该事件的响应函数。 :--:1
```python
@app.signal("foo.bar.<thing>")
async def foo_bar(thing):
    print(f"{thing=}")

await app.dispatch("foo.bar.baz")
```
```
thing=baz
```
:---

### 上下文(Context)

---:1 Sometimes you may find the need to pass extra information into the signal handler. 在上面的第一个例子中，我们希望在注册的事件中能够获取用户使用的电子邮件地址。 :--:1
```python
@app.signal("user.registration.created")
async def send_registration_email(**context):
    print(context)

await app.dispatch(
    "user.registration.created",
    context={"hello": "world"}
)
```
```
{'hello': 'world'}
```
:---

::: tip FYI
Signals are dispatched in a background task.
:::

### 蓝图(Blueprints)

在蓝图中分发信号的工作机制类似于 [中间件](.../basics/middleware.md)。 在应用层面所分发的任何信号，都会传递到蓝图上。 但如果只在蓝图上分发，就只会执行在该蓝图上定义的信号响应函数。

::: warning
```python
bp = Blueprint("bp")

app_counter = 0
bp_counter = 0

@app.signal("foo.bar.baz")
def app_signal():
    nonlocal app_counter
    app_counter += 1

@bp.signal("foo.bar.baz")
def bp_signal():
    nonlocal bp_counter
    bp_counter += 1
```
:---

调用 `app.dispatch("foo.bar.baz")` 将触发两个信号响应函数。 :--:1
```python
await app.dispatch("foo.bar.baz")
assert app_counter == 1
assert bp_counter == 1
```
:---

调用 `bp.dispatch("foo.bar.baz")` 将只触发一个信号响应函数。 :--:1
```python
await bp.dispatch("foo.bar.baz")
assert app_counter == 1
assert bp_counter == 2
```
:---
