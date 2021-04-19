# TLS/SSL/HTTPS

> How do I run Sanic via HTTPS? 

---:1
You can use the [`ssl` module](https://docs.python.org/3/library/ssl.html) to create a context and pass it to Sanic
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

app = Sanic("My App")
http = Sanic("HTTP Proxy")

@http.get("/<path:path>")
def proxy(request, path):
    url = request.url.replace('http://', 'https://')    
    return response.redirect(url)

@app.before_server_start
async def start(app, _):
    app.ctx.http_server = await http.create_server(port=80, return_asyncio_server=True)
    app.ctx.http_server.after_start()

@app.before_server_stop
async def stop(app, _):
    app.ctx.http_server.before_stop()
    await app.ctx.http_server.close()
    app.ctx.http_server.after_stop()
    
if __name__ == '__main__':
    ssl = {"cert": "/path/to/cert", "key": "/path/to/keyfile"}
    app.run(host="0.0.0.0", port=443, ssl=ssl)
```

[See forums](https://community.sanicframework.org/t/https-redirection-with-sanic/810) for more complete discussion
