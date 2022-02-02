# Signals

Signals provide a way for one part of your application to tell another part that something happened.

```python
@app.signal("user.registration.created")
async def send_registration_email(**context):
    await send_email(context["email"], template="registration")

@app.post("/register")
async def handle_registration(request):
    await do_registration(request)
    await request.app.dispatch(
        "user.registration.created",
        context={"email": request.json.email}
    })
```

## Adding a signal

---:1
The API for adding a signal is very similar to adding a route.
:--:1
```python
async def my_signal_handler():
    print("something happened")

app.add_signal(my_signal_handler, "something.happened.ohmy")
```
:---

---:1
But, perhaps a slightly more convenient method is to use the built-in decorators.
:--:1
```python
@app.signal("something.happened.ohmy")
async def my_signal_handler():
    print("something happened")
```
:---

---:1
Signals can also be declared on blueprints
:--:1
```python
bp = Blueprint("foo")

@bp.signal("something.happened.ohmy")
async def my_signal_handler():
    print("something happened")
```
:---

## Built-in signals

In addition to creating a new signal, there are a number of built-in signals that are dispatched from Sanic itself. These signals exist to provide developers with more opportunities to add functionality into the request and server lifecycles.

---:1


You can attach them just like any other signal to an application or blueprint instance.

:--:1

```python
@app.signal("http.lifecycle.complete")
async def my_signal_handler(conn_info):
    print("Connection has been closed")
```
:---

These signals are the signals that are available, along with the arguments that the handlers take, and the conditions that attach (if any).


| Event name                 | Arguments                       | Conditions                                                |
| -------------------------- | ------------------------------- | --------------------------------------------------------- |
| `http.routing.before`      | request                         |                                                           |
| `http.routing.after`       | request, route, kwargs, handler |                                                           |
| `http.lifecycle.begin`     | conn_info                       |                                                           |
| `http.lifecycle.read_head` | head                            |                                                           |
| `http.lifecycle.request`   | request                         |                                                           |
| `http.lifecycle.handle`    | request                         |                                                           |
| `http.lifecycle.read_body` | body                            |                                                           |
| `http.lifecycle.exception` | request, exception              |                                                           |
| `http.lifecycle.response`  | request, response               |                                                           |
| `http.lifecycle.send`      | data                            |                                                           |
| `http.lifecycle.complete`  | conn_info                       |                                                           |
| `http.middleware.before`   | request, response               | `{"attach_to": "request"}` or `{"attach_to": "response"}` |
| `http.middleware.after`    | request, response               | `{"attach_to": "request"}` or `{"attach_to": "response"}` |
| `server.init.before`       | app, loop                       |                                                           |
| `server.init.after`        | app, loop                       |                                                           |
| `server.shutdown.before`   | app, loop                       |                                                           |
| `server.shutdown.after`    | app, loop                       |                                                           |

::: new NEW in v21.12
---:1
To make using the built-in signals easier, there is an `Enum` object that contains all of the allowed built-ins. With a modern IDE this will help so that you do not need to remember the full list of event names as strings.
:--:1
```python
from sanic.signals import Event

@app.signal(Event.HTTP_LIFECYCLE_COMPLETE)
async def my_signal_handler(conn_info):
    print("Connection has been closed")
```
:---
:::

## Events

---:1
Signals are based off of an _event_. An event, is simply a string in the following pattern:
:--:1
```
namespace.reference.action
```
:---

::: tip
Events must have three parts. If you do not know what to use, try these patterns:

- `my_app.something.happened`
- `sanic.notice.hello`
:::

### Event parameters

---:1
An event can be "dynamic" and declared using the same syntax as [path parameters](../basics/routing.md#path-parameters). This allows matching based upon arbitrary values.
:--:1
```python
@app.signal("foo.bar.<thing>")
async def signal_handler(thing):
    print(f"[signal_handler] {thing=}")

@app.get("/")
async def trigger(request):
    await app.dispatch("foo.bar.baz")
    return response.text("Done.")
```
:---

Checkout [path parameters](../basics/routing.md#path-parameters) for more information on allowed type definitions.

::: warning
Only the third part of an event (the "action") may be dynamic:

- `foo.bar.<thing>` :ok:
- `foo.<bar>.baz` :x:
:::

### Waiting

---:1
In addition to executing a signal handler, your application can wait for an event to be triggered.
:--:1
```python
await app.event("foo.bar.baz")
```
:---

---:1
**IMPORTANT**: waiting is a blocking function. Therefore, you likely will want this to run in a [background task](../basics/tasks.md).
:--:1
```python
async def wait_for_event(app):
    while True:
        print("> waiting")
        await app.event("foo.bar.baz")
        print("> event found\n")

@app.after_server_start
async def after_server_start(app, loop):
    app.add_task(wait_for_event(app))
```
:---

---:1
If your event was defined with a dynamic path, you can use `*` to catch any action.
:--:1
```python
@app.signal("foo.bar.<thing>")

...

await app.event("foo.bar.*")
```
:---

## Dispatching

*In the future, Sanic will dispatch some events automatically to assist developers to hook into life cycle events.*

---:1
Dispatching an event will do two things:

1. execute any signal handlers defined on the event, and
2. resolve anything that is "waiting" for the event to complete.
:--:1
```python
@app.signal("foo.bar.<thing>")
async def foo_bar(thing):
    print(f"{thing=}")

await app.dispatch("foo.bar.baz")
```
```
thing=baz
```
:---

### Context

---:1
Sometimes you may find the need to pass extra information into the signal handler. In our first example above, we wanted our email registration process to have the email address for the user.
:--:1
```python
@app.signal("user.registration.created")
async def send_registration_email(**context):
    print(context)

await app.dispatch(
    "user.registration.created",
    context={"hello": "world"}
)
```
```
{'hello': 'world'}
```
:---

::: tip FYI
Signals are dispatched in a background task.
:::

### Blueprints

Dispatching blueprint signals works similar in concept to [middleware](../basics/middleware.md). Anything that is done from the app level, will trickle down to the blueprints. However, dispatching on a blueprint, will only execute the signals that are defined on that blueprint.

---:1
Perhaps an example is easier to explain:
:--:1
```python
bp = Blueprint("bp")

app_counter = 0
bp_counter = 0

@app.signal("foo.bar.baz")
def app_signal():
    nonlocal app_counter
    app_counter += 1

@bp.signal("foo.bar.baz")
def bp_signal():
    nonlocal bp_counter
    bp_counter += 1
```
:---

---:1
Running `app.dispatch("foo.bar.baz")` will execute both signals.
:--:1
```python
await app.dispatch("foo.bar.baz")
assert app_counter == 1
assert bp_counter == 1
```
:---

---:1
Running `bp.dispatch("foo.bar.baz")` will execute only the blueprint signal.
:--:1
```python
await bp.dispatch("foo.bar.baz")
assert app_counter == 1
assert bp_counter == 2
```
:---
