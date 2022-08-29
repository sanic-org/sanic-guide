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

```
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

另外，值得注意的是，在这个例子中，我们还看到了 `access-control-allow-origins` 请求头。 这是因为默认情况下，[CORS保护](cors.md) 是启用状态的。

```
$ curl localhost:8000 -X OPTIONS -i
HTTP/1.1 204 No Content
allow: GET,HEAD,OPTIONS
access-control-allow-origin: *
connection: keep-alive
```

::: tip Even though Sanic Extensions will setup these routes for you automatically, if you decide to manually create an `@app.options` route, it will *not* be overridden. :::

Sanic 拓展将会自动为您创建 `OPTIONS` 路由， 即便您选择手动创建一个 `@app.options` 的路由，它也不会被覆盖掉。

- **配置参数**： `AUTO_TRACE` (默认值 `False`)
- **MDN**： [Read more](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/TRACE)

By default, `TRACE` endpoints will **not** be automatically created. However, Sanic Extensions **will allow** you to create them if you wanted. This is something that is not allowed in vanilla Sanic.

```python
@app.route("/", methods=["trace"])
async def handler(request):
    ...
```

::: tab TRACE

```python
from sanic_ext import Extend, Config

Extend(app, config=Config(auto_trace=True))
```

默认情况下，`TRACE` 响应函数是 **不会** 被自动创建的，当然，如果您需要，Sanic 拓展允许为您自动创建，这在普通的 Sanic 应用程序中是禁止的。

```
$ curl localhost:8000 -X TRACE
TRACE / HTTP/1.1
Host: localhost:9999
User-Agent: curl/7.76.1
Accept: */*
```

::: tip Setting up `AUTO_TRACE` can be super helpful, especially when your application is deployed behind a proxy since it will help you determine how the proxy is behaving. :::

::::

## 额外方法的支持（Additional method support）

::: tip 小提示

- [GET](/en/guide/basics/routing.html#get)
- [POST](/en/guide/basics/routing.html#post)
- [PUT](/en/guide/basics/routing.html#put)
- [HEAD](/en/guide/basics/routing.html#head)
- [OPTIONS](/en/guide/basics/routing.html#options)
- [PATCH](/en/guide/basics/routing.html#patch)
- [DELETE](/en/guide/basics/routing.html#delete)

设置 `AUTO_TRACE` 是非常有帮助的，尤其是当您的应用程序部署在代理后面时，因为它会帮助您确定代理的行为。

---:1

然而，还有两种 “标准” HTTP方法：`TRACE` 和 `CONNECT`。 Sanic 扩展将允许您构建使用这些方法的响应函数，这在普通的 Sanic 应用程序上是禁止的。

It is worth pointing out that this will *NOT* enable convenience methods: `@app.trace` or `@app.connect`. You need to use `@app.route` as shown in the example here.

:--:1

```python
@app.route("/", methods=["trace", "connect"])
async def handler(_):
    return empty()
```

:---
