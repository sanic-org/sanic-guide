# Cookies (Куки)

## Чтение

---:1

Cookies можно получить через словарь `cookies` в объекте `Request`. :--:1
```python
@app.route("/cookie")
async def test(request):
    test_cookie = request.cookies.get("test")
    return text("Test cookie: {}".format(test_cookie))
```
:---


## Запись

---:1

При возврате ответа куки могут быть установлены в объекте `Response`: `response.cookies`. Этот объект является экземпляром `CookieJar`, представляющего собой особый вид словаря, который автоматически пишет для вас заголовки ответа. :--:1
```python
@app.route("/cookie")
async def test(request):
    response = text("There's a cookie up in this response")
    response.cookies["test"] = "It worked!"
    response.cookies["test"]["domain"] = ".yummy-yummy-cookie.com"
    response.cookies["test"]["httponly"] = True
    return response
```
:---

В ответе cookie могут быть установлены в качестве значений словаря и иметь следующие параметры:

- `expires: datetime` - Время истечения срока действия cookie в браузере клиента.
- `path: str` - Подмножество URL-адресов, к которым применяется этот файл cookie. По умолчанию `/`.
- `comment: str` - Комментарий (метаданные).
- `domain: str` - определяет домен, для которого cookie является допустимым. Явно указываемый домен должен всегда начинаться с точки.
- `max-age: int` - Количество секунд, в течение которых cookie должны жить.
- `secure: bool` - Указывает, будет ли cookie отправляться только через HTTPS.
- `httponly: bool` - Указывает, что cookie не могут быть прочитаны JavaScript.
- `samesite: str` - По умолчанию зависит от браузера, состояния, указанные в спецификации (Lax, Strict и None), являются допустимыми значениями.

## Удаление

---:1

Cookies могут быть удалены семантически или явно. :--:1
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

## Питание

Я люблю печеньки :cookie: *(Прим: дословный перевод слова "cookie" - печенье)*
