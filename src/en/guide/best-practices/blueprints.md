# Blueprints

## Overview

Blueprints are objects that can be used for sub-routing within an application. Instead of adding routes to the application instance, blueprints define similar methods for adding routes, which are then registered with the application in a flexible and pluggable manner.

Blueprints are especially useful for larger applications, where your application logic can be broken down into several groups or areas of responsibility.

## Creating and registering

---:1

First, you must create a blueprint. It has a very similar API as the `Sanic()` app instance with many of the same decorators.
:--:1
```python
# ./my_blueprint.py
from sanic.response import json
from sanic import Blueprint

bp = Blueprint("my_blueprint")

@bp.route("/")
async def bp_root(request):
    return json({"my": "blueprint"})
```
:---


---:1

Next, you register it with the app instance.
:--:1
```python
from sanic import Sanic
from my_blueprint import bp

app = Sanic(__name__)
app.blueprint(bp)
```
:---

Blueprints also have the same `websocket()` decorator and `add_websocket_route` method for implementing websockets.

## Blueprint groups

Blueprints may also be registered as part of a list or tuple, where the registrar will recursively cycle through any sub-sequences of blueprints and register them accordingly. The Blueprint.group method is provided to simplify this process, allowing a ‘mock’ backend directory structure mimicking what’s seen from the front end. Consider this (quite contrived) example:

```text
api/
├──content/
│ ├──authors.py
│ ├──static.py
│ └──__init__.py
├──info.py
└──__init__.py
app.py
```

---:1

#### First blueprint

:--:1
```python
# api/content/authors.py
from sanic import Blueprint

authors = Blueprint("content_authors", url_prefix="/authors")
```
:---

---:1

#### Second blueprint

:--:1
```python
# api/content/static.py
from sanic import Blueprint

static = Blueprint("content_static", url_prefix="/static")
```
:---

---:1

#### Blueprint group

:--:1
```python
# api/content/__init__.py
from sanic import Blueprint
from .static import static
from .authors import authors

content = Blueprint.group(static, authors, url_prefix="/content")
```
:---

---:1

#### Third blueprint

:--:1
```python
# api/info.py
from sanic import Blueprint

info = Blueprint("info", url_prefix="/info")
```
:---

---:1

#### Another blueprint group

:--:1
```python
# api/__init__.py
from sanic import Blueprint
from .content import content
from .info import info

api = Blueprint.group(content, info, url_prefix="/api")
```
:---

---:1

#### Main server

All blueprints are now registered

:--:1
```python
# app.py
from sanic import Sanic
from .api import api

app = Sanic(__name__)
app.blueprint(api)
```
:---

## Middleware

---:1

Blueprints can also have middleware that is specifically registered for its endpoints only.
:--:1
```python
@bp.middleware
async def print_on_request(request):
    print("I am a spy")

@bp.middleware("request")
async def halt_request(request):
    return text("I halted the request")

@bp.middleware("response")
async def halt_response(request, response):
    return text("I halted the response")
```
:---

---:1

Similarly, using blueprint groups, it is possible to apply middleware to an entire group of nested blueprints.
:--:1
```python
bp1 = Blueprint("bp1", url_prefix="/bp1")
bp2 = Blueprint("bp2", url_prefix="/bp2")

@bp1.middleware("request")
async def bp1_only_middleware(request):
    print("applied on Blueprint : bp1 Only")

@bp1.route("/")
async def bp1_route(request):
    return text("bp1")

@bp2.route("/<param>")
async def bp2_route(request, param):
    return text(param)

group = Blueprint.group(bp1, bp2)

@group.middleware("request")
async def group_middleware(request):
    print("common middleware applied for both bp1 and bp2")

# Register Blueprint group under the app
app.blueprint(group)
```
:---

## Exceptions

---:1

Just like other [exception handling](./exceptions.md), you can define blueprint specific handlers.
:--:1
```python
@bp.exception(NotFound)
def ignore_404s(request, exception):
    return text("Yep, I totally found the page: {}".format(request.url))
```
:---

## Static files

---:1

Blueprints can also have their own static handlers
:--:1
```python
bp = Blueprint("bp", url_prefix="/bp")
bp.static("/web/path", "/folder/to/serve")
bp.static("/web/path", "/folder/to/server", name="uploads")
```
:---

---:1

Which can then be retrieved using `url_for()`. See [routing](/guide/basics/routing.md) for more information.
:--:1
```python
>>> print(app.url_for("static", name="bp.uploads", filename="file.txt"))
'/bp/web/path/file.txt'
```
:---

## Listeners

---:1

Blueprints can also implement [listeners](/guide/basics/listeners.md).
:--:1
```python
@bp.listener("before_server_start")
async def before_server_start(app, loop):
    ...

@bp.listener("after_server_stop")
async def after_server_stop(app, loop):
    ...
```
:---

## Versioning

As discussed in the [versioning section](/guide/advanced/versioning.md), blueprints can be used to implement different versions of a web API.

---:1

The `version` will be prepended to the routes as `/v1` or `/v2`, etc.
:--:1
```python
auth1 = Blueprint("auth", url_prefix="/auth", version=1)
auth2 = Blueprint("auth", url_prefix="/auth", verison=2)
```
:---

---:1

When we register our blueprints on the app, the routes `/v1/auth` and `/v2/auth` will now point to the individual blueprints, which allows the creation of sub-sites for each API version.
:--:1
```python
from auth_blueprints import auth1, auth2

app = Sanic(__name__)
app.blueprint(auth1)
app.blueprint(auth2)
```
:---

## Generating a URL

When generating a url with `url_for()`, the endpoint name will be in the form:

```text
<blueprint_name>.<handler_name>
```
