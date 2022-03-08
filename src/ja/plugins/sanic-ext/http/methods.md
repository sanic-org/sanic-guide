# HTTPメソッド

## 自動エンドポイント

デフォルトの動作は、すべての`GET`ルートに`HEAD`エンドポイントを、そして全ルートに`OPTIONS`エンドポイントを自動的に生成することです。
さらに、`TRACE`エンドポイントを自動的に生成するオプションもあります。しかし、これらは初期状態では有効ではありません。

::::tabs

:::tab HEAD

- **Configuration**: `AUTO_HEAD` (default `True`)
- **MDN**: [Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD)

`HEAD` リクエストはヘッダーを提供し、それ以外は `GET` リクエストが提供するものと同じレスポンスを提供します。
しかし、実際にはボディを返しません。

```python
@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

上記のルート定義があれば、Sanic Extensionsはここで見られるように`HEAD`レスポンスを有効にします。

```
$ curl localhost:8000 --head
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 13
connection: keep-alive
content-type: text/plain; charset=utf-8
```

:::

:::tab OPTIONS

- **Configuration**: `AUTO_OPTIONS` (default `True`)
- **MDN**: [Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS)

`OPTIONS` リクエストは、クライアントが与えられたエンドポイントとの通信をどのように許可されるかの詳細を受信者に提供します。

```python
@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

上記のルート定義があれば、Sanic Extensionsはここで見られるように`HEAD`レスポンスを有効にします。

この例では、`access-control-allow-origins`も表示されていることに注意することが重要です。
これは、[CORS保護](cors.md)がデフォルトで有効になっているためです。

```
$ curl localhost:8000 -X OPTIONS -i
HTTP/1.1 204 No Content
allow: GET,HEAD,OPTIONS
access-control-allow-origin: *
connection: keep-alive
```

::: tip Sanic Extensionsがこれらのルートを自動的にセットアップしてくれるとしても、手動で `@app.options` ルートを作成することにした場合、それは オーバーライド**されません**。
:::

:::tab TRACE

- **Configuration**: `AUTO_TRACE` (default `False`)
- **MDN**: [Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE)

デフォルトでは、`TRACE`エンドポイントは自動的に作成**されません**。しかし、Sanic Extensions では、必要であれば作成することができます。これはバニラSanicでは許可されていないことである。

```python
@app.route("/", methods=["trace"])
async def handler(request):
    ...
```

これらのエンドポイントの自動作成を有効にするには、まずSanicを拡張する際に有効にする必要があります。

```python
from sanic_ext import Extend, Config

Extend(app, config=Config(auto_trace=True))
```

さて、いくつかのエンドポイントが設定されていると仮定して、以下のようにトレースすることができます。

```
$ curl localhost:8000 -X TRACE
TRACE / HTTP/1.1
Host: localhost:9999
User-Agent: curl/7.76.1
Accept: */*
```

::: tip `AUTO_TRACE` を設定すると、特にアプリケーションがプロキシの後ろに配置されている場合、非常に便利です。
は、プロキシがどのように動作しているかを判断するのに役立ちます。
:::

::::

## Additional method support

Vanilla Sanic allows you to build endpoints with the following HTTP methods:

- [GET](/en/guide/basics/routing.html#get)
- [POST](/en/guide/basics/routing.html#post)
- [PUT](/en/guide/basics/routing.html#put)
- [HEAD](/en/guide/basics/routing.html#head)
- [OPTIONS](/en/guide/basics/routing.html#options)
- [PATCH](/en/guide/basics/routing.html#patch)
- [DELETE](/en/guide/basics/routing.html#delete)

See [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) for more.

---:1

There are, however, two more "standard" HTTP methods: `TRACE` and `CONNECT`. Sanic Extensions will allow you to build
endpoints using these methods, which would otherwise not be allowed.

It is worth pointing out that this will *NOT* enable convenience methods: `@app.trace` or `@app.connect`. You need to
use `@app.route` as shown in the example here.

:--:1

```python
@app.route("/", methods=["trace", "connect"])
async def handler(_):
    return empty()
```

:---
