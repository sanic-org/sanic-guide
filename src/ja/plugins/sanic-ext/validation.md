# 検証

Webアプリケーションで最もよく実装される機能の1つが、ユーザー入力の検証です。 明らかな理由により、これはセキュリティ上の問題であるだけでなく、単なるグッドプラクティスでもあります。 データが期待通りのものであることを確認し、そうでない場合は `400` 応答を投げるようにしたいものです。

## 実装

### データクラスによる検証

[データクラス](https://docs.python.org/3/library/dataclasses.html) の導入により、Pythonは定義されたスキーマを満たすオブジェクトをとても簡単に作成することができるようになりました。 しかし、標準ライブラリは型チェックの検証のみをサポートし、実行時の検証はサポート**していません**。 Sanic Extensionsは`dataclasses`を使って、入力されたリクエストに対して実行時の検証を行う機能を追加します。 `pydantic` または `attrs` がインストールされている場合は、それらのライブラリのいずれかを使用することもできます。

---:1

まず、モデルを定義します。

:--:1

```python
@dataclass
class SearchParams:
    q: str
```

:---

---:1

そして、それをルートに添付してください。

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

これで、受信したリクエストの検証が行われるはずです。

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


Pydanticモデルも使用できます。

---:1

まず、モデルを定義します。

:--:1

```python
class Person(BaseModel):
    name: str
    age: int
```

:---

---:1

そして、それをルートに添付してください。

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

これで、受信したリクエストの検証が行われるはずです。

:--:1

```
$ curl localhost:8000/person -d '{"name": "Alice", "age": 21}' -X POST  
{"name":"Alice","age":21}
```

:---

### Attrsによる検証


Attrsも使用できます。

---:1

まず、モデルを定義します。

:--:1

```python
@attrs.define
class Person:
    name: str
    age: int

```

:---

---:1

そして、それをルートに添付してください。

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

これで、受信したリクエストの検証が行われるはずです。

:--:1

```
$ curl localhost:8000/person -d '{"name": "Alice", "age": 21}' -X POST  
{"name":"Alice","age":21}
```

:---

## 何が検証できるのか?

`validate` デコレータを使用すると、3つの場所から入力されたユーザーデータを検証することができます。 JSON の本文(`request.json`)、フォームの本文(`request.form`)、そしてクエリパラメータ(`request.args`) です。

---:1 あなたが期待するように、デコレータのキーワード引数を使用してモデルを添付することができます。

:--:1
```python
@validate(
    json=ModelA,
    query=ModelB,
    form=ModelC,
)
```
:---
