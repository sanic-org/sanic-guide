# Websockets

Sanic 提供了操作一个易操作的 [websockets](https://websockets.readthedocs.io/en/stable/) 封装。


## 定义路由(Routing)

---:1

Websocket handlers can be hooked up to the router similar to regular handlers. :--:1
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

Typically, a websocket handler will want to hold open a loop.

通常的，一个 websocket 的响应函数将会打开并维持一个通讯循环。

下面这个例子定义了一个简单的 websocket 路由，它将客户端发送的信息再发送回去。 :--:1
```python

@app.websocket("/feed")
async def feed(request, ws):
    while True:
        data = "hello!"
        print("Sending: " + data)
        await ws.send(data)
        data = await ws.recv()
        print("Received: " + data)
        print("Sending: " + data)
        await ws.send(data)
        data = await ws.recv()
        print("Received: " + data)
```
:---
## 配置(Configuration)

:--:1
```python
app.config.WEBSOCKET_MAX_SIZE = 2 ** 20
app.config.WEBSOCKET_MAX_QUEUE = 32
app.config.WEBSOCKET_READ_LIMIT = 2 ** 16
app.config.WEBSOCKET_WRITE_LIMIT = 2 ** 16
app.config.WEBSOCKET_PING_INTERVAL = 20
app.config.WEBSOCKET_PING_TIMEOUT = 20
```
