# Sanicの実行

Sanicには、独自の内部Webサーバが付属しています。 ほとんどの状況では、これがデプロイメントに適した方法です。 さらに、Sanicは、ASGI対応ウェブサーバーにバンドルされたASGIアプリとして、またはgunicornを使用してデプロイすることもできます。

## Sanicサーバー

`sanic.Sanic`の場合、次のキーワード引数を使用してrunメソッドを呼び出すことができます。

|   Parameter    |    Default     | Description                                  |
|:--------------:|:--------------:|:-------------------------------------------- |
|    **host**    | `"127.0.0.1"`  | サーバーをホストするアドレス。                              |
|    **port**    |     `8000`     | サーバをホストするポート。                                |
|    **unix**    |     `None`     | サーバをホストするUnixソケット名 (TCPではありません)              |
|   **debug**    |    `False`     | デバッグ出力をイネーブルにします (サーバの速度が低下します)              |
|    **ssl**     |     `None`     | workersのSSL暗号化のためのSSLContext。                |
|    **sock**    |     `None`     | サーバーがからの接続を受け入れるためのソケット。                     |
|  **workers**   |      `1`       | 作成するworkersもしくはprocessの数                     |
|    **loop**    |     `None`     | 非同期互換イベントループ。 何も指定しないのであれば、独自のイベントループが作成されます |
|  **protocol**  | `HttpProtocol` | asyncio.protocolのサブクラス。                      |
| **access_log** |     `True`     | 要求の処理でログオンを有効にします (サーバの処理速度が大幅に低下します) 。      |

---:1

上記の例では、パフォーマンスを向上させるためにアクセスログをオフにしました。

:--:1

```python
# server.py
app = Sanic("My App")
app.run(host='0.0.0.0', port=1337, access_log=False)
```

:---

---:1

`app.run(...)`を持つPythonスクリプトを実行します。

:--:1

```bash
python server.py
```

:---

### Workers

---:1 デフォルトでは、Sanicは1つのCPUコアだけを使用してメインプロセスをリッスンします。 具体的には、run引数にworkersの数を指定します。 :--:1 :--:1
```python
app.run(host='0.0.0.0', port=1337, workers=4)
```
:---

Sanicは自動的に複数のプロセスを起動し、それらの間でトラフィックをルーティングする。 使用可能なプロセッサと同じ数のworkersを推奨します。

CPUの性能を最大限に引き出す最も簡単な方法は、 `fast` オプションを使用することです。 これは、システムの制約を考慮して、自動的に最大数のワーカーを実行します。 :--:1 :--:1
```python
app.run(host='0.0.0.0', port=1337, fast=True)
```
```python
$ sanic server:app --host=0.0.0.0 --port=1337 --fast
```
:---

古いバージョンのSanicで `fast` オプションがない場合、LinuxベースのOSでよくある確認方法を試してみてください。

```
$ nproc
```

Or, let Python do it:

```python
import multiprocessing
workers = multiprocessing.cpu_count()
app.run(..., workers=workers)
```

### viaコマンドの実行

#### Sanic CLI

---:1 コマンドラインから起動できるシンプルなCLIも用意されています。

たとえば、`server.py`という名前のファイルでアプリケーションとしてSanicを初期化した場合、次のようにサーバを実行できます。 :--:1
```bash
sanic server.app --host=0.0.0.0 --port=1337 --workers=4
```

:---

すべてのオプションを表示するには、`sanic --help`を使用します。

