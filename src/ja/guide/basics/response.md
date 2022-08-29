# Response

すべての[ハンドラ](./handlers.md) **は**レスポンス・オブジェクトを返し、[ミドルウェア](./middleware.md)は、オプションで応答オブジェクトを返すことができます。

## Methods

レスポンス・オブジェクトを生成する最も簡単な方法は、9つの便利なメソッドのいずれかを使用することです。

:::: tabs

::: tab Text

**Default Content-Type**: `text/plain; charset=utf-8`  
**Description**: Returns plain text

```python
from sanic.response import text

@app.route("/")
async def handler(request):
    return text("Hi 😎")
```
:::
::: tab HTML

**Default Content-Type**: `text/html; charset=utf-8`  
**Description**: Returns an HTML document

```python
from sanic.response import html

@app.route("/")
async def handler(request):
    return html('<!DOCTYPE html><html lang="en"><meta charset="UTF-8"><div>Hi 😎</div>')
```
:::
::: tab JSON

**Default Content-Type**: `application/json`  
**Description**: Returns a JSON document

```python
from sanic.response import json

@app.route("/")
async def handler(request):
    return json({"foo": "bar"})
```

By default, Sanic ships with [`ujson`](https://github.com/ultrajson/ultrajson) as its JSON encoder of choice. It is super simple to change this if you want.

```python
from orjson import dumps

json({"foo": "bar"}, dumps=dumps)
```

If `ujson` is not installed, it will fall back to the standard library `json` module.

You may additionally declare which implementation to use globally across your application at initialization:

```python
from orjson import dumps

app = Sanic(..., dumps=dumps)
```
:::
::: tab File

**Default Content-Type**: N/A  
**Description**: Returns a file


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

You can also choose to override the file name:

```python
file("/path/to/whatever.png", filename="super-awesome-incredible.png")
```
:::
::: tab "File Streaming"

**Default Content-Type**: N/A  
**Description**: Streams a file to a client, useful when streaming large files, like a video

```python
from sanic.response import file_stream

@app.route("/")
async def handler(request):
    return await file_stream("/path/to/whatever.mp4")
```

Like the `file()` method, `file_stream()` will attempt to determine the mime type of the file. :::
::: tab Raw

**Default Content-Type**: `application/octet-stream`  
**Description**: Send raw bytes without encoding the body

```python
from sanic.response import raw

@app.route("/")
async def handler(request):
    return raw(b"raw bytes")
```
:::
::: tab Redirect

**Default Content-Type**: `text/html; charset=utf-8`  
**Description**: Send a `302` response to redirect the client to a different path

```python
from sanic.response import redirect

@app.route("/")
async def handler(request):
    return redirect("/login")
```

:::
::: tab Empty

**Default Content-Type**: N/A  
**Description**: For responding with an empty message as defined by [RFC 2616](https://tools.ietf.org/search/rfc2616#section-7.2.1)

```python
from sanic.response import empty

@app.route("/")
async def handler(request):
    return empty()
```

Defaults to a `204` status. :::
::::

## Default status

レスポンスのデフォルトのHTTPステータス・コードは`200`です。 変更が必要な場合は、レスポンス方式で行うことができます。


```python
@app.post("/")
async def create_new(request):
    new_thing = await do_create(request)
    return json({"created": True, "id": new_thing.thing_id}, status=201)
```
