# 構成

## ベーシック


---:1

Sanicは、アプリケーションオブジェクトのconfig属性に設定を保持します。 構成オブジェクトは、ドット表記法を使用して、または辞書のように変更できる単なるオブジェクトです。 :--:1
```python
app = Sanic("myapp")
app.config.DB_NAME = "appdb"
app.config["DB_USER"] = "appuser"
```
:---

---:1

また、通常の辞書と同様に`update()`メソッドを使用することもできます。 :--:1
```python
db_settings = {
    'DB_HOST': 'localhost',
    'DB_NAME': 'appdb',
    'DB_USER': 'appuser'
}
app.config.update(db_settings)
```
:---

::: tip Sanicでは、設定値には**大文字で名前を付ける**のが一般的です。実際、大文字と小文字を混在させると奇妙な動作をすることがあります。 確かに、大文字と小文字の名前を混ぜ始めると、奇妙な動作が発生することがあります。 :::

## 読み込み中

### 環境変数

---:1

`SANIC_`プレフィックスで定義された環境変数は、Sanicの設定に適用されます。 たとえば、設定`SANIC_REQUEST_TIMEOUT`はアプリケーションによって自動的にロードされ、`REQUEST_TIMEOUT`構成変数に渡されます。 :--:1
```bash
$ export SANIC_REQUEST_TIMEOUT=10
```
```python
>>> print(app.config.REQUEST_TIMEOUT)
10
```
:---

---:1

起動時にSanicが要求するプレフィクスを変更できます。 :--:1
```bash
$ export MYAPP_REQUEST_TIMEOUT=10
```
```python
>>> app = Sanic(__name__, env_prefix='MYAPP_')
>>> print(app.config.REQUEST_TIMEOUT)
10
```
:---

---:1

環境変数のロードを完全に無効にすることもできます。 :--:1
```python
app = Sanic(__name__, load_env=False)
```
:---

### Sanic.update_configを使用する

`Sanic`インスタンスには、config:`app.update_config`をロードするための_very_versatileメソッドがあります。 ファイル、辞書、クラスなど、あらゆる種類のオブジェクトへのパスを指定できます。

#### ファイルから

---:1

たとえば、次のような`my_config.py`ファイルがあるとします。 :--:1
```python
# my_config.py
A = 1
B = 2
```
:---

---:1

パスを`app.update_config`に渡すことで、これを構成値としてロードできます。 :--:1
```python
>>> app.update_config("/path/to/my_config.py")
>>> print(app.config.A)
1
```
:---

---:1

このパスはbashスタイルの環境変数も受け付けます。 :--:1
```bash
$ export my_path="/path/to"
```
```python
app.update_config("${my_path}/my_config.py")
```
:---

::: tip 環境変数は`${environment_variable}`の形式で指定する必要があり、`$environment_variable`は展開されません ("プレーン"テキストとして扱われます) 。 :::
#### 辞書から

---:1

`app.update_config`メソッドは、通常の辞書でも動作します。 :--:1
```python
app.update_config({"A": 1, "B": 2})
```
:---

#### クラスまたはオブジェクトから

---:1

独自の構成クラスを定義して、`app.update_config`に渡すこともできます。 :--:1
```python
class MyConfig:
    A = 1
    B = 2

app.update_config(MyConfig)
```
:---

---:1

インスタンス化することもできます。 :--:1
```python
app.update_config(MyConfig())
```
:---

### 型キャスティング

環境変数から読み込む場合、Sanicは値を期待されるPythonの型にキャストしようとします。 これは特に以下に当てはまります。

- `int`
- `float`
- `bool`

`bool` に関しては、以下のような大文字小文字を区別しない値を使用することができます。

- **`True`**: `y`, `yes`, `yep`, `yup`, `t`, `true`, `on`, `enable`, `enabled`, `1`
- **`False`**: `n`, `no`, `f`, `false`, `off`, `disable`, `disabled`, `0`

If a value cannot be cast, it will default to a `str`.

---:1 さらに、Sanicは追加のタイプコンバータを使用して、追加の型をキャストするように設定することができます。 これは、値を返すか、`ValueError`を発生させる任意のcallableでなければならない。

*Added in v21.12* :--:1
```python
app = Sanic(..., config=Config(converters=[UUID]))
```
:---