```text
$ sanic --help
usage: sanic [-h] [--version] [--factory] [-s] [-H HOST] [-p PORT] [-u UNIX] [--cert CERT] [--key KEY] [--tls DIR] [--tls-strict-host]
             [-w WORKERS | --fast] [--access-logs | --no-access-logs] [--debug] [-d] [-r] [-R PATH] [--motd | --no-motd] [-v]
             [--noisy-exceptions | --no-noisy-exceptions]
             module

  ▄███ █████ ██      ▄█▄      ██       █   █   ▄██████████
  ██                 █   █     █ ██     █   █  ██
   ▀███████ ███▄    ▀     █    █   ██   ▄   █  ██
               ██  █████████   █     ██ █   █  ▄▄
  ████ ████████▀  █         █  █       ██   █   ▀██ ███████

 To start running a Sanic application, provide a path to the module, where
 app is a Sanic() instance:

     $ sanic path.to.server:app

 Or, a path to a callable that returns a Sanic() instance:

     $ sanic path.to.factory:create_app --factory

 Or, a path to a directory to run as a simple HTTP server:

     $ sanic ./path/to/static --simple

Required
========
  Positional:
    module                         Path to your Sanic app. Example: path.to.server:app
                                   If running a Simple Server, path to directory to serve. Example: ./

Optional
========
  General:
    -h, --help                     show this help message and exit
    --version                      show program's version number and exit

  Application:
    --factory                      Treat app as an application factory, i.e. a () -> <Sanic app> callable
    -s, --simple                   Run Sanic as a Simple Server, and serve the contents of a directory
                                   (module arg should be a path)

  Socket binding:
    -H HOST, --host HOST           Host address [default 127.0.0.1]
    -p PORT, --port PORT           Port to serve on [default 8000]
    -u UNIX, --unix UNIX           location of unix socket

  TLS certificate:
    --cert CERT                    Location of fullchain.pem, bundle.crt or equivalent
    --key KEY                      Location of privkey.pem or equivalent .key file
    --tls DIR                      TLS certificate folder with fullchain.pem and privkey.pem
                                   May be specified multiple times to choose multiple certificates
    --tls-strict-host              Only allow clients that send an SNI matching server certs

  Worker:
    -w WORKERS, --workers WORKERS  Number of worker processes [default 1]
    --fast                         Set the number of workers to max allowed
    --access-logs                  Display access logs
    --no-access-logs               No display access logs

  Development:
    --debug                        Run the server in debug mode
    -d, --dev                      Currently is an alias for --debug. But starting in v22.3, 
                                   --debug will no longer automatically trigger auto_restart. 
                                   However, --dev will continue, effectively making it the 
                                   same as debug + auto_reload.
    -r, --reload, --auto-reload    Watch source directory for file changes and reload on changes
    -R PATH, --reload-dir PATH     Extra directories to watch and reload on changes

  Output:
    --motd                         Show the startup display
    --no-motd                      No show the startup display
    -v, --verbosity                Control logging noise, eg. -vv or --verbosity=2 [default 0]
    --noisy-exceptions             Output stack traces for all exceptions
    --no-noisy-exceptions          No output stack traces for all exceptions
```

#### モジュールとして

---:1 モジュールとして直接呼び出すこともできます。 :--:1 :--:1
```bash
python -m sanic server.app --host=0.0.0.0 --port=1337 --workers=4
```
:---

