# Потоковая передача

## Потоковая передача в запросе

Sanic позволяет получать поток данных, отправленных клиентом, чтобы начать их обработку по мере прибытия пакетов.

---:1

Если это определено эндпоинтом, внутри него вы можете получать тело запроса при помощи `await request.stream.read()`.

После завершения загрузки тела этот метод вернет `None`. :--:1
```python
from sanic.views import stream

class SimpleView(HTTPMethodView):
    @stream
    async def post(self, request):
        result = ""
        while True:
            body = await request.stream.read()
            if body is None:
                break
            result += body.decode("utf-8")
        return text(result)
```
:---

---:1

Также это можно включить, передав соответствующий параметр в декораторе... :--:1
```python
@app.post("/stream", stream=True)
async def handler(request):
        ...
        body = await request.stream.read()
        ...
```
:---

---:1

... или в методе `add_route()`. :--:1
```python
bp.add_route(
    bp_handler,
    "/bp_stream",
    methods=["POST"],
    stream=True,
)
```
:---

::: Совет FYI
Только декораторы post, put и patch имеют аргумент stream.
:::

## Потоковая передача в ответе

---:1 Sanic позволяет отправлять клиенту контент в потоке. :--:1

```python
@app.route("/")
async def test(request):
    response = await request.respond(content_type="text/csv")
    await response.send("foo,")
    await response.send("bar")

    # Опционально вы можете явно завершить потоковую передачу путём вызова:
    await response.eof()
```
:---

Это полезно в ситуациях, когда вы хотите передавать клиенту контент, который исходит внешних сервисов, например из базы данных. Например, вы можете транслировать записи базы данных клиенту с помощью асинхронного курсора `asyncpg`.

```python
@app.route("/")
async def index(request):
    response = await request.respond()
    conn = await asyncpg.connect(database='test')
    async with conn.transaction():
        async for record in conn.cursor('SELECT generate_series(0, 10)'):
            await response.send(record[0])
```



Вы можете явно завершить потоковую передачу, вызвав `await response.eof()`. Это удобный метод замены `await response.send("", True)`. Его следует вызвать **один раз** *после* того, как ваш обработчик определил, что у него ничего не осталось для отправки клиенту. Хотя это и *необязательно* для использования с сервером Sanic, если вы используете Sanic в режиме ASGI, тогда вы **должны** явно завершить потоковую передачу.

*Calling `eof` became optional in v21.6*

## Потоковая передача файлов

---:1

Sanic предоставляет функцию `sanic.response.file_stream`, которая полезна при отправке большого файла. Она возвращает объект `StreamingHTTPResponse` и по умолчанию использует кодировку передачи в чанках. По этой причине Sanic не добавляет к ответу HTTP-заголовок `Content-Length`.

Типичным примером использования может быть потоковая передача видео-файла. :--:1
```python
@app.route("/mp4")
async def handler_file_stream(request):
    return await response.file_stream(
        "/path/to/sample.mp4",
        chunk_size=1024,
        mime_type="application/metalink4+xml",
        headers={
            "Content-Disposition": 'Attachment; filename="nicer_name.meta4"',
            "Content-Type": "application/metalink4+xml",
        },
    )
```
:---

---:1

Если вы хотите использовать заголовок `Content-Length`, вы можете добавить его вручную, просто добавив заголовок `Content-Length` и отключить кодировку передачи в чанках.

:--:1
```python
from aiofiles import os as async_os
from sanic.response import file_stream

@app.route("/")
async def index(request):
    file_path = "/srv/www/whatever.png"

    file_stat = await async_os.stat(file_path)
    headers = {"Content-Length": str(file_stat.st_size)}

    return await file_stream(
        file_path,
        headers=headers,
    )
```
:---
