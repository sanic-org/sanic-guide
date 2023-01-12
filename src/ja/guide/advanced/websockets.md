# Websockets

Sanicは、[websockets](https://websockets.readthedocs.io/en/stable/)の上に使いやすい抽象化を提供します。


## ルーティング

---:1

Websocketハンドラーは、通常のハンドラと同様にルーターに接続できます。 :--:1
```python
from sanic import Request, Websocket

async def feed(request: Request, ws: Websocket):
    pass

app.add_websocket_route(feed, "/feed")
```
```python
from sanic import Request, Websocket

@app.websocket("/feed")
async def feed(request: Request, ws: Websocket):
    pass
```
:---

## ハンドラ


---:1 Typically, a websocket handler will want to hold open a loop.

その後、ハンドラーに注入された2番目のオブジェクトで `send()` メソッドと `recv()` メソッドを使用できます。

この例は、受信したクライアントメッセージにエコーするシンプルなエンドポイントです。 :--:1
```python
from sanic import Request, Websocket

@app.websocket("/feed")
async def feed(request: Request, ws: Websocket):
    while True:
        data = "hello!"
        print("Sending: " + data)
        await ws.send(data)
        data = await ws.recv()
        print("Received: " + data)
```
:---

---:1 You can simplify your loop by just iterating over the `Websocket` object in a for loop.

*Added in v22.9* :--:1
```python
from sanic import Request, Websocket

@app.websocket("/feed")
async def feed(request: Request, ws: Websocket):
    async for msg in ws:
        await ws.send(msg)
```
:---


## 設定

See [configuration section](/guide/deployment/configuration.md) for more details, however the defaults are shown below.

```python
app.config.WEBSOCKET_MAX_SIZE = 2 ** 20
app.config.WEBSOCKET_PING_INTERVAL = 20
app.config.WEBSOCKET_PING_TIMEOUT = 20
```
