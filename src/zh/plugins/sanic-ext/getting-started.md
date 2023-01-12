# 快速开始（Getting Started）

Sanic Extensions 是一个由 SCO _官方开发和维护的_ 插件。 这个项目的主要目标是为 Sanic 添加额外的功能，以帮助开发人员更轻松地进行网络应用程序开发。

## 特征（Features）

- 能够自动创建 `HEAD`， `OPTIONS`，和 `TRACE` 响应程序
- 具有跨域保护
- 具有内置于指定响应程序的响应序列化器
- 允许进行路由参数的注入
- 完美适配 Redoc 和 Swagger
- 能够对请求参数和请求体进行验证
- Auto create `HEAD`, `OPTIONS`, and `TRACE` endpoints

## 最低要求（Minimum requirements）

- **Python**: 3.8+
- **Sanic**: 21.9+

## 安装（Install）

最好的安装方式就是在安装 Sanic 的同时一并安装 Sanic 拓展：

```bash
pip install sanic[ext]
```

当然，您也可以独立安装 Sanic 拓展：

```bash
pip install sanic-ext
```

## 拓展您的应用程序（Extend your application）

---:1

---:1 To setup Sanic Extensions (v21.12+), you need to do: **nothing**. If it is installed in the environment, it is setup and ready to go.

This code is the Hello, world app in the [Sanic Getting Started page](../../guide/getting-started.md) _without any changes_, but using Sanic Extensions with `sanic-ext` installed in the background. :--:1
```python
from sanic import Sanic
from sanic.response import text

app = Sanic("MyHelloWorldApp")

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

:---

下面这段代码和 [Sanic 快速开始页面](../../guide/getting-started.md) 中的 Hello，World 示例完全一致，没有做任何改动。

:--:1

如果您回看 [Sanic 快速开始](../../guide/getting-started.md) 页面 中的 Hello，world 示例代码，您将看它们之间唯一的区别是多了两行高亮部分的代码。 :--:1

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

在 v21.9 中，最简单的使用方法就是通过 `Extend` 来对其进行一个实例化。
