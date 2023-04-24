# 基本事項

::: tip Side note
Sanic ExtensionsのOpenAPI実装は、[`sanic-openapi`](https://github.com/sanic-org/sanic-openapi)のOAS3実装がベースになっています。実際、Sanic Extensionsはそのプロジェクトの後継であり、Sanic Extensionsのリリースと同時にメンテナンスモードに入りました。もしあなたが以前 OAS3 を `sanic-openapi` で使っていたなら、Sanic Extensions にアップグレードするのは簡単なはずです。残念ながら、このプロジェクトは OAS2 仕様をサポートして*いません*。
:::

---:1

Sanic Extensionsは、[v3.0 OpenAPI仕様](https://swagger.io/specification/)を用いて自動生成されたAPIドキュメントをそのまま提供します。あなたがする必要のあることはありません。

:--:1

```python
from sanic import Sanic

app = Sanic("MyApp")

# すべてのviewを追加する
```

:---

これで、既存のアプリケーションに基づいた美しいドキュメントがすでに生成されていることになります:

 [http://localhost:8000/docs](http://localhost:8000/docs)
- [http://localhost:8000/docs/redoc](http://localhost:8000/docs/redoc)
- [http://localhost:8000/docs/swagger](http://localhost:8000/docs/swagger)

Checkout the [section on configuration](../configuration.md) to learn about changing the routes for the docs. You can also turn off one of the two UIs, and customize which UI will be available on the `/docs` route.

---:1

[Redoc](https://github.com/Redocly/redoc)を使う

![Redoc](~@assets/images/sanic-ext-redoc.png)


:--:1

もしくは[Swagger UI](https://github.com/swagger-api/swagger-ui)

![Swagger UI](~@assets/images/sanic-ext-swagger.png)


:---

## Changing specification metadata

---:1
If you want to change any of the metada, you should use the `describe` method.

In this example `dedent` is being used with the `description` argument to make multi-line strings a little cleaner. This is not necessary, you can pass any string value here.
:--:1
```python
from textwrap import dedent

app.ext.openapi.describe(
    "Testing API",
    version="1.2.3",
    description=dedent(
        """
        # Info
        This is a description. It is a good place to add some _extra_ doccumentation.

        **MARKDOWN** is supported.
        """
    ),
)
```
:---
