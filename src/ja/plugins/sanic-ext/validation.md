# バリデーション

Webアプリケーションで最もよく実装される機能の1つが、ユーザー入力の検証です。 明らかな理由により、これはセキュリティ上の問題であるだけでなく、単なるグッドプラクティスでもあります。 データが期待通りのものであることを確認し、そうでない場合は `400` 応答を投げるようにしたいものです。

## インプリメンテーション

### データクラスによる検証

[データクラス](https://docs.python.org/3/library/dataclasses.html) の導入により、Pythonは定義されたスキーマを満たすオブジェクトをとても簡単に作成することができるようになりました。 しかし、標準ライブラリは型チェックの検証のみをサポートし、実行時の検証はサポート**していません**。 Sanic Extensionsは`dataclasses`を使って、入力されたリクエストに対して実行時の検証を行う機能を追加します。 If you also have either `pydantic` or `attrs` installed, you can alternatively use one of those libraries.

---:1

まず、モデルを定義する。

:--:1

```python
@dataclass
class SearchParams:
    q: str
```

:---

---:1

そして、ルートに添付。

:--:1

```python
from sanic_ext import validate

@app.route("/search")
@validate(query=SearchParams)
async def handler(request, query: SearchParams):
    return json(asdict(query))
```

:---

---:1

これで、受信したリクエストのバリデーションが行われたはずです。

:--:1

```
$ curl localhost:8000/search                                       
⚠️ 400 — Bad Request
====================
Invalid request body: SearchParams. Error: missing a required argument: 'q'
```
```
$ curl localhost:8000/search\?q=python                             
{"q":"python"}
```

:---

### Pydanticを使ったバリデーション


::: warning
現在、PydanticモデルをサポートしているのはJSONボディの検証のみです。
:::

---:1

まず、モデルを定義する。

:--:1

```python
class Person(BaseModel):
    name: str
    age: int
```

:---

---:1

そして、ルートに添付。

:--:1

```python
from sanic_ext import validate

@app.post("/person")
@validate(json=Person)
async def handler(request, body: Person):
    return json(body.dict())
```
:---

---:1

これで、受信したリクエストのバリデーションが行われたはずです。

:--:1

```
$ curl localhost:8000/person -d '{"name": "Alice", "age": 21}' -X POST  
{"name":"Alice","age":21}
```

:---

### Validation with Attrs


Pydanticモデルの使用もできます。

---:1

---:1 予想通り、デコレータのキーワード引数を使ってモデルをアタッチすることができます。

:--:1

```python
@attrs.define
class Person:
    name: str
    age: int

```

:---

---:1

Then, attach it to your route

:--:1

```python
from sanic_ext import validate

@app.post("/person")
@validate(json=Person)
async def handler(request, body: Person):
    return json(attrs.asdict(body))
```
:---

---:1

You should now have validation on the incoming request.

:--:1

```
$ curl localhost:8000/person -d '{"name": "Alice", "age": 21}' -X POST  
{"name":"Alice","age":21}
```

:---

## 何が検証できるのか?

`validate` デコレータを使用すると、3つの場所から入力されたユーザーデータを検証することができます。 JSON の本文(`request.json`)、フォームの本文(`request.form`)、そしてクエリパラメータ(`request.args`) です。

---:1 As you might expect, you can attach your model using the keyword arguments of the decorator.

:--:1
```python
@validate(
    json=ModelA,
    query=ModelB,
    form=ModelC,
)
```
:---