## 組み込み値


| **変数**                      | **デフォルト**       | **説明**                                                                                                  |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| ACCESS_LOG                  | True            | アクセスログを無効または有効にする。                                                                                      |
| AUTO_EXTEND                 | True            | [Sanic Extensions](../../plugins/sanic-ext/getting-started.md) が既存の仮想環境内にある場合にロードするかどうかを制御する            |
| AUTO_RELOAD                 | True            | ファイルが変更されたときにアプリケーションが自動的にリロードするかどうかを制御します。                                                             |
| EVENT_AUTOREGISTER          | True            | `True` のとき、存在しないシグナルに対して `app.event()` メソッドを使用すると、自動的にシグナルを生成して例外を発生させないEVENT_AUTOREGISTER.index.index. |
| FALLBACK_ERROR_FORMAT     | html            | 例外が発生し処理されなかった場合のエラー応答のフォーマット                                                                           |
| FORWARDED_FOR_HEADER      | X-Forwarded-For | クライアントとプロキシのIPを含む「X-Forwarded-For」HTTPヘッダの名前です。                                                         |
| FORWARDED_SECRET            | None            | 特定のプロキシサーバーを安全に識別するために使用される（下記参照）                                                                       |
| GRACEFUL_SHUTDOWN_TIMEOUT | 15.0            | アイドルでない接続を強制終了するまでの時間(秒)                                                                                |
| INSPECTOR                   | False           | Whether to enable the Inspector                                                                         |
| INSPECTOR_HOST              | localhost       | The host for the Inspector                                                                              |
| INSPECTOR_PORT              | 6457            | The port for the Inspector                                                                              |
| INSPECTOR_TLS_KEY         | -               | The TLS key for the Inspector                                                                           |
| INSPECTOR_TLS_CERT        | -               | The TLS certificate for the Inspector                                                                   |
| INSPECTOR_API_KEY         | -               | The API key for the Inspector                                                                           |
| KEEP_ALIVE_TIMEOUT        | 5               | TCP接続を開いたままにする時間(秒)                                                                                     |
| KEEP_ALIVE                  | True            | Falseの場合、キープアライブを無効にする。                                                                                 |
| MOTD                        | True            | 起動時にMOTD（今日のメッセージ）を表示するかどうか                                                                             |
| MOTD_DISPLAY                | {}              | MOTDに任意のデータを追加表示するためのキー/バリュー・ペア                                                                         |
| NOISY_EXCEPTIONS            | False           | すべての `quiet` 例外を強制的にログに記録する                                                                             |
| PROXIES_COUNT               | None            | アプリの前にあるプロキシサーバーの数(例：nginx)                                                                             |
| REAL_IP_HEADER            | None            | 本当のクライアントIPを含む「X-Real-IP」HTTPヘッダーの名前 | REAL_IP_HEADER | なし                                            |
| REGISTER                    | True            | アプリのレジストリを有効にするかどうか。                                                                                    |
| REQUEST_BUFFER_SIZE       | 65536           | リクエストが一時停止するまでのリクエストバッファサイズ、デフォルトは64Kib                                                                 |
| REQUEST_ID_HEADER         | X-Request-ID    | リクエスト/相関 ID を含む HTTP ヘッダー "X-Request-ID" の名前                                                            |
| REQUEST_MAX_SIZE          | 100000000       | リクエストの大きさ (バイト)、デフォルトは100メガバイトです。                                                                       |
| REQUEST_TIMEOUT             | 60              | リクエストが到着するまでの時間(秒)です。                                                                                   |
| RESPONSE_TIMEOUT            | 60              | レスポンス処理にかかる時間(秒)です。                                                                                     |
| USE_UVLOOP                  | True            | ループポリシーをオーバーライドして `uvloop` を使用するかどうかを指定します。 `app.run`でのみサポートされる。                                        |
| WEBSOCKET_MAX_SIZE        | 2^20            | 受信メッセージの最大サイズ (バイト)                                                                                     |
| WEBSOCKET_PING_INTERVAL   | 20              | Pingフレームはping_interval秒ごとに送信されます。                                                                       |
| WEBSOCKET_PING_TIMEOUT    | 20              | ping_timeout秒後にPongを受信しない場合、接続を終了します。                                                                   |

