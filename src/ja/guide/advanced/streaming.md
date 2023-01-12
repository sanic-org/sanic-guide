# ストリーミング

## ストリーミングのリクエスト

Sanicを使用すると、クライアントから送信されたデータをストリーミングして、バイトが到着するとデータの処理を開始できます。

---:1

エンドポイントで有効にすると、`await request.stream.read()`を使用してリクエストボディをストリーミングできます。

そのメソッドは、ボディが完了すると `None` を返します。 :--:1
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

また、デコレータのキーワード引数で有効にすることもできます。 :--:1
```python
@app.post("/stream", stream=True)
async def handler(request):
        ...
        body = await request.stream.read()
        ...
```
:---

---:1

または `add_route()` メソッドを使う。 :--:1
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
post、put、patchデコレータのみがストリーム引数を持っています。
:::

## ストリーミングの応答

---:1 Sanicではクライアントにコンテンツをストリーミングできます。 :--:1

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

これは、データベースなどの外部サービスに由来するクライアントにコンテンツをストリーミングする場合に便利です。 たとえば、`asyncpg`が提供する非同期カーソルを使用して、データベースレコードをクライアントにストリーミングできます。

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



`await response.eof()` を呼び出すことで、ストリームを明示的に終了させることができます。 上記の例では、`await response.eof()` は `await response.send("", True)` を置き換える便利なメソッドとして呼び出されます。 ハンドラがクライアントに送り返すものが何も残っていないと判断した場合、** 1回** *after*を呼び出す必要があります。 Sanicサーバで使用するのは*任意*ですが、SanicをASGIモードで動作させている場合は、**必ず**明示的にストリームを終了させなければなりません。

*Calling `eof` became optional in v21.6*

## ファイルストリーミング

---:1

Sanicは、大きなファイルを送信する場合に便利な `sanic.response.file_stream` 関数を提供します。 `StreamingHTTPResponse`オブジェクトを返し、デフォルトでチャンク転送エンコーディングを使用します。 このため、Sanicは応答に`Content-Length` HTTPヘッダーを追加しません。

典型的なユースケースは、ビデオファイルをストリーミングしている場合です。 :--:1
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

`Content-Length`ヘッダーを使用する場合は、チャンク転送エンコーディングを無効にし、`Content-Length`ヘッダーを追加するだけで手動で追加できます。

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
