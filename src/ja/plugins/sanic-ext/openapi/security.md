# セキュリティスキーム

認証方式を文書化するためには、2つのステップがある。

_セキュリティはv21.12.2以降で利用可能です。_

## スキームを文書化する

---:1 まず最初に、1つ以上のセキュリティスキームを定義する必要があります。 こんな感じに定義するのが基本パターンとなります。 :

```python
add_security_scheme("<NAME>", "<TYPE>")
```

The `type` should correspond to one of the allowed security schemes: `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`. You can then pass appropriate keyword arguments as allowed by the specification.

You should consult the [OpenAPI Specification](https://swagger.io/specification/) for details on what values are appropriate. :--:1
```python
app.ext.openapi.add_security_scheme("api_key", "apiKey")
app.ext.openapi.add_security_scheme(
    "token",
    "http",
    scheme="bearer",
    bearer_format="JWT",
)
app.ext.openapi.add_security_scheme("token2", "http")
app.ext.openapi.add_security_scheme(
    "oldschool",
    "http",
    scheme="basic",
)
app.ext.openapi.add_security_scheme(
    "oa2",
    "oauth2",
    flows={
        "implicit": {
            "authorizationUrl": "http://example.com/auth",
            "scopes": {
                "on:two": "something",
                "three:four": "something else",
                "threefour": "something else...",
            },
        }
    },
)
```
:---

## エンドポイントを文書化する

---:1 2つのオプションがあり、_all_ endpointsをdocumentします。

:--:1
```python
app.ext.openapi.secured()
app.ext.openapi.secured("token")
```
:---

---:1 あるいは、特定の経路だけを記録する。 :--:1 :--:1
```python
@app.route("/one")
async def handler1(request):
    """
    openapi:
    ---
    security:
        - foo: []
    """


@app.route("/two")
@openapi.secured("foo")
@openapi.secured({"bar": []})
@openapi.secured(baz=[])
async def handler2(request):
    ...


@app.route("/three")
@openapi.definition(secured="foo")
@openapi.definition(secured={"bar": []})
async def handler3(request):
    ...
```
:---
