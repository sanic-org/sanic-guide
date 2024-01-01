# Request

`Request`インスタンスには、そのパラメータに関する有用な情報が**たくさん**含まれています。詳細については、[APIドキュメント](https://sanic.readthedocs.io/) を参照してください。

## Body

:::: tabs
::: tab JSON

**Parameter**: `request.json`  
**Description**: The parsed JSON object

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```

```python
>>> print(request.json)
{'foo': 'bar'}
```
:::

::: tab Raw

**Parameter**: `request.body`  
**Description**: The raw bytes from the request body

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```

```python
>>> print(request.body)
b'{"foo": "bar"}'
```
:::

::: tab Form

**Parameter**: `request.form`  
**Description**: The form data

```bash
$ curl localhost:8000 -d 'foo=bar'
```

```python
>>> print(request.body)
b'foo=bar'

>>> print(request.form)
{'foo': ['bar']}

>>> print(request.form.get("foo"))
bar

>>> print(request.form.getlist("foo"))
['bar']
```

::: tip FYI
:bulb: `request.form`オブジェクトは、各値がリストであるディクショナリの、いくつかのタイプの1つです。これは、HTTPでは1つのキーを再利用して複数の値を送信できるためです。  

Most of the time you will want to use the `.get()` method to access the first element and not a list. If you do want a list of all items, you can use `.getlist()`.
:::

::: tab Uploaded

**Parameter**: `request.files`  
**Description**: The files uploaded to the server

```bash
$ curl -F 'my_file=@/path/to/TEST' http://localhost:8000
```

```python
>>> print(request.body)
b'--------------------------cb566ad845ad02d3\r\nContent-Disposition: form-data; name="my_file"; filename="TEST"\r\nContent-Type: application/octet-stream\r\n\r\nhello\n\r\n--------------------------cb566ad845ad02d3--\r\n'

>>> print(request.files)
{'my_file': [File(type='application/octet-stream', body=b'hello\n', name='TEST')]}

>>> print(request.files.get("my_file"))
File(type='application/octet-stream', body=b'hello\n', name='TEST')

>>> print(request.files.getlist("my_file"))
[File(type='application/octet-stream', body=b'hello\n', name='TEST')]
```
::: tip FYI
:bulb: The `request.files` object is one of a few types that is a dictionary with each value being a list. This is because HTTP allows a single key to be reused to send multiple values.  

Most of the time you will want to use the `.get()` method to access the first element and not a list. If you do want a list of all items, you can use `.getlist()`.
:::

::::

## Context

### Request context

`request.ctx`オブジェクトは、リクエストに関して必要な情報を格納するためのプレイグラウンドです。

これは、認証されたユーザーの詳細などのアイテムを格納するためによく使用されます。[ミドルウェア](./middleware.md)を使用しますが、ここでは簡単な例を示します。

```python
@app.on_request
async def run_before_handler(request):
    request.ctx.user = await fetch_user_by_token(request.token)

@app.route('/hi')
async def hi_my_name_is(request):
    return text("Hi, my name is {}".format(request.ctx.user.name))
```

典型的な使用例は、データベースから取得したユーザー・オブジェクトを認証ミドルウェアに格納することです。追加されたキーは、以降のすべてのミドルウェアおよびリクエストの実行中にハンドラからアクセスできます。

カスタムコンテキストは、アプリケーションおよび拡張用に予約されています。サニック自身はそれを利用しない。

### Connection context

---:1

多くの場合、APIは同じクライアントに対して複数の同時 (または連続) リクエストを処理する必要があります。たとえば、データを取得するために複数のエンドポイントにクエリを実行する必要があるプログレッシブウェブアプリでは、これが頻繁に発生します。

HTTPプロトコルでは、[keep alive headers](../ deployment/configuration.md#keep-alive-timeout)を使用した接続によって発生するオーバーヘッド時間を緩和する必要があります。

複数のリクエストが1つの接続を共有する場合、Sanicはそれらのリクエストが状態を共有できるようにコンテキストオブジェクトを提供します。

:--:1
```python
@app.on_request
async def increment_foo(request):
    if not hasattr(request.conn_info.ctx, "foo"):
        request.conn_info.ctx.foo = 0
    request.conn_info.ctx.foo += 1

@app.get("/")
async def count_foo(request):
    return text(f"request.conn_info.ctx.foo={request.conn_info.ctx.foo}")
```

```bash
$ curl localhost:8000 localhost:8000 localhost:8000
request.conn_info.ctx.foo=1
request.conn_info.ctx.foo=2
request.conn_info.ctx.foo=3
```
:---

### Custom Request Objects

As dicussed in [application customization](./app.md#custom-requests), you can create a subclass of `sanic.Request` to add additional functionality to the request object. This is useful for adding additional attributes or methods that are specific to your application.

---:1
For example, imagine your application sends a custom header that contains a user ID. You can create a custom request object that will parse that header and store the user ID for you.
:--:1
```python
from sanic import Sanic, Request

class CustomRequest(Request):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_id = self.headers.get("X-User-ID")

app = Sanic("Example", request_class=CustomRequest)
```
:---

---:1
Now, in your handlers, you can access the `user_id` attribute.
:--:1
```python
@app.route("/")
async def handler(request: CustomRequest):
    return text(f"User ID: {request.user_id}")
```
:---

::: new NEW in v23.6
### Custom Request Context

By default, the request context (`request.ctx`) is a `SimpleNamespace` object allowing you to set arbitrary attributes on it. While this is super helpful to reuse logic across your application, it can be difficult in the development experience since the IDE will not know what attributes are available.

To help with this, you can create a custom request context object that will be used instead of the default `SimpleNamespace`. This allows you to add type hints to the context object and have them be available in your IDE.

---:1
Start by subclassing the `sanic.Request` class to create a custom request type. Then, you will need to add a `make_context()` method that returns an instance of your custom context object. *NOTE: the `make_context` method should be a static method.*
:--:1
```python
from sanic import Sanic, Request
from types import SimpleNamespace

class CustomRequest(Request):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ctx.user_id = self.headers.get("X-User-ID")

    @staticmethod
    def make_context() -> CustomContext:
        return CustomContext()

@dataclass
class CustomContext:
    user_id: str = None
```
:---

*Added in v23.6*
:::

## Parameters

---:1
パスから抽出された値は、パラメータとして、より具体的にはキーワード引数としてハンドラに注入されます。詳細については、 [ルーティングセクション](./routing.md)。
:--:1
```python
@app.route('/tag/<tag>')
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---


## Arguments

`request`インスタンスには、問合せパラメータを取得するための2つの属性があります。

- `request.args`
- `request.query_args`

```bash
$ curl http://localhost:8000\?key1\=val1\&key2\=val2\&key1\=val3
```

```python
>>> print(request.args)
{'key1': ['val1', 'val3'], 'key2': ['val2']}

>>> print(request.args.get("key1"))
val1

>>> print(request.args.getlist("key1"))
['val1', 'val3']

>>> print(request.query_args)
[('key1', 'val1'), ('key2', 'val2'), ('key1', 'val3')]

>>> print(request.query_string)
key1=val1&key2=val2&key1=val3

```

::: tip FYI
:bulb: `request.args`オブジェクトは、各値がリストになっているディクショナリのタイプの1つです。これは、HTTPでは1つのキーを再利用して複数の値を送信できるためです。  

Most of the time you will want to use the `.get()` method to access the first element and not a list. If you do want a list of all items, you can use `.getlist()`.
:::

## Current request getter

Sometimes you may find that you need access to the current request in your application in a location where it is not accessible. A typical example might be in a `logging` format. You can use `Request.get_current()` to fetch the current request (if any).

```python
import logging

from sanic import Request, Sanic, json
from sanic.exceptions import SanicException
from sanic.log import LOGGING_CONFIG_DEFAULTS

LOGGING_FORMAT = (
    "%(asctime)s - (%(name)s)[%(levelname)s][%(host)s]: "
    "%(request_id)s %(request)s %(message)s %(status)d %(byte)d"
)

old_factory = logging.getLogRecordFactory()


def record_factory(*args, **kwargs):
    record = old_factory(*args, **kwargs)
    record.request_id = ""

    try:
        request = Request.get_current()
    except SanicException:
        ...
    else:
        record.request_id = str(request.id)

    return record


logging.setLogRecordFactory(record_factory)

LOGGING_CONFIG_DEFAULTS["formatters"]["access"]["format"] = LOGGING_FORMAT

app = Sanic("Example", log_config=LOGGING_CONFIG_DEFAULTS)
```

In this example, we are adding the `request.id` to every access log message.

*Added in v22.6*
