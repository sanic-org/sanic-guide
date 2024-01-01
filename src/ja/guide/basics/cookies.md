# クッキー

## 読み込み

---:1

クッキーは、`Request`オブジェクトの`cookies`辞書を介してアクセスできます。
:--:1
```python
@app.route("/cookie")
async def test(request):
    test_cookie = request.cookies.get("test")
    return text(f"Test cookie: {test_cookie}")
```

:---

::: tip FYI

💡 The `request.cookies` object is one of a few types that is a dictionary with each value being a `list`. This is because HTTP allows a single key to be reused to send multiple values.

Most of the time you will want to use the `.get()` method to access the first element and not a `list`. If you do want a `list` of all items, you can use `.getlist()`.

*Added in v23.3*
:::


## 書き込み

---:1

応答を返すとき、クッキーは`Response`オブジェクトに設定できます: `response.cookies`。このオブジェクトは、応答ヘッダーを自動的に書き込む特別な種類の辞書である「CookieJar」のインスタンスです。
:--:1
```python
@app.route("/cookie")
async def test(request):
    response = text("このレスポンスにはクッキーがあります")
    response.add_cookie(
        "test",
        "It worked!",
        domain=".yummy-yummy-cookie.com",
        httponly=True
    )
    return response
```
:---

応答クッキーは辞書の値のように設定でき、次のパラメータを使用できます。

- `path: str` - このクッキーが適用されるURLのサブセット。デフォルトは `/` です。
- `domain: str` - クッキーが有効なドメインを指定します。明示的に指定されたドメインは常にドットで始まる必要があります。
- `max_age: int` - クッキーが存息する秒数。
- `expires: datetime` - The time for the cookie to expire on the client’s browser. Usually it is better to use max-age instead.
- `secure: bool` - Specifies whether the cookie will only be sent via HTTPS. Defaults to `True`.
- `httponly: bool` - クッキーをJavaScriptで読み取ることができないかどうかを指定します。
- `samesite: str` - Available values: Lax, Strict, and None. Defaults to `Lax`.
- `comment: str` - A comment (metadata).
- `host_prefix: bool` - Whether to add the `__Host-` prefix to the cookie.
- `secure_prefix: bool` - Whether to add the `__Secure-` prefix to the cookie.
- `partitioned: bool` - Whether to mark the cookie as partitioned.

To better understand the implications and usage of these values, it might be helpful to read the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) on [setting cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie).

::: tip FYI
By default, Sanic will set the `secure` flag to `True` to ensure that cookies are only sent over HTTPS as a sensible default. This should not be impactful for local development since secure cookies over HTTP should still be sent to `localhost`. For more information, you should read the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies) on [secure cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Secure).
:::

## 削除

---:1

クッキーは意味的または明示的に削除できます。
:--:1
```python
@app.route("/cookie")
async def test(request):
    response = text("クッキーを食べる時間だ！ハハハ")

    # 0秒後にこのクッキーは削除されます
    response.delete_cookie("eat_me")

    # このクッキーは5秒後に自分から消えます
    response.add_cookie("fast_bake", "Be quick!", max_age=5)

    return response
```

*Don't forget to add `path` or `domain` if needed!*
:---

## 食べる

Sanicはクッキーが好きなんです :cookie:
