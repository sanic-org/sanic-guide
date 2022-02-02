# 入门（Basics）

::: tip 边注

Sanic 拓展中的 OpenAPI 基于 [sanic-openapi](https://github.com/sanic-org/sanic-openapi) 的 OAS3 规范实现。 事实上，Sanic
拓展在很大程度上是该项目的继承者，该项目将在 Sanic 拓展发布后进入维护模式。 如果您之前使用 `sanic-openapi` 的 OAS3 规范，您应该可以轻松升级到 Sanic 扩展。 遗憾的是，该项目 *不* 支持 OAS2
规范。

:::

---:1

开箱即用，Sanic 拓展使用 [v3.0 OpenAPI 规范](https://swag.io/specification/) 提供自动生成的 API 文档。您唯一需要做地就是将 Sanic 扩展实例化来 `扩展`
您的应用程序。

:--:1

```python
from sanic import Sanic
from sanic_ext import Extend

app = Sanic("MyApp")
Extend(app)
```

:---

完成此操作后，您将得到一份基于现有应用程序生成的精美文档：

[http://localhost:8000/docs](http://localhost:8000/docs)

---:1

使用 [Redoc](https://github.com/Redocly/redoc)

![Redoc](~@assets/images/sanic-ext-redoc.png)

:--:1

或者 [Swagger UI](https://github.com/swagger-api/swagger-ui)

![Swagger UI](~@assets/images/sanic-ext-swagger.png)

:---
