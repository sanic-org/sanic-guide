# Configuration

## Basics


---:1

Sanic holds the configuration in the config attribute of the application object. The configuration object is merely an object that can be modified either using dot-notation or like a dictionary.
:--:1
```python
app = Sanic("myapp")
app.config.DB_NAME = "appdb"
app.config["DB_USER"] = "appuser"
```
:---

---:1

You can also use the `update()` method like on regular dictionaries.
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
It is standard practice in Sanic to name your config values in **uppercase letters**. Indeed, you may experience weird behaviors if you start mixing uppercase and lowercase names.
:::

## Loading

### Environment variables

---:1

Any environment variables defined with the `SANIC_` prefix will be applied to the Sanic config. For example, setting `SANIC_REQUEST_TIMEOUT` will be loaded by the application automatically and fed into the `REQUEST_TIMEOUT` config variable.
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

You can change the prefix that Sanic is expecting at startup.
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

You can also disable environment variable loading completely.
:--:1
```python
app = Sanic(__name__, load_env=False)
```
:---

### Using Sanic.update_config

The `Sanic` instance has a _very_ versatile method for loading config: `app.update_config`. You can feed it a path to a file, a dictionary, a class, or just about any other sort of object.

#### From a file

---:1

Let's say you have `my_config.py` file that looks like this.
:--:1
```python
# my_config.py
A = 1
B = 2
```
:---

---:1

You can load this as config values by passing its path to `app.update_config`.
:--:1
```python
>>> app.update_config("/path/to/my_config.py")
>>> print(app.config.A)
1
```
:---

---:1

This path also accepts bash style environment variables.
:--:1
```bash
$ export my_path="/path/to"
```
```python
app.update_config("${my_path}/my_config.py")
```
:---

::: tip 
Just remember that you have to provide environment variables in the format `${environment_variable}` and that `$environment_variable` is not expanded (is treated as "plain" text).
:::
#### From a dict

---:1

The `app.update_config` method also works on plain dictionaries.
:--:1
```python
app.update_config({"A": 1, "B": 2})
```
:---

#### From a class or object

---:1

You can define your own config class, and pass it to `app.update_config`
:--:1
```python
class MyConfig:
    A = 1
    B = 2

app.update_config(MyConfig)
```
:---

---:1

It even could be instantiated.
:--:1
```python
app.update_config(MyConfig())
```
:---

## Builtin values


| **Variable**              | **Default**       | **Description**                                                             |
|---------------------------|-------------------|-----------------------------------------------------------------------------|
| REQUEST_MAX_SIZE          | 100000000         | How big a request may be (bytes)                                            |
| REQUEST_BUFFER_QUEUE_SIZE | 100               | Request streaming buffer queue size                                         |
| REQUEST_TIMEOUT           | 60                | How long a request can take to arrive (sec)                                 |
| RESPONSE_TIMEOUT          | 60                | How long a response can take to process (sec)                               |
| KEEP_ALIVE                | True              | Disables keep-alive when False                                              |
| KEEP_ALIVE_TIMEOUT        | 5                 | How long to hold a TCP connection open (sec)                                |
| WEBSOCKET_MAX_SIZE        | 2^20              | Maximum size for incoming messages (bytes)                                  |
| WEBSOCKET_MAX_QUEUE       | 32                | Maximum length of the queue that holds incoming messages                    |
| WEBSOCKET_READ_LIMIT      | 2^16              | High-water limit of the buffer for incoming bytes                           |
| WEBSOCKET_WRITE_LIMIT     | 2^16              | High-water limit of the buffer for outgoing bytes                           |
| WEBSOCKET_PING_INTERVAL   | 20                | A Ping frame is sent every ping_interval seconds.                           |
| WEBSOCKET_PING_TIMEOUT    | 20                | Connection is closed when Pong is not received after ping_timeout seconds   |
| GRACEFUL_SHUTDOWN_TIMEOUT | 15.0              | How long to wait to force close non-idle connection (sec)                   |
| ACCESS_LOG                | True              | Disable or enable access log                                                |
| FORWARDED_SECRET          | None              | Used to securely identify a specific proxy server (see below)               |
| PROXIES_COUNT             | None              | The number of proxy servers in front of the app (e.g. nginx; see below)     |
| FORWARDED_FOR_HEADER      | X-Forwarded-For   | The name of "X-Forwarded-For" HTTP header that contains client and proxy ip |
| REAL_IP_HEADER            | None              | The name of "X-Real-IP" HTTP header that contains real client ip            |

::: tip FYI
The `WEBSOCKET_` values will be ignored if in ASGI mode.
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
