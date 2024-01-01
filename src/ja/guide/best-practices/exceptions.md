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
```

:---

## 例外プロパティ

Sanicのすべての例外は `SanicException` から派生します。このクラスにはいくつかのプロパティがあり、開発者がアプリケーション全体で一貫して例外を報告できるように支援します。

- `message`
- `status_code`
- `quiet`
- `headers`
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
デバッグ中に、`quiet=True` プロパティをグローバルに無視したいことがあるかもしれません。このプロパティに関係なく、Sanicにすべての例外をログアウトさせるには、 `NOISY_EXCEPTIONS` を使用します。

*v21.12で追加*
:--:1
```python
app.config.NOISY_EXCEPTIONS = True
```
:---

---:1
### `headers`

Using `SanicException` as a tool for creating responses is super powerful. This is in part because not only can you control the `status_code`, but you can also control reponse headers directly from the exception.
:--:1
```python
class MyException(SanicException):
    headers = {
      "X-Foo": "bar"
    }

raise MyException
# or
raise InvalidUsage("blah blah", headers={
    "X-Foo": "bar"
})
```
:---

---:1
### `extra`

[文脈上の例外](./exceptions.md#contextual-exceptions)を参照してください。

*v21.12で追加*
:--:1
```python
raise SanicException(..., extra={"name": "Adam"})
```
:---

---:1
### `context`

[文脈上の例外](./exceptions.md#contextual-exceptions)を参照してください。

*v21.12で追加*
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
route_which形式を使用するには、`error_format`キーワード引数を使用します。

*v21.9で追加*
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
    def default(self, request: Request, exception: Exception) -> HTTPResponse:
        ''' handles errors that have no error handlers assigned '''
        # You custom error handling logic...
        status_code = getattr(exception, "status_code", 500)
        return json({
          "error": str(exception),
          "foo": "bar"
        }, status=status_code)

app.error_handler = CustomErrorHandler()
```

## ハンドルフォールバック

Sanicには3つのフォールバック例外ハンドラがあります。

1. HTML
2. Text
3. JSON

これらのハンドラは、アプリケーションが[デバッグモード](/guide/deployment/development.md)にあるかどうかによって、異なる詳細レベルを表示します。

