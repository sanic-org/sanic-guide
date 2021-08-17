# Basics

::: tip Side note
The OpenAPI implementation in Sanic Extensions is based upon the OAS3 implementation from [`sanic-openapi`](https://github.com/sanic-org/sanic-openapi). In fact, Sanic Extensions is in a large way the successor to that project, which entered maintenance mode upon the release of Sanic Extensions. If you were previously using OAS3 with `sanic-openapi` you should have an easy path to upgrading to Sanic Extensions. Unfortunately, this project does *NOT* support the OAS2 specification.
:::

---:1

Out of the box, Sanic Extensions provides automatically generated API documentation using the [v3.0 OpenAPI specification](https://swagger.io/specification/). The only thing that you need to do is `Extend` your application by instantiating Sanic Extensions.

:--:1

```python
from sanic import Sanic
from sanic_ext import Extend

app = Sanic("MyApp")
Extend(app)
```

:---

After doing this, you will now have beautiful documentation already generated for you based upon your existing application:

[http://localhost:8000/docs](http://localhost:8000/docs)


---:1

Using [Redoc](https://github.com/Redocly/redoc)

![Redoc](~@assets/images/sanic-ext-redoc.png)


:--:1

or [Swagger UI](https://github.com/swagger-api/swagger-ui)

![Swagger UI](~@assets/images/sanic-ext-swagger.png)

:---
