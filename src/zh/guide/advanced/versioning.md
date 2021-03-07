# 版本管理（Versioning）

在URL中前添加版本信息是接口开发中的一种惯例。这样做可以让您在迭代您API功能时，保证旧版本API的兼容性。

添加版本信息就是在URL上添加这样的`/v{version}`前缀。

## 为路由添加版本前缀

---:1

您可以在定义路由时直接传入版本号。
:--:1
```python
# /v1/text
@app.route("/text", version=1)
def handle_request(request):
    return response.text("Hello world! Version 1")

# /v2/text
@app.route("/text", version=2)
def handle_request(request):
    return response.text("Hello world! Version 2")
```
:---

## 为蓝图添加版本前缀

---:1

您也可以在创建蓝图的时候传入版本号，这样蓝图下的所有路由都会拥有该版本号的前缀。
:--:1
```python
bp = Blueprint("test", url_prefix="/foo" version=1)

# /v1/foo/text
@bp.route("/html")
def handle_request(request):
    return response.html("<p>Hello world!</p>")
```
:---

## 为蓝图组添加版本前缀

---:1
您可以在蓝图组中指定版本信息来简化蓝图版本的管理。如果蓝图组内的蓝图在创建时没有指定其他的版本，则将继承蓝图组所指定的版本信息。

当您使用蓝图组来管理管本时，版本的前缀信息会按照以下顺序被自动添加在路由上。

1. 路由上的配置
2. 蓝图上的配置
3. 蓝图组的配置
   
一旦发现在定义路由时指定了版本信息，Sanic将会忽略蓝图和蓝图组中的版本信息。
:--:1
```python
from sanic.blueprints import Blueprint
from sanic.response import json
bp1 = Blueprint(
    name="blueprint-1",
    url_prefix="/bp1",
    version=1.25,
)
bp2 = Blueprint(
    name="blueprint-2",
    url_prefix="/bp2",
)
group = Blueprint.group(
    [bp1, bp2],
    url_prefix="/bp-group",
    version="v2",
)
# GET /v1.25/bp-group/bp1/endpoint-1
@bp1.get("/endpoint-1")
async def handle_endpoint_1_bp1(request):
    return json({"Source": "blueprint-1/endpoint-1"})
# GET /v2/bp-group/bp2/endpoint-2
@bp2.get("/endpoint-1")
async def handle_endpoint_1_bp2(request):
    return json({"Source": "blueprint-2/endpoint-1"})
# GET /v1/bp-group/bp2/endpoint-2
@bp2.get("/endpoint-2", version=1)
async def handle_endpoint_2_bp2(request):
    return json({"Source": "blueprint-2/endpoint-2"})
```
:---