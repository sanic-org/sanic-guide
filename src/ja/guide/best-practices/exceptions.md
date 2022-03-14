# 例外エラー

## Sanicの例外を使う

場合によっては、ハンドラの実行を停止し、ステータスコード応答を返すようにSanicに指示する必要があります。このために 「SanicException」 を発生させることができ、残りはSanicが行います。

オプションの`status_code`引数を渡すことができます。デフォルトでは、SanicExceptionは内部サーバエラー500応答を返します。

```python
from sanic.exceptions import SanicException

@app.route("/youshallnotpass")
async def no_no(request):
        raise SanicException("Something went wrong.", status_code=501)
```

Sanicはいくつかの標準的な例外を提供しています。これらはそれぞれ、応答で適切なHTTPステータスコードを自動的に生成します。詳しくは[APIリファレンスを確認](https://sanic.readthedocs.io/en/latest/sanic/api_reference.html#module-sanic.exceptions)を参照してください。

---:1

あなた自身が実装すべき一般的な例外は以下の通りです。

- `InvalidUsage` (400)
- `Unauthorized` (401)
- `Forbidden` (403)
- `NotFound` (404)
- `ServerError` (500)

:--:1

```python
from sanic import exceptions

@app.route("/login")
async def login(request):
    user = await some_login_func(request)
    if not user:
        raise exceptions.NotFound(
            f"Could not find user with username={request.json.username}"
        )
    ...
```

:---

## 例外プロパティ

Sanicのすべての例外は `SanicException` から派生します。このクラスにはいくつかのプロパティがあり、開発者がアプリケーション全体で一貫して例外を報告できるように支援します。

- `message`
- `status_code`
- `quiet`
- `context`
- `extra`

これらのプロパティはすべて例外の生成時に渡すことができますが、これから説明するように、最初の3つはクラス変数として使用することもできます。

---:1
### `message`

`message` プロパティは、Python の他の例外と同様に、表示されるメッセージを制御します。特に便利なのは、クラス定義で `message` プロパティを設定できることで、アプリケーション全体の言語を簡単に標準化することができることです。
:--:1
```python
class CustomError(SanicException):
    message = "Something bad happened"

raise CustomError
# もしくは
raise CustomError("Override the default message with something else")
```
:---

---:1
### `status_code`

このプロパティは、例外が発生したときの応答コードを設定するために用います。これは、通常クライアントから来る悪い情報への対応である、カスタムの400シリーズ例外を作成するときに特に有用です。
:--:1
```python
class TeapotError(SanicException):
    status_code = 418
    message = "Sorry, I cannot brew coffee"

raise TeapotError
# もしくは
raise TeapotError(status_code=400)
```
:---

---:1
### `quiet`

デフォルトでは、例外は Sanic によって `error_logger` に出力されます。特に例外ハンドラでイベントのトリガとして例外を使っている場合、これは望ましくないことがあります ([次のセクションを参照してください](./exceptions.md#handling))。`quiet=True`を使用すると、ログ出力を抑制することができます。
:--:1
```python
class SilentError(SanicException):
    message = "Something happened, but not shown in logs"
    quiet = True

raise SilentError
# もしくは
raise InvalidUsage("blah blah", quiet=True)
```
:---

---:1
::: new NEW in v21.12
デバッグ中に、`quiet=True` プロパティをグローバルに無視したいことがあるかもしれません。このプロパティに関係なく、Sanicにすべての例外をログアウトさせるには、 `NOISY_EXCEPTIONS` を使用します。
:::
:--:1
```python
app.config.NOISY_EXCEPTIONS = True
```
:---

---:1
::: new NEW in v21.12
### `extra`

[文脈上の例外](./exceptions.md#contextual-exceptions)を参照してください。
:::
:--:1
```python
raise SanicException(..., extra={"name": "Adam"})
```
:---

---:1
::: new NEW in v21.12
### `context`

[文脈上の例外](./exceptions.md#contextual-exceptions)を参照してください。
:::
:--:1
```python
raise SanicException(..., context={"foo": "bar"})
```
:---


## 取り扱い

Sanicはエラーページを表示することで例外を自動的に処理するので、多くの場合、ユーザ自身が処理する必要はありません。ただし、例外が発生したときの処理をより詳細に制御したい場合は、ハンドラを自分で実装できます。

Sanicはこのためのデコレータを提供しており、これはSanic標準の例外だけでなく、アプリケーションがスローする可能性のある**任意の**例外にも適用されます。

---:1

ハンドラを追加する最も簡単な方法は、`@app.exception()`を使用して1つ以上の例外を渡すことです。

:--:1

```python
from sanic.exceptions import NotFound

@app.exception(NotFound, SomeCustomException)
async def ignore_404s(request, exception):
    return text("Yep, I totally found the page: {}".format(request.url))
```

:---

---:1

`Exception`をキャッチすることで、catchallハンドラを作成することもできます。

:--:1

```python
@app.exception(Exception)
async def catch_anything(request, exception):
    ...
```

:---

---:1

`app.error_handler.add()`を使用してエラー・ハンドラを追加することもできます。

:--:1

```python
async def server_error_handler(request, exception):
    return text("Oops, server error", status=500)

app.error_handler.add(Exception, server_error_handler)
```

:---

## 組み込みのエラー処理

Sanicには、例外用にHTML、JSON、およびテキストの3つの形式が用意されています。以下の [Fallback handler](#fallback-handler) セクションに例があります。

---:1

::: new NEW in v21.9
route_which形式を使用するには、`error_format`キーワード引数を使用します。

:::

:--:1

```python
@app.request("/", error_format="text")
async def handler(request):
    ...
```

:---


## カスタムエラー処理

場合によっては、デフォルトで提供される機能にさらにエラー処理機能を追加する必要があります。この場合、次のようにSanicのデフォルトのエラーハンドラをサブクラス化できます。

```python
from sanic.handlers import ErrorHandler

class CustomErrorHandler(ErrorHandler):
    def default(self, request, exception):
        ''' handles errors that have no error handlers assigned '''
        # You custom error handling logic...
        return super().default(request, exception)

app.error_handler = CustomErrorHandler()
```

## ハンドルフォールバック

Sanicには3つのフォールバック例外ハンドラがあります。

1. HTML (*default*)
2. Text
3. JSON

これらのハンドラは、アプリケーションが[デバッグモード](/guide/deployment/development.md)にあるかどうかによって、異なる詳細レベルを表示します。

### HTML

```python
app.config.FALLBACK_ERROR_FORMAT = "html"
```

---:1

```python
app.config.DEBUG = True
```

![Error](~@assets/images/error-html-debug.png)

:--:1

```python
app.config.DEBUG = False
```

![Error](~@assets/images/error-html-no-debug.png)

:---

### Text

```python
app.config.FALLBACK_ERROR_FORMAT = "text"
```

---:1

```python
app.config.DEBUG = True
```

```bash
$ curl localhost:8000/exc -i
HTTP/1.1 500 Internal Server Error
content-length: 590
connection: keep-alive
content-type: text/plain; charset=utf-8

⚠️ 500 — Internal Server Error
==============================
That time when that thing broke that other thing? That happened.

ServerError: That time when that thing broke that other thing? That happened. while handling path /exc
Traceback of __BASE__ (most recent call last):

  ServerError: That time when that thing broke that other thing? That happened.
    File /path/to/sanic/app.py, line 986, in handle_request
    response = await response

    File /path/to/server.py, line 222, in exc
    raise ServerError(
```

:--:1

```python
app.config.DEBUG = False
```

```bash
$ curl localhost:8000/exc -i
HTTP/1.1 500 Internal Server Error
content-length: 134
connection: keep-alive
content-type: text/plain; charset=utf-8

⚠️ 500 — Internal Server Error
==============================
That time when that thing broke that other thing? That happened.
```

:---

### JSON

```python
app.config.FALLBACK_ERROR_FORMAT = "json"
```

---:1

```python
app.config.DEBUG = True
```

```bash
$ curl localhost:8000/exc -i
HTTP/1.1 500 Internal Server Error
content-length: 129
connection: keep-alive
content-type: application/json

{
  "description": "Internal Server Error",
  "status": 500,
  "message": "That time when that thing broke that other thing? That happened.",
  "path": "/exc",
  "args": {},
  "exceptions": [
    {
      "type": "ServerError",
      "exception": "That time when that thing broke that other thing? That happened.",
      "frames": [
        {
          "file": "/path/to/sanic/app.py",
          "line": 986,
          "name": "handle_request",
          "src": "response = await response"
        },
        {
          "file": "/path/to/server.py",
          "line": 222,
          "name": "exc",
          "src": "raise ServerError("
        }
      ]
    }
  ]
}


```

:--:1

```python
app.config.DEBUG = False
```

```bash
$ curl localhost:8000/exc -i
HTTP/1.1 500 Internal Server Error
content-length: 530
connection: keep-alive
content-type: application/json

{
  "description": "Internal Server Error",
  "status": 500,
  "message": "That time when that thing broke that other thing? That happened."
}

```

:---

### 自動

Sanicには、使用するフォールバックオプションを推測するためのオプションも用意されています。これはまだ**実験的な機能です**.

```python
app.config.FALLBACK_ERROR_FORMAT = "auto"
```
