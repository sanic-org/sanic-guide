# スタートアップ

Sanic Extensionsは、SCOが開発し、保守している*公式サポート*のプラグインです。このプロジェクトの主な目的は、Web API と Web アプリケーションの開発を容易にするための追加機能を提供することです。

## 機能

- 自動で`HEAD`、`OPTIONS`、`TRACE`エンドポイントを作成
- CORSによる保護
- あらかじめ定義されたエンドポイント固有のレスポンスシリアライザー
- ルートハンドラへの引数挿入
- RedocやSwaggerを使ったOpenAPIドキュメンテーション
- リクエストのクエリ引数とボディ入力のバリデーション

## 最低要件

- **Python**: 3.8+
- **Sanic**: 21.9+

## インストール

```bash
pip install sanic-ext
```

## アプリケーションを拡張

---:1

Sanic Extensionsは詳細な設定不要で、多くの機能を有効にしてくれます。最も簡単な方法は、`Extend`をインスタンス化することです。

[Sanic入門ページ](../../guide/getting-started.md) のHello, worldアプリを見返してみると、ここで追加したのはハイライトした2行だけであることがわかると思います。

アプリケーションを実行すると、[http://localhost:8000/docs](http://localhost:8000/docs) でOpenAPIのドキュメントが表示され、機能の一部を確認することができるようになります。

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
