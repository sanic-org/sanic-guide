# 流式传输(Streaming)

## 请求流(Request streaming)

Sanic 允许您以串流的形式接收并响应由客户端发送来的数据。

---:1

当在一个路由上启用了流式传输，您就可以使用 `await request.stream.read()` 方法来获取请求数据流。

当请求中所有的数据都传输完毕后，该方法会返回 `None` 值。

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

在使用装饰器注册路由时也可以传入关键字参数来启动流式传输...

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

... 或者在调用 `add_route` 方法是传入该参数。

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

::: tip 小提示

只有在 post，put 和 patch 装饰器中才有该参数。

:::

## 响应流(Response streaming)

---:1

Sanic 中的 `StreamingHTTPResponse` 对象允许您将响应的内容串流给客户端。也可以使用 `sanic.response.stream` 这个方法。

这个方法接受一个协程函数作为回调，同时，该回调必须接受一个参数，该参数是一个可以控制向客户端传输数据的对象。

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

流式传输在处理一些依赖第三方服务的场景下十分有用，比如数据库。下面的示例代码展示了使用 `asyncpg` 提供的异步游标来为客户端串流数据库的查询结果。

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

::: tip 小提示

如果客户端支持 HTTP/1.1，Sanic 将会使用 [分块传输编码](https://en.wikipedia.org/wiki/Chunked_transfer_encoding) 进行流式传输；您也可以指定是否启用分块传输编码选项。

:::

---:1

使用协程 + 回调的方式来进行流式传输已经是*明日黄花*。您应该使用新的方式来进行串流。新方式的好处是允许您以自然的语序来编写处理串流的响应函数代码（非回调）。

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

::: new v21.6 新增

在上述例子中调用 `await response.eof()` 方法可以替代之前的 `await response.send("", True)` 方法。为客户端传输完数据*后*，您应该在响应函数内调用**一次**该方法。

:::


## 文件流(File streaming)

---:1

Sanic 提供了 `sanic.response.file_stream` 函数来处理发送大文件的场景。该函数会返回一个 `StreamingHTTPResponse` 对象，并且默认使用分块传输编码；因此 Sanic 不会为该响应添加 `Content-Length` 响应头。

通常，我们可能为客户端串流一个视频文件。

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

如果您想手动添加 `Content-Length` 响应头，参考下面的代码。并且如果您添加了该头，则会自动禁用分块传输编码。

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
