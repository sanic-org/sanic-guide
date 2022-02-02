# 版本管理(Versioning)

在 URL 中前添加版本信息是接口开发中的一种惯例。这样做可以让您在迭代您 API 功能时，保证旧版本 API 的兼容性。

添加版本信息就是在 URL 上添加这样的 `/v{version}` 前缀。

version 可以是 `int`，`float` 或 `str` 类型。下列值都为有效值：

- `1`，`2`，`3`
- `1.1`，`2.25`，`3.0`
- `"1"`，`"v1"`，`"v1.1"`

## 为路由添加版本前缀(Per route)

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

## 为蓝图添加版本前缀(Per Blueprint)

---:1

您也可以在创建蓝图的时候传入版本号，这样蓝图下的所有路由都会拥有该版本号的前缀。

:--:1

```python
bp = Blueprint("test", url_prefix="/foo", version=1)


# /v1/foo/html
@bp.route("/html")
def handle_request(request):
    return response.html("<p>Hello world!</p>")
```

:---

## 为蓝图组添加版本前缀(Per Blueprint Group)

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

## 版本前缀(Version prefix)

如上所述，路由的 `version` 参数 **总是** 会再在生成的 URI 路径最前面添加版本信息。为了在版本信息之前还能够增加其他路径信息，在接受 `version` 参数的函数中，您也可以传递 `version_prefix`
参数。

`version_prefix` 参数可以这么使用：

- 使用 `app.route` 和 `bp.route` 装饰器（以及所有其他装饰器）时
- 创建 `Blueprint` 对象时
- 调用 `Blueprint.group` 函数时
- 创建 `BlueprintGroup` 对象时
- 使用 `app.blueprint` 注册蓝图

如果在多个地方都有定义该参数了。根据上述列表顺序（从上至下），更加具体的定义将覆盖比之宽泛的定义。

`version_prefix` 的默认值时 `/v`。

---:1

一个常见的场景就是在 `/api` 的前置后再添加 API 的版本信息。使用 `version_prefix` 可以轻松实现。

:--:1

```python
# /v1/my/path
app.route("/my/path", version=1, version_prefix="/api/v")
```

:---

---:1

也许更好用法是将所有的 `/api` 开头路由添加到同一个 `BlueprintGroup` 中。

:--:1

```python
# /v1/my/path
app = Sanic(__name__)
v2ip = Blueprint("v2ip", url_prefix="/ip", version=2)
api = Blueprint.group(v2ip, version_prefix="/api/version")


# /api/version2/ip
@v2ip.get("/")
async def handler(request):
    return text(request.ip)


app.blueprint(api)
```

:---

URI 拼接的规则如下：

```
version_prefix + version + url_prefix + URI definition
```

::: tip

就像 `url_prefix` 一样，您也可以在 `version_prefix` 中定义路径参数。这样做完全没问题。只要记住，每个路由对应的响应函数都会被传入该参数。

```python
version_prefix = "/<foo:str>/v"
```
