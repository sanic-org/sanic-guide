# 入门（Basics）

Sanic 拓展中的 OpenAPI 基于 [sanic-openapi](https://github.com/sanic-org/sanic-openapi) 的 OAS3 规范实现。 事实上，Sanic 拓展在很大程度上是该项目的继承者，该项目将在 Sanic 拓展发布后进入维护模式。 如果您之前使用 `sanic-openapi` 的 OAS3 规范，您应该可以轻松升级到 Sanic 扩展。 遗憾的是，该项目 *不* 支持 OAS2 规范。 :::

---:1

开箱即用，Sanic 拓展使用 [v3.0 OpenAPI 规范](https://swag.io/specification/) 提供自动生成的 API 文档。 There is nothing special that you need to do

:--:1

```python
from sanic import Sanic
from sanic_ext import Extend

app = Sanic("MyApp")
Extend(app)
```

:---

完成此操作后，您将得到一份基于现有应用程序生成的精美文档：

- [http://localhost:8000/docs](http://localhost:8000/docs)
- [使用 [Redoc](https://github.com/Redocly/redoc)](http://localhost:8000/docs/redoc)
- [或者 [Swagger UI](https://github.com/swagger-api/swagger-ui)](http://localhost:8000/docs/swagger)

Checkout the [section on configuration](../configuration.md) to learn about changing the routes for the docs. You can also turn off one of the two UIs, and customize which UI will be available on the `/docs` route.

---:1

Using [Redoc](https://github.com/Redocly/redoc)

![Redoc](~@assets/images/sanic-ext-redoc.png)


:--:1

or [Swagger UI](https://github.com/swagger-api/swagger-ui)

![Swagger UI](~@assets/images/sanic-ext-swagger.png)


:---

## Changing specification metadata

---:1 If you want to change any of the metada, you should use the `describe` method.

In this example `dedent` is being used with the `description` argument to make multi-line strings a little cleaner. This is not necessary, you can pass any string value here. :--:1
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
