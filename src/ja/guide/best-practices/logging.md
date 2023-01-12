# Logging

Sanicでは、[Python logging API](https://docs.python.org/3/howto/logging.html)に基づいて、さまざまなタイプのロギング(アクセスログ、エラーログ)を要求に対して実行できます。 新しい設定を作成する場合は、Pythonロギングに関する基本的な知識が必要です。

## クイックスタート

---:1

デフォルト設定を使用する簡単な例を次に示します。 :--:1
```python
from sanic import Sanic
from sanic.log import logger
from sanic.response import text

app = Sanic('logging_example')

@app.route('/')
async def test(request):
    logger.info('Here is your log')
    return text('Hello World!')

if __name__ == "__main__":
  app.run(debug=True, access_log=True)
```
:---

サーバーの実行後、次のようなログが表示されます。
```text
[2021-01-04 15:26:26 +0200] [1929659] [INFO] Goin' Fast @ http://127.0.0.1:8000
[2021-01-04 15:26:26 +0200] [1929659] [INFO] Starting worker [1929659]
```

サーバに要求を送信すると、ログメッセージが出力されます。
```text
[2021-01-04 15:26:28 +0200] [1929659] [INFO] Here is your log
[2021-01-04 15:26:28 +0200] - (sanic.access)[INFO][127.0.0.1:44228]: GET http://localhost:8000/  200 -1
```

## Sanicのログを変える

独自のロギング設定を使用するには、`logging.config.dictConfig`を使用するか、Sanicアプリケーションを初期化するときに`log_config`を渡します。

```python
app = Sanic('logging_example', log_config=LOGGING_CONFIG)

if __name__ == "__main__":
  app.run(access_log=False)
```

::: tip FYI Pythonでのロギングは比較的安価な操作です。 ただし、多数の要求を処理していて、パフォーマンスが懸念される場合は、アクセスログをログアウトする時間が増え、非常にコストがかかります。

これは、 (nginxのような) プロキシの背後にSanicを置き、そこでアクセスログを取る良い機会です。 `access_log`を無効にすると、全体的なパフォーマンスが*大幅に*向上します。

最適な運用パフォーマンスを得るには、`debug`と`access_log`を無効にした状態で、`app.run(debug=False、access_log=False)`でSanicを実行することをお勧めします。 :::

## 構成

Sanicのデフォルトのロギング設定は、`sanic.log。 LOGGING_CONFIG_DEFAULTS`を参照してください。

---:1 sanicで使用されるロガーは3つあり、独自のロギング設定を作成する場合は定義する必要があります。

| **Logger Name** | **Use Case**       |
| --------------- | ------------------ |
| `sanic.root`    | 内部メッセージのログに使用されます。 |
| `sanic.error`   | エラーログの記録に使用されます。   |
| `sanic.access`  | アクセスログの記録に使用されます。  |
 :--:1

:---

### ログのフォーマット

Pythonが提供するデフォルトのパラメータ(`asctime`,`levelname`,`message`)に加えて、SanicはAccess Loggerに追加のパラメータを提供します。

| Log Context Parameter | Parameter Value                      | Datatype |
| --------------------- | ------------------------------------ | -------- |
| `host`                | `request.ip`                         | `str`    |
| `request`             | `request.method + " " + request.url` | `str`    |
| `status`              | `response`                           | `int`    |
| `byte`                | `len(response.body)`                 | `int`    |




デフォルトのアクセスログ形式は次のとおりです。

```text
%(asctime)s - (%(name)s)[%(levelname)s][%(host)s]: %(request)s %(message)s %(status)d %(byte)d
```
