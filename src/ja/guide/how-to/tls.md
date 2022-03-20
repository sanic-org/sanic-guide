# TLS/SSL/HTTPS

> HTTPS経由でSanicを実行するにはどうすればよいですか?

TLS証明書がない場合は、[このページの最後を参照](./tls.md#get-certificates-for-your-domain-names)してください。

## 単一ドメイン、単一証明書

---:1
Sanicに証明書ファイルを自動的に読み込ませます。証明書ファイルは、指定されたフォルダーに `fullchain.pem` と `privkey.pem` という名前で格納する必要があります。

:--:1
```sh
sudo sanic myserver:app -H :: -p 443 \
  --tls /etc/letsencrypt/live/example.com/
```
```python
app.run("::", 443, ssl="/etc/letsencrypt/live/example.com/")
```
:---
 
---:1
または、certとkeyのファイル名を別々に辞書として渡すことも可能です。

さらに、鍵が暗号化されている場合は `password` を追加することができ、パスワード以外のすべてのフィールドは `request.conn_info.cert` に渡されます。
:--:1
```python
ssl = {
    "cert": "/path/to/fullchain.pem",
    "key": "/path/to/privkey.pem",
    "password": "for encrypted privkey file",   # Optional
}
app.run(host="0.0.0.0", port=8443, ssl=ssl)
```
:---

---:1
また、どの暗号アルゴリズムが許可されるかなどの詳細を完全に制御したい場合は、[`ssl.SSLContext`](https://docs.python.org/3/library/ssl.html)を渡すこともできます。デフォルトでは、Sanicは安全なアルゴリズムのみを許可しており、非常に古いデバイスからのアクセスを制限する可能性があります。
:--:1
```python
import ssl

context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain("certs/fullchain.pem", "certs/privkey.pem")

app.run(host="0.0.0.0", port=8443, ssl=context)
```
:---


## 複数のドメインで別々の証明書を使用

---:1
複数の証明書のリストが提供されることがあり、その場合、Sanicはユーザーが接続しているホスト名に一致する証明書を選択する。これはTLSハンドシェイクの初期に発生するため、Sanicはまだクライアントにパケットを送信していません。

クライアントがSNI（サーバー名表示）を送信しない場合、クライアントブラウザ上では名前の不一致によるTLSエラーで失敗する可能性が高いにもかかわらず、リストの最初の証明書が使用されることになります。このフォールバックを防ぎ、既知のホスト名を持たないクライアントを直ちに切断するには、リストの最初のエントリとして `None` を追加してください。`tls-strict-host` は同等のCLIオプションです。

::: tip
また、適切なDNS名ではなくIPアドレスに接続する人に対して、あなたの証明書、真のホスト名、サイトのコンテンツを明らかにしたくない場合は、単一の証明書の前に`None`を使用することができます。
:::

:--:1
```python
ssl = ["certs/example.com/", "certs/bigcorp.test/"]
app.run(host="0.0.0.0", port=8443, ssl=ssl)
```
```sh
sanic myserver:app
    --tls certs/example.com/
    --tls certs/bigcorp.test/
    --tls-strict-host
```
:---

---:1
リスト上で辞書を使用することができます。これにより、証明書がどのドメインに一致するかを指定することもできますが、証明書自体に存在する名前をここから制御することはできません。名前が指定されない場合、証明書自体の名前が使用されます。

メインドメイン **example.com** と **bigcorp.test** のサブドメインへの接続のみを許可する場合。

:--:1
```python
ssl = [
    None,  # No fallback if names do not match!
    {
        "cert": "certs/example.com/fullchain.pem",
        "key": "certs/example.com/privkey.pem",
        "names": ["example.com", "*.bigcorp.test"],
    }
]
app.run(host="0.0.0.0", port=8443, ssl=ssl)
```
:---

## ハンドラの TLS 情報に `request.conn_info` フィールドでアクセスする

* `.ssl` - 接続は安全か (bool)
* `.cert` - 現在アクティブな証明書の証明書情報およびdictフィールド (dict)
* `.server_name` - クライアントが送信した SNI (文字列、空白の場合もある)

すべての `conn_info` フィールドは、時間経過とともに多くのリクエストが発生する可能性のある接続ごとにあることに注意してください。サーバーの前でプロキシを使用している場合、同じパイプにあるこれらのリクエストは異なるユーザーからのものである可能性さえあります。

## HTTP を HTTPS にリダイレクトし、証明書のリクエストは HTTP のままにする

通常の HTTPS サーバに加えて、リダイレクト用のサーバ `http_redir.py` を起動します。
```python
from sanic import Sanic, exceptions, response

app = Sanic("http_redir")

# Serve ACME/certbot files without HTTPS, for certificate renewals
app.static("/.well-known", "/var/www/.well-known", resource_type="dir")

@app.exception(exceptions.NotFound, exceptions.MethodNotSupported)
def redirect_everything_else(request, exception):
    server, path = request.server_name, request.path
    if server and path.startswith("/"):
        return response.redirect(f"https://{server}{path}", status=308)
    return response.text("Bad Request. Please use HTTPS!", status=400)
```

HTTPS サーバーとは別の systemd ユニットとしてセットアップするのがベストです。HTTPS サーバはまだ実行できませんが、証明書を要求する間は HTTP を実行する必要があるかもしれません。IPv4 と IPv6 で起動します。
```
sanic http_redir:app -H 0.0.0.0 -p 80
sanic http_redir:app -H :: -p 80
```

また、メインアプリケーションからHTTPリダイレクトアプリケーションを実行することも可能です。

```python
# app == Your main application
# redirect == Your http_redir application
@app.before_server_start
async def start(app, _):
    app.ctx.redirect = await redirect.create_server(
        port=80, return_asyncio_server=True
    )
    app.add_task(runner(redirect, app.ctx.redirect))


@app.before_server_stop
async def stop(app, _):
    await app.ctx.redirect.close()


async def runner(app, app_server):
    app.is_running = True
    try:
        app.signalize()
        app.finalize()
        await app_server.serve_forever()
    finally:
        app.is_running = False
        app.is_stopping = True
```

## ドメイン名用の証明書を取得する

[Let's Encrypt](https://letsencrypt.org/)から無料で証明書を取得することができます。パッケージマネージャで[certbot](https://certbot.eff.org/)をインストールし、証明書を要求してください。

```sh
sudo certbot certonly --key-type ecdsa --preferred-chain "ISRG Root X1" -d example.com -d www.example.com
```

複数のドメイン名を `-d` 引数で追加することができ、すべて1つの証明書に保存され、ここでリストした **最初のドメイン** に従って `/etc/letsencrypt/live/example.com/` に保存されます。

鍵の種類と優先するチェーンのオプションは、最小限のサイズの証明書ファイルを取得するために必要で、サーバーを*できるだけ速く*動作させるために不可欠なものです。Let's Encrypt が新しい EC チェーンをすべての主要なブラウザで信頼されるようになるまで、チェーンにはまだ 1 つの RSA 証明書が含まれます（おそらく 2023 年頃）。
