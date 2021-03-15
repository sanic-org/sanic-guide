# Websockets

Sanic 提供了操作一个易操作的 [websockets](https://websockets.readthedocs.io/en/stable/) 封装。

## 定义路由(Routing)

---:1

定义 Websocket 的路由和定义普通的路由相似。

:--:1

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

## 定义响应函数(Handler)

---:1

通常的，一个 websocket 的响应函数将会打开并维持一个通讯循环。

然后，可以调用传入函数的第二个参数对象的 `send()` 和 `recv()` 方法来处理业务。

下面这个例子定义了一个简单的 websocket 路由，它将客户端发送的信息再发送回去。

:--:1

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

## 配置(Configuration)

更多细节请看 [配置](/zh/guide/deployment/configuration.md) 章节。

```python
app.config.WEBSOCKET_MAX_SIZE = 2 ** 20
app.config.WEBSOCKET_MAX_QUEUE = 32
app.config.WEBSOCKET_READ_LIMIT = 2 ** 16
app.config.WEBSOCKET_WRITE_LIMIT = 2 ** 16
app.config.WEBSOCKET_PING_INTERVAL = 20
app.config.WEBSOCKET_PING_TIMEOUT = 20
```
