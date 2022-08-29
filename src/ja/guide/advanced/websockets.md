# Websockets

Sanicは、[websockets](https://websockets.readthedocs.io/en/stable/)の上に使いやすい抽象化を提供します。


## Routing

---:1

Websocketハンドラーは、通常のハンドラと同様にルーターに接続できます。 :--:1 :--:1
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

## Handler


---:1

通常、Websocketハンドラはループを開きたいと思うでしょう。

その後、ハンドラーに注入された2番目のオブジェクトで `send()` メソッドと `recv()` メソッドを使用できます。

この例は、受信したクライアントメッセージにエコーバックする単純なエンドポイントです。 :--:1 :--:1
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
## Configuration

詳細については、[構成セクション](/guide/deployment/configuration.md)を参照してください。
```python
app.config.WEBSOCKET_MAX_SIZE = 2 ** 20
app.config.WEBSOCKET_MAX_QUEUE = 32
app.config.WEBSOCKET_READ_LIMIT = 2 ** 16
app.config.WEBSOCKET_WRITE_LIMIT = 2 ** 16
app.config.WEBSOCKET_PING_INTERVAL = 20
app.config.WEBSOCKET_PING_TIMEOUT = 20
```
