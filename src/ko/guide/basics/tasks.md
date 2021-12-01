# 백그라운드 작업(Background tasks)

비동기 Python에서 [tasks](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task)을 사용하는 것이 바람직하고 매우 편리합니다. Sanic은 작업을 현재 실행 중인 루프에 추가할 수 있는 편리한 방법을 제공합니다. 이것은 `asyncio.create_task`와 다소 비슷합니다.

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

## `app.run` 전에 작업 추가 (Adding tasks before `app.run`)

앱이 실행되기 전에 백그라운드 작업을 추가할 수 있습니다. `app.run` 전에. 앱이 실행되기 전에 작업을 추가하려면, 코루틴 객체를 전달하지 않는 것이 좋습니다. (즉, `async` 콜러블을 호출하여 생성된 것), 대신 콜러블을 전달하면 Sanic은 **각 작업자**에 코루틴 객체를 생성합니다. 참고: 추가된 작업은 'before_server_start' 작업으로 실행되므로 모든 작업자(메인 프로세스가 아님 에서 실행됩니다.이것은 특정한 결과를 가져옵니다. 자세한 내용은 이 [issue](https://github.com/sanic-org/sanic/issues/2139)에 대한 [comment](https://github.com/sanic-org/sanic/issues/2139#issuecomment-868993668)을 읽으십시오.

메인 프로세스에 작업을 추가하려면 [`@app.main_process_start`](./listeners.md)에 작업을 추가하는 것이 좋습니다. 참고: 작업자는 이 작업이 완료될 때까지 시작되지 않습니다.
---:1

`app.run` 전에 작업을 추가하는 예
:---:1
```python
async def slow_work(...):
   ...

app = Sanic(...)
app.add_task(slow_work) # Note: we are passing the callable and not coroutine object `slow_work(...)`
app.run(...)
```
::: tip
위의 `slow_work`에 매개변수를 전달하려면 `functools.partial`을 사용할 수 있습니다.