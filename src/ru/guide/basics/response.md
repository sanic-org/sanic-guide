# Объект ответа

Все [хендлеры](./handlers.md) **обязаны** возвращать объект ответа, в то время как [middleware](./middleware.md) могут возвращать объект ответа опционально.

## Методы

Самый простой способ сгенерировать объект ответа - использовать один из девяти (9) удобных методов.

:::: tabs

::: tab Текст

**Default Content-Type**: `text/plain; charset=utf-8`  
**Описание**: Возвращает обычный текст

```python
from sanic.response import text

@app.route("/")
async def handler(request):
    return text("Hi 😎")
```
:::
::: tab HTML

**Default Content-Type**: `text/html; charset=utf-8`  
**Описание**: Возвращает HTML документ

```python
from sanic.response import html

@app.route("/")
async def handler(request):
    return html('<!DOCTYPE html><html lang="en"><meta charset="UTF-8"><div>Hi 😎</div>')
```
:::
::: tab JSON

**Default Content-Type**: `application/json`  
**Описание**: Возвращает JSON документ

```python
from sanic.response import json

@app.route("/")
async def handler(request):
    return json({"foo": "bar"})
```

По умолчанию Sanic поставляется с пакетом [`ujson`](https://github.com/ultrajson/ultrajson) в качестве выбранного кодировщика JSON. Если вы хотите это изменить - это супер просто.

```python
from orjson import dumps

json({"foo": "bar"}, dumps=dumps)
```

В случае, если `ujson` не установлен, будет использоваться `json` модуль из стандартной библиотеки.

Вы можете дополнительно определить, какую реализацию использовать во всем вашем приложении при его инициализации:

```python
from orjson import dumps

app = Sanic(..., dumps=dumps)
```
:::
::: tab File

**Default Content-Type**: N/A  
**Описание**: Возвращает файл


```python
from sanic.response import file

@app.route("/")
async def handler(request):
    return await file("/path/to/whatever.png")
```

Sanic исследует файл и попробует угадать его тип и использовать соответствующее значение для типа содержимого. Если хотите, вы можете указать это явно:

```python
file("/path/to/whatever.png", mime_type="image/png")
```

Вы также можете переопределить имя файла:

```python
file("/path/to/whatever.png", filename="super-awesome-incredible.png")
```
:::
::: tab "Потоковая передача файла"

**Default Content-Type**: N/A  
**Описание**: Передаёт файл клиенту в потоке; полезно при пересылке больших файлов, например видео

```python
from sanic.response import file_stream

@app.route("/")
async def handler(request):
    return await file_stream("/path/to/whatever.mp4")
```

Как и метод `file()`, `file_stream()` попытается определить тип содержимого файла. :::
::: tab Сырые данные

**Default Content-Type**: `application/octet-stream`  
**Описание**: Отправляет сырые данные без кодирования тела ответа

```python
from sanic.response import raw

@app.route("/")
async def handler(request):
    return raw(b"raw bytes")
```
:::
::: tab Перенаправление

**Default Content-Type**: `text/html; charset=utf-8`  
**Описание**: Отправляет ответ с кодом `302` с последующим перенаправлением запроса клиента по другому пути

```python
from sanic.response import redirect

@app.route("/")
async def handler(request):
    return redirect("/login")
```

:::
::: tab Пустой ответ

**Default Content-Type**: N/A  
**Описание**: Используется для отправки ответа с пустым сообщением, как описано в [RFC 2616](https://tools.ietf.org/search/rfc2616#section-7.2.1)

```python
from sanic.response import empty

@app.route("/")
async def handler(request):
    return empty()
```

По умолчанию статус `204`. :::
::::

## Код статуса по умолчанию

По умолчанию HTTP-код статуса для ответа `200`. Если вам нужно его изменить, то это может быть сделано в методе ответа.


```python
@app.post("/")
async def create_new(request):
    new_thing = await do_create(request)
    return json({"created": True, "id": new_thing.thing_id}, status=201)
```
