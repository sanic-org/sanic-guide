# 响应(Response)

All [handlers](./handlers.md)* **must** return a response object, and [middleware](./middleware.md) may optionally return a response object.

To clarify that statement:
- unless the handler is a streaming endpoint, the return value must be an instance of `sanic.HTTPResponse` (to learn more about this exception see [streaming responses](../advanced/streaming.md#response-streaming))
- if a middleware returns a response object, that will be used instead of whatever the handler would do (see [middleware](./middleware.md) to learn more)

A most basic handler would look like the following. The `HTTPResponse` object will allow you to set the status, body, and headers to be returned to the client.

```python
from sanic import HTTPResponse, Sanic

app = Sanic("TestApp")


@app.route("")
def handler(_):
    return HTTPResponse()
```

However, usually it is easier to use one of the convenience methods discussed below.


## 响应方式(Methods)

Sanic 内置了 9 种常用的返回类型，您可以通过以下方式中的任意一种快速生成返回对象。

:::: tabs

::: tab Text

**响应类型**: `text/plain; charset=utf-8`

```python
from sanic.response import text

@app.route("/")
async def handler(request):
    return text("Hi 😎")
```
**响应说明**: 返回纯文本内容。

:::

```python
from sanic.response import html

@app.route("/")
async def handler(request):
    return html('<!DOCTYPE html><html lang="en"><meta charset="UTF-8"><div>Hi 😎</div>')
```
::: tab HTML

**响应类型**: `text/html; charset=utf-8`

```python
from sanic.response import json

@app.route("/")
async def handler(request):
    return json({"foo": "bar"})
```

在默认情况下， Sanic 使用 [`ujson`](https://github.com/ultrajson/ultrajson) 作为 JSON 编码器， 更改此配置非常简单，只需如下操作： It is super simple to change this if you want.

```python
from orjson import dumps

json({"foo": "bar"}, dumps=dumps)
```

:::

::: tab JSON

```python
from orjson import dumps

app = Sanic(..., dumps=dumps)
```
**响应类型**: `application/json`

**响应说明**: 返回 JSON 内容


```python
from sanic.response import file

@app.route("/")
async def handler(request):
    return await file("/path/to/whatever.png")
```

Sanic will examine the file, and try and guess its mime type and use an appropriate value for the content type. You could be explicit, if you would like:

```python
file("/path/to/whatever.png", mime_type="image/png")
```

如果没有安装 `ujson` ， 它就会使用 Python 自带的 `json` 模块。

```python
file("/path/to/whatever.png", filename="super-awesome-incredible.png")
```
您可以在应用初始化时申明全局的 Json 序列化函数：

:::

```python
from sanic.response import file_stream

@app.route("/")
async def handler(request):
    return await file_stream("/path/to/whatever.mp4")
```

Like the `file()` method, `file_stream()` will attempt to determine the mime type of the file. ::: tab File

**响应类型**: N/A

```python
from sanic.response import raw

@app.route("/")
async def handler(request):
    return raw(b"raw bytes")
```
**响应说明**: 返回一个文件

Sanic 将会自动检查文件，并猜测其可能的 mine 类型，并且为响应类型设置合适的值。

```python
from sanic.response import redirect

@app.route("/")
async def handler(request):
    return redirect("/login")
```

如果您愿意指定响应类型，只需如下操作：

您也可以选择重命名文件:

```python
from sanic.response import empty

@app.route("/")
async def handler(request):
    return empty()
```

默认返回状态码 `204` :::
::::

## 默认状态码(Default Status)

响应的默认 HTTP 状态码是 `200`，如果您需要更改状态码，可以通过下面的方式进行更改： If you need to change it, it can be done by the response method.


```python
@app.post("/")
async def create_new(request):
    new_thing = await do_create(request)
    return json({"created": True, "id": new_thing.thing_id}, status=201)
```

::: new NEW in v22.12
## Returning JSON data

Starting in v22.12, When you use the `sanic.json` convenience method, it will return a subclass of `HTTPResponse` called `JSONResponse`. This object will have several convenient methods available to modify common JSON body.

```python
from sanic import json

resp = json(...)
```

- `resp.set_body(<raw_body>)` - Set the body of the JSON object to the value passed
- `resp.append(<value>)` - Append a value to the body like `list.append` (only works if the root JSON is an array)
- `resp.extend(<value>)` - Extend a value to the body like `list.extend` (only works if the root JSON is an array)
- `resp.update(<value>)` - Update the body with a value like `dict.update` (only works if the root JSON is an object)
- `resp.pop()` - Pop a value like `list.pop` or `dict.pop` (only works if the root JSON is an array or an object)

::: warning The raw Python object is stored on the `JSONResponse` object as `raw_body`. While it is safe to overwrite this value with a new one, you should **not** attempt to mutate it. You should instead use the methods listed above.

```python
resp = json({"foo": "bar"})

# This is OKAY
resp.raw_body = {"foo": "bar", "something": "else"}

# This is better
resp.set_body({"foo": "bar", "something": "else"})

# This is also works well
resp.update({"something": "else"})

# This is NOT OKAY
resp.raw_body.update({"something": "else"})
```
:::
