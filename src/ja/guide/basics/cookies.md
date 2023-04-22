# クッキー

## 読み込み

---:1

クッキーは、`Request`オブジェクトの`cookies`辞書を介してアクセスできます。
:--:1
```python
@app.route("/cookie")
async def test(request):
    test_cookie = request.cookies.get("test")
    return text("テストクッキー: {}".format(test_cookie))
```
:---


## 書き込み

---:1

応答を返すとき、クッキーは`Response`オブジェクトに設定できます: `response.cookies`。このオブジェクトは、応答ヘッダーを自動的に書き込む特別な種類の辞書である「CookieJar」のインスタンスです。
:--:1
```python
@app.route("/cookie")
async def test(request):
    response = text("このレスポンスにはクッキーがあります")
    response.cookies["test"] = "It worked!"
    response.cookies["test"]["domain"] = ".yummy-yummy-cookie.com"
    response.cookies["test"]["httponly"] = True
    return response
```
:---

応答クッキーは辞書の値のように設定でき、次のパラメータを使用できます。

- `expires: datetime` - クライアントのブラウザでクッキーが期限切れになる時間。
- `path: str` - このクッキーが適用されるURLのサブセット。デフォルトは `/` です。
- `comment: str` - コメント(メタデータ)。
- `domain: str` - クッキーが有効なドメインを指定します。明示的に指定されたドメインは常にドットで始まる必要があります。
- `max-age: int` - クッキーが存息する秒数。
- `secure: bool` - クッキーがHTTPS経由でのみ送信されるかどうかを指定します。
- `httponly: bool` - クッキーをJavaScriptで読み取ることができないかどうかを指定します。
- `samesite: str` - デフォルトはブラウザに依存し、仕様状態(Lax、Strict、None)は有効な値です。

## 削除

---:1

クッキーは意味的または明示的に削除できます。
:--:1
```python
@app.route("/cookie")
async def test(request):
    response = text("クッキーを食べる時間だ！ハハハ")

    # 0秒後にこのクッキーは削除されます
    del response.cookies["kill_me"]

    # このクッキーは5秒後に自分から消えます
    response.cookies["short_life"] = "Glad to be here"
    response.cookies["short_life"]["max-age"] = 5
    del response.cookies["favorite_color"]

    # このクッキーには変更はありません
    response.cookies["favorite_color"] = "blue"
    response.cookies["favorite_color"] = "pink"
    del response.cookies["favorite_color"]

    return response
```
:---

## 食べる

Sanicはクッキーが好きなんです :cookie:
