# TLS/SSL/HTTPS

> 我该如何通过 HTTPS 访问 Sanic ？

---:1

您可以通过 [`ssl` 模块](https://docs.python.org/3/library/ssl.html) 创建一个环境（context）并将其传递给 Sanic。

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

或者，您可以通过字典传递您的密钥和证书文件路径:

:--:1

```python
ssl = {"cert": "/path/to/cert", "key": "/path/to/keyfile"}
app.run(host="0.0.0.0", port=8443, ssl=ssl)
```

:---

> 我该如何将 HTTP 请求重定向到 HTTPS ？

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

[点此](https://community.sanicframework.org/t/https-redirection-with-sanic/810) 在论坛中查看更详细的讨论。
