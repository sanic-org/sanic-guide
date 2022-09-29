# デコレーター

スキーマにコンテンツを追加するための主なメカニズムは、エンドポイントを装飾することです。 もしあなたが過去に `sanic-openapi` を使ったことがあるなら、これは馴染みのあるものでしょう。 デコレータとその引数は [OAS v3.0 仕様](https://swagger.io/specification/) とほぼ同じです。

---:1

表示されるすべての例は、ルート定義の周りにラップされます。 これらを作成する際には、Sanic ルート・デコレーター (`@app.route` や `@app.get` など) が一番外側のデコレーターであることを確認する必要があります。 つまり、最初にそれを置き、その後に以下のデコレータを1つ以上置く必要があります。

:--:1

```python
from sanic_ext import openapi


@app.get("/path/to/<something>")
@openapi.summary("これは概要です")
@openapi.description("これは説明です")
async def handler(request, somethind: str):
    ...
```

:---

---:1

また、以下の例の多くはモデルオブジェクトを参照していることがわかります。 シンプルにするために、例では `UserProfile` を使用し、以下のようになります。 重要なのは、型付けされたクラスであれば何でも良いということです。 `dataclass`や他の種類のモデルオブジェクトであることは容易に想像がつくでしょう。

:--:1

```python
class UserProfile:
    name: str
    age: int
    email: str
```

:---

## デコレーターの定義

### `@opanepi.definition`

`@openapi.definition`デコレーターを使用すると、パス上の操作のすべての部分を一度に定義することができます。 これは、他のデコレーターと同じように操作の定義を作成できるオムニバムデコレーターです。 複数のフィールド固有のデコレータを使うか、あるいは単一のデコレータを使うかは、 開発者のスタイルによります。

このフィールドは、操作の定義を容易にするために、意図的に複数のタイプを受け入れる寛容なものとなっています。

**引数**

| フィールド         | 型                                                                  |
| ------------- | ------------------------------------------------------------------ |
| `body`        | ***dict, RequestBody, ***ユーザー定義モデル******                           |
| `deprecated`  | **bool**                                                           |
| `description` | **str**                                                            |
| `document`    | **str, ExternalDocumentation**                                     |
| `exclude`     | **bool**                                                           |
| `operation`   | **str**                                                            |
| `parameter`   | **str, dict, Parameter, [str], [dict], [Parameter]**               |
| `response`    | **dict, Response, *ユーザー定義モデル*, [dict], [Response], [*ユーザー定義モデル*]** |
| `summary`     | **str**                                                            |
| `tag`         | **str, Tag, [str], [Tag]**                                         |
| `secured`     | **Dict[str, Any]**                                                 |

**例**

---:1

```python
@openapi.definition(
    body=RequestBody(UserProfile, required=True),
    summary="ユーザープロファイルの更新",
    tag="one",
    response=[Success, Response(Failure, status=400)],
)
```

:--:1

:---

*その他の例については、以下の例を参照してください。 以下のデコレータの値は、対応するキーワード引数で使用することができます。*

## フィールド固有デコレーター

以下のすべてのデコレーターは `@openapi` をベースにしています。

::::tabs

:::tab body

**引数**

| フィールド       | 型                                  |
| ----------- | ---------------------------------- |
| **content** | ***ユーザー定義モデル*, dict, RequestBody** |

**例**

---:1

```python
@openapi.body(UserProfile)
```

```python
@openapi.body({"application/json": UserProfile})
```

```python
@openapi.body(RequestBody({"application/json": UserProfile}))
```

:--:1

```python
@openapi.body({"content": UserProfile})
```

```python
@openapi.body(RequestBody(UserProfile))
```

```python
@openapi.body({"application/json": {"description": ...}})
```

:---

:::

:::tab deprecated

**引数**

*なし*

**例**

---:1

```python
@openapi.deprecated()
```

:--:1

```python
@openapi.deprecated
```

:---

:::

:::tab description

**引数**

| フィールド  | 型       |
| ------ | ------- |
| `text` | **str** |

**例**

---:1

```python
@openapi.description(
    """これは**説明**です。

## `markdown`も使えます。

- そして
- リストも
- 作れます。
"""
)
```

:--:1

:---

:::

:::tab document

**引数**

| フィールド         | 型       |
| ------------- | ------- |
| `url`         | **str** |
| `description` | **str** |

**例**

---:1

```python
@openapi.document("http://example.com/docs")
```

:--:1

```python
@openapi.document(ExternalDocumentation("http://example.com/more"))
```

:---

:::

:::tab exclude

他のすべてのデコレータと同様にルート定義で使用するか、ブループリントで呼び出すことができます。

**引数**

| フィールド  | 型             | デフォルト    |
| ------ | ------------- | -------- |
| `flag` | **bool**      | **True** |
| `bp`   | **Blueprint** |          |

**例**

---:1

```python
@openapi.exclude()
```

:--:1

```python
openapi.exclude(bp=some_blueprint)
```

:---

:::

:::tab operation

オペレーションIDを設定します。

**引数**

| フィールド  | タイプ     |
| ------ | ------- |
| `name` | **str** |

**例**

---:1

```python
@openapi.operation("doNothing")
```

:--:1

:---

:::

:::tab parameter

**引数**

| フィールド      | 型                                           | デフォルト       |
| ---------- | ------------------------------------------- | ----------- |
| `name`     | **str**                                     |             |
| `schema`   | ***type***                                  | **str**     |
| `location` | **"query", "header", "path" もしくは "cookie"** | **"query"** |

**例**

---:1

```python
@openapi.parameter("thing")
```

```python
@openapi.parameter(parameter=Parameter("foobar", deprecated=True))
```

:--:1

```python
@openapi.parameter("Authorization", str, "header")
```

```python
@openapi.parameter("thing", required=True, allowEmptyValue=False)
```

:---

:::

:::tab response

**引数**

`Responce`オブジェクトを使用する場合は、他の引数を渡してはいけません。

| フィールド         | 型                          |
| ------------- | -------------------------- |
| `status`      | **int**                    |
| `content`     | ***型*, *ユーザー定義モデル*, dict** |
| `description` | **str**                    |
| `response`    | **Response**               |

**例**

---:1

```python
@openapi.response(200, str, "stringを返すエンドポイントです")
```

```python
@openapi.response(200, {"text/plain": str}, "...")
```

```python
@openapi.response(response=Response(UserProfile, description="..."))
```

```python
@openapi.response(
    response=Response(
        {
            "application/json": UserProfile,
        },
        description="...",
        status=201,
    )
)
```

:--:1

```python
@openapi.response(200, UserProfile, "...")
```

```python
@openapi.response(
    200,
    {
        "application/json": UserProfile,
    },
    "説明...",
)
```

:---

:::

:::tab summary

**引数**

| フィールド  | 型       |
| ------ | ------- |
| `text` | **str** |

**例**

---:1

```python
@openapi.summary("これはエンドポイントです")
```

:--:1

:---

:::

:::tab tag

**引数**

| フィールド   | 型            |
| ------- | ------------ |
| `*args` | **str, Tag** |

**例**

---:1

```python
@openapi.tag("foo")
```

:--:1

```python
@openapi.tag("foo", Tag("bar"))
```

:---

:::

:::tab secured

**引数**

| フィールド             | 型                       |
| ----------------- | ----------------------- |
| `*args, **kwargs` | **str, Dict[str, Any]** |

**例**

---:1
```python
@openapi.secured()
```
:--:1 :---

---:1
```python
@openapi.secured("foo")
```
:--:1
```python
@openapi.secured("token1", "token2")
```
:---

---:1
```python
@openapi.secured({"my_api_key": []})
```
:--:1
```python
@openapi.secured(my_api_key=[])
```
:---

`add_security_scheme` を使用することを忘れないでください。 詳細は [セキュリティ](./security.md) を参照してください。

:::

::::

::: new NEW in v22.9
## Integration with Pydantic

Pydantic models have the ability to [generate OpenAPI schema](https://pydantic-docs.helpmanual.io/usage/schema/).

---:1 To take advantage of Pydantic model schema generation, pass the output in place of the schema. :--:1
```python
from sanic import Sanic, json
from sanic_ext import validate, openapi
from pydantic import BaseModel, Field

class Test(BaseModel):
    foo: str = Field(description="Foo Description", example="FOOO")
    bar: str = "test"


app = Sanic("test")

@app.get("/")
@openapi.definition(
    body={'application/json': Test.schema()},
)
@validate(json=Test)
async def get(request):
    return json({})
```
:---

:::
