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

context = ssl.create_default_context(
    purpose=ssl.Purpose.CLIENT_AUTH
)
context.load_cert_chain(
    "/path/to/cert", keyfile="/path/to/keyfile"
)

app.run(host="0.0.0.0", port=8443, ssl=context)
```
:---

---:1
また、鍵や証明書のファイルパスを辞書で渡すだけでもOKです。
:--:1
```python
ssl = {"cert": "/path/to/cert", "key": "/path/to/keyfile"}
app.run(host="0.0.0.0", port=8443, ssl=ssl)
```
:---

> HTTPをHTTPSにリダイレクトするにはどうしたらいいですか？

```python
from sanic import Sanic, response

HTTP_PORT = 80
HTTPS_PORT = 443

app = Sanic("My App")
http = Sanic("HTTP Proxy")

app.config.SERVER_NAME = "example.com"
http.config.SERVER_NAME = "example.com"

@http.get("/<path:path>")
def proxy(request, path):
    url = request.app.url_for(
        "proxy",
        path=path,
        _server=https.config.SERVER_NAME,
        _external=True,
        _scheme="http",
    )
    return response.redirect(url)

@app.before_server_start
async def start(app, _):
    global http
    app.http_server = await http.create_server(
        port=HTTP_PORT, return_asyncio_server=True
    )
    app.http_server.after_start()


@app.before_server_stop
async def stop(app, _):
    app.http_server.before_stop()
    await app.http_server.close()
    app.http_server.after_stop()

ssl = {"cert": "/path/to/cert", "key": "/path/to/keyfile"}
app.run(host="example.com", port=443, ssl=ssl)
```

[forumsを見て](https://community.sanicframework.org/t/https-redirection-with-sanic/810) for more complete discussion
