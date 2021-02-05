# 配置（Configuration）

## 基础（Basics）

---:1

Sanic 会将配置保存在应用程序对象的Config属性中，它是一个可以通过字典的形式或者属性的形式进行操作的对象。

:--:1

```python
app = Sanic("myapp")
app.config.DB_NAME = "appdb"
app.config["DB_USER"] = "appuser"
```
:---

---:1

因此，您也可是使用 `update()` 方法来更新配置。
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

在 Sanic 中， 标准做法是使用 **大写字母** 来命名您的配置名称，如果您将大写名称和小写名称混合使用，可能会导致某些配置无法正常读取，遇到无法解释的状况。

:::

## 配置加载（Loading）

### 环境变量（Environment variables）

---:1

任何使用 `SANIC_` 作为前缀的环境变量都会被加载并应用于 Sanic 配置。例如：在环境变量中设置 `SANIC_REQUEST_TIMEOUT` 环境变量后，将会被应用程序自动加载，并传递到 `REQUEST_TIMEOUT` 配置变量中。

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

您可以自动选择启动时应用程序要读取的变量前缀。

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

同样，您可以完全禁用环境变量的加载。

:--:1

```python
app = Sanic(__name__, load_env=False)
```
:---

### 使用通用方法加载（Using Sanic.update_config）

`Sanic` 中有一种通用的方法用于加载配置：`app.update_config` 。您可以通过向它提供文件路径，字典，类，或者几乎任何其他种类的对象的路径来更新配置。

#### 通过文件加载（From a file）

---:1

假设您有一个名为 `my_config.py` 的文件，它的内容如下：

:--:1

```python
# my_config.py
A = 1
B = 2
```
:---

---:1

您可以通过将文件路径传递给 `app.update_config` 进行配置加载。

:--:1

```python
>>> app.update_config("/path/to/my_config.py")
>>> print(app.config.A)
1
```
:---

---:1

它同样接受 bash 风格的环境变量。

:--:1

```bash
$ export my_path="/path/to"
```
```python
app.update_config("${my_path}/my_config.py")
```
:---

::: 小提示

请记住，您必须以 `$environment_variable` 的格式来提供环境变量。而且`${environment_variable}` 被视作纯文本（没有使用字符串格式化）

:::

#### 通过字典加载（From a dict）

---:1

`app.update_config` 的方法同样适用于字典
:--:1

```python
app.update_config({"A": 1, "B": 2})
```
:---

#### 通过类加载（From a class or object）

---:1

您可以自定义配置类，并将该类传递给 `app.update_config`

:--:1

```python
class MyConfig:
    A = 1
    B = 2

app.update_config(MyConfig)
```
:---

---:1

甚至您可以向它传递一个实例化好的对象

:--:1

```python
app.update_config(MyConfig())
```
:---

## 内置配置（Builtin values）


| 变量名称                  | 默认值          | 说明                                     |
| :------------------------ | --------------- | ---------------------------------------- |
| REQUEST_MAX_SIZE          | 100000000       | Request 的最大字节数                     |
| REQUEST_BUFFER_QUEUE_SIZE | 100             | 请求流缓冲区队列大小                     |
| REQUEST_TIMEOUT           | 60              | 请求超时时间                             |
| RESPONSE_TIMEOUT          | 60              | 响应超时时间                             |
| KEEP_ALIVE                | True            | 是否启用长连接                           |
| KEEP_ALIVE_TIMEOUT        | 5               | 长连接超时时间                           |
| WEBSOCKET_MAX_SIZE        | 2^20            | websocket 传入消息最大字节数             |
| WEBSOCKET_MAX_QUEUE       | 32              | websocket 传入消息最小字节数             |
| WEBSOCKET_READ_LIMIT      | 2^16            | websocket 传入字节的缓冲区上限           |
| WEBSOCKET_WRITE_LIMIT     | 2^16            | websocket 传出字节的缓冲区上限           |
| WEBSOCKET_PING_INTERVAL   | 20              | websocket ping 帧 发送间隔               |
| WEBSOCKET_PING_TIMEOUT    | 20              | websocket pong 帧 响应超时时间           |
| GRACEFUL_SHUTDOWN_TIMEOUT | 15.0            | 强制关闭非空闲连接超时时间               |
| ACCESS_LOG                | True            | 访问日志开关                             |
| FORWARDED_SECRET          | None            | 用于安全地识别特定的代理服务器（见下文） |
| PROXIES_COUNT             | None            | 应用程序钱代理服务器的数量（见下文）     |
| FORWARDED_FOR_HEADER      | X-Forwarded-For | 客户端IP和代理IP：X-Forwarded-For        |
| REAL_IP_HEADER            | None            | 客户端真实IP： X-Real-IP                 |