::: tip FYI どちらの方法(CLIまたはモジュール)でも、Pythonファイルの`app.run()`を*呼び出さない*でください。 もしも実行する場合は、インタプリタによって直接実行される場合にのみ実行されるようにラップしてください。

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337, workers=4)
```
:::


### Sanicシンプルサーバー

---:1 提供する必要がある静的ファイルのディレクトリだけがある場合もあります。 これは特に、localhostサーバーを素早く立ち上げる場合に便利です。 SanicにはSimple Serverが付属しており、ディレクトリを指定するだけです。 :--:1 :--:1
```bash
sanic ./path/to/dir --simple
```
:---

---:1 自動リロードと組み合わせることもできます。 :--:1 :--:1
```bash
sanic ./path/to/dir --simple --reload --reload-dir=./path/to/dir
```
:---


::: new NEW in v21.12 ---:1

### HTTP/3


Sanic server offers HTTP/3 support using [aioquic](https://github.com/aiortc/aioquic). This **must** be installed to use HTTP/3:

```
daphne myapp:app
uvicorn myapp:app
hypercorn myapp:app
```

```
pip install sanic[http3]
```

ASGIを使用する際には、次の点に注意してください。

---:1
```
$ sanic path.to.server:app --http=3
```

```
$ sanic path.to.server:app -3
```
:--:1

```python
app.run(version=3)
```
:---

To run both an HTTP/3 and HTTP/1.1 server simultaneously, you can use [application multi-serve](../release-notes/v22.3.html#application-multi-serve) introduced in v22.3. This will automatically add an [Alt-Svc](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Alt-Svc) header to your HTTP/1.1 requests to let the client know that it is also available as HTTP/3.


---:1
```
$ sanic path.to.server:app --http=3 --http=1
```

```
$ sanic path.to.server:app -3 -1
```
:--:1

```python
app.prepre(version=3)
app.prepre(version=1)
Sanic.serve()
```
:---

Because HTTP/3 requires TLS, you cannot start a HTTP/3 server without a TLS certificate. You should [set it up yourself](../how-to/tls.html) or use `mkcert` if in `DEBUG` mode. Currently, automatic TLS setup for HTTP/3 is not compatible with `trustme`. See [development](./development.md) for more details.

:::

## ASGI

SanicもASGIに準拠しています。 つまり、任意のASGI Webサーバを使用してSanicを実行できます。 ASGIの3つの主要な実装は、[Daphne](http://github.com/django/daphne),[Uvicorn](https://www.uvicorn.org/),と[Hypercorn](https://pgjones.gitlab.io/hypercorn/index.html)です。

::: warning Daphne does not support the ASGI `lifespan` protocol, and therefore cannot be used to run Sanic. See [Issue #264](https://github.com/django/daphne/issues/264) for more details. :::

実行方法は次のようになります。 ※適切な実行方法についてはドキュメントを参照してください。

```
uvicorn myapp:app
hypercorn myapp:app
```

A couple things to note when using ASGI:

1. Sanic Webサーバを使用する場合、websocketsは`websockets`パッケージを使用して実行されますが。 ASGIモードでは、websocketsはASGIサーバで管理されるため、このパッケージは必要ありません。
2. ASGIライフスパンプロトコルは、スタートアップとシャットダウンの2つのサーバイベントだけをサポートします。 Sanicには、起動前、起動後、シャットダウン前、シャットダウン後の4つがあります。 したがって、ASGIモードでは、スタートアップイベントとシャットダウンイベントは連続して実行され、実際にはサーバプロセスの開始と終了の前後では実行されません(なぜなら現在、ASGIサーバによって制御されているためです)。 したがって、`after_server_start`および`before_server_stop`を使用することをお薦めします。

### Trio

SanicはTrio上での実行を実験的にサポートしています。

```
hypercorn -k trio myapp:app
```


## Gunicorn

[Gunicorn](http://gunicorn.org/)("Green Unicorn")は、UNIXベースのオペレーティング・システム用のWSGI HTTP Serverです。 これはRubyのUnicornプロジェクトから移植されたフォーク前のworkerモデルです。

GunicornでSanicアプリケーションを実行するには、特殊な`sanic.worker.GunicornWorker`を実行する必要があります:

```bash
gunicorn myapp:app --bind 0.0.0.0:1337 --worker-class sanic.worker.GunicornWorker
```

アプリケーションでメモリリークが発生した場合、Gunicornを設定して、指定した数のリクエストを処理したあとでワーカーを正常に再起動できます。 これは、メモリリークの影響を制限するのに役立つ便利な方法です。

詳細については、[Gunicorn Docs](http://docs.gunicorn.org/en/latest/settings.html#max-requests) を参照してください。

::: warning `gunicorn`経由でSanicを実行すると、`async/await`のパフォーマンス上の利点の多くを失うことになります。 Weigh your considerations carefully before making this choice. Gunicornには多くの設定オプションが用意されていますが、Sanicを最速で動作させるには最適な選択肢ではありません。 :::
:::

## パフォーマンスに関する考慮事項

---:1 本番環境で実行する場合は、`debug`を必ずオフにしてください。 :--:1 :--:1
```python
app.run(..., debug=False)
```
:---

---:1 また、`access_log`をオフにすると、Sanicは最も高速に動作します。

それでもアクセスログが必要だが、このパフォーマンス向上を享受したい場合は、[Nginxをプロキシとして](./nginx.md)使用すればアクセスログを処理できます。 Pythonが処理できるものよりもはるかに高速になります。 :--:1 :--:1
```python
app.run(..., access_log=False)
```
:---
