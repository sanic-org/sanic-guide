# 标头(Headers)

请求头和响应头仅在对应的 `Request` 对象和`HTTPResponse`对象中起作用。它们使用  [`multidict` 包](https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict) 进行构建，这意味着它们允许一个键名具有多个对应值。

::: tip 仅供参考：

请求头或响应头中的键值建名将会在解析过程中被转换为小写，Headers 中不考虑键名大写。

:::

## 请求头(Request Headers)

Sanic 确实试图在把请求头提交给开发人员之前对它们进行一些规范化，并且对常见的用例进行一些潜在的有意义的提取。

---:1

#### 令牌(Tokens)

从请求头中解析到的 `Token <token>` 或者 `Bearer <token>` 将会被赋值给`request.token`

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

#### 代理头(Proxy headers)

Sanic 对代理头也有着特殊的处理，具体的细节请参考 [代理头](/guide/advanced/proxy-headers.md) 章节的解释

## 响应头(Response Headers)

Sanic将为您自动设置以下响应头（如果适用）：

- `content-length`
- `content-type`
- `connection`
- `transfer-encoding`

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
