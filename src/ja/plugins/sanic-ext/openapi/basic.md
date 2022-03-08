# Basics

::: tip Side note
Sanic ExtensionsのOpenAPI実装は、[`sanic-openapi`](https://github.com/sanic-org/sanic-openapi)のOAS3実装がベースになっています。実際、Sanic Extensionsはそのプロジェクトの後継であり、Sanic Extensionsのリリースと同時にメンテナンスモードに入りました。もしあなたが以前 OAS3 を `sanic-openapi` で使っていたなら、Sanic Extensions にアップグレードするのは簡単なはずです。残念ながら、このプロジェクトは OAS2 仕様をサポートして*いません*。
:::

---:1

Sanic Extensionsは、[v3.0 OpenAPI仕様](https://swagger.io/specification/)を用いて自動生成されたAPIドキュメントをそのまま提供します。必要なのは、Sanic Extensionsをインスタンス化することによって、アプリケーションを`拡張`することだけです。

:--:1

```python
from sanic import Sanic
from sanic_ext import Extend

app = Sanic("MyApp")
Extend(app)
```

:---

これで、既存のアプリケーションに基づいた美しいドキュメントがすでに生成されていることになります:

[http://localhost:8000/docs](http://localhost:8000/docs)


---:1

[Redoc](https://github.com/Redocly/redoc)を使う

![Redoc](~@assets/images/sanic-ext-redoc.png)


:--:1

もしくは[Swagger UI](https://github.com/swagger-api/swagger-ui)

![Swagger UI](~@assets/images/sanic-ext-swagger.png)

:---
