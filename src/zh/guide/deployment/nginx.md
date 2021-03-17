# Nginx 部署(Nginx Deployment)

## 介绍(Introduction)

尽管 Sanic 可以直接运行在 Internet 中，但是使用代理服务器可能会更好。
例如在 Sanic 服务器之前添加 Nginx 代理服务器。这将有助于在同一台机器上同时提供多个不同的服务。
这样做还可以简单快捷的提供静态文件。包括 SSL 和 HTTP2 等协议也可以在此类代理上轻松实现。

我们将 Sanic 应用部署在本地，监听 `127.0.0.1`，
然后使用 Nginx 代理 `/var/www` 下的静态文件，
最后使用 Nginx 绑定域名 `example.com` 向公网提供服务

## 代理 Sanic(Proxied Sanic app)

被代理的应用应该设置 `FORWARDED_SECRET`（受信任代理的密钥）用于识别真实的客户端 IP 以及其他信息。
这可以有效的防止网络中发送的伪造标头来隐藏其 IP 地址的请求。
您可以设置任意随机字符串，同时，您需要在 Nginx 中进行相同的配置。

```python
from sanic import Sanic
from sanic.response import text

app = Sanic("proxied_example")
app.config.FORWARDED_SECRET = "YOUR SECRET"

@app.get("/")
def index(request):
    # 此处将会显示公网IP
    return text(
        f"{request.remote_addr} connected to {request.url_for('index')}\n"
        f"Forwarded: {request.forwarded}\n"
    )

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, workers=8, access_log=False)
```

将您的代码保存到 `/srv/sanicexample/sanicexample.py`

测试时在终端运行您的应用程序。

## Nigin 配置(Nginx configuration)

允许快速透明代理需要相当多的配置，但是在大多数情况下，这些并不需要修改。

在单独的 `upstream` 模块中配置 `keepalive` 来启用长连接，这可以极大的提高性能，而不是直接在 `server` 中 配置 `proxy_pass`。
在此示例中，`upstream` 命名为 `server_name` 及域名，该名称将通过 Host 标头传递给 Sanic， 您可以按需修改该名称，也可以提供多个服务器以达到负载均衡和故障转移。

将两次出现的 `example.com` 更改为您的域名，然后
将 `YOUR SECRET` 替换为您应用中配置的 `FORWARDED_SECRET`

```nginx
upstream example.com {
    keepalive 100;
    server 127.0.0.1:8000;
    #server unix:/tmp/sanic.sock;
}

server {
    server_name example.com;
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    # Serve static files if found, otherwise proxy to Sanic
    location / {
    root /var/www;
    try_files $uri @sanic;
    }
    location @sanic {
    proxy_pass http://$server_name;
    # Allow fast streaming HTTP/1.1 pipes (keep-alive, unbuffered)
    proxy_http_version 1.1;
    proxy_request_buffering off;
    proxy_buffering off;
    # Proxy forwarding (password configured in app.config.FORWARDED_SECRET)
    proxy_set_header forwarded "$proxy_forwarded;secret=\"YOUR SECRET\"";
    # Allow websockets
    proxy_set_header connection "upgrade";
    proxy_set_header upgrade $http_upgrade;
    }
}
```

为避免 Cookie 可见性问题和搜索引擎上的地址不一致的问题，
您可以使用以下方法将所有的访问都重定向到真实的域名上。
以确保始终为 HTTPS 访问：

```nginx
# Redirect all HTTP to HTTPS with no-WWW
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ~^(?:www\.)?(.*)$;
    return 301 https://$1$request_uri;
}

# Redirect WWW to no-WWW
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ~^www\.(.*)$;
    return 301 $scheme://$1$request_uri;
}
```

上面的配置部分可以放在 `/etc/nginx/sites-available/default` 中或其他网站配置中（如果您创建了新的配置，请务必将它们链接到 `sites-enabled` 中）。

请确保在主配置中配置了您的 SSL 证书，或者向每个 `server` 模块添加 `ssl_certificate` 和 `ssl_certificate_key` 配置来进行 SSL 监听。

除此之外，复制并粘贴以下内容到 `nginx/conf.d/forwarded.conf` 中：

```nginx
# RFC 7239 Forwarded header for Nginx proxy_pass

# Add within your server or location block:
#    proxy_set_header forwarded "$proxy_forwarded;secret=\"YOUR SECRET\"";

# Configure your upstream web server to identify this proxy by that password
# because otherwise anyone on the Internet could spoof these headers and fake
# their real IP address and other information to your service.


# Provide the full proxy chain in $proxy_forwarded
map $proxy_add_forwarded $proxy_forwarded {
    default "$proxy_add_forwarded;by=\"_$hostname\";proto=$scheme;host=\"$http_host\";path=\"$request_uri\"";
}

# The following mappings are based on
# https://www.nginx.com/resources/wiki/start/topics/examples/forwarded/

map $remote_addr $proxy_forwarded_elem {
    # IPv4 addresses can be sent as-is
    ~^[0-9.]+$          "for=$remote_addr";

    # IPv6 addresses need to be bracketed and quoted
    ~^[0-9A-Fa-f:.]+$   "for=\"[$remote_addr]\"";

    # Unix domain socket names cannot be represented in RFC 7239 syntax
    default             "for=unknown";
}

map $http_forwarded $proxy_add_forwarded {
    # If the incoming Forwarded header is syntactically valid, append to it
    "~^(,[ \\t]*)*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*([ \\t]*,([ \\t]*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*)?)*$" "$http_forwarded, $proxy_forwarded_elem";

    # Otherwise, replace it
    default "$proxy_forwarded_elem";
}
```

如果您的 Nginx 不使用 `conf.d` 和 `sites-available`，以上全部配置也可以放在 `nginx.conf` 的 `http` 模块中。

保存修改之后，重新启动 Nginx 服务：

```bash
sudo nginx -s reload
```

现在，您应该可以在 `https://example.com/` 上访问您的应用了。
任何的 404 以及类似的错误都将交由 Sanic 进行处理。
静态文件存储在指定的目录下，将由 Nginx 提供访问。

## SSL 证书(SSL certificates)

如果您尚未在服务器上配置有效证书，您可以安装 `certbot` 和 `python3-certbot-nginx` 以使用免费的 SSL/TLS 证书，然后运行:

```bash
certbot --nginx -d example.com -d www.example.com
```

相关资料请参考：[使用免费的 SSL/TLS 证书](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/)

## 作为服务运行(Running as a service)

这部分是针对基于 `systemd` 的 Linux 发行版。 创建一个文件：`/etc/systemd/system/sanicexample.service` 并写入以下内容：

```text
[Unit]
Description=Sanic Example

[Service]
User=nobody
WorkingDirectory=/srv/sanicexample
ExecStart=/usr/bin/env python3 sanicexample.py
Restart=always

[Install]
WantedBy=multi-user.target
```

之后重新加载服务文件，启动服务并允许开机启动：

```bash
sudo systemctl daemon-reload
sudo systemctl start sanicexample
sudo systemctl enable sanicexample
```
