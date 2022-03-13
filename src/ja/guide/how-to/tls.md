# TLS/SSL/HTTPS

> HTTPS経由でSanicを実行するにはどうすればよいですか?

---:1
[`ssl`モジュール] (https://docs.python.org/3/library/ssl.html) を使用してコンテキストを作成し、Sanicに渡すことができます。
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
Or, you can just pass your key and certificate file paths in a dictionary:
:--:1
```python
ssl = {"cert": "/path/to/cert", "key": "/path/to/keyfile"}
app.run(host="0.0.0.0", port=8443, ssl=ssl)
```
:---

> How do I redirect HTTP to HTTPS?

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
