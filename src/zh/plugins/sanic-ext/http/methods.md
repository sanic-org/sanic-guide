# HTTP 方法（HTTP Methods）

## 自动生成响应程序（Auto-endpoints）

其默认行为是为所有的 `GET` 路由自动生成 `HEAD` 响应程序，为所有路由自动生成 `OPTIONS` 响应程序。 此外，还有自动生成 `TRACE` 响应程序的选项。 但是该功能在默认设置下并不会启用。

:::: tabs

::: tab HEAD

- **配置参数**：`AUTO_HEAD` (默认值 `True`)
- **MDN**：[了解更多](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/HEAD)

`HEAD` 请求提供请求头以及与 `GET` 请求将提供的相同地响应。 但是，它实际上并没有返回主体。

```python
@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

给定上述路由定义，Sanic 拓展将启用 `HEAD` 响应，如下所示。

```text
$ curl localhost:8000 --head
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 13
connection: keep-alive
content-type: text/plain; charset=utf-8
```

:::

::: tab OPTIONS

- **配置参数**： `AUTO_OPTIONS` (默认值 `True`)
- **MDN**： [Read more](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS)

`OPTIONS` 请求将会向请求者返回关如何允许客户端与对应响应函数进行通信的详细信息。

```python
@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

给定上述路由定义，Sanic 拓展将启用 `OPTIONS` 响应，如下所示。

另外，值得注意的是，在这个例子中，我们还看到了 `access-control-allow-origins` 请求头。这是因为默认情况下，[CORS保护](cors.md) 是启用状态的。

```text
$ curl localhost:8000 -X OPTIONS -i
HTTP/1.1 204 No Content
allow: GET,HEAD,OPTIONS
access-control-allow-origin: *
connection: keep-alive
```

::: tip 小提示

Sanic 拓展将会自动为您创建 `OPTIONS` 路由， 即便您选择手动创建一个 `@app.options` 的路由，它也不会被覆盖掉。

:::

::: tab TRACE

- **配置参数**： `AUTO_TRACE` (默认值 `False`)
- **MDN**： [Read more](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/TRACE)

默认情况下，`TRACE` 响应函数是 **不会** 被自动创建的，当然，如果您需要，Sanic 拓展允许为您自动创建，这在普通的 Sanic 应用程序中是禁止的。

```python
@app.route("/", methods=["trace"])
async def handler(request):
    ...
```

想要允许 Sanic 拓展为您自动创建 TRACE 响应函数，您必须在拓展 Sanic 的时候启用它们：

```python
from sanic_ext import Extend, Config

Extend(app, config=Config(auto_trace=True))
```

现在，假设您有一些响应函数设置，您可以跟踪它们，如下所示:

```text
$ curl localhost:8000 -X TRACE
TRACE / HTTP/1.1
Host: localhost:9999
User-Agent: curl/7.76.1
Accept: */*
```

::: tip 小提示

设置 `AUTO_TRACE` 是非常有帮助的，尤其是当您的应用程序部署在代理后面时，因为它会帮助您确定代理的行为。

:::

::::

## 额外方法的支持（Additional method support）

普通的 Sanic 应用程序允许您使用以下 HTTP 方法构建响应程序：

- [GET](/zh/guide/basics/routing.html#get)
- [POST](/zh/guide/basics/routing.html#post)
- [PUT](/zh/guide/basics/routing.html#put)
- [HEAD](/zh/guide/basics/routing.html#head)
- [OPTIONS](/zh/guide/basics/routing.html#options)
- [PATCH](/zh/guide/basics/routing.html#patch)
- [DELETE](/zh/guide/basics/routing.html#delete)

查看 [MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods) 以了解更多。

---:1

然而，还有两种 “标准” HTTP方法：`TRACE` 和 `CONNECT`。Sanic 扩展将允许您构建使用这些方法的响应函数，这在普通的 Sanic 应用程序上是禁止的。

需要指出的是，Sanic 拓展并 **不能** 允许您直接使用 `@app.trace` 或 `@app.connect` 来创建使用对应 HTTP 方法的响应程序，您需要使用 `@app.route` 来进行创建，如 👉 所示：

:--:1

```python
@app.route("/", methods=["trace", "connect"])
async def handler(_):
    return empty()
```

:---
