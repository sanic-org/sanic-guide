# 日志(Logging)

Sanic 允许您根据请求进行不同类型的记录（访问日志、错误日志）[Python 日志 API](https://docs.python.org/3/howto/logging.html)。 如果您想创建一个新的配置，您应该有一些关于 Python logging 的基础知识。

## 快速开始(Quick Start)

---:1

使用默认配置的简单示例如下：
```python
from sanic import Sanic
from sanic.log import logger
from sanic.response import text

app = Sanic('logging_example')

@app.route('/')
async def test(request):
    logger.info('Here is your log')
    return text('Hello World!')

if __name__ == "__main__":
  app.run(debug=True, access_log=True)

if __name__ == "__main__":
  app.run(debug=True, access_log=True)
```
:---

After the server is running, you should see logs like this.
```text
[2021-01-04 15:26:26 +0200] [1929659] [INFO] Goin' Fast @ http://127.0.0.1:8000
[2021-01-04 15:26:26 +0200] [1929659] [INFO] Starting worker [1929659]
```

在服务器运行后，您应该看到以下的日志信息：
```text
[2021-01-04 15:26:28 +0200] [1929659] [INFO] Here is your log
[2021-01-04 15:26:28 +0200] - (sanic.access)[INFO][127.0.0.1:44228]: GET http://localhost:8000/  200 -1
```

## 自定义日志(Changing Sanic loggers)

您可以尝试向服务器发送请求，之后，您会看到输出如下的日志信息：

```python
app = Sanic('logging_example', log_config=LOGGING_CONFIG)

if __name__ == "__main__":
  app.run(access_log=False)
```

在 Python 中处理日志是一个比较轻松的操作，但是如果您需要处理大量的请求，那么性能可能回成为一个瓶颈。 添加访问日志的耗时将会增加，这将会增大您的系统开销。

This is a good opportunity to place Sanic behind a proxy (like nginx) and to do your access logging there. You will see a *significant* increase in overall performance by disabling the `access_log`.

如果要使用自己的日志配置，只需使用 `logging.config.dictConfig`，或者在初始化 Sanic app 时传递 `log_config` 即可。

## 配置(Configuration)

使用 Nginx 记录访问日志是一个减轻系统开销的好办法，将 Sanic 部署在 Nginx 代理之后，并禁用 Sanic 的 `access_log`，您将能够看到性能的显著提升

为了在生产环境下获得最佳性能，建议在禁用 `debug` 和 `access_log` 的情况下运行Sanic：`app.run(debug=False, access_log=False)`

| **Logger Name** | **Use Case**                  |
| --------------- | ----------------------------- |
| `sanic.root`    | Used to log inernal messages. |
| `sanic.error`   | Used to log error logs.       |
| `sanic.access`  | Used to log access logs.      |
 :--:1

:---

### 日志格式（Log format）

Sanic 的默认认知配置为：`sanic.log.LOGGING_CONFIG_DEFAULTS`。

| 参数名称      | 参数值                                  | 参数类型  |
| --------- | ------------------------------------ | ----- |
| `host`    | `request.ip`                         | `str` |
| `request` | `request.method + " " + request.url` | `str` |
| `status`  | `response`                           | `int` |
| `byte`    | `len(response.body)`                 | `int` |




默认的访问日志格式为:

```text
%(asctime)s - (%(name)s)[%(levelname)s][%(host)s]: %(request)s %(message)s %(status)d %(byte)d
```
