# Development

まず、Sanicに統合されているウェブサーバは、単なる開発サーバではありません。

デバッグ・モードで*not*であれば、本番環境で使用できます。

## デバッグ・モード

デバッグモードを設定すると、Sanicからより詳細な出力が出力され、Automatic Reloaderがアクティブになります。

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

::: warning
Sanicのデバッグモードは、サーバのパフォーマンスを低下させるため、開発環境でのみ有効にすることをお勧めします。
:::
## 自動的に読み込む

---:1

Sanicでは、Automatic Reloaderを手動で (デバッグモードから独立して) 有効または無効にする方法を提供しています。`auto_reload`引数は、自動リローダーをアクティブまたは非アクティブにします。
:--:1
```python
app.run(auto_reload=True)
```
:---
