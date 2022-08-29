# Cookies

## 读取(Reading)

---:1

Cookies can be accessed via the `Request` object’s `cookies` dictionary. :--:1
```python
@app.route("/cookie")
async def test(request):
    test_cookie = request.cookies.get("test")
    return text("Test cookie: {}".format(test_cookie))
```
:---


## 写入(Writing)

---:1

When returning a response, cookies can be set on the `Response` object: `response.cookies`. 返回 response 的时候， 您可以通过 `Response` 对象的 `response.cookies` 来设置 cookies，它是一个 `CookieJar` 对象，这是一种特殊的字典类型，能够帮助您自动编写响应头。 :--:1
```python
@app.route("/cookie")
async def test(request):
    response = text("There's a cookie up in this response")
    response.cookies["test"] = "It worked!"
    response.cookies["test"]["domain"] = ".yummy-yummy-cookie.com"
    response.cookies["test"]["httponly"] = True
    return response
    response.cookies["test"]["domain"] = ".yummy-yummy-cookie.com"
    response.cookies["test"]["httponly"] = True
    return response
```
:---

:--:1

- Cookie 在客户端浏览器上失效的时间。
- 此 Cookie 适用的 URL 子集。 默认值为 `/`
- `comment: str` - A comment (metadata).
- 指定 Cookie 的有效域。 显式指定的域必须始终以点开始。
- Cookie 应生存的秒数。
- 指定是否仅通过 HTTPS 发送 Cookie。
- 您可以通过 `Request` 对象的 `cookies` 字典来访问 Cookies。
- 默认值取决于浏览器，规范状态（Lax、Strict 和 None）是有效值。

## 删除(Deleting)

---:1

Cookies can be removed semantically or explicitly. :--:1
```python
@app.route("/cookie")
async def test(request):
    response = text("Time to eat some cookies muahaha")

    # 此 cookie 将被立即删除
    del response.cookies["kill_me"]

    # 此 cookie 将在 5 秒后删除
    response.cookies["short_life"] = "Glad to be here"
    response.cookies["short_life"]["max-age"] = 5

    del response.cookies["favorite_color"]

    # 此 cookie 将保持不变
    response.cookies["favorite_color"] = "blue"
    response.cookies["favorite_color"] = "pink"

    del response.cookies["favorite_color"]

    return response
```
:---

## 食用(Eating)

您可以通过语义设置或对 Cookies 进行显示操作来达到删除的效果。
