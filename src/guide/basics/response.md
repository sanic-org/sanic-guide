# Response

All [handlers](./handlers.md) **must** return a response object, and [middleware](./middleware.md) may optionally return a response object.

## Methods

The easiest way to generate a response object is to use one of the nine (9) convenience methods.

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
:::
::: tab File

**Default Content-Type**: N/A  
**Description**: Returns a file


```python
from sanic.response import file

@app.route("/")
async def handler(request):
    return file("/path/to/whatever.png")
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
::: tab Streaming

**Default Content-Type**: `text/plain; charset=utf-8`  
**Description**: Streams data to a client

```python
from sanic.response import stream

@app.route("/")
async def handler(request):
    return stream(streaming_fn)

async def streaming_fn(response):
    await response.write('foo')
    await response.write('bar')
```
By default, Sanic will stream back to the client using chunked encoding if the client supports it. You can disable this:

```python
stream(streaming_fn, chunked=False)
```
:::
::: tab "File Streaming"

**Default Content-Type**: N/A  
**Description**: Streams a file to a client, useful when streaming large files, like a video

```python
from sanic.response import file_stream

@app.route("/")
async def handler(request):
    return file_stream("/path/to/whatever.mp4")
```

Like the `file()` method, `file_stream()` will attempt to determine the mime type of the file.
:::
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

Defaults to a `204` status.
:::
::::

## Default status

The default HTTP status code for the response is `200`. If you need to change it, it can be done by the response method.


```python
@app.post("/")
async def create_new(request):
    new_thing = await do_create(request)
    return json({"created": True, "id": new_thing.thing_id}, status=201)
```
