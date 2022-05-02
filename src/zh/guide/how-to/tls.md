# TLS/SSL/HTTPS

> 我该如何通过 HTTPS 访问 Sanic ？

如果您还没有 TLS 证书，请参照 [本页末尾](./tls.md#get-certificates-for-your-domain-names)

## 单域名和单证书(Single domain and single certificate)

---:1

如果您想让 Sanic 自动加载您的证书文件，您需要将证书文件在指定的文件夹中命名为 `fullchain.pem` 和 `privkey.pem`：

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

或者您可以将证书文件路径和秘钥文件路径作为字典的值传入到运行配置中：

除此之外，如果您的秘钥文件被加密，您还可以选择传入 `password`，除了 `password` 之外的所有参数都将被传递给 `request.conn_info.cert`。

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

或者，如果您需要完全控制诸如允许哪些加密算法之类的细节，可以通过[`ssl` 模块](https://docs.python.org/3/library/ssl.html)。默认情况下，Sanic 只允许安全算法，这可能会限制来自非常旧的设备的访问。

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

## 具有多个证书的域名(Multiple domains with separate certificates)

---:1

有些时候，一个域名可能提供了多种证书，在这种情况下，Sanic 会主动选择和客户端相匹配的证书。该阶段处于 TLS 握手阶段，在该阶段中 Sanic 不会向客户端发送任何数据包。

如果客户端没有发送 SNI(服务器名称指示)，将使用证书列表中的第一个证书，即使在客户端浏览器上它可能会由于名称不匹配而失败，并出现 TLS 错误。为了防止这种回退并使没有已知主机名的客户端立即断开连接，请在列表中添加 `None` 作为第一个条目。

在 CLI 参数中，`-tls-strict-host` 是等效的选项。

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

::: tip 小提示

如果您不希望将您的证书、真实主机名或网站内容透露给任何连接到该 IP 地址的人，而不是正确的 DNS 名称，您也可以在单个证书前面使用 `None`。

:::

---:1

单子上可以用字典。这也允许指定证书匹配的域，尽管不能从这里控制证书上的名称。如果未指定名称，则使用证书本身的名称。

字典也可以的用于证书列表中，您可以通过 `names` 来指定证书需要使用的域。这并不能控制证书上对应的域，只是做了一层额外的控制。如果您未指定证书要使用的域，则将使用证书本身对应的域。

只允许连接到主域 **example.com** 和 **bigcorp.test** 的子域示例:

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

## 通过 `request.conn_info` 访问 TLS 信息(Accessing TLS information in handlers via `request.conn_info` fields)

- `.ssl` - 连接是否安全（布尔类型）
- `.cert` - 当前使用的证书以及证书相关信息（字典类型）
- `.server_name` - 客户端发送的 SNI 类型信息（字符类型，可能为空）

请注意，所有 `conn_info` 字段都是针对每个连接的，其中可能会有许多请求。如果您在服务器前面使用了代理，那么这些请求虽然信息相同，但很有可能来自不同的用户。

## 将证书请求之外的 HTTP 重定向到 HTTPS（Redirect HTTP to HTTPS, with certificate requests still over HTTP）

除了需要运行一个以 HTTPS 启动的应用程序之外，您还需要额外的启动一个额外的应用程序用于重定向：

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

最好通过 systemd 将您的转发应用程序注册为独立于 HTTPS 应用程序的服务。在请求证书时，会将请求发送到到您的 HTTP 服务上，此时 HTTPS 服务并未工作。IPv4 和 IPv6 的启动方式如下：

```
sanic http_redir:app -H 0.0.0.0 -p 80
sanic http_redir:app -H :: -p 80
```

当然，您也可以在 HTTPS 应用程序上运行 HTTP 重定向服务。

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
        app.state.is_started = True
        await app_server.serve_forever()
    finally:
        app.is_running = False
        app.is_stopping = True
```

## 为您的域名获取证书(Get certificates for your domain names)

您可以通过 [Let's Encrypt](https://letsencrypt.org/) 来获取免费的证书。您可以通过包管理器来安装 [certbot](https://certbot.eff.org/) 来请求创建一个证书：

```sh
sudo certbot certonly --key-type ecdsa --preferred-chain "ISRG Root X1" -d example.com -d www.example.com
```
您可以通过 `-d` 参数来指定多个域名，这些域名都将共用一个证书。证书的保存位置在 `/etc/letsencrypt/live/example.com/` 下，与您列出的第一个域名名称相匹配。

The key type and preferred chain options are necessary for getting a minimal size certificate file, essential for making your server run as *fast* as possible. The chain will still contain one RSA certificate until when Let's Encrypt gets their new EC chain trusted in all major browsers, possibly around 2023.

如果你想获取体积最小的证书文件，那么 `秘钥类型` 以及 `首选链` 这两个选项是很有必要的。这有助于让您的服务器更快地进行认证。该链中包含了一个 RSA 证书，直到所有的主流服务器都信任 Let's Encrypt 的新 EC 链，可能在 2023 年左右。

密钥类型和首选链选项对于获取最小大小的证书文件是必需的，对于使您的服务器尽可能*快*地运行是必不可少的。该链仍将包含一个RSA证书，直到Let's Encrypt在所有主流浏览器中信任他们的新EC链，可能在2023年左右。