# Объект запроса

Объект `запроса` содержит **много** полезной информации о его параметрах. Обратитесь к [документации по API](https://sanic.readthedocs.io/) для получения полной информации.

## Тело запроса

:::: tabs
::: tab JSON

**Параметр**: `request.json`  
**Описание**: Десериализованный объект JSON

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```

```python
>>> print(request.json)
{'foo': 'bar'}
```
:::

::: tab Сырые данные

**Параметр**: `request.body`  
**Описание**: Сырые байты в теле запроса

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```

```python
>>> print(request.body)
b'{"foo": "bar"}'
```
:::

::: tab Форма

**Параметр**: `request.form`  
**Описание**: Данные формы

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

::: Совет FYI :bulb: Объект `request.form` - один из нескольких типов, представляющих собой словарь, каждое значение которого является списком. Это связано с тем, что HTTP позволяет повторно использовать один ключ для отправки нескольких значений.

Чаще всего вы хотите использовать метод `.get()` для доступа к первому элементу, а не списку. Если вы хотите получить список всех элементов, можно использовать `.getlist()`. :::

::: tab Загрузка данных

**Параметр**: `request.files`  
**Описание**: Файлы, загруженные на сервер

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
::: Совет FYI :bulb: Объект `request.files` - один из нескольких типов, представляющих собой словарь, каждое значение которого является списком. Это связано с тем, что HTTP позволяет повторно использовать один ключ для отправки нескольких значений.

Чаще всего вы хотите использовать метод `.get()` для доступа к первому элементу, а не списку. Если вы хотите получить список всех элементов, можно использовать `.getlist()`. :::

::::

## Контекст

### Контекст запроса

Объект `request.ctx` является местом, куда вы можете сохранить любую необходимую информацию о запросе.

Он часто используется для хранения таких элементов, как аутентификационные данные пользователя. Позже мы окунёмся глубже в понятие [middleware](./middleware.md), а пока простой пример.

```python
@app.on_request
async def run_before_handler(request):
    request.ctx.user = await fetch_user_by_token(request.token)

@app.route('/hi')
async def hi_my_name_is(request):
    return text("Hi, my name is {}".format(request.ctx.user.name))
```

Типичным вариантом использования является сохранение объекта user, полученного из базы данных в middleware, отвечающем за аутентификацию. Добавленные ключи доступны в течение всего выполнения запроса для всех последующих middleware, а также для хендлера запроса.

Пользовательский контекст зарезервирован для приложений и расширений. Сам Sanic его не использует.

### Контекст подключения

---:1

Зачастую вашему API придется обрабатывать несколько одновременных (или последовательных) запросов к одному и тому же клиенту. Это очень часто происходит, например, с прогрессивными веб-приложениями, которые должны запрашивать несколько эндпоинтов для получения данных.

Протокол HTTP требует уменьшения времени накладных расходов, вызванного соединением с использованием [keep alive headers](../deployment/configuration.md#keep-alive-timeout).

Когда несколько запросов имеют единое соединение, Sanic предоставляет объект контекста, позволяющий этим запросам обмениваться состоянием.

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

## Параметры

---:1 Значения, извлекаемые из пути, указываются в сигнатуре хендлера в качестве позиционных или именованных аргументов. Подробнее об этом читайте в [разделе Маршрутизация](./routing.md). :--:1
```python
@app.route('/tag/<tag>')
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---


## Аргументы

В объекте `request` есть два атрибута для получения параметров запроса:

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

::: Совет FYI :bulb: Объект `request.args` - один из нескольких типов, представляющих собой словарь, каждое значение которого является списком. Это связано с тем, что HTTP позволяет повторно использовать один ключ для отправки нескольких значений.

Чаще всего вы хотите использовать метод `.get()` для доступа к первому элементу, а не списку. Если вы хотите получить список всех элементов, можно использовать `.getlist()`. :::

## Геттер текущего запроса

Иногда вам может понадобиться доступ к текущему запросу в вашем приложении в том месте, где он недоступен. Типичный пример может быть в формате `логирования`. Вы можете использовать `Request.get_current()` для получения текущего запроса (если он присутствует).

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

В этом примере мы добавляем `request.id` к каждому сообщению в access log.

*Added in v22.6*
