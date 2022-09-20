# Конфигурация прокси

При использовании обратного прокси-сервера (например, nginx), значение `request.ip` будет содержать прокси IP-адрес, как правило, `127.0.0.1`. Чаще всего вы хотите получить **не** это.

Sanic может быть настроен на использование заголовков прокси для определения истинного IP-адреса клиента, доступного как `request.remote_addr`. Полный внешний URL также строится из полей заголовка, _если они имеются_.

::: Подсказка Внимание
Без надлежащих предосторожностей злонамеренный клиент может использовать заголовки прокси для исправления собственного IP. Чтобы избежать подобных проблем, Sanic не использует ни один прокси-сервер, если он явно не включен.
:::

---:1

Сервисы за обратными прокси должны настроить один или несколько из следующих [параметров конфигурации](/guide/deployment/configuration.md):

- `FORWARDED_SECRET`
- `REAL_IP_HEADER`
- `PROXIES_COUNT` :--:1
```python
app.config.FORWARDED_SECRET = "super-duper-secret"
app.config.REAL_IP_HEADER = "CF-Connecting-IP"
app.config.PROXIES_COUNT = 2
```
:---

## Заголовок Forwarded

Чтобы использовать заголовок `Forwarded`, вы должны установить `app.config.FORWARDED_SECRET` на значение, известное доверенному прокси-серверу. Это секретное значение используется для надежной идентификации конкретного прокси-сервера.

Sanic игнорирует любые элементы без секретного ключа, и даже не будет разбирать заголовок, если секретный ключ не установлен.

Все остальные заголовки прокси-сервера игнорируются при обнаружении доверенного переадресационного элемента, так как он уже несет полную информацию о клиенте.

Чтобы узнать больше о заголовке `Forwarded`, прочитайте связанные статьи [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) и [Nginx](https://www.nginx.com/resources/wiki/start/topics/examples/forwarded/).

## Традиционные прокси-заголовки

### Заголовки IP

Когда ваш прокси перенаправляет вам IP-адрес в известном заголовке, с помощью конфигурации `REAL_IP_HEADER` вы можете указать Sanic, что это такое.

### X-Forwarded-For

This header typically contains a chain of IP addresses through each layer of a proxy. Setting `PROXIES_COUNT` tells Sanic how deep to look to get an actual IP address for the client. This value should equal the _expected_ number of IP addresses in the chain.

### Other X-headers

If a client IP is found by one of these methods, Sanic uses the following headers for URL parts:

- x-forwarded-proto
- x-forwarded-host
- x-forwarded-port
- x-forwarded-path
- x-scheme

## Examples

In the following examples, all requests will assume that the endpoint looks like this:
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

##### Example 1
Without configured FORWARDED_SECRET, x-headers should be respected
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

##### Example 2
FORWARDED_SECRET now configured
```python
app.config.PROXIES_COUNT = 1
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.FORWARDED_SECRET = "mySecret"
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

##### Example 3
Empty Forwarded header -> use X-headers
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

##### Example 4
Header present but not matching anything
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

##### Example 5
Forwarded header present but no matching secret -> use X-headers
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

##### Example 6
Different formatting and hitting both ends of the header
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

##### Example 7
Test escapes (modify this if you see anyone implementing quoted-pairs)
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

##### Example 8
Secret insulated by malformed field #1
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

##### Example 9
Secret insulated by malformed field #2
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

##### Example 10
Unexpected termination should not lose existing acceptable values
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

##### Example 11
Field normalization
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

##### Example 12
Using "by" field as secret
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
