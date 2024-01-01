# Websockets

Sanicは、[websockets](https://websockets.readthedocs.io/en/stable/)の上に使いやすい抽象化を提供します。


## ルーティング

---:1

Websocketハンドラーは、通常のハンドラと同様にルーターに接続できます。
:--:1
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


---:1

通常、WebSocketハンドラはループを開いた状態に保持しようとします。

その後、ハンドラーに注入された2番目のオブジェクトで `send()` メソッドと `recv()` メソッドを使用できます。

この例は、受信したクライアントメッセージにエコーするシンプルなエンドポイントです。
:--:1
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

---:1
You can simplify your loop by just iterating over the `Websocket` object in a for loop.

*v22.9で追加*
:--:1
```python
from sanic import Request, Websocket
@app.websocket("/feed")
async def feed(request: Request, ws: Websocket):
    async for msg in ws:
        await ws.send(msg)
```
:---

:---
## 設定

デフォルトは以下の通りです。詳細は[構成セクション](/guide/deployment/configuration.md)を参照してください。
```python
app.config.WEBSOCKET_MAX_SIZE = 2 ** 20
app.config.WEBSOCKET_PING_INTERVAL = 20
app.config.WEBSOCKET_PING_TIMEOUT = 20
```
