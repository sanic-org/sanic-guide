# クラスベースビュー

## なぜ使うのか？

---:1

### 問題

APIを設計する際の一般的なパターンは、HTTPメソッドに依存する同じエンドポイントに複数の機能を持つことです。

これらのオプションは両方とも機能しますが、優れた設計慣行ではなく、プロジェクトが成長するにつれて時間の経過とともに維持するのが難しい場合があります。
:--:1
```python
@app.get("/foo")
async def foo_get(request):
    ...

@app.post("/foo")
async def foo_post(request):
    ...

@app.put("/foo")
async def foo_put(request):
    ...

@app.route("/bar", methods=["GET", "POST", "PATCH"])
async def bar(request):
    if request.method == "GET":
        ...
    elif request.method == "POST":
        ...
    elif request.method == "PATCH":
        ...
```
:---

---:1

### 解決策

クラスベースのビューは、単に要求に対する応答動作を実装するクラスです。これらは、同じエンドポイントで異なるHTTPリクエストタイプの処理を区分する方法を提供します。
:--:1
```python
from sanic.views import HTTPMethodView

class FooBar(HTTPMethodView):
    async def get(self, request):
        ...
        
    async def post(self, request):
        ...
        
    async def put(self, request):
        ...

app.add_route(FooBar.as_view(), "/foobar")
```
:---

## ビューの定義

クラスベースのビューは、`HTTPMethodView`のサブクラスである必要があります。その後、対応するHTTPメソッドの名前でクラスメソッドを実装できます。定義されたメソッドを持たない要求を受信すると、`405: Method not allowed`応答が生成されます。

---:1

エンドポイントにクラスベースのビューを登録するために、`app.add_route`メソッドが使用できます。最初の引数は、メソッド`as_view`が呼び出された定義済みクラスで、2番目の引数はURLエンドポイントである必要があります。

利用可能なメソッドは:

- get
- post
- put
- patch
- delete
- head
- options
:--:1
```python
from sanic.views import HTTPMethodView
from sanic.response import text

class SimpleView(HTTPMethodView):

  def get(self, request):
      return text("I am get method")

  # 非同期構文も利用可能
  async def post(self, request):
      return text("I am post method")

  def put(self, request):
      return text("I am put method")

  def patch(self, request):
      return text("I am patch method")

  def delete(self, request):
      return text("I am delete method")

app.add_route(SimpleView.as_view(), "/")
```
:---

## パスパラメーター

---:1

[ルーティングセクション](/guide/basics/routing.md)で説明されているとおりにパスパラメータを使用できます。
:--:1
```python
class NameView(HTTPMethodView):

  def get(self, request, name):
    return text("Hello {}".format(name))

app.add_route(NameView.as_view(), "/<name>")
```
:---

## デコレーター

[デコレータセクション](/guide/best-practices/decorators.md)で説明したように、デコレータを使用してエンドポイントに機能を追加する必要がある場合があります。 CBVによる二つの選択肢があります:

1. ビュー内の _全ての_ HTTPメソッドに適用する
2. ビュー内のHTTPメソッドに個別に適用する

オプションがどのように見えるか見てみましょう:

---:1

### すべてのメソッドに適用する

クラスにデコレータを追加する場合は、`decorators`クラス変数を設定できます。 これらは、`as_view`が呼び出されるとクラスに適用されます。
:--:1
```python
class ViewWithDecorator(HTTPMethodView):
  decorators = [some_decorator_here]

  def get(self, request, name):
    return text("やあ、僕はデコレータを持ってるよ")

  def post(self, request, name):
    return text("やあ、僕もデコレータを持ってるよ")

app.add_route(ViewWithDecorator.as_view(), "/url")
```
:---

---:1

### 個々の方法に適用する

しかし、すべてのメソッドではなく、いくつかのメソッドを飾りたい場合は、ここに示すようにできます。
:--:1
```python
class ViewWithSomeDecorator(HTTPMethodView):

    @staticmethod
    @some_decorator_here
    def get(request, name):
        return text("やあ、僕はデコレータを持ってるよ")

    def post(self, request, name):
        return text("やあ、僕はデコレータを持っていないよ")

    @some_decorator_here
    def patch(self, request, name):
        return text("やあ、僕もデコレータを持っているよ")
```
:---

## URLを作成
---:1

これは、クラス名がエンドポイントの一部であることを除いて、[他のURLの生成](/guide/basics/routing.md#generating-a-url)と同じように機能します。
:--:1
```python
@app.route("/")
def index(request):
    url = app.url_for("SpecialClassView")
    return redirect(url)


class SpecialClassView(HTTPMethodView):
    def get(self, request):
        return text("Special Class Viewからこんにちは!")


app.add_route(SpecialClassView.as_view(), "/special_class_view")
```
:---
