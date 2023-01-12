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

### 方法1 - デコレータ

---:1 このアプローチの利点は、テンプレートを起動時にあらかじめ定義できることです。 これは、ハンドラで起こるフェッチがより少ないことを意味し、したがって最速の方法になります。 :--:1
```python
@app.get("/")
@app.ext.template("foo.html")
async def handler(request: Request):
    return {"seq": ["one", "two"]}
```
:---

### 方法2 - 戻り値オブジェクト

---:1 これは、コアSanicの`text`、`json`、`html`、`file`などのパターンを模倣することを意味します。 直接制御しているので、レスポンスオブジェクトに最も深いカスタマイズを可能にします。 他の `HTTPResponse` オブジェクトと同じように、ヘッダー、クッキーなどを制御できます。 :--:1
```python
from sanic_ext import render

@app.get("/alt")
async def handler(request: Request):
    return await render(
        "foo.html", context={"seq": ["three", "four"]}, status=400
    )
```
:---

### 方法3 - ハイブリッド/遅延型

---:1 このアプローチでは、テンプレートはハンドラ内ではなく、前面に定義されます(パフォーマンスのため)。 次に、 `render` 関数は、デコレータ内で適切な `HTTPResponse` を構築するために使用できる `LazyResponse` を返します。 :--:1
```python
from sanic_ext import render

@app.get("/")
@app.ext.template("foo.html")
async def handler(request: Request):
    return await render(context={"seq": ["five", "six"]}, status=400)
```
:---

## 文字列からテンプレートをレンダリングする

---:1 HTMLファイルから_読み取らない_で、Pythonコードの中でテンプレートを書きたい(もしくは生成したい)ことがあります。 この場合でも、上記の `render` 関数を使用することができます。 `template_source` を使用するだけです。 :--:1
```python
from sanic_ext import render
from textwrap import dedent

@app.get("/")
async def handler(request):
    template = dedent("""
        <!DOCTYPE html>
        <html lang="en">

            <head>
                <title>僕のWebページ</title>
            </head>

            <body>
                <h1>こんにちは、世界!!!!</h1>
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

::: tip この例では、 `textwrap.dedent` を使用して、マルチライン文字列の各行の先頭の空白を削除します。 必要ではありませんが、コードと生成されたソースの両方をきれいに保つためにちょうどいいタッチです。 :::

## 開発とオートリロード

オートリロードがオンになっている場合、テンプレートファイルへの変更によりサーバーの再読み込みが実行されます。

## 設定

`templating_enable_async` および `templating_path_to_templates` を [設定](./configuration.md#settings) で参照してください。
