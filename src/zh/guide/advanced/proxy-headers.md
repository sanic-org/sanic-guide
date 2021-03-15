# 代理设置(Proxy configuration)

当使用反向代理时（比如 nginx 等），`request.ip` 的值将会被设置为反向代理的 IP，一般来说就是 `127.0.0.1`。而这通常并不是您希望看到的。

Sanic 可以通过配置来从代理请求的请求头部信息获取客户端的真实的 IP 地址，这个地址会被保存到 `request.remote_addr` 属性中。如果请求头中包含 URL 的完整信息，那同样也可以获取得到。

::: Heads up

如果没有适当的防护措施，一些恶意客户端可能会使用代理头来隐藏自己的 IP。为了避免此类问题，除非明确启用，否则 Sanic 不会使用任何代理头。

:::

---:1

反向代理后的服务必须要设置如下一项或多项 [配置](/zh/guide/deployment/configuration.md)

- `FORWARDED_SECRET`
- `REAL_IP_HEADER`
- `PROXIES_COUNT`

:--:1

```python
app.config.FORWARDED_SECRET = "super-duper-secret"
app.config.REAL_IP_HEADER = "CF-Connecting-IP"
app.config.PROXIES_COUNT = 2
```

:---

## 转发头(Forwarded header)

如果想使用 `转发（Forwarded）` 头，您应该将 `app.config.FORWARDED_SECRET` 秘钥值设置为受信的反向代理服务器已知的秘钥值。这个秘钥会被用于鉴定反向代理服务是否安全。

Sanic 会忽略任何不携带这个秘钥的信息，并且如果不设置秘钥值，就不会去解析请求头。

一旦获取了受信的转发头信息，所有其他的代理相关的头信息都会被忽略，因为该头中已经携带了原始客户端的所有信息。

想要了解关于 `转发（Forwarded）` 头的更多信息，可以查看 [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) 或者 [Nginx](https://www.nginx.com/resources/wiki/start/topics/examples/forwarded/) 上的文章。

## 一些代理相关的请求头(Traditional proxy headers)

### IP 头信息(IP Headers)

当您的代理服务器在某个请求头中携带了客户端 IP，您可以通过设置 Sanic 的 `REAL_IP_HEADER` 来明确这个请求头是什么。

### X-Forwarded-For

这个请求头是一串 IP 地址链，通常包含了一连串的代理 IP 地址。可以通过设置 Sanic 的 `PROXIES_COUNT` 配置变量来确定客户端 IP 地址在该链路中的具体位置。这个值通常应该等于 IP 地址链中 *预期的* IP 数量。

### 其他的 X-headers

如果 Sanic 从以上任意一种方法中获取了客户端的IP地址，那么 URL 的部分将会从以下请求头信息中获取。

- x-forwarded-proto
- x-forwarded-host
- x-forwarded-port
- x-forwarded-path
- x-scheme

## 实例(Examples)

在接下来的例子中，假设所有的请求都是通过下面定义的这个方法：

```python
@app.route("/fwd")
async def forwarded(request):
    return json(
        {
            "remote_addr": request.remote_addr,
            "scheme": request.scheme,
            "server_name": request.server_name,
            "server_port": request.server_port,
            "forwarded": request.forwarded,
        }
    )
```

---:1

---

##### 例一(Example 1)

没有设置 `FORWARDED_SECRET`，那就以 x-headers 中的信息为准

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
```

```bash
$ curl localhost:8000/fwd \
    -H 'Forwarded: for=1.1.1.1, for=injected;host=", for="[::2]";proto=https;host=me.tld;path="/app/";secret=mySecret,for=broken;;secret=b0rked, for=127.0.0.3;scheme=http;port=1234' \
    -H "X-Real-IP: 127.0.0.2" \
    -H "X-Forwarded-For: 127.0.1.1" \
    -H "X-Scheme: ws" \
    -H "Host: local.site" | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "127.0.0.2",
  "scheme": "ws",
  "server_name": "local.site",
  "server_port": 80,
  "forwarded": {
    "for": "127.0.0.2",
    "proto": "ws"
  }
}
```

:---

---

---:1

##### 例二(Example 2)

配置 `FORWARDED_SECRET` 后：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```
```bash
$ curl localhost:8000/fwd \
    -H 'Forwarded: for=1.1.1.1, for=injected;host=", for="[::2]";proto=https;host=me.tld;path="/app/";secret=mySecret, for=broken;;secret=b0rked, for=127.0.0.3;scheme=http;port=1234' \
    -H "X-Real-IP: 127.0.0.2" \
    -H "X-Forwarded-For: 127.0.1.1" \
    -H "X-Scheme: ws" \
    -H "Host: local.site" | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "[::2]",
  "scheme": "https",
  "server_name": "me.tld",
  "server_port": 443,
  "forwarded": {
    "for": "[::2]",
    "proto": "https",
    "host": "me.tld",
    "path": "/app/",
    "secret": "mySecret"
  }
}
```

