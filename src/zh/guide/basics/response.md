# 响应(Response)

所有的 [响应函数](/zh/guide/basics/handlers.md) 都必须返回一个 response 对象，[中间件](/zh/guide/basics/middleware.md) 可以自由选择是否返回 response 对象。

## 响应方式(Methods)

Sanic 内置了 9 种常用的返回类型，您可以通过以下方式中的任意一种快速生成返回对象。

:::: tabs

::: tab Text

**响应类型**: `text/plain; charset=utf-8`

**响应说明**: 返回纯文本内容。

```python
from sanic.response import text

@app.route("/")
async def handler(request):
    return text("Hi 😎")
```

:::

::: tab HTML

**响应类型**: `text/html; charset=utf-8`

**响应说明**: 返回 HTML 文档

```python
from sanic.response import html

@app.route("/")
async def handler(request):
    return html('<!DOCTYPE html><html lang="en"><meta charset="UTF-8"><div>Hi 😎</div>')
```

:::

::: tab JSON

**响应类型**: `application/json`

**响应说明**: 返回 JSON 内容

```python
from sanic.response import json

@app.route("/")
async def handler(request):
    return json({"foo": "bar"})
```

在默认情况下， Sanic 使用 [`ujson`](https://github.com/ultrajson/ultrajson) 作为 JSON 编码器， 更改此配置非常简单，只需如下操作：

```python
from orjson import dumps

json({"foo": "bar"}, dumps=dumps)
```

如果没有安装 `ujson` ， 它就会使用 Python 自带的 `json` 模块。

::: new v21.3 新增
您可以在应用初始化时申明全局的 Json 序列化函数：

```python
from orjson import dumps

app = Sanic(..., dumps=dumps)
```

:::

::: tab File

**响应类型**: N/A

**响应说明**: 返回一个文件

```python
from sanic.response import file

@app.route("/")
async def handler(request):
    return file("/path/to/whatever.png")
```

Sanic 将会自动检查文件，并猜测其可能的 mine 类型，并且为响应类型设置合适的值。

如果您愿意指定响应类型，只需如下操作：

```python
file("/path/to/whatever.png", mime_type="image/png")
```

您也可以选择重命名文件:

```python
file("/path/to/whatever.png", filename="super-awesome-incredible.png")
```

:::

::: tab Streaming

**响应类型**: `text/plain; charset=utf-8`

**响应说明**: 数据流到客户端

```python
from sanic.response import stream

@app.route("/")
async def handler(request):
    return stream(streaming_fn)

async def streaming_fn(response):
    await response.write('foo')
    await response.write('bar')
```

默认情况下，如果客户端支持，Sanic 将使用分块编码传输到客户端。 您可以禁用此功能：

```python
stream(streaming_fn, chunked=False)
```

:::

::: tab "File Streaming"

**响应类型**: N/A

**响应说明**: 将文件流传输到客户端，在传输大文件(例如视频)的时候非常有用：

```python
from sanic.response import file_stream

@app.route("/")
async def handler(request):
    return file_stream("/path/to/whatever.mp4")
```

和 `file()` 一样，`file_stream()` 也将主动确定您的 mine 类型，并为响应类型进行自动设置。

:::

::: tab Raw

**响应类型**: `application/octet-stream`

**响应说明**: 发送未进行编码的原始字节。

```python
from sanic.response import raw

@app.route("/")
async def handler(request):
    return raw(b"raw bytes")
```

:::

::: tab Redirect

**响应类型**: `text/html; charset=utf-8`

**响应说明**: 发送状态码 `302` 以将客户端重定向到其他路由

```python
from sanic.response import redirect

@app.route("/")
async def handler(request):
    return redirect("/login")
```

:::

::: tab Empty

**响应类型**: N/A

**响应说明**: 用于响应定义的空消息，遵循 [RFC 2616](https://tools.ietf.org/search/rfc2616#section-7.2.1)

```python
from sanic.response import empty

@app.route("/")
async def handler(request):
    return empty()
```

默认返回状态码 `204`

:::

::::

## 默认状态码(Default Status)

响应的默认 HTTP 状态码是 `200`，如果您需要更改状态码，可以通过下面的方式进行更改：

```python
@app.post("/")
async def create_new(request):
    new_thing = await do_create(request)
    return json({"created": True, "id": new_thing.thing_id}, status=201)
```
