# CORSの保護

Cross-Origin Resource Sharing（別名：CORS）は、それだけで*巨大な*トピックです。 この文書では、それが何であるかについて十分に詳しく説明することはできません。 セキュリティ上の問題や解決策の背景にある理論について理解するために、ご自身で調査されることを強くお勧めします。 [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)が最初の一歩として最適です。

超簡単に説明すると、CORS 保護は、Web ページが別のドメインから情報にアクセスする方法とタイミングを容易にするために、ブラウザが使用するフレームワークです。 これは、単一ページのアプリケーションを構築している人に非常に関連性の高いものです。 フロントエンドは `https://portal.myapp.com` のようなドメインにありますが、バックエンドには `https://api.myapp.com` からアクセスする必要があることがよくあります。

この実装は[`sanic-cors`](https://github.com/ashleysommer/sanic-cors)に強く影響を受けており、さらに[`flask-cors`](https://github.com/corydolphin/flask-cors) がベースになっています。 したがって、`sanic-cors`を`sanic-ext`でほぼ完全に置き換えることができるでしょう。

## 基本的な実装

---:1

[自動エンドポイントの例](methods.md#options) にあるように、Sanic Extensions は特に何もしなくても自動的に CORS 保護を有効にします。 しかし、それは箱から出してもあまり多くのものを提供しません。

最低でも、`config.CORS_ORIGINS` をアプリケーションにアクセスする意図されたオリジンに設定することを **強く** お勧めします。

:--:1
```python
from sanic import Sanic, text
from sanic_ext import Extend

app = Sanic(__name__)
app.config.CORS_ORIGINS = "http://foobar.com,http://bar.com"
Extend(app)

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

```
$ curl localhost:8000 -X OPTIONS -i
HTTP/1.1 204 No Content
allow: GET,HEAD,OPTIONS
access-control-allow-origin: http://foobar.com
connection: keep-alive
```
:---

## コンフィグレーション

CORS 対策の真の威力は、設定を開始してから発揮されます。 以下は、すべてのオプションの表です。

| キー                          | 型                                | デフォルト   | 説明                                                                                                                                                                                                 |
| --------------------------- | -------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CORS_ALLOW_HEADERS`        | `str` または `List[str]`            | `"*"`   | `access-control-allow-headers` に表示されるヘッダのリストです。                                                                                                                                                    |
| `CORS_ALWAYS_SEND`          | `bool`                           | `True`  | `True` の場合、常に `access-control-allow-origin` に値を設定します。 `False` の場合、 `Origin` ヘッダがある場合にのみ設定されます。                                                                                                     |
| `CORS_AUTOMATIC_OPTIONS`    | `bool`                           | `True`  | 受信したプリフライトリクエストに対して、 `access-control-allow-headers`, `access-control-max-age`, `access-control-allow-methods` へ自動的に値を設定するかどうかを指定することができます。 `False` の場合、これらの値は `@cors` デコレーターでデコレートされたルートにのみ設定されます。 |
| `CORS_EXPOSE_HEADERS`       | `str` または `List[str]`            | `""`    | `access-control-expose-headers` ヘッダに設定するヘッダの指定リストです。                                                                                                                                               |
| `CORS_MAX_AGE`              | `str`, `int`, `timedelta`        | `0`     | `access-control-max-age` ヘッダーを使用してプリフライトリマインダーをキャッシュできる最大秒数です。 虚偽の値を指定すると、このヘッダは設定されません。                                                                                                           |
| `CORS_METHODS`              | `str` または `List[str]`            | `""`    | 許可されたオリジンがアクセスできる HTTP メソッド (`access-control-allow-methods`ヘッダーで設定)。                                                                                                                               |
| `CORS_ORIGINS`              | `str`, `List[str]`, `re.Pattern` | `"*"`   | `access-control-allow-origin` ヘッダーで設定した、リソースへのアクセスを許可するオリジンを指定します。                                                                                                                                 |
| `CORS_SEND_WILDCARD`        | `bool`                           | `False` | `True` の場合、 `origin` リクエストヘッダの代わりにワイルドカード `*` オリジンを送信します。                                                                                                                                          |
| `CORS_SUPPORTS_CREDENTIALS` | `bool`                           | `False` | `access-control-allow-credentials` ヘッダを設定するかどうか。                                                                                                                                                   |
| `CORS_VARY_HEADER`          | `bool`                           | `True`  | 適切な場合に `vary` ヘッダーを追加するかどうか。                                                                                                                                                                       |

**簡潔にするために、上記で `List[str]` と記述している場合は、 `list`, `set`, `frozenset`, または `tuple` のインスタンスであれば、何でも構いません。 また、値が `str` の場合は、カンマで区切られたリストでも構いません*。*

## ルートレベル・オーバーライド

---:1

特定のルートに対して、アプリ全体の設定を上書きすることが必要な場合があります。 これを可能にするために、`@sanic_ext.cors()` デコレーターを使用して、異なるルート固有の値を設定することができます。

このデコレータでオーバーライドできる値は、以下のとおりです。

- `origins`
- `expose_headers`
- `allow_headers`
- `allow_methods`
- `supports_credentials`
- `max_age`

:--:1
```python
from sanic_ext import cors

app.config.CORS_ORIGINS = "https://foo.com"


@app.get("/", host="bar.com")
@cors(origins="https://bar.com")
async def hello_world(request):
    return text("Hello, world.")
```
:---
