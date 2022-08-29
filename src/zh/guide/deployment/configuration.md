# 配置(Configuration)

## 基础(Basics)


---:1

Sanic 会将配置保存在应用程序对象的 Config 属性中，它是一个可以通过字典的形式或者属性的形式进行操作的对象。 The configuration object is merely an object that can be modified either using dot-notation or like a dictionary. :--:1
```python
app = Sanic("myapp")
app.config.DB_NAME = "appdb"
app.config["DB_USER"] = "appuser"
```
:---

---:1

因此，您也可以使用 `update()` 方法来更新配置。 :--:1
```python
db_settings = {
    'DB_HOST': 'localhost',
    'DB_NAME': 'appdb',
    'DB_USER': 'appuser'
}
app.config.update(db_settings)
```
:---

在 Sanic 中， 标准做法是使用 **大写字母** 来命名您的配置名称，如果您将大写名称和小写名称混合使用，可能会导致某些配置无法正常读取，遇到无法解释的状况。 Indeed, you may experience weird behaviors if you start mixing uppercase and lowercase names. :::

## 配置加载(Loading)

### 环境变量(Environment variables)

---:1

任何使用 `SANIC_` 作为前缀的环境变量都会被加载并应用于 Sanic 配置。 例如：在环境变量中设置 `SANIC_REQUEST_TIMEOUT` 环境变量后，将会被应用程序自动加载，并传递到 `REQUEST_TIMEOUT` 配置变量中。 :--:1
```bash
$ export SANIC_REQUEST_TIMEOUT=10
```
```python
>>> print(app.config.REQUEST_TIMEOUT)
10
```
:---

---:1

You can change the prefix that Sanic is expecting at startup. :--:1
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

同样，您可以完全禁用环境变量的加载。 :--:1
```python
app = Sanic(__name__, load_env=False)
```
:---

### 使用通用方法加载(Using Sanic.update_config)

`Sanic` 中有一种通用的方法用于加载配置：`app.update_config` 。 您可以通过向它提供文件路径、字典、类或者几乎任何其他种类的对象的路径来更新配置。

#### 通过文件加载（From a file）

---:1

假设您有一个名为 `my_config.py` 的文件，它的内容如下： :--:1
```python
# my_config.py
A = 1
B = 2
```
:---

---:1

您可以通过将文件路径传递给 `app.update_config` 进行配置加载。 :--:1
```python
>>> app.update_config("/path/to/my_config.py")
>>> print(app.config.A)
1
```
:---

---:1

它同样接受 bash 风格的环境变量。 :--:1
```bash
$ export my_path="/path/to"
```
```python
app.update_config("${my_path}/my_config.py")
```
:---

请记住，您必须以 `$environment_variable` 的格式来提供环境变量。 :::
#### 通过字典加载(From a dict)

---:1

The `app.update_config` method also works on plain dictionaries. :--:1
```python
app.update_config({"A": 1, "B": 2})
```
:---

#### 通过类加载(From a class or object)

---:1

您可以自定义配置类，并将该类传递给 `app.update_config`
```python
class MyConfig:
    A = 1
    B = 2

app.update_config(MyConfig)
```
:---

---:1

It even could be instantiated. :--:1
```python
app.update_config(MyConfig())
```
:---

### 类型转换(Type casting)

从环境变量加载时，Sanic 将尝试将值转换为预期的 Python 类型。 这尤其适用于:

- `int`
- `float`
- `bool`

对于“bool ”,允许使用以下 _不区分大小写_ 的值:

- **`True`**: `y`, `yes`, `yep`, `yup`, `t`, `true`, `on`, `enable`, `enabled`, `1`
- **`False`**: `n`, `no`, `f`, `false`, `off`, `disable`, `disabled`, `0`

此外，Sanic 可以通过配置类型转换器来进行类型转换。 这应该是一个能够返回任何值且能触发 `ValueError` 的可调用函数。 :--:1
```python
app = Sanic(..., config=Config(converters=[UUID]))
```
:---

## 内置配置(Builtin values)


