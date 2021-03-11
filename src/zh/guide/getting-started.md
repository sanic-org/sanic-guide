#  快速开始(Getting Started)

在我们开始之前，请确保您使用的是 Python3.7 或更高版本。目前已知可以使用的 Python 版本包括：3.7，3.8 和 3.9。

## 安装(Install)

```bash
pip install sanic
```

## Hello, world 应用(Hello, world application)

---:1

如果您熟悉其他任意一款基于装饰器的框架，那么您可能对此感觉有些亲切。

::: tip 小提示

如果您来自 Flask 或其他框架，则需要指出一些重要的事情。 请记住，Sanic 旨在提高性能、灵活性和易用性。 这些指导原则对 API 及其工作方式产生了重要影响。

:::

:--:1

```python
from sanic import Sanic
from sanic.response import text

app = Sanic("My Hello, world app")

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

:---

### 注意

- 每一个请求处理函数都可以使用同步方式（` def hello_world `）和异步方式（` async def hello_world `）进行声明。除非你有一个明确的需求和完善的使用方法，否则的话，请尽量使用 `async` 来声明处理函数。

- `request` 对象始终是处理函数的第一个参数。 其他框架在需要导入的上下文变量中进行传递。 在 `async` 的世界里，如果使用隐式传递，那么它将无法完美的运行，更何况还要兼顾简洁且高效的表现形式。所以我们在这里进行显式传递。

- 您 **必须** 使用 `Response` 或继承自 `Response` 的类作为响应类型。在许多其他框架中，它们允许您使用诸如 `return "Hello World"` 或者 `return {"foo":"bar"}` 的方式来进行返回，但是为了执行这类隐式调用，需要在响应流程中的某个位置花费大量的时间来确定您到底想要表达什么意思。因此，我们以轻松调用为代价，来提升服务的响应速度，Sanic 会要求您对您的响应进行显式调用。

### 运行

---:1

让我们将上面写好的文件保存为`sanic.py`， 然后运行它。

:--:1

```bash
sanic server.app
```

:---

::: tip 小提示

这是 **另一个** 重要的区别。其他框架带有一个内置的开发服务器，并明确表示它只用于开发。而 Sanic 的情况恰好相反。

**可以用于生产环境的服务器已经准备就绪**

:::
