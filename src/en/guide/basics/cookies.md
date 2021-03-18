# Cookies

## Reading

---:1

Cookies can be accessed via the `Request` object’s `cookies` dictionary.
:--:1
```python
@app.route("/cookie")
async def test(request):
    test_cookie = request.cookies.get("test")
    return text("Test cookie: {}".format(test_cookie))
```
:---


## Writing

---:1

When returning a response, cookies can be set on the `Response` object: `response.cookies`. This object is an instance of `CookieJar` which is a special sort of dictionary that automatically will write the response headers for you.
:--:1
```python
@app.route("/cookie")
async def test(request):
    response = text("There"s a cookie up in this response")
    response.cookies["test"] = "It worked!"
    response.cookies["test"]["domain"] = ".yummy-yummy-cookie.com"
    response.cookies["test"]["httponly"] = True
    return response
```
:---

Response cookies can be set like dictionary values and have the following parameters available:

- `expires: datetime` - The time for the cookie to expire on the client’s browser.
- `path: str` - The subset of URLs to which this cookie applies. Defaults to `/`.
- `comment: str` - A comment (metadata).
- `domain: str` - Specifies the domain for which the cookie is valid. An explicitly specified domain must always start with a dot.
- `max-age: int` - Number of seconds the cookie should live for.
- `secure: bool` - Specifies whether the cookie will only be sent via HTTPS.
- `httponly: bool` - Specifies whether the cookie cannot be read by JavaScript.
- `samesite: str` - Default is browser dependent, specification states (Lax, Strict, and None) are valid values.

## Deleting

---:1

Cookies can be removed semantically or explicitly.
:--:1
```python
@app.route("/cookie")
async def test(request):
    response = text("Time to eat some cookies muahaha")

    # This cookie will be set to expire in 0 seconds
    del response.cookies["kill_me"]

    # This cookie will self destruct in 5 seconds
    response.cookies["short_life"] = "Glad to be here"
    response.cookies["short_life"]["max-age"] = 5
    del response.cookies["favorite_color"]

    # This cookie will remain unchanged
    response.cookies["favorite_color"] = "blue"
    response.cookies["favorite_color"] = "pink"
    del response.cookies["favorite_color"]

    return response
```
:---

## Eating

I like cookies :cookie:
