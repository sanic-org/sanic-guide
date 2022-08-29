# 요청 (Request)

`Request` 인스턴스에는 해당 매개변수에서 사용할 수 있는 **많은** 유용한 정보가 포함되어 있습니다. 자세한 내용은 [API Docs](https://sanic.readthedocs.io/)를 참조하세요.

## 본문 (Body)

:::: tabs
::: tab JSON

**매개변수**: `request.json`  
**설명**: 구문 분석된 JSON 객체

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```

```python
>>> print(request.json)
{'foo': 'bar'}
```
:::

::: tab Raw

**매개변수**: `request.body`  
**설명**: 요청 본문의 원시 바이트

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```

```python
>>> print(request.body)
b'{"foo": "bar"}'
```
:::

::: tab Form

**매개변수**: `request.form`  
**설명**: 폼 데이터

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

:bulb: `request.form` 객체는 각 값이 목록인 사전인 몇 가지 유형 중 하나입니다. HTTP에서는 단일 키를 재사용하여 여러 값을 보낼 수 있기 때문입니다.

대부분의 경우 `.get()` 메서드를 사용하여 목록이 아닌 첫 번째 요소에 액세스하기를 원할 것입니다. 모든 항목의 목록을 원하면 `.getlist()`를 사용할 수 있습니다. :::

::: tab Uploaded

**매개변수**: `request.files`  
**설명**: 서버에 업로드된 파일

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
::: tip FYI :bulb: `request.files` 객체는 각 값이 목록인 사전인 몇 가지 유형 중 하나입니다. HTTP에서는 단일 키를 재사용하여 여러 값을 보낼 수 있기 때문입니다.

대부분의 경우 `.get()` 메서드를 사용하여 목록이 아닌 첫 번째 요소에 액세스하기를 원할 것입니다. 모든 항목의 목록을 원하면 `.getlist()`를 사용할 수 있습니다. :::

::::

## 컨텍스트 (Context)

### 요청 컨텍스트 (Request context)

`request.ctx` 객체는 요청에 대해 필요한 모든 정보를 저장하는 놀이터입니다.

인증된 사용자 세부 정보와 같은 항목을 저장하는 데 자주 사용됩니다. 나중에 [middleware](./middleware.md)에 대해 더 자세히 다루겠지만 여기에 간단한 예가 있습니다.

```python
@app.on_request
async def run_before_handler(request):
    request.ctx.user = await fetch_user_by_token(request.token)

@app.route('/hi')
async def hi_my_name_is(request):
    return text("Hi, my name is {}".format(request.ctx.user.name))
```

일반적인 사용 사례는 인증 미들웨어에 데이터베이스에서 얻은 사용자 객체를 저장하는 것입니다. 추가된 키는 이후의 모든 미들웨어와 요청 기간 동안 처리기에 액세스할 수 있습니다.

사용자 정의 컨텍스트는 애플리케이션 및 확장을 위해 예약되어 있습니다. Sanic 자체는 그것을 사용하지 않습니다.

### 연결 컨텍스트(Connection context)

---:1

종종 API는 동일한 클라이언트에 여러 동시(또는 연속) 요청을 제공해야 합니다. 예를 들어, 이는 데이터를 얻기 위해 여러 엔드포인트를 쿼리해야 하는 점진적 웹 앱에서 매우 자주 발생합니다.

The HTTP protocol calls for an easing of overhead time caused by the connection with the use of [keep alive headers](../deployment/configuration.md#keep-alive-timeout).

HTTP 프로토콜은 [keep live headers](../deployment/configuration.md#keep-alive-timeout)를 사용하여 연결로 인한 오버헤드 시간의 완화를 요청합니다

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

## 매개변수 (Parameters)

---:1 경로에서 추출된 값은 핸들러에 매개변수로, 더 구체적으로는 키워드 인수로 주입됩니다. [Routing section](./routing.md)에 이에 대한 자세한 내용이 있습니다. :--:1
```python
@app.route('/tag/<tag>')
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---


## 인수 (Arguments)

쿼리 매개변수를 가져오기 위한 `request` 인스턴스에는 두 가지 속성이 있습니다.

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

::: tip FYI :bulb: `request.args` 객체는 각 값이 목록인 사전인 몇 가지 유형 중 하나입니다. HTTP에서는 단일 키를 재사용하여 여러 값을 보낼 수 있기 때문입니다.

대부분의 경우 `.get()` 메서드를 사용하여 목록이 아닌 첫 번째 요소에 액세스하기를 원할 것입니다. 모든 항목의 목록을 원하면 `.getlist()`를 사용할 수 있습니다. :::

::: new NEW in v22.6

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

:::
