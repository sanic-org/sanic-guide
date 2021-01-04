# Websockets

Sanic provides an easy to use abstraction on top of [websockets](https://websockets.readthedocs.io/en/stable/).


## Routing

<!-- panels:start -->
<!-- div:left-panel -->
Websocket handlers can be hooked up to the router similar to regular handlers.
<!-- div:right-panel -->
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
<!-- panels:end -->

## Handler


<!-- panels:start -->
<!-- div:left-panel -->
Typically, a websocket handler will want to hold open a loop.

It can then use the `send()` and `recv()` methods on the second object injected into the handler.

This example is a simple endpoint that echos back to the client messages that it receives.
<!-- div:right-panel -->
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
<!-- panels:end -->
## Configuration

See [configuration section](/deployment/configuration.md) for more details.
```python
app.config.WEBSOCKET_MAX_SIZE = 2 ** 20
app.config.WEBSOCKET_MAX_QUEUE = 32
app.config.WEBSOCKET_READ_LIMIT = 2 ** 16
app.config.WEBSOCKET_WRITE_LIMIT = 2 ** 16
app.config.WEBSOCKET_PING_INTERVAL = 20
app.config.WEBSOCKET_PING_TIMEOUT = 20
```
