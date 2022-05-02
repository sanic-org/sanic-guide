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

---:1

如果您有额外的目录想要在文件保存时自动重新加载(例如，HTML 模板的目录)，您可以在运行时添加它。

:--:1

```python
app.run(auto_reload=True, reload_dir="/path/to/templates")
# or multiple directories
app.run(auto_reload=True, reload_dir=["/path/to/one", "/path/to/two"])
```

:---

## 两全其美(Best of both worlds)

::: new v22.3 新特征

---:1

如果您想在调试模式中使用自动重载功能，您可以设置 `dev=True`，这相当于您开启了 **调试模式 + 自动重载**

:--:1

```python
app.run(dev=True)
```

:---

:::

## 客户端(CLI)

值得注意的是，所有这些在 Sanic CLI 中都有对应的内容:

```
  Development:
    --debug                        在调试模式下运行服务器。它包括调试日志、关于异常的附加上下文，
                                   以及对生产不安全但有助于调试问题的其他设置。
    -r, --reload, --auto-reload    监听文件的修改，并在修改时重新加载
    -R PATH, --reload-dir PATH     更改时需要监听和重新加载的额外目录
    -d, --dev                      调试模式 + 自动重载
```
