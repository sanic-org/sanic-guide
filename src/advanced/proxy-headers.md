Proxy configuration
When you use a reverse proxy server (e.g. nginx), the value of request.ip will contain ip of a proxy, typically 127.0.0.1. Sanic may be configured to use proxy headers for determining the true client IP, available as request.remote_addr. The full external URL is also constructed from header fields if available.

Without proper precautions, a malicious client may use proxy headers to spoof its own IP. To avoid such issues, Sanic does not use any proxy headers unless explicitly enabled.

Services behind reverse proxies must configure FORWARDED_SECRET, REAL_IP_HEADER and/or PROXIES_COUNT.

Forwarded header
Set FORWARDED_SECRET to an identifier used by the proxy of interest.

The secret is used to securely identify a specific proxy server. Given the above header, secret Pr0xy would use the information on the first line and secret _1234proxy would use the second line. The secret must exactly match the value of secret or by. A secret in by must begin with an underscore and use only characters specified in RFC 7239 section 6.3, while secret has no such restrictions.

Sanic ignores any elements without the secret key, and will not even parse the header if no secret is set.

All other proxy headers are ignored once a trusted forwarded element is found, as it already carries complete information about the client.

Traditional proxy headers
Set REAL_IP_HEADER to x-real-ip, true-client-ip, cf-connecting-ip or other name of such header.

Set PROXIES_COUNT to the number of entries expected in x-forwarded-for (name configurable via FORWARDED_FOR_HEADER).

If client IP is found by one of these methods, Sanic uses the following headers for URL parts:

x-forwarded-proto, x-forwarded-host, x-forwarded-port, x-forwarded-path and if necessary, x-scheme.

Proxy config if using …
a proxy that supports forwarded: set FORWARDED_SECRET to the value that the proxy inserts in the header
Apache Traffic Server: CONFIG proxy.config.http.insert_forwarded STRING for|proto|host|by=_secret

NGHTTPX: nghttpx –add-forwarded=for,proto,host,by –forwarded-for=ip –forwarded-by=_secret

NGINX: Nginx Deployment.

a custom header with client IP: set REAL_IP_HEADER to the name of that header

x-forwarded-for: set PROXIES_COUNT to 1 for a single proxy, or a greater number to allow Sanic to select the correct IP

no proxies: no configuration required!


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
<!-- panels:start -->

<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->
