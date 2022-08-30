# テストクライアント

3種類のテストクライアントが用意されており、それぞれ異なる機能を備えています。

## 通常同期クライアント: `SanicTestClient`

`SanicTestClient` は、あなたのローカルネットワーク上で実際のバージョンの Sanic Server を実行し、テストを実行します。 エンドポイントを呼び出すたびに、アプリケーションのバージョンがスピンアップされ、ホスト OS 上のソケットにバインドされます。 そして、`httpx`を使用して、そのアプリケーションに直接呼び出しを行います。

これは Sanic アプリケーションがテストされる典型的な方法です。

---:1 Sanic Testing をインストールすると、通常の `SanicTestClient` をそのまま使用できるようになります。 これは、Sanicが縁の下であなたのために裏の働きを行うからです。 :--:
```python
app.test_client.get("/path/to/endpoint")
```
:---

---:1 しかし、クライアントを自分でインスタンス化することが望ましいと思われるかもしれません。 :--:
```python
from sanic_testing.testing import SanicTestClient

test_client = SanicTestClient(app)
test_client.get("/path/to/endpoint")
```
:---

---:1 テストクライアントを起動するための第三の選択肢は、 `TestManager` を使用することです。 これは、`SanicTestClient` と `SanicASGITestClient` の両方をセットアップするための便利なオブジェクトです。

:--:
```python
from sanic_testing import TestManager

mgr = TestManager(app)
app.test_client.get("/path/to/endpoint")
# もしくは
mgr.test_client.get("/path/to/endpoint")
```
:---

以下のいずれかの方法でリクエストしてください。

- `SanicTestClient.get`
- `SanicTestClient.post`
- `SanicTestClient.put`
- `SanicTestClient.patch`
- `SanicTestClient.delete`
- `SanicTestClient.options`
- `SanicTestClient.head`
- `SanicTestClient.websocket`
- `SanicTestClient.request`

これらのメソッドは、 `httpx` を使用するときと *ほとんど* 同じように使用することができます。 `httpx` に渡すような引数はすべて受け入れられますが、 **ひとつだけ注意点があります** 。 もし、 `test_client.request` を使用していて、HTTPメソッドを手動で指定したい場合は、以下のようにし、`http_method`を使用します。

```python
test_client.request("/path/to/endpoint", http_method="get")
```

## ASGI非同期クライアント: `SanicASGITestClient`

リクエストごとにサーバーを起動する `SanicTestClient` とは異なり、`SanicASGITestClient` はそうしません。 代わりに、 `httpx` ライブラリを利用して、SanicをASGIアプリケーションとして実行し、内部からルートハンドラを実行します。

---:1 このテストクライアントは、`SanicTestClient` と全て同じメソッドを提供し、基本的に同じ動作をします。 唯一の違いは、各コールに `await` を追加する必要があることです。 :--:
```python
await app.test_client.get("/path/to/endpoint")
```
:---

`SanicASGITestClient` は `SanicTestClient` と全く同じ3つの方法で使用することができます。

::: tip メモ `SanicASGITestClient` はASGIアプリケーションにのみ使用する必要はありません。 同様に、`SanicTestClient` は、同期エンドポイントのみをテストする必要はありません。 これらのクライアントはどちらも *あらゆる* Sanic アプリケーションをテストすることが可能です。 :::

## 永続的なサービスクライアント: `ReusableClient`

このクライアントは `SanicTestClient` と同様の前提で動作し、アプリケーションのインスタンスを立ち上げ、実際に HTTP リクエストを送信します。 しかし、`SanicTestClient` とは異なり、`ReusableClient` を使用する場合は、アプリケーションのライフサイクルを制御することができます。

つまり、すべてのリクエストで新しい Web サーバーが起動されるわけではありません。 その代わり、必要に応じてサーバーを起動・停止し、同じインスタンスに対して複数のリクエストを行うことができます。

---:1 他の2つのクライアントとは異なり、このクライアントは使用するためにインスタンス化**しなければなりません**。 :--:
```python
from sanic_testing.reusable import ReusableClient

client = ReusableClient(app)
```
:---


---:1 作成したら、クライアントをコンテキスト・マネージャの内部で使用することになります。 マネージャの範囲外に出ると、サーバはシャットダウンします。 :--:
```python
from sanic_testing.reusable import ReusableClient

def test_multiple_endpoints_on_same_server(app):
    client = ReusableClient(app)
    with client:
        _, response = client.get("/path/to/1")
        assert response.status == 200

        _, response = client.get("/path/to/2")
        assert response.status == 200
```
:---
