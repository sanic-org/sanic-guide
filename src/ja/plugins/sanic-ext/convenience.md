# 便利な物

## シリアライザーの修正

---:1

アプリケーションを開発していると、常に同じようなレスポンスを返すルートが存在することがよくあります。このような場合、エンドポイントで返されるシリアライザーをあらかじめ定義しておけば、あとはコンテンツを返すだけでよいのです。

:--:1

```python
from sanic_ext import serializer

@app.get("/<name>")
@serializer(text)
async def hello_world(request, name: str):
    if name.isnumeric():
        return "hello " * int(name)
    return f"Hello, {name}"
```

:---



---:1

`@serializer` デコレータは、ステータスコードを追加することもできます。

:--:1
```python
from sanic_ext import serializer

@app.post("/")
@serializer(text, status=202)
async def create_something(request):
    ...
```
:---

## カスタムシリアライザー


---:1

`@serializer` デコレータを使用すると、有効な型 (`HTTPResonse`) を返す限りにおいて、独自のカスタム関数を渡すことも可能です。

:--:1

```python
def message(retval, request, action, status):
    return json(
        {
            "request_id": str(request.id),
            "action": action,
            "message": retval,
        },
        status=status,
    )


@app.post("/<action>")
@serializer(message)
async def do_action(request, action: str):
    return "This is a message"
```

:---

---:1

さて、文字列だけを返すと、素敵なシリアル化された出力が返されるはずです。

:--:1

```python
$ curl localhost:8000/eat_cookies -X POST
{
  "request_id": "ef81c45b-235c-46dd-9dbd-b550f8fa77f9",
  "action": "eat_cookies",
  "message": "This is a message"
}

```

:---
