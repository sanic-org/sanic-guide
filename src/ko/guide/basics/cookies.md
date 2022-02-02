# 쿠키(Cookies)

## 읽기(Reading)

---:1

쿠키는 `Request` 객체의 `cookies` 사전(dict)을 통해 액세스 할 수 있습니다.

:--:1

```python
@app.route("/cookie")
async def test(request):
    test_cookie = request.cookies.get("test")
    return text("Test cookie: {}".format(test_cookie))
```

:---

## 쓰기(Writing)

---:1

응답을 반환할 때 `Response`객체인 `response.cookies`에 쿠키를 설정할 수 있습니다. 이 객체는 응답 헤더를 자동으로 작성하는 특별한 종류의 사전(dict)인 `CookieJar`의 인스턴스입니다.

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

응답 쿠키는 사전 값과 같이 설정할 수 있으며 다음 매개변수들을 사용할 수 있습니다.:

- `expires: datetime` - 클라이언트의 브라우저에서 쿠키가 만료되는 시간입니다.
- `path: str` - 이 쿠키가 적용되는 URL의 하위 집합입니다. 기본값은 `/`입니다.
- `comment: str` - 주석(메타데이터)입니다.
- `domain: str` - 쿠키가 유효한 도메인을 지정합니다. 명시적으로 지정된 도메인은 항상 점으로 시작해야 합니다.
- `max-age: int` - 쿠키가 유지될 시간(초) 입니다.
- `secure: bool` - 쿠키가 HTTPS를 통해서만 전송될지 지정합니다
- `httponly: bool` - JavaScript에서 쿠키를 읽을 수 없는지 지정합니다.
- `samesite: str` - 기본값은 브라우저에 따라 다르며, 사양 상태 (Lax, Strict 및 None)는 유효한 값입니다.

## 지우기(Deleting)

---:1

쿠키는 의미적으로 또는 명시적으로 제거할 수 있습니다.

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

## 먹기(Eating)

저는 쿠키를 좋아합니다 :cookie:
