# 構成

## ベーシック


---:1

Sanicは、アプリケーションオブジェクトのconfig属性に設定を保持します。構成オブジェクトは、ドット表記法を使用して、または辞書のように変更できる単なるオブジェクトです。
:--:1
```python
app = Sanic("myapp")
app.config.DB_NAME = "appdb"
app.config["DB_USER"] = "appuser"
```
:---

---:1

また、通常の辞書と同様に`update()`メソッドを使用することもできます。
:--:1
```python
db_settings = {
    'DB_HOST': 'localhost',
    'DB_NAME': 'appdb',
    'DB_USER': 'appuser'
}
app.config.update(db_settings)
```
:---

::: tip 
Sanicでは、設定値には**大文字で名前を付けるのが一般的です**.実際、大文字と小文字を混在させると奇妙な動作をすることがあります。
:::

## 読み込み中

### 環境変数

---:1

`SANIC_`プレフィックスで定義された環境変数は、Sanicの設定に適用されます。たとえば、設定`SANIC_REQUEST_TIMEOUT`はアプリケーションによって自動的にロードされ、`REQUEST_TIMEOUT`構成変数に渡されます。
:--:1
```bash
$ export SANIC_REQUEST_TIMEOUT=10
```
```python
>>> print(app.config.REQUEST_TIMEOUT)
10
```
:---

---:1

起動時にSanicが要求するプレフィクスを変更できます。
:--:1
```bash
$ export MYAPP_REQUEST_TIMEOUT=10
```
```python
>>> app = Sanic(__name__, load_env='MYAPP_')
>>> print(app.config.REQUEST_TIMEOUT)
10
```
:---

---:1

環境変数のロードを完全に無効にすることもできます。
:--:1
```python
app = Sanic(__name__, load_env=False)
```
:---

### Sanic.update_configを使用する

`Sanic`インスタンスには、config:`app.update_config`をロードするための_very_versatileメソッドがあります。ファイル、辞書、クラスなど、あらゆる種類のオブジェクトへのパスを指定できます。

#### From a file

---:1

たとえば、次のような`my_config.py`ファイルがあるとします。
:--:1
```python
# my_config.py
A = 1
B = 2
```
:---

---:1

パスを`app.update_config`に渡すことで、これを構成値としてロードできます。
:--:1
```python
>>> app.update_config("/path/to/my_config.py")
>>> print(app.config.A)
1
```
:---

---:1

このパスはbashスタイルの環境変数も受け付けます。
:--:1
```bash
$ export my_path="/path/to"
```
```python
app.update_config("${my_path}/my_config.py")
```
:---

::: tip 
環境変数は`${environment_variable}`の形式で指定する必要があり、`$environment_variable`は展開されません ("プレーン"テキストとして扱われます) 。
:::
#### 辞書から

---:1

`app.update_config`メソッドは、通常の辞書でも動作します。
:--:1
```python
app.update_config({"A": 1, "B": 2})
```
:---

#### クラスまたはオブジェクトから

---:1

独自の構成クラスを定義して、`app.update_config`
:--:1
```python
class MyConfig:
    A = 1
    B = 2

app.update_config(MyConfig)
```
:---

---:1

インスタンス化も可能です。
:--:1
```python
app.update_config(MyConfig())
```
:---

## 組み込み値


| **Variable**              | **Default**       | **Description**                                                             |
|---------------------------|-------------------|-----------------------------------------------------------------------------|
| ACCESS_LOG                | True              | Disable or enable access log                                                |
| FALLBACK_ERROR_FORMAT     | html              | Format of error response if an exception is not caught and handled          |
| FORWARDED_FOR_HEADER      | X-Forwarded-For   | The name of "X-Forwarded-For" HTTP header that contains client and proxy ip |
| FORWARDED_SECRET          | None              | Used to securely identify a specific proxy server (see below)               |
| GRACEFUL_SHUTDOWN_TIMEOUT | 15.0              | How long to wait to force close non-idle connection (sec)                   |
| KEEP_ALIVE                | True              | Disables keep-alive when False                                              |
| KEEP_ALIVE_TIMEOUT        | 5                 | How long to hold a TCP connection open (sec)                                |
| PROXIES_COUNT             | None              | The number of proxy servers in front of the app (e.g. nginx; see below)     |
| REAL_IP_HEADER            | None              | The name of "X-Real-IP" HTTP header that contains real client ip            |
| REGISTER                  | True              | Whether the app registry should be enabled                                  |
| REQUEST_BUFFER_QUEUE_SIZE | 100               | Request streaming buffer queue size                                         |
| REQUEST_BUFFER_SIZE       | 65536             | Request buffer size before request is paused, default is 64 Kib             |
| REQUEST_ID_HEADER         | X-Request-ID      | The name of "X-Request-ID" HTTP header that contains request/correlation ID |
| REQUEST_MAX_SIZE          | 100000000         | How big a request may be (bytes), default is 100 megabytes                  |
| REQUEST_TIMEOUT           | 60                | How long a request can take to arrive (sec)                                 |
| RESPONSE_TIMEOUT          | 60                | How long a response can take to process (sec)                               |
| WEBSOCKET_MAX_QUEUE       | 32                | Maximum length of the queue that holds incoming messages                    |
| WEBSOCKET_MAX_SIZE        | 2^20              | Maximum size for incoming messages (bytes)                                  |
| WEBSOCKET_PING_INTERVAL   | 20                | A Ping frame is sent every ping_interval seconds.                           |
| WEBSOCKET_PING_TIMEOUT    | 20                | Connection is closed when Pong is not received after ping_timeout seconds   |
| WEBSOCKET_READ_LIMIT      | 2^16              | High-water limit of the buffer for incoming bytes                           |
| WEBSOCKET_WRITE_LIMIT     | 2^16              | High-water limit of the buffer for outgoing bytes                           |

::: tip FYI
ASGIモードの場合、`WEBSOCKET_`値は無視されます。
:::

## Timeouts

### REQUEST_TIMEOUT

A request timeout measures the duration of time between the instant when a new open TCP connection is passed to the
Sanic backend server, and the instant when the whole HTTP request is received. If the time taken exceeds the
`REQUEST_TIMEOUT` value (in seconds), this is considered a Client Error so Sanic generates an `HTTP 408` response
and sends that to the client. Set this parameter's value higher if your clients routinely pass very large request payloads
or upload requests very slowly.

### RESPONSE_TIMEOUT

A response timeout measures the duration of time between the instant the Sanic server passes the HTTP request to the
Sanic App, and the instant a HTTP response is sent to the client. If the time taken exceeds the `RESPONSE_TIMEOUT`
value (in seconds), this is considered a Server Error so Sanic generates an `HTTP 503` response and sends that to the
client. Set this parameter's value higher if your application is likely to have long-running process that delay the
generation of a response.

### KEEP_ALIVE_TIMEOUT

#### What is Keep Alive? And what does the Keep Alive Timeout value do?

`Keep-Alive` is a HTTP feature introduced in `HTTP 1.1`. When sending a HTTP request, the client (usually a web browser application)
can set a `Keep-Alive` header to indicate the http server (Sanic) to not close the TCP connection after it has send the response.
This allows the client to reuse the existing TCP connection to send subsequent HTTP requests, and ensures more efficient
network traffic for both the client and the server.

The `KEEP_ALIVE` config variable is set to `True` in Sanic by default. If you don't need this feature in your application,
set it to `False` to cause all client connections to close immediately after a response is sent, regardless of
the `Keep-Alive` header on the request.

The amount of time the server holds the TCP connection open is decided by the server itself.
In Sanic, that value is configured using the `KEEP_ALIVE_TIMEOUT` value. By default, it is set to 5 seconds.
This is the same default setting as the Apache HTTP server and is a good balance between allowing enough time for
the client to send a new request, and not holding open too many connections at once. Do not exceed 75 seconds unless
you know your clients are using a browser which supports TCP connections held open for that long.

For reference:

* Apache httpd server default keepalive timeout = 5 seconds
* Nginx server default keepalive timeout = 75 seconds
* Nginx performance tuning guidelines uses keepalive = 15 seconds
* IE (5-9) client hard keepalive limit = 60 seconds
* Firefox client hard keepalive limit = 115 seconds
* Opera 11 client hard keepalive limit = 120 seconds
* Chrome 13+ client keepalive limit > 300+ seconds

## Proxy configuration

See [proxy configuration section](/guide/advanced/proxy-headers.md)
