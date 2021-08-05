# Streaming

## Request streaming

Sanic allows you to stream data sent by the client to begin processing data as the bytes arrive.

---:1

When enabled on an endpoint, you can stream the request body using `await request.stream.read()`.

That method will return `None` when the body is completed.
:--:1
```python
from sanic.views import stream

class SimpleView(HTTPMethodView):
    @stream
    async def post(self, request):
        result = ""
        while True:
            body = await request.stream.read()
            if body is None:
                break
            result += body.decode("utf-8")
        return text(result)
```
:---

---:1

It also can be enabled with a keyword argument in the decorator...
:--:1
```python
@app.post("/stream", stream=True)
async def handler(request):
        ...
        body = await request.stream.read()
        ...
```
:---

---:1

... or the `add_route()` method.
:--:1
```python
bp.add_route(
    bp_handler,
    "/bp_stream",
    methods=["POST"],
    stream=True,
)
```
:---

::: tip FYI
Only post, put and patch decorators have stream argument.
:::

## Response streaming

---:1

Sanic allows you to stream content to the client with an instance of `StreamingHTTPResponse`. There is also a `sanic.response.stream` convenience method.

This method accepts a coroutine callback which is passed an object that can control writing to the client.
:--:1
```python
from sanic.response import stream

@app.route("/")
async def test(request):
    async def sample_streaming_fn(response):
        await response.write("foo,")
        await response.write("bar")

    return stream(sample_streaming_fn, content_type="text/csv")
```
:---

This is useful in situations where you want to stream content to the client that originates in an external service, like a database. For example, you can stream database records to the client with the asynchronous cursor that `asyncpg` provides.

```python
@app.route("/")
async def index(request):
    async def stream_from_db(response):
        conn = await asyncpg.connect(database='test')
        async with conn.transaction():
            async for record in conn.cursor('SELECT generate_series(0, 10)'):
                await response.write(record[0])

    return stream(stream_from_db)
```

::: tip FYI
If a client supports HTTP/1.1, Sanic will use [chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding); you can explicitly enable or disable it using chunked option of the stream function.
:::

---:1

The coroutine callback pattern using `stream` is not needed. It is the *old style* of streaming, and should be replaced with the newer inline streaming. You now are able to stream the response directly in the handler.

:--:1
```python
@app.route("/")
async def test(request):
    response = await request.respond(content_type="text/csv")
    await response.send("foo,")
    await response.send("bar")
    await response.eof()
    return response
```
:---

::: new NEW in v21.6
In the example above `await response.eof()` is called as a convenience method to replace `await response.send("", True)`. It should be called **one time** *after* your handler has determined that it has nothing left to send back to the client.
:::


## File streaming

---:1

Sanic provides `sanic.response.file_stream` function that is useful when you want to send a large file. It returns a `StreamingHTTPResponse` object and will use chunked transfer encoding by default; for this reason Sanic doesn’t add `Content-Length` HTTP header in the response.

A typical use case might be streaming an video file.
:--:1
```python
@app.route("/mp4")
async def handler_file_stream(request):
    return await response.file_stream(
        "/path/to/sample.mp4",
        chunk_size=1024,
        mime_type="application/metalink4+xml",
        headers={
            "Content-Disposition": 'Attachment; filename="nicer_name.meta4"',
            "Content-Type": "application/metalink4+xml",
        },
    )
```
:---

---:1

If you want to use the `Content-Length` header, you can disable chunked transfer encoding and add it manually simply by adding the `Content-Length` header.

:--:1
```python
from aiofiles import os as async_os
from sanic.response import file_stream

@app.route("/")
async def index(request):
    file_path = "/srv/www/whatever.png"

    file_stat = await async_os.stat(file_path)
    headers = {"Content-Length": str(file_stat.st_size)}

    return await file_stream(
        file_path,
        headers=headers,
    )
```
:---
