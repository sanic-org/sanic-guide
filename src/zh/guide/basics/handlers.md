# 响应函数(Handlers)

第二个重要的组件就是响应函数(Handlers)，也就是我们通常所说的视图(views)。

在 Sanic 中，响应函数可以是任何一个可调用程序，它至少以一个 `request` 实例作为参数，并返回一个 `HTTPResponse` 实例或一个执行其他操作的协同程序作为响应。

---:1

哈? :flushed:

它既可以是一个普通函数，也可以是一个异步的函数。

它的工作是响应指定端点的访问， 并执行一些指定的操作，所以这里是承载业务逻辑代码的地方。

:--:1

```python
def i_am_a_handler(request):
    return HTTPResonse()

async def i_am_ALSO_a_handler(request):
    return HTTPResonse()
```

:---

::: tip 小提示：

如果您想要了解更多关于封装逻辑的信息，可以通过 [基于类的视图](/zh/guide/advanced/class-based-views.md) 这一章节来了解更多

:::

---:1

之后，您需要做的就只是将其挂载到服务端点上。 在 [路由](/zh/guide/basics/routing.md) 这一章节，我们将会了解更多相关的内容

让我们来用一个示例进行讲解：

- 我们在响应函数实例中使用了装饰器：`@app.get()`
- 我们还使用了函数 `text()` 来快速的生成一个文本类型的响应对象。 

任务完成 :muscle:

:--:1

```python
from sanic.response import text

@app.get("/foo")
async def foo_handler(request):
    return text("I said foo!")
```
:---

---

## 关于 async …(A word about async...)

---:1

编写普通的响应函数是完全可行的。

在下面的例子中，我们通过  `time.sleep()` 方法来等待 100 毫秒，用于模拟数据读取或者内容处理等操作。

使用 4 个工作进程和一个通用基准工具进行性能测试，得到以下数据：

-   在 30.10 秒内，共进行了 956 次请求
-   平均每秒响应 31.76 次请求

:--:1

```python
@app.get("/sync")
def sync_handler(request):
    time.sleep(0.1)
    return text("Done.")
```

:---

---:1

当我们使用异步解决方案时，性能将会得到极大的提升，您会看道一组惊人的数据​ :rocket:。

同样使用 4 个子进程和一个相同的基准工具再次进行性能测试，得到以下数据:

-   在 30.10 秒内，共进行了 **115,590** 次请求
-   平均每秒响应 **3843.17** 次请求

:flushed: Wow！

好吧，这个结果有些夸张，甚至有些好笑。这个例子有一些极端了，你所看到的任何一个基准测试都是如此的。这样的测试方式在实际生产环境中没有任何意义，这个例子旨在告诉我们在网络编程中 `async/await` 的优势有多么大。像 Sanic 和其他的异步 Python 库并不是让程序执行速度变得更快，只是让它们的组织方式变得更为高效而已。

在我们刚才的例子中，异步版本的效率要高得多，因为当一个请求处于休眠状态时，它能够响应另一个请求、另一个请求、另一个请求、另一个请求...

没错，重点就在这里，Sanic 之所以快速是因为它充分组织了这些可用资源来提升性能。它可以同时响应多个请求，这意味着它每秒可以处理更多的请求。

:--:1
```python
@app.get("/async")
async def async_handler(request):
    await asyncio.sleep(0.1)
    return text("Done.")
```
:---

::: warning 常见错误：

请尽量避免使用同步的工具，或许您需要 ping 一下你的站点来进行测试。

请尽可能的使用异步工具来避免发生阻塞。您的服务器将感谢您。在 [Awesome Sanic](https://github.com/mekicha/awesome-sanic) 中有许多性能优秀的 Sanic 异步工具，您可以在那里找到合适自己的异步工具。

Sanic 的测试套件 (sanic-testing) 充分的发挥了 [httpx](https://www.python-httpx.org/) 的性能 :wink:。

:::

---

## 带完整注释的响应函数(A fully annotated handler)

Sanic 支持使用类型注解，下面的例子送给喜欢使用类型注解的人…

```python
from sanic.response import HTTPResponse, text
from sanic.request import Request

@app.get("/typed")
async def typed_handler(request: Request) -> HTTPResponse:
    return text("Done.")
```
