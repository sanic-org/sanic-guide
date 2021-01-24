# Listeners

During the life cylce of a worker process, Sanic provides you with four(4) opportunities to inject an operation. This enables you to execute startup/teardown code as your server starts or closes.

- `before_server_start`
- `after_server_start`
- `before_server_stop`
- `after_server_stop`

The life cycle of a worker process looks like this:

```text
event     <worker process starts>
listener      before_server_start
event             <server started>
listener              after_server_start

event                     <serving requests>
event                     <graceful shutdown initiated>
event                     <complete remaining requests>

listener              before_server_stop
event             <server stopped>
listener      after_server_stop
event     <process exits>
```

## Attaching a listener

---:1

The process to setup a function as a listener is similar to declaring a route.

The two injected arguments are the currently running `Sanic()` instance, and the currently running loop.
:--:1
```python
async def setup_db(app, loop):
    app.db = await db_setup()

app.register_listener(setup_db, "before_server_start")
```
:---

---:1

The `Sanic` app instance also has a convenience decorator.
:--:1
```python
@app.listener("before_server_start")
async def setup_db(app, loop):
    app.db = await db_setup()
```
:---

## Order of execution

Listeners are executed in the order they are declared during startup, and reverse order of declaration during teardown

|                       | Phase    | Order   |
|-----------------------|----------|---------|
| `before_server_start` | startup  | regular |
| `after_server_start`  | startup  | regular |
| `before_server_stop`  | shutdown | reverse |
| `after_server_stop`   | shutdown | reverse |

Given the following setup, we should expect to see this in the console.

---:1

```python
@app.listener("before_server_start")
async def listener_1(app, loop):
    print("listener_1")

@app.listener("before_server_start")
async def listener_2(app, loop):
    print("listener_2")

@app.listener("after_server_start")
async def listener_3(app, loop):
    print("listener_3")

@app.listener("after_server_start")
async def listener_4(app, loop):
    print("listener_4")

@app.listener("before_server_stop")
async def listener_5(app, loop):
    print("listener_5")

@app.listener("before_server_stop")
async def listener_6(app, loop):
    print("listener_6")

@app.listener("after_server_stop")
async def listener_7(app, loop):
    print("listener_7")

@app.listener("after_server_stop")
async def listener_8(app, loop):
    print("listener_8")
```
:--:1
```bash
[INFO] Goin' Fast @ http://127.0.0.1:8000
listener_1
listener_2
listener_3
listener_4
[INFO] Starting worker
[INFO] Stopping worker
listener_6
listener_5
listener_8
listener_7
[INFO] Server Stopped
```
:---

::: tip FYI
The practical result of this is that if the first listener in `before_server_start` handler setups a database connection, listeners that are registered after it can rely upon that connection being alive both when they are started and stopped.

