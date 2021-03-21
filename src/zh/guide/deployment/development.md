# 开发历程(Development)

首先要明确的是，集成到 Sanic 中的 Web 服务器不只是一个开发服务器。

只要您没有处于调试模式，它就可以投入生产。

## 调试模式(Debug mode)

通过设置调试模式，Sanic 将会输出更为详细的输出内容，并激活自动重载功能。

```python
from sanic import Sanic
from sanic.response import json

app = Sanic(__name__)

@app.route("/")
async def hello_world(request):
    return json({"hello": "world"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1234, debug=True)
```

::: warning 警告

Sanic 的调试模式会降低服务器的性能，因此建议只在开发环境中启用它。

:::

## 自动重载(Automatic Reloader)

---:1

在调试模式之外，Sanic 还提供了一种手动开关自动重载的方法。`auto_reload` 参数将开启或关闭自动重载功能。

:--:1

```python
app.run(auto_reload=True)
```

:---
