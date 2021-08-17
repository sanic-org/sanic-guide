# Getting Started

Sanic Extensions is an *officially supported* plugin developed, and maintained by the SCO. The primary goal of this project is to add additional features to help Web API and Web application development easier.

## Features

- Auto create `HEAD`, `OPTIONS`, and `TRACE` endpoints
- CORS protection
- Predefined, endpoint-specific response serializers
- Argument injection into route handlers
- OpenAPI documentation with Redoc and/or Swagger
- Request query arguments and body input validation

## Minimum requirements

- **Python**: 3.7+
- **Sanic**: 21.9+

## Install

```bash
pip install sanic-ext
```

## Extend your application

---:1

Out of the box, Sanic Extensions will enable a bunch of features for you. The easiest way to get started is just to instantiate it with `Extend`.

If you look back at the Hello, world app in the [Sanic Getting Started page](../../guide/getting-started.md), you will see the only additions here are the two highlighted lines.

After running your application, you should now be able to view the OpenAPI documentation and see some of the functionality in action: [http://localhost:8000/docs](http://localhost:8000/docs).

:--:1

```python{3,6}
from sanic import Sanic
from sanic.response import text
from sanic_ext import Extend

app = Sanic("MyHelloWorldApp")
Extend(app)

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

:---
