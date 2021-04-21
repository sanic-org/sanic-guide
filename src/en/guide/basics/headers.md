# Headers

Request and response headers are available in the `Request` and `HTTPResponse` objects, respectively. They make use of the [`multidict` package](https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict) that allows a single key to have multiple values.

::: tip FYI

Header keys are converted to *lowercase* when parsed. Capitalization is not considered for headers.

:::

## Request

Sanic does attempt to do some normalization on request headers before presenting them to the developer, and also make some potentially meaningful extractions for common use cases.

---:1

#### Tokens

Authorization tokens in the form `Token <token>` or `Bearer <token>` are extracted to the request object: `request.token`.

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

#### Proxy headers

Sanic has special handling for proxy headers. See the [proxy headers](/guide/advanced/proxy-headers.md) section for more details.

---:1

#### Other headers

Sanic support you operate headers, Header keys are converted to *lowercase* when parsed. Capitalization is not considered for headers.
You can operate it like dict.

:--:1

```python
@app.route("/")
async def handler(request):
    print(request.headers["user-agent"])
    print(request.headers.items())
    return json(dict(request.headers))
```

```bash
$ curl localhost:8000 
```

```bash
$ curl localhost:8000 
{"host":"localhost:8000","user-agent":"curl/7.64.1","accept":"*/*"}
```

:---

#### Request ID

::: new

New in v21.3, often it is convenient or necessary to track a request by its `X-Request-ID` header. You can easily access that as: `request.id`.

:::

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

Sanic will automatically set the following response headers (when appropriate) for you:

- `content-length`
- `content-type`
- `connection`
- `transfer-encoding`

---:1

Any other header that you would like to set can be done either in the route handler, or a response middleware.

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

::: new

A common [middleware](middleware.md) you might want is to add a `X-Request-ID` header to every response. As stated above: `request.id` will provide the ID from the incoming request. But, even if no ID was supplied in the request headers, one will be automatically supplied for you.

[See API docs for more details](https://sanic.readthedocs.io/en/latest/sanic/api_reference.html#sanic.request.Request.id)

:::

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
