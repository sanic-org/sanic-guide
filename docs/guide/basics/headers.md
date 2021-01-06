# Headers

Request and response headers are available in the `Request` and `HTTPResponse` objects, respectively. They make use of the [`multidict` package](https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict) that allows a single key to have multiple values.

::: tip FYI
Header keys are converted to *lowercase* when parsed. Capitalization is not considered for headers.
:::
## Request

Sanic does attempt to do some normalization on request headers before presenting them to the developer, and also make some potentially meaningful extractions for common use cases.

---:1
#### Tokens

Authorization tokens in the form `Token <token>` or `Bearer <token>` are extracted to the request object: `reuest.token`.

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
:--:1
```python
@app.route("/")
async def handler(request):
    return text(request.token)
```
:---
#### Proxy headers
Sanic has special handling for proxy headers. See the [proxy headers](/advanced/proxy-headers.md) section for more details.

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
