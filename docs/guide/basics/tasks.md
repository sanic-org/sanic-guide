# Background tasks

It is often desirable and very convenient to make usage of [tasks]() in async Python. Sanic provides a convenient method to add tasks to the currently running loop. It is somewhat similar to `asyncio.create_task`.

```python
async def notify_server_started_after_five_seconds():
    await asyncio.sleep(5)
    print('Server successfully started!')

app.add_task(notify_server_started_after_five_seconds())
```

---:1

Sanic will attempt to automatically inject the app, passing it as an argument to the task.
:--:1
```python
async def auto_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(auto_inject)
```
:---

---:1

Or you can pass the `app` argument explicitly.
:--:1
```python
async def explicit_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(explicit_inject(app))
```
:---
