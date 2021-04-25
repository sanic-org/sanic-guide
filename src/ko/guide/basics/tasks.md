# 백그라운드 작업(Background tasks)

비동기 Python에서 [작업(tasks)](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task)을 사용하는 것이 바람직하고 매우 편리합니다. Sanic은 작업을 현재 실행 중인 루프에 추가할 수 있는 편리한 방법을 제공합니다. 이것은 `asyncio.create_task`와 다소 비슷합니다.

```python
async def notify_server_started_after_five_seconds():
    await asyncio.sleep(5)
    print('Server successfully started!')

app.add_task(notify_server_started_after_five_seconds())
```

---:1

Sanic은 자동으로 앱을 주입하여 인수로 작업에 전달합니다.
:--:1

```python
async def auto_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(auto_inject)
```

:---

---:1

또는 `app` 인수를 명시적으로 전달할 수 있습니다.
:--:1

```python
async def explicit_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(explicit_inject(app))
```

:---
