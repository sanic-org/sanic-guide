# 标头(Headers)

请求头和响应头仅在对应的 `Request` 对象和 `HTTPResponse` 对象中起作用。它们使用 [`multidict` 包](https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict) 进行构建，这意味着它们允许一个键名具有多个对应值。

::: tip 小提示：

请求头或响应头中的键名将会在解析过程中被转换为小写，Headers 中不考虑大写键名。

:::

## 请求头(Request Headers)

Sanic 确实试图在把请求头提交给开发人员之前对它们进行一些规范处理，并且对常见的用例进行一些潜在的有意义的提取。

---:1

#### 令牌(Tokens)

从请求头中解析到的 `Token <token>` 或者 `Bearer <token>` 将会被赋值给 `request.token`。

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

#### 代理头(Proxy headers)

Sanic 对代理头也有着特殊的处理，具体的细节请参考 [代理头](/zh/guide/advanced/proxy-headers.md) 章节的解释

#### 主机标头和动态URL的构建(Host header and dynamic URL construction)

您可以通过 `request.host` 属性来获取有效主机名。该值不一定与头信息中的主机一致，因为它更倾向于保存反向代理的主机信息，并且可以通过服务器名称强行设置。

在通常情况下，Web 应用应该去设置并使用这个属性，这样能保证在任何部署方式下都能提供同样的功能。如果需要的话 `request.headers` 可以获取真实的主机头信息。

有效的主机名称也可以与 `request.url_for` 方法一起使用，它可以确定响应函数所对应的外部地址。

::: tip 警惕恶意客户端

由于头信息中的主机信息可能会被客户端恶意替换，为了生成正确的 URL，您应该考虑使用 `app.url_for` 方法。

:::

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

#### 其他标头(Other headers)

您可以在请求对象的 `request.headers` 属性中获取所有的请求头，并且可以通过字典的方式来进行访问。Headers 的键名不考虑大小写，可以通过大写或小写键名来进行访问。

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

::: tip 小提示

💡 request.headers 对象是少数几个字典类型之一，每个值都是一个列表。这是因为HTTP允许重用一个键来发送多个值。

大多数情况下，您会希望使用 .get()或 .getone()方法访问第一个元素，而不是列表。如果您想要所有项目的列表，您可以使用 .getall() 方法。

:::


#### Request ID

---:1

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

## 响应头(Response Headers)

Sanic将为您自动设置以下响应头（如果适用）：

- `content-length`
- `content-type`
- `connection`
- `transfer-encoding`

在大多数情况下，您应该不需要去关心如何去设置这些标头。

---:1

如果您想要设置其他的标头，那您可以在路由处理程序或者响应中间件中进行添加。

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

您可能会想要为响应也添加 `X-Request-ID` 头信息，通常，您可以添加一个 [中间件](middleware.md)。

如上所述。`request.id` 可以从请求头中获取请求 ID。并且如果在请求中没有 `X-Request-ID` 头，也会自动为您创建一个。

[查看API文档来获取更多信息](https://sanic.readthedocs.io/en/latest/sanic/api_reference.html#sanic.request.Request.id)

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
