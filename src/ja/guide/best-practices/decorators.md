# デコレーター

一貫性のあるDRY Web APIを作成する最良の方法の1つは、デコレータを使用してハンドラから機能を削除し、ビュー間で繰り返し可能にすることです。

---:1

そのため、複数のデコレータを持つSanicビューハンドラが表示されることがよくあります。 :--:1 :--:1
```python
@app.get("/orders")
@authorized("view_order")
@validate_list_params()
@inject_user()
async def get_order_details(request, params, user):
    ...
```
:---


## 例文

ここに、デコレーターの作成に役立つ初期テンプレートがあります。

この例では、ユーザーが特定のエンドポイントへのアクセスを許可されていることを確認するとします。 ハンドラー関数をラップし、クライアントがリソースへのアクセスを許可されているかどうか要求を検査し、適切な応答を送信するデコレータを作成できます。
```python
from functools import wraps
from sanic.response import json

def authorized():
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            # run some method that checks the request
            # for the client's authorization status
            is_authorized = await check_request_for_authorization_status(request)

            if is_authorized:
                # the user is authorized.
                # run the handler method and return the response
                response = await f(request, *args, **kwargs)
                return response
            else:
                # the user is not authorized.
                return json({"status": "not_authorized"}, 403)
        return decorated_function
    return decorator


@app.route("/")
@authorized()
async def test(request):
    return json({"status": "authorized"})
```

## テンプレート

デコレーターは、Sanicでアプリケーションを構築するための**基本**です。 これにより、コードの移植性と保守性が向上します。

Pythonの禅を言い換えてこう言います: 「 (装飾家は) 素晴らしいアイデアの一つです--もっといろいろやってみましょう!"

簡単に実装できるように、ここではコピー/ペースト可能なコードの例を3つ示します。

---:1

これらのインポート文を忘れずに追加してください。 Although it is *not* necessary, using `@wraps` helps keep some of the metadata of your function intact. [docs](https://docs.python.org/3/library/functools.html#functools.wraps) を参照してください。 また、ここでは 「isawaitable」 パターンを使用して、通常の関数または非同期関数によるルートハンドラの実行を許可します。

:--:1

```python
from inspect import isawaitable
from functools import wraps
```

:---

### 引数と一緒に

---:1

多くの場合、*常に*引数を必要とするデコレータが必要になります。 したがって、この関数が実装されると、常に関数を呼び出します。

```python
@app.get("/")
@foobar(1, 2)
async def handler(request: Request):
    return text("hi")
```

:--:1

```python
def foobar(arg1, arg2):
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):

            response = f(request, *args, **kwargs)
            if isawaitable(response):
                response = await response

            return response

        return decorated_function

    return decorator
```

:---

### 引数なし

---:1

引数を取らないデコレータが必要な場合もあります。 このような場合、それを呼び出す必要がないのは便利です。

```python
@app.get("/")
@foobar
async def handler(request: Request):
    return text("hi")
```

:--:1

```python
def foobar(func):
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):

            response = f(request, *args, **kwargs)
            if isawaitable(response):
                response = await response

            return response

        return decorated_function

    return decorator(func)
```

:---

### 引数の有無

---:1

呼び出し可能かどうかを指定できるデコレータが必要な場合は、このパターンに従います。 キーワードのみの引数を使用する必要はありませんが、実装が簡単になる場合があります。

```python
@app.get("/")
@foobar(arg1=1, arg2=2)
async def handler(request: Request):
    return text("hi")
```

```python
@app.get("/")
@foobar
async def handler(request: Request):
    return text("hi")
```

:--:1

```python
def foobar(maybe_func=None, *, arg1=None, arg2=None):
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):

            response = f(request, *args, **kwargs)
            if isawaitable(response):
                response = await response

            return response

        return decorated_function

    return decorator(maybe_func) if maybe_func else decorator
```

:---
