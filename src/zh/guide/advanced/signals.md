# 信号（Signals）

::: new v21.3 新增
即将介绍的是全新的API。
:::

::: warning 该功能还处于BETA阶段

由于是BETA版本，该API可能发生改动，且在非必要的情况下，不会大改。现在发布是为了让开发者可以尽早开始使用该功能，并且我们会在最终版本（目前计划是v21.6）之前继续完善它。

最终，信号将提供注入请求/响应生命周期的能力。
:::

信号可以让您应用中的不同部分可以相互通讯。

```python
@app.signal("user.registration.created")
async def send_registration_email(context):
    await send_email(context["email"], template="registration")

@app.post("/register")
async def handle_registration(request):
    await do_registration(request)
    await request.app.dispatch(
        "user.registration.created",
        context={"email": request.json.email}
    })
```

## 添加信号（Adding a signal）

---:1
添加信号的API十分像添加路由的。
:--:1
```python
async def my_signal_handler():
    print("something happened")

app.add_signal(my_signal_handler, "something.happened.ohmy")
```
:---

---:1
同样的，信号也内置了装饰器来提供了便捷的注册方法。
:--:1
```python
@app.signal("something.happened.ohmy")
async def my_signal_handler():
    print("something happened")
```
:---

---:1
信号也可以在注册在蓝图上。
:--:1
```python
bp = Blueprint("foo")

@bp.signal("something.happened.ohmy")
async def my_signal_handler():
    print("something happened")
```
:---


## 事件（Events）

---:1
信号是基于一个 *事件* 的。一个事件，就是一个简单的字符串，它由以下部分组成如下：

:--:1
```
namespace.reference.action
```
:---

::: tip
事件必须包含三个部分。如果您不是很清楚怎么声明一个事件，可以看看下面这些例子：

- `my_app.something.happened`
- `sanic.notice.hello`
:::

### 事件参数（Event parameters）

---:1
一个事件可以是“动态的”，其动态的部分使用与[路由参数](../basics/routing.md#path-parameters)相同的语法来声明。这允许事件根据任意值进行匹配。

:--:1
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

::: warning
只有事件的第三部分（“动作”部分）可以是动态的：

- `foo.bar.<thing>` :ok:
- `foo.<bar>.baz` :x:
:::

### 等待（Waiting）

---:1
除了主动分发信号来执行事件的响应函数，您的应用程序还可以被动地等待事件被触发。
:--:1
```python
await app.event("foo.bar.baz")
```
:---

---:1
**重要**：等待是一个阻塞的动作。因此您可能会想使用 [后台任务](../basics/tasks.md) 来实现类型的功能。
:--:1
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

---:1
您可以使用 `*` 符号来匹配任意动态事件。
:--:1
```python
@app.signal("foo.bar.<thing>")

...

await app.event("foo.bar.*")
```
:---

## 分发（Dispatching）

*未来，Sanic将自动分发一些事件，以帮助开发人员注入程序和请求生命周期。*

---:1

分发事件后将会做两件事件：

1. 执行所有和该事件绑定的响应函数，并且
2. 触发任何正在“等待”该事件的响应函数。

:--:1
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

### 上下文（Context）

---:1

有时您会需要向信号的响应函数中传递额外的信息。在上面的第一个例子中，我们希望在注册的事件中能够获取用户使用的电子邮件地址。

:--:1
```python
@app.signal("user.registration.created")
async def send_registration_email(context):
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

::: tip 小提示
信号是在后台任务中分发的。
:::

### 蓝图（Blueprints）

在蓝图中分发信号的工作机制类似于[中间件](.../basics/middleware.md)。在应用层面所分发的任何信号，都会传递到蓝图上。但如果只在蓝图上分发，就只会执行在该蓝图上定义的信号响应函数。

---:1

下面的例子可以更好解释：

:--:1
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

---:1

调用 `app.dispatch("foo.bar.baz")` 将触发两个信号响应函数。

:--:1
```python
await app.dispatch("foo.bar.baz")
assert app_counter == 1
assert bp_counter == 1
```
:---

---:1
调用 `bp.dispatch("foo.bar.baz")` 将只触发一个信号响应函数。

:--:1
```python
await bp.dispatch("foo.bar.baz")
assert app_counter == 1
assert bp_counter == 2
```
:---
