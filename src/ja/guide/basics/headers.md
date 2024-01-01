# Headers

リクエストおよびレスポンスのヘッダーは、それぞれ`Request`オブジェクトと`HTTPResponse`オブジェクトで使用できます。単一のキーが複数の値を持つことを可能にする [`multidict`パッケージ] (https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict) を利用します。

::: tip FYI

ヘッダキーは、解析時に*小文字*に変換されます。ヘッダーでは大文字と小文字は区別されません。

:::

## Request

Sanicは、リクエストヘッダーを開発者に提示する前に正規化を試み、一般的なユースケースのために潜在的に意味のある抽出を行います。

---:1

#### Tokens

`Token`または`Bearer`形式の認可トークンは、リクエスト・オブジェクト`request.token`に抽出されます。

:--:1

```python
@app.route("/")
async def handler(request):
    return text(request.token)
```

```bash
$ curl localhost:8000 \
    -H "Authorization: Token ABCDEF12345679"
ABCDEF12345679
```

```bash
$ curl localhost:8000 \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

:---

---:1

#### Proxy headers

Sanicはプロキシヘッダを特別に扱います。詳細については、 [proxy headers](/guide/advanced/proxy-headers.md) セクションを参照してください。

#### Host header and dynamic URL construction

*実効ホスト*は`request.host`を介して使用できます。これは、プロキシ転送されたホストを優先し、サーバ名の設定によって強制される可能性があるため、必ずしもホストヘッダーと同じではありません。

Webアプリケーションは通常、どのようにデプロイされても同じように機能できるように、このアクセサを使用する必要があります。実際のホストヘッダーは、必要に応じて`request.headers`

実効ホストは、ハンドラの外部アドレスを決定するためにリクエストを使用する`request.url_for`を介して動的URL構築でも使用されます。

::: tip Be wary of malicious clients
これらのURLは、誤ったホストヘッダーを送信することで操作できます。これが懸念される場合は、代わりに`app.url_for`を使用する必要があります。
:::

:--:1

```python
app.config.SERVER_NAME = "https://example.com"

@app.route("/hosts", name="foo")
async def handler(request):
    return json(
        {
            "effective host": request.host,
            "host header": request.headers.get("host"),
            "forwarded host": request.forwarded.get("host"),
            "you are here": request.url_for("foo"),
        }
    )
```

```bash
$ curl localhost:8000/hosts
{
  "effective host": "example.com",
  "host header": "localhost:8000",
  "forwarded host": null,
  "you are here": "https://example.com/hosts"
}
```

:---

---:1
#### Other headers

すべてのリクエストヘッダーは`request.headers`で使用でき、辞書形式でアクセスできます。大文字はヘッダーでは考慮されず、大文字または小文字のキーを使用してアクセスできます。

:--:1

```python
@app.route("/")
async def handler(request):
    return json(
        {
            "foo_weakref": request.headers["foo"],
            "foo_get": request.headers.get("Foo"),
            "foo_getone": request.headers.getone("FOO"),
            "foo_getall": request.headers.getall("fOo"),
            "all": list(request.headers.items()),
        }
    )
```

```bash
$ curl localhost:9999/headers -H "Foo: one" -H "FOO: two"|jq
{
  "foo_weakref": "one",
  "foo_get": "one",
  "foo_getone": "one",
  "foo_getall": [
    "one",
    "two"
  ],
  "all": [
    [
      "host",
      "localhost:9999"
    ],
    [
      "user-agent",
      "curl/7.76.1"
    ],
    [
      "accept",
      "*/*"
    ],
    [
      "foo",
      "one"
    ],
    [
      "foo",
      "two"
    ]
  ]
}
```

:---

::: tip FYI
💡 request.headersオブジェクトは、辞書のタイプの1つで、各値はリストです。これは、HTTPでは1つのキーを再利用して複数の値を送信できるためです。

ほとんどの場合、リストではなく最初の要素にアクセスするには、.get () または.getone () メソッドを使用します。すべての項目のリストが必要な場合は、.getall () を使用できます。
:::

#### Request ID

---:1

多くの場合、 「X-Request-ID」 ヘッダーを使用してリクエストを追跡すると便利です。次の方法で簡単にアクセスできます。
`request.id`.

:--:1

```python
@app.route("/")
async def handler(request):
    return text(request.id)
```

```bash
$ curl localhost:8000 \
    -H "X-Request-ID: ABCDEF12345679"
ABCDEF12345679
```

:---

## Response

必要に応じて、以下のレスポンスヘッダが自動的に設定されます。

- `content-length`
- `content-type`
- `connection`
- `transfer-encoding`

ほとんどの場合、これらのヘッダーの設定について心配する必要はありません。

---:1

設定するその他のヘッダーは、ルートハンドラまたは応答ミドルウェアで実行できます。

:--:1

```python
@app.route("/")
async def handler(request):
    return text("Done.", headers={"content-language": "en-US"})

@app.middleware("response")
async def add_csp(request, response):
    response.headers["content-security-policy"] = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';base-uri 'self';form-action 'self'"
```

:---

---:1

一般的な [ミドルウェア](middleware.md) は、すべての応答に`X-Request-ID`ヘッダーを追加することです。前述のように、`request.id`は着信要求からIDを提供します。ただし、リクエストヘッダーにIDが指定されていない場合でも、自動的にIDが指定されます。

[詳細については、APIドキュメントを参照してください。](https://sanic.readthedocs.io/en/latest/sanic/api_reference.html#sanic.request.Request.id)

:--:1

```python
@app.route("/")
async def handler(request):
    return text(str(request.id))

@app.on_response
async def add_request_id_header(request, response):
    response.headers["X-Request-ID"] = request.id
```

```bash
$ curl localhost:8000 -i
HTTP/1.1 200 OK
X-Request-ID: 805a958e-9906-4e7a-8fe0-cbe83590431b
content-length: 36
connection: keep-alive
content-type: text/plain; charset=utf-8

805a958e-9906-4e7a-8fe0-cbe83590431b
```

:---
