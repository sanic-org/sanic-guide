# Signals

シグナルは、アプリケーションのある部分が別の部分に何かが起こったことを伝える方法を提供します。

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

## signalを追加する

---:1 信号を追加するためのAPIは、ルートの追加と非常によく似ています。 :--:1 :--:1
```python
async def my_signal_handler():
    print("something happened")

app.add_signal(my_signal_handler, "something.happened.ohmy")
```
:---

---:1 ただし、おそらくもう少し便利な方法は、組み込みのデコレータを使用することです。 :--:1 :--:1
```python
@app.signal("something.happened.ohmy")
async def my_signal_handler():
    print("something happened")
```
:---

---:1 If the signal requires conditions, make sure to add them while adding the handler. :--:1
```python
async def my_signal_handler1():
    print("something happened")

app.add_signal(
    my_signal_handler,
    "something.happened.ohmy1",
    conditions={"some_condition": "value"}
)

@app.signal("something.happened.ohmy2", conditions={"some_condition": "value"})
async def my_signal_handler2():
    print("something happened")
```
:---

---:1 信号は設計図で宣言することもできます :--:1
```python
bp = Blueprint("foo")

@bp.signal("something.happened.ohmy")
async def my_signal_handler():
    print("something happened")
```
:---

## signalsを設計する

新しい信号を作成することに加えて、Sanic自体からディスパッチされる組み込み信号がいくつかあります。 これらの信号は、開発者に要求とサーバーのライフサイクルに機能を追加する機会を増やすために存在します。

---:1 おそらく、例は説明しやすいです: :--:1


他のシグナルと同じように、アプリケーションまたはブループリントインスタンスにアタッチできます。

:--:1

```python
@app.signal("http.lifecycle.complete")
async def my_signal_handler(conn_info):
    print("Connection has been closed")
```
:---

これらの信号は、ハンドラーが取る引数、およびアタッチする条件(存在する場合)とともに、利用可能な信号です。


| イベント名                      | 変数                              | 条件                                                        |
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

::: new NEW in v21.12 ---:1 ビルトインシグナルを使いやすくするために、許可されたビルトインをすべて含む `Enum` オブジェクトが用意されています。 最近の IDE では、イベント名の完全なリストを文字列として覚えておく必要がないので、これは便利です。 :--:1 :--:1
```python
from sanic.signals import Event

@app.signal(Event.HTTP_LIFECYCLE_COMPLETE)
async def my_signal_handler(conn_info):
    print("Connection has been closed")
```
:---

## イベント

---:1 信号は_event_に基づいています。 イベントは、単に次のパターンの文字列です。 :--:1
```
namespace.reference.action
```
:---

::: 次に イベントには3つの部分が必要です。 何を使うべきかわからない場合は、次のパターンを試してください。

- `my_app.something.happened`
- `sanic.notice.hello` :::

### イベントパラメータ

---:1 イベントは「動的」であり、[pathパラメータ](../basics/routing.md#path-parameters)と同じ構文を使用して宣言できます。 これにより、任意の値に基づいてマッチングできます。 :--:1 :--:1
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

---:1 シグナルハンドラの実行に加えて、アプリケーションはイベントがトリガーされるのを待つことができます。 :--:1

::: 注意 イベントの3番目の部分(「アクション」)のみが動的です。

- `foo.bar.<thing>` :ok:
- `foo.<bar>.baz` :x: :::

### 待つ

---:1 In addition to executing a signal handler, your application can wait for an event to be triggered. :--:1
```python
await app.event("foo.bar.baz")
```
:---

---:1 **大事**: 待つことはブロッキング機能です。 したがって、これを[バックグラウンドタスク](../basics/tasks.md)で実行する必要があります。 :--:1 :--:1
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

---:1 イベントが動的パスで定義されている場合は、`*`を使用して任意のアクションをキャッチできます。 :--:1 :--:1
```python
@app.signal("foo.bar.<thing>")

...

await app.event("foo.bar.*")
```
:---

## Dispatching

*将来的には、Sanicは開発者がライフサイクルイベントに参加するのを支援するために、いくつかのイベントを自動的にディスパッチします。*

---:1 イベントをDispatchすると、2つのことを行います。

1. イベントで定義されたシグナルハンドラを実行し、
2. イベントが完了するまで「待っている」ことをすべて解決します。 :--:1 :--:1
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

---:1 場合によっては、信号ハンドラに余分な情報を渡す必要があるかもしれません。 上記の最初の例では、電子メール登録プロセスにユーザーの電子メールアドレスを指定してほしかった。 :--:1 :--:1
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
信号はバックグラウンドタスクでディスパッチされます。
::: :::

### Blueprints

青写真信号のdispatchは、[middleware](../basics/middleware.md)と同様に機能します。 アプリレベルから行われるものは、青写真まで流れ落ちます。 ただし、青写真でディスパッチすると、その青写真で定義されている信号のみが実行されます。

---:1 `app.dispatch("foo.bar.baz")`を実行すると、両方の信号が実行されます。 :--:1
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

---:1 Running `app.dispatch("foo.bar.baz")` will execute both signals. :--:1
```python
await app.dispatch("foo.bar.baz")
assert app_counter == 1
assert bp_counter == 1
```
:---

---:1 `bp.dispatch("foo.bar.baz")`を実行すると、ブループリント信号のみが実行されます。 :--:1 :--:1
```python
await bp.dispatch("foo.bar.baz")
assert app_counter == 1
assert bp_counter == 2
```
:---
