# 蓝图(Blueprints)

## 概述(Overview)

蓝图是应用中可以作为子路由的对象。 蓝图定义了同样的添加路由的方式，您可以将一系列路由注册到蓝图上而不是直接注册到应用上，然后再以可插拔的方式将蓝图注册到到应用程序。

Blueprints are especially useful for larger applications, where your application logic can be broken down into several groups or areas of responsibility.

## 创建和注册蓝图(Creating and registering)

---:1

首先，您必须先创建一个蓝图。 It has a very similar API as the `Sanic()` app instance with many of the same decorators. :--:1
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

Next, you register it with the app instance. :--:1
```python
from sanic import Sanic
from my_blueprint import bp

app = Sanic(__name__)
app.blueprint(bp)
```
:---

蓝图也提供了 `websocket()` 装饰器和 `add_websocket_route` 方法来实现 websocket 通讯。

---:1

从 v21.12 开始，您可以在向蓝图中添加响应函数之前或之后注册蓝图。 Previously, only objects attached to the Blueprint at the time of registration would be loaded into application instance. :--:1
```python
app.blueprint(bp)

@bp.route("/")
async def bp_root(request):
    ...
```
:---
## 复制蓝图(Copying)

---:1 Blueprints along with everything that is attached to them can be copied to new instances using the `copy()` method. 唯一需要的参数是给它传递一个新的 `name`。 当然，您也可以使用它来覆盖旧蓝图中的任何值。 :--:1
```python
v1 = Blueprint("Version1", version=1)

@v1.route("/something")
def something(request):
    pass

v2 = v1.copy("Version2", version=2)

app.blueprint(v1)
app.blueprint(v2)
```

```
Available routes:
/v1/something
/v2/something

```
:---

*Added in v21.9*

## 蓝图组(Blueprint groups)

蓝图也可以以列表或者元组的形式进行注册，在这种情况下，注册时会递归地遍历当前序列，在序列中或者在子序列中的所有蓝图对象都会被注册到应用上。 `Blueprint.group` 方法允许模拟一个后端目录结构来简化上述问题。 请看这个例子：

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

#### 第一个蓝图(First blueprint)

:--:1
```python
# api/content/authors.py
from sanic import Blueprint

authors = Blueprint("content_authors", url_prefix="/authors")
```
:---

---:1

#### 第二个蓝图(Second blueprint)

:--:1
```python
# api/content/static.py
from sanic import Blueprint

static = Blueprint("content_static", url_prefix="/static")
```
:---

---:1

#### 蓝图组(Blueprint group)

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

#### 第三个蓝图(Third blueprint)

:--:1
```python
# api/info.py
from sanic import Blueprint

info = Blueprint("info", url_prefix="/info")
```
:---

---:1

#### 另一个蓝图组(Another blueprint group)

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

#### 主应用(Main server)

所有的蓝图都会被注册。

:--:1
```python
# app.py
from sanic import Sanic
from .api import api

app = Sanic(__name__)
app.blueprint(api)
```
:---

## 中间件(Middleware)

---:1

Blueprints can also have middleware that is specifically registered for its endpoints only. :--:1
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

同样的，使用蓝图组能够将中间件应用给同组中的所用蓝图。 :--:1
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

## 异常(Exceptions)

---:1

正如 [异常处理](./exceptions.md) 一章所述，您可以定义蓝图特定的异常响应函数。 :--:1
```python
@bp.exception(NotFound)
def ignore_404s(request, exception):
    return text("Yep, I totally found the page: {}".format(request.url))
```
:---

## 静态文件(Static files)

---:1

蓝图也可以单独指定需要代理的静态文件。
```python
bp = Blueprint("bp", url_prefix="/bp")
bp.static("/web/path", "/folder/to/serve")
bp.static("/web/path", "/folder/to/server", name="uploads")
```
:---

---:1

然后文件可以使用 `url_for()` 函数来获取。 详见 [路由](/zh/guide/basics/routing.md) 章节。 :--:1
```python
>>> print(app.url_for("static", name="bp.uploads", filename="file.txt"))
'/bp/web/path/file.txt'
```
:---

## 监听器(Listeners)

---:1

蓝图也可以实现 [监听器](/zh/guide/basics/listeners.md)。 :--:1
```python
@bp.listener("before_server_start")
async def before_server_start(app, loop):
    ...


@bp.listener("after_server_stop")
async def after_server_stop(app, loop):
    ...

@bp.listener("after_server_stop")
async def after_server_stop(app, loop):
    ...
```
:---

## 版本管理(Versioning)

[版本管理](/zh/guide/advanced/versioning.md) 这一章中介绍了如何进行版本管理，蓝图也可以使用该功能来管理不同版本 API。

---:1

`version` 参数会被作为前缀添加到路由上，如 `/v1`，`/v2` 等等。
```python
auth1 = Blueprint("auth", url_prefix="/auth", version=1)
auth2 = Blueprint("auth", url_prefix="/auth", version=2)
```
:---

---:1

当我们将蓝图注册到APP上时，`/v1/auth` 和 `/v2/auth` 路由将指向两个不同的蓝图，这就允许您为每个 API 版本创建子路由。 :--:1
```python
from auth_blueprints import auth1, auth2

app = Sanic(__name__)
app.blueprint(auth1)
app.blueprint(auth2)
```
:---

---:1

It is also possible to group the blueprints under a `BlueprintGroup` entity and version multiple of them together at the same time. :--:1
```python
auth = Blueprint("auth", url_prefix="/auth")
metrics = Blueprint("metrics", url_prefix="/metrics")

group = Blueprint.group(auth, metrics, version="v1")

# This will provide APIS prefixed with the following URL path
# /v1/auth/ and /v1/metrics
```
:---

## 组合(Composable)

A `Blueprint` may be registered to multiple groups, and each of `BlueprintGroup` itself could be registered and nested further. This creates a limitless possibility `Blueprint` composition.

*Added in v21.6* ---:1 Take a look at this example and see how the two handlers are actually mounted as five (5) distinct routes. :--:1
```python
app = Sanic(__name__)
blueprint_1 = Blueprint("blueprint_1", url_prefix="/bp1")
blueprint_2 = Blueprint("blueprint_2", url_prefix="/bp2")
group = Blueprint.group(
    blueprint_1,
    blueprint_2,
    version=1,
    version_prefix="/api/v",
    url_prefix="/grouped",
    strict_slashes=True,
)
primary = Blueprint.group(group, url_prefix="/primary")


@blueprint_1.route("/")
def blueprint_1_default_route(request):
    return text("BP1_OK")


@blueprint_2.route("/")
def blueprint_2_default_route(request):
    return text("BP2_OK")


app.blueprint(group)
app.blueprint(primary)
app.blueprint(blueprint_1)

# The mounted paths:
# /api/v1/grouped/bp1/
# /api/v1/grouped/bp2/
# /api/v1/primary/grouped/bp1
# /api/v1/primary/grouped/bp2
# /bp1

```
:---


## URL 生成(Generating a URL)

当使用 `url_for()` 来生成 URL 时，端点的名称将以以下格式来组织：

```text
{blueprint_name}.{handler_name}
```