| **变量名称**                    | **默认值**         | **说明**                                                                              |
| --------------------------- | --------------- | ----------------------------------------------------------------------------------- |
| ACCESS_LOG                  | True            | 访问日志开关                                                                              |
| AUTO_EXTEND^                | True            | Sanic 拓展启用开关                                                                        |
| AUTO_RELOAD                 | True            | 自动重载开关                                                                              |
| EVENT_AUTOREGISTER          | True            | 自动注册信号开关（开启后不存在的事件将会自动注册）                                                           |
| FALLBACK_ERROR_FORMAT     | html            | 异常返回格式                                                                              |
| FORWARDED_FOR_HEADER      | X-Forwarded-For | 客户端 IP 和代理 IP：X-Forwarded-For                                                       |
| FORWARDED_SECRET            | None            | 用于安全地识别特定的代理服务器（见下文）                                                                |
| GRACEFUL_SHUTDOWN_TIMEOUT | 15.0            | 强制关闭非空闲连接的等待时间(秒)                                                                   |
| KEEP_ALIVE                  | True            | 是否启用长连接                                                                             |
| KEEP_ALIVE_TIMEOUT        | 5               | 长连接超时时间                                                                             |
| MOTD^                       | True            | 是否在启动时展示 MOTD 信息                                                                    |
| MOTD_DISPLAY                | {}              | 键/值对显示 MOTD 中的附加任意数据                                                                |
| NOISY_EXCEPTIONS ^          | False           | 强制禁止异常输出                                                                            |
| PROXIES_COUNT               | None            | 应用程序钱代理服务器的数量（见下文）                                                                  |
| REAL_IP_HEADER            | None            | 客户端真实 IP： X-Real-IP                                                                 |
| REGISTER                    | True            | 是否启用应用程序注册表                                                                         |
| REQUEST_BUFFER_QUEUE_SIZE | 100             | 请求流缓冲区队列大小                                                                          |
| REQUEST_ID_HEADER         | X-Request-ID    | 请求头中的请求 ID 名称：X-Request-ID                                                          |
| REQUEST_MAX_SIZE          | 100000000       | Request 的最大字节数                                                                      |
| REQUEST_TIMEOUT             | 60              | 请求超时时间                                                                              |
| RESPONSE_TIMEOUT            | 60              | 响应超时时间                                                                              |
| USE_UVLOOP                  | True            | Whether to override the loop policy to use `uvloop`. Supported only with `app.run`. |
| WEBSOCKET_MAX_SIZE        | 2^20            | websocket ping 帧 发送间隔                                                               |
| WEBSOCKET_PING_INTERVAL   | 20              | websocket pong 帧 响应超时时间                                                             |
| WEBSOCKET_PING_TIMEOUT    | 20              | Connection is closed when Pong is not received after ping_timeout seconds           |

`app.update_config` 的方法同样适用于字典
- 如果您使用 Gunicorn 运行，那么 `USE_UVLOOP` 将会被忽略。 在不支持的平台(Windows)上该值默认为 False。
- 如果您处于 ASGI 模式， 那么 `WEBSOCKET_` 的值将会被忽略 :::

## 超时(Timeouts)

### REQUEST_TIMEOUT

请求时间用于衡量从建立 TCP 连接到整个 HTTP 请求接收完成所花费的时间。 如果请求时间超过了设定的 `REQUEST_TIMEOUT` ，Sanic 会将其视为客户端错误并将 HTTP 408 作为响应发送给客户端。 如果您的客户端需要频繁传递大量的数据， 请您将此参数调至更高或减少传输数据。

### RESPONSE_TIMEOUT

响应时间用于衡量从整个 HTTP 请求接收完成到 Sanic 将响应完整发送至客户端所花费的时间。 如果响应时间超过了设定的 `RESONSE_TIMEOUT` ，Sanic 会将其视为服务端错误并将 HTTP 503 作为响应发送给客户端。 如果您的应用程序需要消耗大量的时间来进行响应，请尝试将此参数调至更高或优化响应效率。

### KEEP_ALIVE_TIMEOUT

#### What is Keep Alive? And what does the Keep Alive Timeout value do?

`Keep-Alive` 中文叫做长连接，它是 HTTP1.1 中引入的 HTTP 功能。 当发送 HTTP 请求时，客户端（通常是浏览器）可以通过设置 `Keep-Alive` 标头来指示 http 服务器（Sanic）在发送响应之后不关闭 TCP 连接。 这将允许客户端重用现有的 TCP 连接来发送后续的 HTTP 请求，以提高客户端和服务端之间的通讯效率。

在默认情况下，Sanic 中的 `Keep-Alive` 的值为 `True` 。 如果您的应用程序不需要此功能，可以将其设置为 False。 不过此举将导致 Sanic 无视 `Keep_Alive` 标头，且所有的客户端连接在响应发送完成之后被立即关闭。

The amount of time the server holds the TCP connection open is decided by the server itself. TCP 连接打开的时长本质上由服务器自身决定，在 Sanic 中，使用 `KEEP_ALIVE_TIMEOUT` 作为该值。 默认情况下它设置为 5 秒。 This is the same default setting as the Apache HTTP server and is a good balance between allowing enough time for the client to send a new request, and not holding open too many connections at once. 如需更改，请勿超过 75 秒，除非您确认客户端支持 TCP 连接保持足够久。

小提示：

* Apache httpd 服务器默认 KEEP_ALIVE_TIMEOUT = 5 秒
* Nginx 服务器默认 KEEP_ALIVE_TIMEOUT = 75 秒
* Nginx 性能调整准则使用 KEEP_ALIVE_TIMEOUT = 15 秒
* IE（5-9）客户端 KEEP_ALIVE_LIMIT = 60 秒
* Firefox 客户端 KEEP_ALIVE_LIMIT = 115 秒
* Opera 11 客户端 KEEP_ALIVE_LIMIT = 120 秒
* Chrome 13+ 客户端 KEEP_ALIVE_LIMIT > 300+秒

## 代理配置(Proxy configuration)

请参照 [代理配置](/zh/guide/advanced/proxy-headers.md)
