# ルーティング

---:1

これまでに様々な形の装飾家を見てきました。

But what is it? And how do we use it? :--:1
```python
@app.route("/stairway")
...

@app.get("/to")
...

@app.post("/heaven")
...
```
:---

## ルートを追加する

---:1

ハンドラをエンドポイントに接続する最も基本的な方法は、`app.add_route()`を使用することです。

詳細については、[API docs](https://sanic.readthedocs.io/en/stable/sanic/api_reference.html#sanic.app.Sanic.url_for)を参照してください。 :--:1 :--:1
```python
async def handler(request):
    return text("OK")

app.add_route(handler, "/test")
```
:---

---:1

デフォルトでは、ルートはHTTP`GET`コールとして使用できます。 1つ以上のHTTPメソッドに応答するようにハンドラを変更できます。 :--:1 :--:1
```python
app.add_route(
    handler,
    '/test',
    methods=["POST", "PUT"],
)
```
:---

---:1

でも何なの?どうやって使うのか? :--:1
```python
@app.route('/test', methods=["POST", "PUT"])
async def handler(request):
    return text('OK')
```
:---

## HTTPメソッド

標準のHTTPメソッドにはそれぞれ便利なデコレータがあります。

:::: tabs
::: tab GET

```python
@app.get('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) :::
::: tab POST

```python
@app.post('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) :::
::: tab PUT

```python
@app.put('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) :::
::: tab PATCH

```python
@app.patch('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH) :::
::: tab DELETE

```python
@app.delete('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) :::
::: tab HEAD

```python
@app.head('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD) :::
::: tab OPTIONS

```python
@app.options('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS) :::
::::

::: warning デフォルトでは、Sanic は安全でない HTTP メソッド (`POST`、`PUT`、`PATCH`) で受信したリクエストボディ**のみ**を消費します。 他のメソッドでHTTPリクエストのデータを受け取りたい場合は、以下の2つのオプションのいずれかを実行する必要があります。

**オプション#1 - `ignore_body`を使用してSanicにボディを消費するように指示する。**
```python
@app.delete("/path", ignore_body=False)
async def handler(_):
    ...
```

**オプション #2 - ハンドラ内で `receive_body` を使って手動でボディを消費する。**
```python
@app.delete("/path")
async def handler(request: Request):
    await request.receive_body()
```
:::

## パスパラメーター

---:1

Sanicでは、パターンマッチングやURLパスからの値の抽出が可能です。 これらのパラメータは、キーワード引数としてルートハンドラに挿入されます。 :--:1 :--:1
```python
@app.get("/tag/<tag>")
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---

---:1

パラメータの型を宣言できます。 これはマッチング時に強制され、変数を型キャストします。 :--:1 :--:1
```python
@app.get("/foo/<foo_id:uuid>")
async def uuid_handler(request, foo_id: UUID):
    return text("UUID - {}".format(foo_id))
```
:---

### 型のサポート

:::: tabs

::: tab str

```python
@app.route("/path/to/<foo:str>")
async def handler(request, foo: str):
    ...
```
**Regular expression applied**: `r"[^/]+")`  
**Cast type**: `str`  
**Example matches**:
- `/path/to/Bob`
- `/path/to/Python%203`

Beginning in v22.3 `str` will *not* match on empty strings. See `strorempty` for this behavior.

:::
::: tab strorempty

```python
async def handler(request, ws):
    messgage = "Start"
    while True:
        await ws.send(message)
        message = ws.recv()

app.add_websocket_route(handler, "/test")
```
**Regular expression applied**: `r"[^/]*")`  
**Cast type**: `str`  
**Example matches**:
- `/path/to/Bob`
- `/path/to/Python%203`
- `/path/to/`

Unlike the `str` path parameter type, `strorempty` can also match on an empty string path segment.

以前のバージョンのSanicでは、この形式は非推奨となり、v21.12で削除される予定です。 :::
::: tab alpha

```python
@app.route("/path/to/<foo:int>")
async def handler(request, foo: int):
    ...
```
**Regular expression applied**: `r"-?\d+")`  
**Cast type**: `int`  
**Example matches**:
- `/path/to/10`
- `/path/to/-10`

_Does not match float, hex, octal, etc_ :::
::: tab float

```python
@app.route("/path/to/<foo:float>")
async def handler(request, foo: float):
    ...
```
**Regular expression applied**: `r"-?(?:\d+(?:\.\d*)?|\.\d+)")`  
**Cast type**: `float`  
**Example matches**:
- `/path/to/10`
- `/path/to/-10`
- `/path/to/1.5`

:::
::: tab alpha

```python
@app.route("/path/to/<foo:alpha>")
async def handler(request, foo: str):
    ...
```
**Regular expression applied**: `r"[A-Za-z]+")`  
**Cast type**: `str`  
**Example matches**:
- `/path/to/Bob`
- `/path/to/Python`

_Does not match a digit, or a space or other special character_ :::
::: tab slug

```python
@app.route("/path/to/<article:slug>")
async def handler(request, article: str):
    ...
```
**Regular expression applied**: `r"[a-z0-9]+(?:-[a-z0-9]+)*")`  
**Cast type**: `str`  
**Example matches**:
- `/path/to/some-news-story`
- `/path/to/or-has-digits-123`

*Added in v21.6* :::
::: tab path

```python
@app.route("/path/to/<foo:path>")
async def handler(request, foo: str):
    ...
```
**Regular expression applied**: `r"[^/].*?")`  
**Cast type**: `str`  
**Example matches**:
- `/path/to/hello`
- `/path/to/hello.txt`
- `/path/to/hello/world.txt`

::: warning これは`/`で一致するため、`path`を使用するパターンを慎重に徹底的にテストして、別のエンドポイント向けのトラフィックをキャプチャしないようにする必要があります。 :::
::: tab ymd
::: ::: tab ymd

```python
@app.route("/path/to/<foo:ymd>")
async def handler(request, foo: datetime.date):
    ...
```
**Regular expression applied**: `r"^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"`  
**Cast type**: `datetime.date`  
**Example matches**:
- `/path/to/2021-03-28` :::

::: tab uuid

```python
@app.route("/path/to/<foo:uuid>")
async def handler(request, foo: UUID):
    ...
```
**Regular expression applied**: `r"[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}"`  
**Cast type**: `UUID`  
**Example matches**:
- `/path/to/123a123a-a12a-1a1a-a1a1-1a12a1a12345`

:::

複雑なルーティングと比較すると、上記の例は単純すぎることが多く、まったく異なるルーティングマッチングパターンを使用するため、ここではregexマッチングの高度な使用方法について詳しく説明します。

```python
@app.route("/path/to/<foo:ext>")
async def handler(request, foo: str, ext: str):
    ...
```
ルートの一部を照合する場合があります。

<table spaces-before="0">
  <tr>
    <th>
      definition
    </th>
    
    <th>
      example
    </th>
    
    <th>
      filename
    </th>
    
    <th>
      extension
    </th>
  </tr>
  
  <tr>
    <td>
      \<file:ext>
    </td>
    
    <td>
      page.txt
    </td>
    
    <td>
      <code>"page"</code>
    </td>
    
    <td>
      <code>"txt"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      \<file:ext=jpg>
    </td>
    
    <td>
      cat.jpg
    </td>
    
    <td>
      <code>"cat"</code>
    </td>
    
    <td>
      <code>"jpg"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      \<file:ext=jpg\
    </td>
    
    <td>
      png\
    </td>
    
    <td>
      gif\
    </td>
    
    <td>
      svg>    | cat.jpg     | <code>"cat"</code>     | <code>"jpg"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      <file=int:ext>
    </td>
    
    <td>
      123.txt
    </td>
    
    <td>
      <code>123</code>
    </td>
    
    <td>
      <code>"txt"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      <file=int:ext=jpg\
    </td>
    
    <td>
      png\
    </td>
    
    <td>
      gif\
    </td>
    
    <td>
      svg> | 123.svg     | <code>123</code>       | <code>"svg"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      <file=float:ext=tar.gz>
    </td>
    
    <td>
      3.14.tar.gz
    </td>
    
    <td>
      <code>3.14</code>
    </td>
    
    <td>
      <code>"tar.gz"</code>
    </td>
  </tr>
</table>

File extensions can be matched using the special `ext` parameter type. It uses a special format that allows you to specify other types of parameter types as the file name, and one or more specific extensions as shown in the example table above.

さらに、これらはすべて許容可能です。

また、名前付き一致グループを使用する場合は、セグメントラベルと同じである必要があります。

::: tab regex

```python
@app.route(r"/path/to/<foo:^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))>")
async def handler(request, foo: str):
    ...
```
**Regular expression applied**: _whatever you insert_  
**Cast type**: `str`  
**Example matches**:
- `/path/to/2021-01-01`

This gives you the freedom to define specific matching patterns for your use case.

これにより、ユースケースの特定のマッチング・パターンを自由に定義できます。 この例では、YYYY-MM-DD形式の日付を探しています。

::::

### 正規表現照合



More often than not, compared with complex routing, the above example is too simple, and we use a completely different routing matching pattern, so here we will explain the advanced usage of regex matching in detail.

Sometimes, you want to match a part of a route:

```text
/image/123456789.jpg
```

ファイルのパターンにマッチさせたいが、数値の部分だけをキャプチャしたい場合は、正規表現を使う必要があります😄:

```python
app.route(r"/image/<img_id:(?P<img_id>\d+)\.jpg>")
```

また、1つのクエリキーに複数の値を渡すこともサポートされています。 :--:1

```python
@app.get(r"/<foo:[a-z]{3}.txt>")                # matching on the full pattern
@app.get(r"/<foo:([a-z]{3}).txt>")              # defining a single matching group
@app.get(r"/<foo:(?P<foo>[a-z]{3}).txt>")       # defining a single named matching group
@app.get(r"/<foo:(?P<foo>[a-z]{3}).(?:txt)>")   # defining a single named matching group, with one or more non-matching groups
```

Also, if using a named matching group, it must be the same as the segment label.

```python
@app.get(r"/<foo:(?P<foo>\d+).jpg>")  # OK
@app.get(r"/<foo:(?P<bar>\d+).jpg>")  # NOT OK
```

より一般的な使用方法については、[正規表現の操作](https://docs.python.org/3/library/re.html)を参照してください。

## URLを生成

---:1

Sanicは、ハンドラメソッド名`app.url_for()`に基づいてURLを生成するメソッドを提供しています。 これは、アプリケーションへのURLパスをハードコーディングしない場合に便利です。 代わりに、ハンドラ名を参照することができます。 :--:1
```python
@app.route('/')
async def index(request):
    # generate a URL for the endpoint `post_handler`
    url = app.url_for('post_handler', post_id=5)

    # Redirect to `/posts/5`
    return redirect(url)

@app.route('/posts/<post_id>')
async def post_handler(request, post_id):
    ...
```
:---

---:1

任意の数のキーワード引数を渡すことができます。 _not_a要求パラメータであるものはすべて、クエリ文字列の一部として実装されます。 :--:1 :--:1
```python
>>> app.url_for(
    "post_handler",
    post_id=5,
    arg_one="one",
    arg_two="two",
)
'/posts/5?arg_one=one&arg_two=two'
```
:---

---:1

Also supported is passing multiple values for a single query key. :--:1
```python
>>> app.url_for(
    "post_handler",
    post_id=5,
    arg_one=["one", "two"],
)
'/posts/5?arg_one=one&arg_one=two'
```
:---

### 特殊のキーワード

See [API Docs]() for more details.

```python
>>> app.url_for("post_handler", post_id=5, arg_one="one", _anchor="anchor")
'/posts/5?arg_one=one#anchor'

# _external requires you to pass an argument _server or set SERVER_NAME in app.config if not url will be same as no _external
>>> app.url_for("post_handler", post_id=5, arg_one="one", _external=True)
'//server/posts/5?arg_one=one'

# when specifying _scheme, _external must be True
>>> app.url_for("post_handler", post_id=5, arg_one="one", _scheme="http", _external=True)
'http://server/posts/5?arg_one=one'

# you can pass all special arguments at once
>>> app.url_for("post_handler", post_id=5, arg_one=["one", "two"], arg_two=2, _anchor="anchor", _scheme="http", _external=True, _server="another_server:8888")
'http://another_server:8888/posts/5?arg_one=one&arg_one=two&arg_two=2#anchor'
```

### ルート名をカスタマイズ

---:1

カスタムルート名は、ルートの登録時に`name`引数を渡すことで使用できます。 :--:1 :--:1
```python
@app.get("/get", name="get_handler")
def handler(request):
    return text("OK")
```
:---

---:1

ここで、このカスタム名を使用してURLを取得します。 :--:1
```python
>>> app.url_for("get_handler", foo="bar")
'/get?foo=bar'
```
:---

## Websockets routes

---:1

WebsocketルーティングはHTTPメソッドと同様に動作します。 :--:1 :--:1
```python
async def handler(request, ws):
    message = "Start"
    while True:
        await ws.send(message)
        message = await ws.recv()

app.add_websocket_route(handler, "/test")
```
:---

---:1

It also has a convenience decorator. :--:1
```python
@app.websocket("/test")
async def handler(request, ws):
    message = "Start"
    while True:
        await ws.send(message)
        message = await ws.recv()
```
:---

[websockets section](/guide/advanced/websockets.md)を読み、動作の仕組みを学んでください。

## 厳密なスラッシュ


---:1

Sanicルートは、末尾のスラッシュがあるかどうかに厳密に一致するように設定できます。 これはいくつかのレベルで設定でき、次の優先順位に従います。

1. Route
2. Blueprint
3. BlueprintGroup
4. Application

:--:1
```python
# provide default strict_slashes value for all routes
app = Sanic(__file__, strict_slashes=True)
```

```python
# overwrite strict_slashes value for specific route
@app.get("/get", strict_slashes=False)
def handler(request):
    return text("OK")
```

```python
# it also works for blueprints
bp = Blueprint(__file__, strict_slashes=True)

@bp.get("/bp/get", strict_slashes=False)
def handler(request):
    return text("OK")
```

```python
bp1 = Blueprint(name="bp1", url_prefix="/bp1")
bp2 = Blueprint(
    name="bp2",
    url_prefix="/bp2",
    strict_slashes=False,
)

# This will enforce strict slashes check on the routes
# under bp1 but ignore bp2 as that has an explicitly
# set the strict slashes check to false
group = Blueprint.group([bp1, bp2], strict_slashes=True)
```
:---

## Staticファイル

---:1

Sanicから静的ファイルを提供するには、`app.static()`を使用します。

引数の順序は重要です。

1. ファイルが提供されるルート
2. サーバー上のファイルへのパス

詳しくは[API docs]()を見てください。 :--:1 :--:1
```python
app.static("/static", "/path/to/directory")
```
:---

---:1

個々のファイルを提供することもできます。 :--:1 :--:1
```python
app.static("/", "/path/to/index.html")
```
:---

---:1

また、エンドポイントに名前を付けると便利な場合もあります。 :--:1
```python
app.static(
    "/user/uploads",
    "/path/to/uploads",
    name="uploads",
)
```
:---

---:1

URLの取得は、ハンドラと同様に機能します。 ただし、ディレクトリ内に特定のファイルが必要な場合は、`filename`引数を追加することもできます。 :--:1 :--:1
```python
>>> app.url_for(
    "static",
    name="static",
    filename="file.txt",
)
'/static/file.txt'
```
```python
>>> app.url_for(
    "static",
    name="uploads",
    filename="image.png",
)
'/user/uploads/image.png'

```
:---

::: tip 複数の`static()`ルートを使用する場合は、手動で名前を付けることを推奨します。 これにより、バグを発見するのが難しい可能性がほぼ確実に軽減されます。

```python
app.static("/user/uploads", "/path/to/uploads", name="uploads")
app.static("/user/profile", "/path/to/profile", name="profile_pics")
```
:::

## ルートコンテキスト

---:1 ルートが定義されるとき、`ctx_` という接頭辞を持つキーワード引数をいくつでも追加することができます。 これらの値はルートの `ctx` オブジェクトにインジェクションされます。 :--:1 :--:1
```python
@app.get("/1", ctx_label="something")
async def handler1(request):
    ...

@app.get("/2", ctx_label="something")
async def handler2(request):
    ...

@app.get("/99")
async def handler99(request):
    ...

@app.on_request
async def do_something(request):
    if request.route.ctx.label == "something":
        ...
```
:--- *Added in v21.12*