::: tip FYI
- `USE_UVLOOP` の値は、Gunicorn で実行されている場合、無視されます。 サポートされていないプラットフォーム (Windows) では、デフォルトは `False` である。
- ASGI モードでは `WEBSOCKET_` 値は無視されます。 :::
- v21.12 added: `AUTO_EXTEND`, `MOTD`, `MOTD_DISPLAY`, `NOISY_EXCEPTIONS`
- v22.9 added: `INSPECTOR`
- v22.12 added: `INSPECTOR_HOST`, `INSPECTOR_PORT`, `INSPECTOR_TLS_KEY`, `INSPECTOR_TLS_CERT`, `INSPECTOR_API_KEY` :::

## タイムアウト

### REQUEST_TIMEOUT

要求タイムアウトは、新しいオープンTCP接続がSanicバックエンドサーバーに渡された瞬間と、HTTP要求全体を受信した瞬間の間の時間を測定します。 もし時間が `REQUEST_TIMEOUT` 値（秒）を超えたら、これはクライアントエラーとみなされ、Sanicは `HTTP 408` 応答を生成してクライアントに送信する。 クライアントが日常的に非常に大きなリクエストペイロードを渡したり、リクエストを非常にゆっくりとアップロードする場合は、このパラメータの値を高く設定してください。

### RESPONSE_TIMEOUT

レスポンスタイムアウトは、SanicサーバーがSanicアプリにHTTPリクエストを渡した瞬間から、HTTPレスポンスがクライアントに送信されるまでの時間を測定します。 時間が `RESPONSE_TIMEOUT` 値 (秒) を超えると、サーバーエラーと見なされるため、Sanic は `HTTP 503` 応答を生成してクライアントに送信します。 レスポンスの生成を遅らせるような長時間稼働のプロセスがあるようなアプリケーションでは、このパラメータの値を高く設定してください。

### KEEP_ALIVE_TIMEOUT

#### Keep Alive とは何ですか？ また、キープアライブタイムアウトの値は何をするのでしょうか？

キープアライブとは、HTTP 1.1 で導入された HTTP の機能です。 HTTPリクエストを送信するとき、クライアント(通常はウェブブラウザアプリケーション)は `Keep-Alive` ヘッダを設定して、HTTPサーバ(Sanic)が応答を送信した後もTCP接続を閉じないように指示することができます。 これにより、クライアントは後続のHTTPリクエストを送信するために既存のTCP接続を再利用することができ、クライアントとサーバーの両方にとってより効率的なネットワークトラフィックを確保することができます。

Sanicでは、`KEEP_ALIVE`設定変数がデフォルトで `True` に設定されています。 アプリケーションでこの機能を必要としない場合は、`False`に設定すると、リクエストの `Keep-Alive` ヘッダに関係なく、レスポンスが送信された後にすべてのクライアント接続を直ちに終了するようになります。

サーバーが TCP 接続を開いたままにする時間は、サーバー自身が決定します。 Sanic では、その値は `KEEP_ALIVE_TIMEOUT` 値を使用して設定されます。 デフォルトでは、5秒に設定されています。 これは Apache HTTP サーバーと同じデフォルト設定で、クライアントが新しいリクエストを送信するのに十分な時間を与えることと、一度に多くのコネクションをオープンしないことのバランスが取れています。 クライアントが、その時間だけ開いたままの TCP 接続をサポートするブラウザを使用していることが分かっている場合を除き、75 秒を超えないようにしてください。

参考までに

* Apache httpd サーバーのデフォルトのキープアライブタイムアウト = 5 秒
* Nginxサーバのデフォルトのキープアライブタイムアウトは75秒です。
* Nginx パフォーマンスチューニングガイドラインでは、keepalive = 15 秒を使用しています。
* IE（5-9）クライアントのハードキープアライブ制限 = 60秒
* Firefoxクライアントハードキープアライブ制限=115秒
* Opera 11クライアントハードキープアライブ制限 = 120秒
* Chrome 13+のクライアントキープアライブ制限 > 300秒以上

## プロキシ設定

[プロキシ設定のセクション](/guide/advanced/proxy-headers.md)を参照してください。
