# Веб-сокеты

Для [веб-сокетов](https://websockets.readthedocs.io/en/stable/) Sanic предоставляет легкую в использовании абстракцию.


## Маршрутизация

---:1

Обработчики веб-сокетов могут быть подключены к маршрутизатору аналогичным для обычных хендлеров способом. :--:1
```python
async def feed(request, ws):
    pass

app.add_websocket_route(feed, "/feed")
```
```python
@app.websocket("/feed")
async def feed(request, ws):
    pass
```
:---

## Хендлер (обработчик)


---:1

Обычно обработчик веб-сокета работает в бесконечном цикле.

Таким образом он может использовать методы `send()` и `recv()` для второго объекта, переданного в него.

Этот пример представляет собой простой эндпоинт, который отправляет клиенту получаемые сообщения. :--:1
```python

@app.websocket("/feed")
async def feed(request, ws):
    while True:
        data = "hello!"
        print("Sending: " + data)
        await ws.send(data)
        data = await ws.recv()
        print("Received: " + data)
```
:---
## Конфигурация

Смотрите раздел [Конфигурации](/guide/deployment/configuration.md) для получения более подробной информации.
```python
app.config.WEBSOCKET_MAX_SIZE = 2 ** 20
app.config.WEBSOCKET_MAX_QUEUE = 32
app.config.WEBSOCKET_READ_LIMIT = 2 ** 16
app.config.WEBSOCKET_WRITE_LIMIT = 2 ** 16
app.config.WEBSOCKET_PING_INTERVAL = 20
app.config.WEBSOCKET_PING_TIMEOUT = 20
```
