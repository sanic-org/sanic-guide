# 快速开始(Getting Started)

在我们开始之前，请确保您使用的是 Python3.7 或更高版本。 目前已知可以使用的 Python 版本包括：3.7，3.8 和 3.9。

## 安装(Install)

```bash
pip install sanic
```

## Hello, world 应用(Hello, world application)

---:1

如果您熟悉其他任意一款基于装饰器的框架，那么您可能对此感觉有些亲切。

如果您来自 Flask 或其他框架，则需要指出一些重要的事情。 请记住，Sanic 旨在提高性能、灵活性和易用性。 这些指导原则对 API 及其工作方式产生了重要影响。 :::



:--:1

```python
from sanic import Sanic
from sanic.response import text

app = Sanic("MyHelloWorldApp")

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

:---

### 注意(Important to note)

- 每一个请求响应函数都可以使用同步方式（`def hello_world`）和异步方式（`async def hello_world`）进行声明。 除非您有一个明确的需求和完善的使用方法，否则的话，请尽量使用 `async` 来声明响应函数。
- `request` 对象始终是响应函数的第一个参数。 其他框架在需要导入的上下文变量中进行传递。 在 `async` 的世界里，如果使用隐式传递，那么它将无法完美的运行，更何况还要兼顾简洁且高效的表现形式。
- 您 **必须** 使用 `Response` 或继承自 `Response` 的类作为响应类型。 在许多其他框架中，它们允许您使用诸如 `return "Hello World"` 或者 `return {"foo":"bar"}` 的方式来进行返回，但是为了执行这类隐式调用，需要在响应流程中的某个位置花费大量的时间来确定您到底想要表达什么意思。 But, in order to do this implicit calling, somewhere in the chain needs to spend valuable time trying to determine what you meant. So, at the expense of this ease, Sanic has decided to require an explicit call.

### 运行(Running)

---:1 Let's save the above file as `server.py`. And launch it. :--:1
```bash
sanic server.app
```
:---

这是 **另一个** 重要的区别。 其他框架带有一个内置的开发服务器，并明确表示它只用于开发。 而 Sanic 的情况恰好相反。

让我们将上面写好的文件保存为 `server.py`， 然后运行它。

## Sanic 拓展(Sanic Extensions)

Sanic 致力于构建一个简洁且没有任何偏见的特征表。 该项目不想要求您以某种方式构建应用程序，并试图避免指定特定的开发模式。 有许多由社区构建和维护的第三方插件，用于添加不符合核心库要求的附加功能。

请查看 [插件文档](../plugins/sanic-ext/getting-started.md) 来了解如何使用拓展插件。

- **OpenAPI** 使用 Redoc 和/或 Swagger 的文档
- **CORS** 保护
- **依赖注入** 路由处理程序
- Request 参数 **检查**
- 自动创建 `HEAD`, `OPTIONS`, 和 `TRACE` 响应函数
- 响应序列化

::: tip 小提示

---:1
```
$ pip install sanic[ext]
```
:--:1
```
$ pip install sanic sanic-ext
```
:---

从 v21.12 开始，如果在相同的环境中，Sanic 将自动设置 Sanic 扩展。 您可以通过以下的两种方式来进行访问拓展功能:

- `app.extend()` - 用于配置 Sanic 拓展
- `app.ext` - 注入到应用程序的扩展实例

但是，为了 **帮助 API 开发者** ，Sanic 组织维护了一个名为 [Sanic Extensions](../plugins/sanic-ext/getting-started.md) 的项目来提供各种易用的功能，包括:
