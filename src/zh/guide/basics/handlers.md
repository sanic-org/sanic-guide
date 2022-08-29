# 响应函数(Handlers)

The next important building block are your _handlers_. These are also sometimes called "views".

在 Sanic 中，响应函数可以是任何一个可调用程序，它至少以一个 `request` 实例作为参数，并返回一个 `HTTPResponse` 实例或一个执行其他操作的协同程序作为响应。



---:1

Huh? 哈? :flushed:

它既可以是一个普通函数，也可以是一个异步的函数。

The job of the handler is to respond to an endpoint and do something. This is where the majority of your business logic will go. :--:1
```python
def i_am_a_handler(request):
    return HTTPResponse()

async def i_am_ALSO_a_handler(request):
    return HTTPResponse()
```
:---

::: tip Heads up If you want to learn more about encapsulating your logic, checkout [class based views](/guide/advanced/class-based-views.md). ::: ---:1 Then, all you need to do is wire it up to an endpoint. 在 [路由](/zh/guide/basics/routing.md) 这一章节，我们将会了解更多相关的内容

::: tip 小提示：

- 我们在响应函数实例中使用了装饰器：`@app.get()`
- 我们还使用了函数 `text()` 来快速的生成一个文本类型的响应对象。

如果您想要了解更多关于封装逻辑的信息，可以通过 [基于类的视图](/zh/guide/advanced/class-based-views.md) 这一章节来了解更多
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

It is entirely possible to write handlers that are synchronous.

In this example, we are using the _blocking_ `time.sleep()` to simulate 100ms of processing time. Perhaps this represents fetching data from a DB, or a 3rd-party website.

任务完成 :muscle:

- 在 30.10 秒内，共进行了 956 次请求
- 平均每秒响应 31.76 次请求
```python
@app.get("/sync")
def sync_handler(request):
    time.sleep(0.1)
    return text("Done.")
```
:---

---:1

Just by changing to the asynchronous alternative `asyncio.sleep()`, we see an incredible change in performance. :rocket:

编写普通的响应函数是完全可行的。

- 在 30.10 秒内，共进行了 **115,590** 次请求
- 平均每秒响应 **3843.17** 次请求

在下面的例子中，我们通过  `time.sleep()` 方法来等待 100 毫秒，用于模拟数据读取或者内容处理等操作。

好吧，这个结果有些夸张，甚至有些好笑。 And any benchmark you see is inherently very biased. 这样的测试方式在实际生产环境中没有任何意义，这个例子旨在告诉我们在网络编程中 `async/await` 的优势有多么大。 Results will certainly vary. 像 Sanic 和其他的异步 Python 库并不是让程序执行速度变得更快，只是让它们的组织方式变得更为高效而已。 They make them _more efficient_.

In our example, the asynchronous version is so much better because while one request is sleeping, it is able to start another one, and another one, and another one, and another one...

But, this is the point! 没错，重点就在这里，Sanic 之所以快速是因为它充分组织了这些可用资源来提升性能。 它可以同时响应多个请求，这意味着它每秒可以处理更多的请求。

:--:1
```python
@app.get("/async")
async def async_handler(request):
    await asyncio.sleep(0.1)
    return text("Done.")
```
:---

同样使用 4 个子进程和一个相同的基准工具再次进行性能测试，得到以下数据:

Don't do this! You need to ping a website. What do you use? `pip install your-fav-request-library` :see_no_evil:

Instead, try using a client that is `async/await` capable. 您的服务器将感谢您。 Avoid using blocking tools, and favor those that play well in the asynchronous ecosystem. If you need recommendations, check out [Awesome Sanic](https://github.com/mekicha/awesome-sanic).

在我们刚才的例子中，异步版本的效率要高得多，因为当一个请求处于休眠状态时，它能够响应另一个请求、另一个请求、另一个请求、另一个请求...

:::

---

## 带完整注释的响应函数(A fully annotated handler)

For those that are using type annotations...

```python
from sanic.response import HTTPResponse, text
from sanic.request import Request

@app.get("/typed")
async def typed_handler(request: Request) -> HTTPResponse:
    return text("Done.")
```
