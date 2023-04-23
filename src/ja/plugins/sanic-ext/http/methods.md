# HTTPメソッド

## 自動エンドポイント

デフォルトの動作は、すべての`GET`ルートに`HEAD`エンドポイントを、そして全ルートに`OPTIONS`エンドポイントを自動的に生成することです。
さらに、`TRACE`エンドポイントを自動的に生成するオプションもあります。しかし、これらは初期状態では有効ではありません。

::::tabs

:::tab HEAD

- **Configuration**: `AUTO_HEAD` (デフォルトは`True`)
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

- **Configuration**: `AUTO_OPTIONS` (デフォルトは`True`)
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

## メソッドの追加サポート

バニラSanicでは、以下のHTTPメソッドでエンドポイントを構築することができます。

- [GET](/en/guide/basics/routing.html#get)
- [POST](/en/guide/basics/routing.html#post)
- [PUT](/en/guide/basics/routing.html#put)
- [HEAD](/en/guide/basics/routing.html#head)
- [OPTIONS](/en/guide/basics/routing.html#options)
- [PATCH](/en/guide/basics/routing.html#patch)
- [DELETE](/en/guide/basics/routing.html#delete)

もっと見たい場合は[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) を見てください。

---:1

しかし、さらに2つの「標準的な」HTTPメソッドがあります: `TRACE` と `CONNECT` です。
Sanic Extensions は、これらのメソッドを使用したエンドポイントの構築を可能にするもので、他の方法では許可されません。

これは便利なメソッドである `@app.trace` や `@app.connect` を有効にするものではないことに注意してください。
この例で示されているように、`@app.route`を使用する必要があります。

:--:1

```python
@app.route("/", methods=["trace", "connect"])
async def handler(_):
    return empty()
```

:---
