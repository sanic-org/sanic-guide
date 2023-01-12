# 跨域保护（CORS protection）

跨域资源共享（aka CORS）本身就是一个 *巨大* 的话题，这里的文档再多也不为过，至于它究竟是什么，建议您自行进行一些研究，以了解其存在的安全问题以及背后的理论解决方案。 The documentation here cannot go into enough detail about *what* it is. You are highly encouraged to do some research on your own to understand the security problem presented by it, and the theory behind the solutions. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 是很好的入门文章。

简而言之，CORS保护是一个框架，浏览器使用它来访问来自其他域的信息的时候能够有效地提升访问效率和缩短访问时间。 它与任何构建单页应用程序的人都息息相关。 尤其是在您的前端页面位于类似 `https://portal.myapp.com` 但它需要访问位于 `https://api.myapp.com` 的后端的时候。

这一部分功能的实现深受 [sanic-cors](https://github.com/ashleysommer/sanic-cors) 的启发，它基于 [flask-cors](https://github.com/corydolphin/flask-cors) 因此，您几乎可以直接使用 `sanic-ext` 替换 `sanic-cors`。 It is therefore very likely that you can achieve a near drop-in replacement of `sanic-cors` with `sanic-ext`.

## 基本实现（Basic implementation）

---:1

就如 [自动创建响应程序示例](methods.md#options) 中所示例的那样，Sanic 拓展将会自动地启用跨域保护而不需要太多的操作，但是它也没有提供太多开箱即用的方法。 But, it does not offer too much out of the box.

强烈建议您设置 `config.CORS_ORIGINS` 至少将需要访问的应用程序的域名添加到其中。

:--:1
```python
from sanic import Sanic, text
from sanic_ext import Extend

app = Sanic(__name__)
app.config.CORS_ORIGINS = "http://foobar.com,http://bar.com"
Extend(app)


@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

```
$ curl localhost:8000 -X OPTIONS -i
HTTP/1.1 204 No Content
allow: GET,HEAD,OPTIONS
access-control-allow-origin: http://foobar.com
connection: keep-alive
```
:---

## 配置（Configuration）

The true power of CORS protection, however, comes into play once you start configuring it. Here is a table of all of the options.

| 配置名称                        | 数据类型                             | 默认值     | 说明                                                                                                                                                           |
| --------------------------- | -------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CORS_ALLOW_HEADERS`        | `str`, `List[str]`               | `"*"`   | 被添加的值会在 `access-control-allow-headers` 中的请求头列表中出现                                                                                                            |
| `CORS_ALWAYS_SEND`          | `bool`                           | `True`  | 当 `True` 时，将总是为 `access-control-allow-headers` 设置一个值。 当 `False` 时，仅当有 `Origin` 请求头时才会设置值。                                                                    |
| `CORS_AUTOMATIC_OPTIONS`    | `bool`                           | `True`  | 当收到传入的预检请求时，是否自动设置 `access-control-allow-headers`、`access-control-max-age` 和 `access-control-allow-methods` 请求头的值。 如果 `False` 这些值将只应用在使用了 `@cors` 装饰器装饰的路由上。 |
| `CORS_EXPOSE_HEADERS`       | `str`, `List[str]`               | `""`    | 在`access-control-expose-headers` 请求头中设置的特定请求头列表。                                                                                                             |
| `CORS_MAX_AGE`              | `str`, `int`, `timedelta`        | `0`     | 使用 `access-control-max-age` 请求头可以缓存预检响应的最大秒数。 一个错误值将导致不设置请求头。                                                                                                |
| `CORS_METHODS`              | `str`, `List[str]`               | `""`    | 允许的来源可以使用的 HTTP 访问方法，将设置在 `access-control-allow-methods` 请求头中。                                                                                               |
| `CORS_ORIGINS`              | `str`, `List[str]`, `re.Pattern` | `"*"`   | 允许访问资源的来源，将设置在 `access-control-allow-origin` 请求头中。                                                                                                           |
| `CORS_SEND_WILDCARD`        | `bool`                           | `False` | 如果为 `True`，将发送通配符 `*` 源而不是 `Origin` 请求头。                                                                                                                     |
| `CORS_SUPPORTS_CREDENTIALS` | `bool`                           | `False` | 是否设置 `access-control-allow-credentials` 请求头。                                                                                                                 |
| `CORS_VARY_HEADER`          | `bool`                           | `True`  | 是否在适当的时候添加 `vary` 请求头。                                                                                                                                       |

*为了提高易用性，上面提到的 `List[str]` 任何一个 `list`、`set`、`frozenset` 或 `tuple` 的实例都将可用。 或者，如果值是一个 `str`，它可以是一个逗号分隔的列表。*

## 路由级别覆盖（Route level overrides）

---:1

It may sometimes be necessary to override app-wide settings for a specific route. 有些时候我们需要对特定的路由进行跨域保护设置，为此，您可以使用 `@sanic_ext.cors()` 装饰器来为不同的路由设置不同的跨域保护配置。

可以被此装饰器设置的值包括：

- `origins`
- `expose_headers`
- `allow_headers`
- `allow_methods`
- `supports_credentials`
- `max_age`

:--:1
```python
from sanic_ext import cors

app.config.CORS_ORIGINS = "https://foo.com"


@app.get("/", host="bar.com")
@cors(origins="https://bar.com")
async def hello_world(request):
    return text("Hello, world.")
```
:---