::: tip 

如果您处于 ASGI 模式， 那么 `WEBSOCKET_` 的值将会被忽略 

:::

## 超时（Timeouts）

### 请求超时（REQUEST_TIMEOUT）

请求时间用于衡量从建立 TCP 连接到接收完整个 HTTP 请求所花费的时间。如果请求时间超过了设定的 `REQUEST_TIMEOUT` ，Sanic 会将其视为客户端错误并将 HTTP 408 作为响应发送给客户端。如果您的客户端需要频繁传递大量的数据， 请您将此参数调至更高或减少传输数据。

### 响应超时（RESPONSE_TIMEOUT）

响应时间用于衡量从 Sanic 接收完 HTTP 请求到 Sanic 将响应完整发送至客户端所花费的时间。如果响应时间超过了设定的 `RESONSE_TIMEOUT` ，Sanic 会将其视为服务端错误并将 HTTP 503 作为响应发送给客户端。如果您的应用程序需要消耗大量的时间来进行响应，请尝试将此参数调至更高或优化响应效率。

### 长连接超时（KEEP_ALIVE_TIMEOUT）

#### 什么是长连接？长连接超时有什么作用？

`Keep-Alive` 中文叫做长连接，它是 HTTP1.1 中引入的 HTTP 功能。当发送 HTTP 请求时，客户端（通常是浏览器）可以通过设置 `Keep-Alive` 标头来指示 http 服务器（Sanic）在发送响应之后不关闭 TCP 连接。这将允许客户端重用现有的 TCP 连接来发送后续的 HTTP 请求，以提高客户端和服务端之间的通讯效率。

在默认情况下，Sanic 中的 `Keep-Alive` 的值为 `True` 。如果您的应用程序不需要此功能，可以将其设置为 False。不过此举将导致 Sanic 无视 `Keep_Alive` 标头，且所有的客户端连接在响应发送完成之后被立即关闭。

TCP连接打开的时长本质上由服务器自身决定，在 Sanic 中，使用 `KEEP_ALIVE_TIMEOUT` 作为该值。默认情况下它设置为 5 秒。这与 Apache 的默认值相同。该值足够客户端发送一个新的请求。如非必要请勿更改此项。如需更改，请勿超过 75 秒，除非您确认客户端支持TCP连接保持足够久。

仅供参考：

* Apache httpd 服务器默认 KEEP_ALIVE_TIMEOUT = 5秒
* Nginx 服务器默认 KEEP_ALIVE_TIMEOUT = 75秒
* Nginx 性能调整准则使用 KEEP_ALIVE_TIMEOUT = 15秒
* IE（5-9）客户端 KEEP_ALIVE_LIMIT = 60秒
* Firefox 客户端 KEEP_ALIVE_LIMIT = 115秒
* Opera 11 客户端 KEEP_ALIVE_LIMIT  = 120秒
* Chrome 13+ 客户端 KEEP_ALIVE_LIMIT > 300+秒

## 代理配置（Proxy configuration）

请参照 [代理配置](/advanced/proxy-headers.md)
