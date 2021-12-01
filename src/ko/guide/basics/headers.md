# 헤더(Headers)

요청 및 응답 헤더는 각각 `Request` 및 `HTTPResponse` 객체에서 사용할 수 있습니다.
단일 키가 여러 값을 가질 수 있도록 허용하는 [`multidict` 패키지](https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict)를 사용합니다.

::: tip FYI
헤더 키는 구문 분석시 *소문자*로 변환됩니다. 헤더에는 대문자 사용이 고려되지 않습니다.
:::

## 요청(Request)

Sanic은 요청 헤더를 개발자에게 제공하기 전에 요청 헤더에 대해 일부 정규화를 시도하고, 일반적인 사용 사례에 대해 잠재적으로 의미 있는 몇 가지 추출을 시도합니다.

---:1

#### 토큰(Tokens)

`Token <token>` 또는 `Bearer <token>`형식의 인증 토큰이 요청 객체 `request.token`으로 추출됩니다.
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

#### 프록시 헤더(Proxy headers)

Sanic에는 프록시 헤더에 대한 특수 처리 기능이 있습니다. 자세한 내용은 [proxy headers](/guide/advanced/proxy-headers.md) 섹션을 참조하십시오.

#### 호스트 헤더 및 동적 URL 구성(Host header and dynamic URL construction)

*유효 호스트*는 `request.host`를 통해 사용할 수 있습니다. 이것은 proxy-forwarded를 선호하고 서버 이름 설정에 의해 강제될 수 있으므로 호스트 헤더와 반드시 같지는 않습니다.

웹앱은 일반적으로 이 접근자를 사용해야 배포 방식에 관계없이 동일하게 작동할 수 있습니다. 실제 호스트 헤더는 필요한 경우 `request.headers`를 통해 찾을 수 있습니다.

유효 호스트는 요청을 사용하여 핸들러의 외부 주소를 결정하는 `request.url_for`를 통한 동적 URL 구성에도 사용됩니다.

::: tip 악의적인 클라이언트를 조심하세요!

이러한 URL은 오해의 소지가 있는 호스트 헤더를 전송하여 조작할 수 있습니다. 이것이 우려된다면 `app.url_for`를 대신 사용해야 합니다.
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
#### Other headers

모든 요청 헤더는 `request.headers`에서 사용할 수 있으며 사전 형식으로 액세스할 수 있습니다. 대문자는 헤더에 대해 고려되지 않으며 대문자 또는 소문자 키를 사용하여 액세스할 수 있습니다.

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

::: tip FYI
💡 request.headers 객체는 각 값이 목록인 사전인 몇 가지 유형 중 하나입니다. HTTP에서는 단일 키를 재사용하여 여러 값을 보낼 수 있기 때문입니다

대부분의 경우 .get() 또는 .getone() 메서드를 사용하여 목록이 아닌 첫 번째 요소에 액세스하려고 합니다. 모든 항목의 목록을 원하면 .getall()을 사용할 수 있습니다.
:::

#### 요청 ID(Request ID)

---:1

종종 `X-Request-ID` 헤더로 요청을 추적하는 것이 편리하거나 필요합니다. `request.id`로 쉽게 액세스할 수 있습니다.

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

## 응답(Response)

Sanic은 자동으로 다음 응답 헤더(해당되는 경우)를 설정합니다.:

- `content-length`
- `content-type`
- `connection`
- `transfer-encoding`

---:1

설정할 다른 헤더는 경로 핸들러 또는 응답 미들웨어에서 수행할 수 있습니다.
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
일반적인 [middleware](middleware.md)는 모든 응답에 `X-Request-ID` 헤더를 추가하는 것입니다. 위에서 언급했듯이`request.id`는 수신 요청의 ID를 제공합니다. 그러나 요청 헤더에 ID가 제공되지 않은 경우에도 자동으로 제공됩니다.

[자세한 내용은 API 문서를 참조하세요.](https://sanic.readthedocs.io/en/latest/sanic/api_reference.html#sanic.request.Request.id)
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
