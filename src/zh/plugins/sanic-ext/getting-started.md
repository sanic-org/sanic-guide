# 快速开始（Getting Started）

Sanic Extensions 是一个由 SCO *官方开发和维护的* 插件。这个项目的主要目标是为 Sanic 添加额外的功能，以帮助开发人员更轻松地进行网络应用程序开发。

## 特征（Features）

- 能够自动创建 `HEAD`， `OPTIONS`，和 `TRACE` 响应程序
- 具有跨域保护
- 具有内置于指定响应程序的响应序列化器
- 允许进行路由参数的注入
- 完美适配 Redoc 和 Swagger
- 能够对请求参数和请求体进行验证

## 最低要求（Minimum requirements）

- **Python**: 3.7+
- **Sanic**: 21.9+

## 安装（Install）

```bash
pip install sanic-ext
```

## 拓展你的应用程序（Extend your application）

---:1

开箱即用，Sanic 扩展将为您拓展一系列功能。最简单的使用方法就是将对应的 `拓展功能` 进行实例化。

如果您回看 [Sanic 快速开始页面](../../guide/getting-started.md) 中的Hello，world 示例代码，您将看它们之间唯一的区别是多了两行高亮部分的代码。

运行应用程序之后，您现在已经能够通过 [http://localhost:8000/docs](http://localhost:8000/docs) 打开 OpenAPI 文档，并在其中看到可以访问路由。

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
