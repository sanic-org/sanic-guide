# Handlers

次の重要な構成要素は、あなたの_handlers_です。これらは「ビュー」とも呼ばれます。

Sanicでは、ハンドラは、少なくとも「Request`インスタンスを引数として受け取り、`HTTPResponse`インスタンス、または同じことを行うコルーチンのいずれかを返す呼び出し可能物です。



---:1

え? :confused:

これは**関数**です。同期または非同期のいずれかです。

ハンドラの仕事は、エンドポイントに応答し、何かをすることです。これはあなたのビジネスロジックの大半が行く場所です。
:--:1
```python
def i_am_a_handler(request):
    return HTTPResponse()

async def i_am_ALSO_a_handler(request):
    return HTTPResponse()
```
:---

::: tip Heads up
ロジックのカプセル化の詳細については、[クラスベースのビュー](/guide/advanced/class-based-views.md) をチェックアウトしてください。
:::
---:1
次に、エンドポイントに配線するだけです。[すぐにルーティング](./routing.md)について詳しく学びます。

実際の例を見てみましょう。

- アプリインスタンスで便利なデコレータを使用します: `@app.get()`
- そして、応答オブジェクトを生成するための便利な便利なメソッド: `text()`

達成されたミッション :muscle:
:--:1
```python
from sanic.response import text

@app.get("/foo")
async def foo_handler(request):
    return text("I said foo!")
```
:---

---

## _async_について...

---:1

同期しているハンドラーを書くことは完全に可能です。

この例では、_blocking_ `time.sleep()`を使用して100msの処理時間をシミュレートしています。おそらく、これはDB、またはサードパーティのウェブサイトからデータを取得することを表します。

4つのワーカープロセスと共通のベンチマークツールを使用する:

- **956** 30.10秒のリクエスト
- または、約**31.76**リクエスト/秒
:--:1
```python
@app.get("/sync")
def sync_handler(request):
    time.sleep(0.1)
    return text("Done.")
```
:---

---:1

非同期代替 `asyncio.sleep()` に変更するだけで、パフォーマンスが驚くほど変化します。 :rocket:

同じ4つのワーカープロセスを使用する:

- **115,590** requests in 30.08s
- Or, about **3,843.17** requests/second

:flushed:

さて...これはとんでもなく劇的な結果です。そして、あなたが見るベンチマークは本質的に非常に偏っています。この例は、ウェブの世界で「async/await」の利点をオーバーザトップで示すことを目的としています。結果は確かに異なります。Sanicやその他の非同期Pythonライブラリなどのツールは、物事をより速くする魔法の弾丸ではありません。彼らはそれらをより効率的にします。

この例では、1つのリクエストがスリープしている間、別のリクエストと別のリクエスト、別のリクエスト、別のリクエスト、別のリクエストを開始できるため、非同期バージョンの方がはるかに優れています。

しかし、これがポイントです!Sanicは、利用可能なリソースを取り出し、それらからパフォーマンスを絞り出すため、高速です。多くのリクエストを同時に処理できるため、1秒あたりのリクエストが増えます。

:--:1
```python
@app.get("/async")
async def async_handler(request):
    await asyncio.sleep(0.1)
    return text("Done.")
```
:---

::: 警告 よくある間違い!

こんなことしないで!ウェブサイトにpingを送信する必要があります。何を使いますか?`pip install your-fav-request-library` :see_no_evil:

その代わり、`async/await` が可能なクライアントを使用してみてください。あなたのサーバーはあなたに感謝するでしょう。ブロッキングツールの使用は避け、非同期のエコシステムでうまく機能するものを選びましょう。もし推薦が必要なら、[Awesome Sanic](https://github.com/mekicha/awesome-sanic)をチェックしてください。

Sanicは、テストパッケージ（sanic-testing）内で[httpx](https://www.python-httpx.org/)を使用しています。 :wink:.

:::

---

## A fully annotated handler

型注釈を使用している人のために...

```python
from sanic.response import HTTPResponse, text
from sanic.request import Request

@app.get("/typed")
async def typed_handler(request: Request) -> HTTPResponse:
    return text("Done.")
```
