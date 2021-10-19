# TLS/SSL/HTTPS

> Get certificates for your domain names

You can get free certificates from [Let's Encrypt](https://letsencrypt.org/). Install [certbot](https://certbot.eff.org/) via your package manager, and request a certificate:

```sh
sudo certbot certonly --key-type ecdsa --preferred-chain "ISRG Root X1" -d example.com -d www.example.com
```

Multiple domain names may be added by further `-d` arguments, all stored into a single certificate which gets saved to `/etc/letsencrypt/live/example.com/` as per **the first domain** that you list here.

The key type and preferred chain options are necessary for getting a minimal size certificate file, essential for making your server run as *fast* as possible. The chain will still contain one RSA certificate until when Let's Encrypt gets their new EC chain trusted in all major browsers, possibly around 2023.

> How do I run Sanic via HTTPS? 

---:1
Let Sanic automatically load your certificate files, which need to be named `fullchain.pem` and `privkey.pem`.

:--:1
```python
app.run(
    host="0.0.0.0", port=443,
    ssl="/etc/letsencrypt/live/example.com/"
)
```
:---

---:1
Or, you can pass cert and key filenames separately as a dictionary:

Additionally, `password` may be added if the key is encrypted, all fields except for the password are passed to `request.conn_info.cert`.
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
Alternatively, [`ssl.SSLContext`](https://docs.python.org/3/library/ssl.html) may be passed, if you need full control over details such as which crypto algorithms are permitted. By default Sanic only permits secure algorithms, which may restrict access from very old devices.
:--:1
```python
import ssl

context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain("certs/fullchain.pem", "certs/privkey.pem")

app.run(host="0.0.0.0", port=8443, ssl=context)
```
:---


> Multiple domains with separate certificates

---:1
A list of multiple certificates may be provided, in which case Sanic chooses the one matching the hostname the user is connecting to. This occurs so early in the TLS handshake that Sanic has not sent any packets to the client yet.

If the client sends no SNI (Server Name Indication), the first certificate on the list will be used even though it will likely fail with an SSL error on the client browser. To prevent this fallback and to cause immediate disconnection of clients without a known hostname, add `None` as the first entry on the list.
:--:1
```python
ssl = ["certs/example.com/", "certs/bigcorp.test/"]
app.run(host="0.0.0.0", port=8443, ssl=ssl)
```
:---

---:1
Dictionaries can be used on the list. This allows also specifying which domains a certificate matches to, although the names present on the certificate itself cannot be controlled from here. If names are not specified, the names from the certificate itself are used.

To only allow connections to the main domain **example.com** and only to subdomains of **bigcorp.test**:

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

> How do I redirect HTTP to HTTPS?

In addition to your normal `app` server running HTTPS, run another server in parallel for redirection:
```python
from sanic import Sanic, response
from multiprocessing import Process

app = Sanic("My App")

@app.get("/<path:path>")
def handler(request, path):
    return response.text(f"Secure connection to {path}")

http = Sanic("HTTP")

@http.get("/<path:path>")
def handler(request, path=""):
    return response.redirect(f"https://{request.server_name}/{path}")

http_server = Process(target=lambda: http.run("0.0.0.0", 80))
http_server.start()
app.run("0.0.0.0", 443, ssl="/etc/letsencrypt/live/example.com")
http_server.join()
```
