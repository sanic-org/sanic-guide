# テンプレートの使用

Sanic Extensionsは、テンプレートをルートハンドラに簡単に統合するのに役立ちます。


## 依存関係

**現在、 [Jinja](https://github.com/pallets/jinja/) のみサポートしています。**

テンプレートの作成に慣れていない場合は、まず [Jinjaドキュメント](https://jinja.palletsprojects.com/en/3.1.x/) を読んでください。

Sanic Extensionsは、Jinjaが環境にインストールされている場合、自動的にセットアップしてロードします。 したがって、必要なセットアップはJinjaのインストールだけです:

```
pip install Jinja2
```

## ファイルからテンプレートをレンダリングする

3つの方法があります:

1. テンプレートファイルを事前にロードするデコレータを使用する
1. レンダリングされた `HTTPResponse` オブジェクトを返す
1. `LazyResponse` を生成するハイブリッドなパターン

`./templates/foo.html` というファイルがあるとしましょう。

```html
<!DOCTYPE html>
<html lang="en">

    <head>
        <title>僕のwebページ</title>
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

Sanic + Jinjaでどのようにレンダリングできるか見てみましょう。

### Option 1 - as a decorator

---:1 このアプローチの利点は、テンプレートを起動時にあらかじめ定義できることです。 This will mean that less fetching needs to happen in the handler, and should therefore be the fastest option. :--:1
```python
@app.get("/")
@app.ext.template("foo.html")
async def handler(request: Request):
    return {"seq": ["one", "two"]}
```
:---

### Option 2 - as a return object

---:1 This is meant to mimic the `text`, `json`, `html`, `file`, etc pattern of core Sanic. It will allow the most customization to the response object since it has direct control of it. Just like in other `HTTPResponse` objects, you can control headers, cookies, etc. :--:1
```python
from sanic_ext import render

@app.get("/alt")
async def handler(request: Request):
    return await render(
        "foo.html", context={"seq": ["three", "four"]}, status=400
    )
```
:---

### Option 3 - hybrid/lazy

---:1 In this approach, the template is defined up front and not inside the handler (for performance). Then, the `render` function returns a `LazyResponse` that can be used to build a proper `HTTPResponse` inside the decorator. :--:1
```python
from sanic_ext import render

@app.get("/")
@app.ext.template("foo.html")
async def handler(request: Request):
    return await render(context={"seq": ["five", "six"]}, status=400)
```
:---

## Rendering a template from a string

---:1 Sometimes you may want to write (or generate) your template inside of Python code and _not_ read it from an HTML file. In this case, you can still use the `render` function we saw above. Just use `template_source`. :--:1
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

::: tip In this example, we use `textwrap.dedent` to remove the whitespace in the beginning of each line of the multi-line string. It is not necessary, but just a nice touch to keep both the code and the generated source clean. :::

## Development and auto-reload

If auto-reload is turned on, then changes to your template files should trigger a reload of the server.

## Configuration

See `templating_enable_async` and `templating_path_to_templates` in [settings](./configuration.md#settings).
