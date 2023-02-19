# 模板

Sanic Extensions 可以轻松地帮助您将模板集成至您的路由响应函数中。


## 依赖

**目前只支持 [Jinja](https://github.com/pallets/jinja/).**

[请先阅读Jinja文档](https://jinja.palletsprojects.com/en/3.1.x/) 如果您不熟悉如何创建模板。

如果您的环境安装了 Jinja，Sanic Extensions 会自动为您设置并加载 Jinja。 因此，您唯一需要做的是安装 Jinja:

```
pip install Jinja2
```

## 从文件渲染模板

有三种办法:

1. 通过装饰器预加载模板
1. 返回一个渲染后的 `HTTPResponse` 对象
1. 用混合模式创建一个 `LazyResponse`

让我们想象您有一个叫 `./templates/foo.html` 的文件:

```html
<!DOCTYPE html>
<html lang="en">

    <head>
        <title>My Webpage</title>
    </head>

    <body>
        <h1>Hello, world!!!!</h1>
        <ul>
            {% for item in seq %}
            <li>{{ item }}</li>
            {% endfor %}
        </ul>
    </body>

</html>
```

让我们看看如何通过Sanic + Jinja渲染它。

### 方法 1 - 使用装饰器

---:1
这种方法的好处是模板可以在启动时被预先定义。这意味着响应函数要提取的东西更少，而且应该因此成为更快的选项。
:--:1
```python
@app.get("/")
@app.ext.template("foo.html")
async def handler(request: Request):
    return {"seq": ["one", "two"]}
```
:---

### 方法 2 - 使用返回对象

---:1
这旨在模仿核心 Sanic 的 `text`，`json`，`html`，`file`，等模式。它允许最大程度地自定义响应对象，因为它对响应有直接的控制就像在其他 `HTTPResponse` 对象，您可以调整 headers, cookies等.
:--:1
```python
from sanic_ext import render

@app.get("/alt")
async def handler(request: Request):
    return await render(
        "foo.html", context={"seq": ["three", "four"]}, status=400
    )
```
:---

### 方法 3 - 混合/懒处理

---:1
在这个方法中，模板被预先，而不是在响应函数中定义（为了性能）。然后， `render` 函数返回一个可以被装饰器转为正常 `HTTPResponse` 的 `LazyResponse` 
:--:1
```python
from sanic_ext import render

@app.get("/")
@app.ext.template("foo.html")
async def handler(request: Request):
    return await render(context={"seq": ["five", "six"]}, status=400)
```
:---

## 从字符串渲染模板

---:1
您有时会想要在Python代码中书写（或生成）您的模板 而 _不是_ 从HTML文件读取。这时，您仍然可以用上面的 `render` 函数。只要使用 `template_source`。
:--:1
```python
from sanic_ext import render
from textwrap import dedent

@app.get("/")
async def handler(request):
    template = dedent("""
        <!DOCTYPE html>
        <html lang="en">

            <head>
                <title>My Webpage</title>
            </head>

            <body>
                <h1>Hello, world!!!!</h1>
                <ul>
                    {% for item in seq %}
                    <li>{{ item }}</li>
                    {% endfor %}
                </ul>
            </body>

        </html>
    """)
    return await render(
        template_source=template,
        context={"seq": ["three", "four"]},
        app=app,
    )
```
:---

::: 小贴士
在这个例子中，我们使用 `textwrap.dedent` 来移除多行字符串中每行开头的空白字符（whitespace）。但这并非必须的，虽然是一个令人愉快的保持生成源和代码整洁的小修饰。
:::

## 开发 和 自动重载

如果auto-reload被打开，对您的模板文件的改变应该触发服务器的一次重载。

## 配置

看 [settings](./configuration.md#settings) 中的 `templating_enable_async` 和 `templating_path_to_templates` 
