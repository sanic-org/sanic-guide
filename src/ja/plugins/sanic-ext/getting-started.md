# スタートアップ

Sanic Extensionsは、SCOが開発し、保守している*公式サポート*のプラグインです。 このプロジェクトの主な目的は、Web API と Web アプリケーションの開発を容易にするための追加機能を提供することです。

## 機能

- 自動で`HEAD`、`OPTIONS`、`TRACE`エンドポイントを作成
- CORSによる保護
- あらかじめ定義されたエンドポイント固有のレスポンスシリアライザー
- ルートハンドラへの引数挿入
- RedocやSwaggerを使ったOpenAPIドキュメンテーション
- リクエストのクエリ引数とボディ入力のバリデーション
- `HEAD`、`OPTIONS`、`TRACE` のエンドポイントの自動作成

## 最低要件

- **Python**: 3.8+
- **Sanic**: 21.9+

## インストール

一番良い方法は、Sanic本体と一緒にSanic Extensionsをインストールするだけです。

```bash
pip install sanic[ext]
```

もちろん、単体でインストールすることも可能です。

```bash
pip install sanic-ext
```

## アプリケーションを拡張

Sanic Extensionsは、特別な操作なしに、たくさんの機能を有効にしてくれます。

::: new v21.12で追加 ---:1 Sanic Extensions (v21.12+) をセットアップするために必要なこと: **何もありません**。 環境でインストールされている場合は、セットアップして実行する準備ができています。

このコードは、[Sanic Getting Started page](../../guide/getting-started.md) にある Hello, world アプリを_何も変更せずに_そのまま使用しています。 :--:1
```python
from sanic import Sanic
from sanic.response import text

app = Sanic("MyHelloWorldApp")

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```
:--- :::

---:1 **_古い非推奨の設定_**

v21.9 では、`Extend` でインスタンス化するのが最も簡単な方法です。

[Sanic Getting Started page](../../guide/getting-started.md) の Hello, world アプリを見返してみると、ここで追加されているのはハイライトした2行だけであることがわかると思います。 :--:1

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

どのように設定されているかに関わらず、これでOpenAPIのドキュメントを閲覧し、機能の一部を確認できるはずです: [http://localhost:8000/docs](http://localhost:8000/docs)