:---

---

---:1

##### 例三(Example 3)

转发头（Forwarded header）为空时，这时候还是使用 X-headers ：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H "X-Real-IP: 127.0.0.2" \
    -H "X-Forwarded-For: 127.0.1.1" \
    -H "X-Scheme: ws" \
    -H "Host: local.site" | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "127.0.0.2",
  "scheme": "ws",
  "server_name": "local.site",
  "server_port": 80,
  "forwarded": {
    "for": "127.0.0.2",
    "proto": "ws"
  }
}
```

:---

---

---:1

##### 例四(Example 4)

没有请求头但是不包含任何匹配的信息：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H "Forwarded: nomatch" | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "",
  "scheme": "http",
  "server_name": "localhost",
  "server_port": 8000,
  "forwarded": {}
}

```

:---

---

---:1

##### 例五(Example 5)

虽然有转发头（Forwarded header），但是没有对的上的秘钥，还是使用 X-headers 中的值：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H "Forwarded: for=1.1.1.1;secret=x, for=127.0.0.1" \
    -H "X-Real-IP: 127.0.0.2" | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "127.0.0.2",
  "scheme": "http",
  "server_name": "localhost",
  "server_port": 8000,
  "forwarded": {
    "for": "127.0.0.2"
  }
}
```

:---

---

---:1

##### 例六(Example 6)

不同的格式但也满足条件的情况：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H 'Forwarded: Secret="mySecret";For=127.0.0.4;Port=1234' | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "127.0.0.4",
  "scheme": "http",
  "server_name": "localhost",
  "server_port": 1234,
  "forwarded": {
    "secret": "mySecret",
    "for": "127.0.0.4",
    "port": 1234
  }
}
```

:---

---

---:1

##### 例七(Example 7)

测试包含转译字符的（如果你看到有人实现了引号对，请修改这一点）：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H 'Forwarded: for=test;quoted="\,x=x;y=\";secret=mySecret' | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "test",
  "scheme": "http",
  "server_name": "localhost",
  "server_port": 8000,
  "forwarded": {
    "for": "test",
    "quoted": "\\,x=x;y=\\",
    "secret": "mySecret"
  }
}
```

:---

---

---:1

##### 例八(Example 8)

如果出现破坏了格式的信息，情况1：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H 'Forwarded: for=test;secret=mySecret;b0rked;proto=wss;' | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "test",
  "scheme": "http",
  "server_name": "localhost",
  "server_port": 8000,
  "forwarded": {
    "for": "test",
    "secret": "mySecret"
  }
}
```

:---

---

---:1

##### 例九(Example 9)

如果出现破坏了格式的信息，情况2：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H 'Forwarded: for=test;b0rked;secret=mySecret;proto=wss' | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "",
  "scheme": "wss",
  "server_name": "localhost",
  "server_port": 8000,
  "forwarded": {
    "secret": "mySecret",
    "proto": "wss"
  }
}
```

:---

---

---:1

##### 例十(Example 10)

出现意外值不会丢失其他有效信息：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H 'Forwarded: b0rked;secret=mySecret;proto=wss' | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "",
  "scheme": "wss",
  "server_name": "localhost",
  "server_port": 8000,
  "forwarded": {
    "secret": "mySecret",
    "proto": "wss"
  }
}
```

:---

---

---:1

##### 例十一(Example 11)

反转译：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H 'Forwarded: PROTO=WSS;BY="CAFE::8000";FOR=unknown;PORT=X;HOST="A:2";PATH="/With%20Spaces%22Quoted%22/sanicApp?key=val";SECRET=mySecret' | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "",
  "scheme": "wss",
  "server_name": "a",
  "server_port": 2,
  "forwarded": {
    "proto": "wss",
    "by": "[cafe::8000]",
    "host": "a:2",
    "path": "/With Spaces\"Quoted\"/sanicApp?key=val",
    "secret": "mySecret"
  }
}
```

:---

---

---:1

##### 例十二(Example 12)

可以使用 “by” 字段携带密钥：

```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "_proxySecret"
```

```bash
$ curl localhost:8000/fwd \
    -H 'Forwarded: for=1.2.3.4; by=_proxySecret' | jq
```

:--:1

```bash
# curl response
{
  "remote_addr": "1.2.3.4",
  "scheme": "http",
  "server_name": "localhost",
  "server_port": 8000,
  "forwarded": {
    "for": "1.2.3.4",
    "by": "_proxySecret"
  }
}

```

:---
