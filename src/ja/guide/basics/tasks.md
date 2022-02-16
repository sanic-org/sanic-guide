# Background tasks

## Tasksを作成
非同期Pythonで[tasks](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task)を使用することは、望ましいことが多く、非常に便利です。Sanicは、現在実行中の**ループにタスクを追加する便利な方法を提供します。これは`asyncio.create_task`。'App'ループの実行前にタスクを追加する方法については、次のセクションを参照してください。

```python
async def notify_server_started_after_five_seconds():
    await asyncio.sleep(5)
    print('Server successfully started!')

app.add_task(notify_server_started_after_five_seconds())
```

---:1

Sanicは自動的にアプリを注入し、タスクへの引数として渡す。
:--:1
```python
async def auto_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(auto_inject)
```
:---

---:1

または、`app`引数を明示的に渡すこともできます。
:--:1
```python
async def explicit_inject(app):
    await asyncio.sleep(5)
    print(app.name)

app.add_task(explicit_inject(app))
```
:---

## `app.run`の前にタスクを追加します

Appを実行する前にバックグラウンドタスクを追加することができます。`app.run`の前に置きます。Appが実行される前にタスクを追加するには、コルーチンオブジェクト(つまり、。`async`callable)を渡さずに、単に呼び出し可能オブジェクトを渡すことをお勧めします。Sanicは各ワーカーにコルーチンオブジェクトを作成します**.注:追加されるタスクは`before_server_start`ジョブとして実行されるため、すべてのワーカーで実行されます (メインプロセスでは実行されません) 。これには特定の結果が伴います。詳細については、[この問題](https://github.com/sanic-org/sanic/issues/2139) の [このコメント](https://github.com/sanic-org/sanic/issues/2139#issuecomment-868993668) を参照してください。

メイン・プロセスに作業を追加するには、[`@app.main_process_start`](./listeners.md)。注意:この作業が完了するまで、就業者は開始しません。

---:1

`app.run`の前にタスクを追加する例
:---:1
```python
async def slow_work(...):
   ...

app = Sanic(...)
app.add_task(slow_work) # Note: we are passing the callable and not coroutine object `slow_work(...)`
app.run(...)
```
::: tip
上記の`slow_work`にパラメータを渡すには、`functools.partial`を使用します。
:::