By default, Sanic will be in "auto" mode, which means that it will using the incoming request and potential matching handler to choose the appropriate response format. For example, when in a browser it should always provide an HTML error page. When using curl, you might see JSON or plain text.

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
Traceback of TestApp (most recent call last):

  ServerError: That time when that thing broke that other thing? That happened.
    File /path/to/sanic/app.py, line 979, in handle_request
    response = await response

    File /path/to/server.py, line 16, in handler
    do_something(cause_error=True)

    File /path/to/something.py, line 9, in do_something
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
          "line": 979,
          "name": "handle_request",
          "src": "response = await response"
        },
        {
          "file": "/path/to/server.py",
          "line": 16,
          "name": "handler",
          "src": "do_something(cause_error=True)"
        },
        {
          "file": "/path/to/something.py",
          "line": 9,
          "name": "do_something",
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
content-length: 129
connection: keep-alive
content-type: application/json

{
  "description": "Internal Server Error",
  "status": 500,
  "message": "That time when that thing broke that other thing? That happened."
}

```

:---

### Auto

Sanicには、使用するフォールバックオプションを推測するためのオプションも用意されています。

```python
app.config.FALLBACK_ERROR_FORMAT = "auto"
```
## 文脈上の例外

デフォルトの例外メッセージにより、アプリケーション全体で一貫して例外を発生させる機能を簡素化できます。

```python
class TeapotError(SanicException):
    status_code = 418
    message = "Sorry, I cannot brew coffee"

raise TeapotError
```

しかし、これには2つのことが欠けています。

1. ダイナミックで予測可能なメッセージのフォーマット
2. エラーメッセージに追加のコンテキストを追加する機能（詳細は後述します）

*v21.12で追加*

Using one of Sanic's exceptions, you have two options to provide additional details at runtime:

```python
raise TeapotError(extra={"foo": "bar"}, context={"foo": "bar"})
```

What's the difference and when should you decide to use each?

- `extra` - The object itself will **never** be sent to a production client. It is meant for internal use only. What could it be used for?
  - Generating (as we will see in a minute) a dynamic error message
  - Providing runtime details to a logger
  - Debug information (when in development mode, it is rendered)
- `context` - This object is **always** sent to production clients. It is generally meant to be used to send additional details about the context of what happened. What could it be used for?
  - Providing alternative values on a `BadRequest` validation issue
  - Responding with helpful details for your customers to open a support ticket
  - Displaying state information like current logged in user info


### `extra` を使用した動的で予測可能なメッセージ

Sanic の例外は `extra` キーワード引数を使って発生させることができ、発生した例外インスタンスに追加情報を提供することができます。

```python
class TeapotError(SanicException):
    status_code = 418

    @property
    def message(self):
        return f"Sorry {self.extra['name']}, I cannot make you coffee"

raise TeapotError(extra={"name": "Adam"})
```

この新しい機能では、例外インスタンスに `extra` メタを渡すことができます。これは、上記の例のように、メッセージテキストに動的なデータを渡すのに特に便利です。この `extra` 情報オブジェクトは、 `PRODUCTION` モードでは抑制され**、 `DEVELOPMENT` モードでは表示されます。

---:1
**制作**

![image](https://user-images.githubusercontent.com/166269/139014161-cda67cd1-843f-4ad2-9fa1-acb94a59fc4d.png)
:--:1
**開発**

![image](https://user-images.githubusercontent.com/166269/139014121-0596b084-b3c5-4adb-994e-31ba6eba6dad.png)
:---

### エラーメッセージに `context` を追加する

Sanic の例外は、 `context` 引数とともに発生させて、何が起こったのかについてユーザーに意図した情報を渡すこともできます。これは、マイクロサービスや、JSON形式のエラーメッセージを渡すことを目的としたAPIを作成するときに特に便利です。この使用例では、クライアントに詳細を返すために、解析可能なエラーメッセージだけでなく、例外の周りにいくつかのコンテキストを持ちたいと思います。

```python
raise TeapotError(context={"foo": "bar"})
```

これは、(利用可能であれば)常にエラーで渡される**ようにしたい**情報です。以下のような感じです。

---:1
**制作**

```json
{
  "description": "I'm a teapot",
  "status": 418,
  "message": "Sorry Adam, I cannot make you coffee",
  "context": {
    "foo": "bar"
  }
}
```
:--:1
**開発**

```json
{
  "description": "I'm a teapot",
  "status": 418,
  "message": "Sorry Adam, I cannot make you coffee",
  "context": {
    "foo": "bar"
  },
  "path": "/",
  "args": {},
  "exceptions": [
    {
      "type": "TeapotError",
      "exception": "Sorry Adam, I cannot make you coffee",
      "frames": [
        {
          "file": "handle_request",
          "line": 83,
          "name": "handle_request",
          "src": ""
        },
        {
          "file": "/tmp/p.py",
          "line": 17,
          "name": "handler",
          "src": "raise TeapotError("
        }
      ]
    }
  ]
}
```
:---


::: new NEW in v23.6

## Error reporting

Sanic has a [signal](../advanced/signals.md#built-in-signals) that allows you to hook into the exception reporting process. This is useful if you want to send exception information to a third party service like Sentry or Rollbar. This can be conveniently accomplished by attaching an error reporting handler as show below:

```python
@app.report_exception
async def catch_any_exception(app: Sanic, exception: Exception):
    print("Caught exception:", exception)
```

::: tip NOTE
This handler will be dispatched into a background task and **IS NOT** intended for use to manipulate any response data. It is intended to be used for logging or reporting purposes only, and should not impact the ability of your application to return the error response to the client.
:::

*Added in v23.6*
:::

