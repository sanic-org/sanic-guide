# Заголовки

Заголовки запросов и ответов доступны в объектах `Request` и `HTTPResponse`, соответственно. Они используют [пакет `multidict`](https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict), который позволяет одному ключу иметь несколько значений.

::: Совет К сведенью

При обработке запроса ключи заголовков преобразуются в *в нижний регистр*. Написание имен заголовков с заглавной буквы не предполагается.

:::

## Запрос

Sanic пытается сделать некоторую нормализацию заголовков запроса, прежде чем представить их разработчику, а также сделать некоторые потенциально значимые выборки наиболее часто используемых вариантов.

---:1

#### Токены

Токены авторизации из форм `Token <token>` или `Bearer <token>` извлекаются в объект запроса: `request.token`.

:--:1

```python
@app.route("/")
async def handler(request):
    return text(request.token)
```

```bash
$ curl localhost:8000 \
    -H "Authorization: Token ABCDEF12345679"
ABCDEF12345679
```

```bash
$ curl localhost:8000 \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

:---

---:1

#### Заголовки прокси

У Sanic есть специальная обработка заголовков прокси. Смотрите раздел [Заголовки прокси](/guide/advanced/proxy-headers.md) для получения более подробной информации.

#### Заголовок "host" и динамическое формирование URL

*Принимающий хост* доступен через `request.host`. Он не обязательно совпадает со значением в заголовке host, так как он нацелен на прокси-перенаправленный хост и может быть принудительно изменен настройкой имени сервера.

Веб-приложения должны использовать в основном это свойство, чтобы они могли работать одинаково независимо от способа развёртывания на сервере. При необходимости реальный заголовок host можно найти через `request.headers`

Принимающий хост также используется в динамическом построении URL по запросу `request.url_for`, который использует запрос для определения внешнего адреса хендлера.

::: Совет Будьте осторожны с вредоносными клиентами. Их URL могут быть подменены путём отправки подложных заголовков хостов. Если это имеет значение `app.url_for` следует использовать. :::

:--:1

```python
app.config.SERVER_NAME = "https://example.com"

@app.route("/hosts", name="foo")
async def handler(request):
    return json(
        {
            "effective host": request.host,
            "host header": request.headers.get("host"),
            "forwarded host": request.forwarded.get("host"),
            "you are here": request.url_for("foo"),
        }
    )
```

```bash
$ curl localhost:8000/hosts
{
  "effective host": "example.com",
  "host header": "localhost:8000",
  "forwarded host": null,
  "you are here": "https://example.com/hosts"
}
```

:---

---:1
#### Прочие заголовки

Все заголовки запроса доступны в свойстве `request.headers`, и их можно получить в форме словарей. Написание имен заголовков с заглавной буквы не предполагается, в связи с этим используйте нижний или верхний регистр для доступка к ключам заголовков.

:--:1

```python
@app.route("/")
async def handler(request):
    return json(
        {
            "foo_weakref": request.headers["foo"],
            "foo_get": request.headers.get("Foo"),
            "foo_getone": request.headers.getone("FOO"),
            "foo_getall": request.headers.getall("fOo"),
            "all": list(request.headers.items()),
        }
    )
```

```bash
$ curl localhost:9999/headers -H "Foo: one" -H "FOO: two"|jq
{
  "foo_weakref": "one",
  "foo_get": "one",
  "foo_getone": "one",
  "foo_getall": [
    "one",
    "two"
  ],
  "all": [
    [
      "host",
      "localhost:9999"
    ],
    [
      "user-agent",
      "curl/7.76.1"
    ],
    [
      "accept",
      "*/*"
    ],
    [
      "foo",
      "one"
    ],
    [
      "foo",
      "two"
    ]
  ]
}
```

:---

::: Совет К сведенью Объект request.headers - один из нескольких типов, представляющих собой словарь, каждое значение которого является списком. Это связано с тем, что HTTP позволяет повторно использовать один ключ для отправки нескольких значений.

Чаще всего вы хотите использовать метод .get() для доступа к первому элементу, а не списку. Если вы хотите получить список всех элементов, можно использовать .getlist(). :::

#### ID запроса

---:1

Часто бывает удобно или необходимо отслеживать запрос через его заголовок `X-Request-ID`. Вы можете легко получить доступ к нему посредством: `request.id`.

:--:1

```python
@app.route("/")
async def handler(request):
    return text(request.id)
```

```bash
$ curl localhost:8000 \
    -H "X-Request-ID: ABCDEF12345679"
ABCDEF12345679
```

:---

## Response

Sanic автоматически установит для вас следующие заголовки ответов (при необходимости):

- `content-length`
- `content-type`
- `connection`
- `transfer-encoding`

В большинстве случаев вам не нужно беспокоиться об установке этих заголовков.

---:1

Любой другой заголовок, который вы хотите установить, можно сделать либо в соответствующем хендлере, либо в middleware.

:--:1

```python
@app.route("/")
async def handler(request):
    return text("Done.", headers={"content-language": "en-US"})

@app.middleware("response")
async def add_csp(request, response):
    response.headers["content-security-policy"] = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';base-uri 'self';form-action 'self'"
```

:---

---:1

Скорее всего вы можете захотеть использовать [middleware](middleware.md), в котором к каждому ответу добавляется заголовок `X-Request-ID`. Как указано выше, `request.id` предоставит идентификатор входящего запроса. Но даже если идентификатор не был предоставлен в заголовках запроса, он будет предоставлен для вас автоматически.

[Смотрите документацию API для более подробной информации](https://sanic.readthedocs.io/en/latest/sanic/api_reference.html#sanic.request.Request.id)

:--:1

```python
@app.route("/")
async def handler(request):
    return text(str(request.id))

@app.on_response
async def add_request_id_header(request, response):
    response.headers["X-Request-ID"] = request.id
```

```bash
$ curl localhost:8000 -i
HTTP/1.1 200 OK
X-Request-ID: 805a958e-9906-4e7a-8fe0-cbe83590431b
content-length: 36
connection: keep-alive
content-type: text/plain; charset=utf-8

805a958e-9906-4e7a-8fe0-cbe83590431b
```

:---
