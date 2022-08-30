# セキュリティスキーム

認証方式を文書化するためには、2つのステップがある。

_セキュリティはv21.12.2以降で利用可能です。_

## スキームを文書化する

---:1 まず最初に、1つ以上のセキュリティスキームを定義する必要があります。 こんな感じに定義するのが基本パターンとなります。 :

```python
add_security_scheme("<NAME>", "<TYPE>")
```

`type`は、許可されたセキュリティスキームのいずれかに対応する必要があります: `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"` その後、仕様で許可されているキーワード引数を渡すことができます。

適切な値の詳細については、 [OpenAPIの仕様](https://swagger.io/specification/) を参照してください。 :--:1
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
                "on:two": "何か",
                "three:four": "それ以外",
                "threefour": "それ以外...",
            },
        }
    },
)
```
:---

## エンドポイントを文書化する

---:1 2つのオプションがあり、1つは_全ての_エンドポイントを文章化することです。

:--:1
```python
app.ext.openapi.secured()
app.ext.openapi.secured("token")
```
:---

---:1 もしくは、特定のルートだけを記録できます。 :--:1
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
