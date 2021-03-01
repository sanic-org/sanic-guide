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
