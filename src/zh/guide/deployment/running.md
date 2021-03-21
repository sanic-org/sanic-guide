# 运行 Sanic(Running Sanic)

Sanic 自带了一个 Web 服务器。在大多数情况下，推荐使用该服务器来部署您的 Sanic 应用。除此之外，您还可以使用支持 ASGI 应用的服务器来部署 Sanic，或者使用 Gunicorn。

## Sanic 服务器(Sanic Server)

当定义了 `sanic.Sanic` 实例后，我们可以调用其 `run` 方法，该方法支持以下几个关键字参数：

|     参数名称     |     默认值     |                              参数说明                              |
| :-------------: | :------------: | :---------------------------------------------------------------: |
|  **host**       | `"127.0.0.1"`  | 服务器监听的地址。                                                  |
|  **port**       | `8000`         | 服务器监听的端口。                                                  |
|  **unix**       | `None`         | Unix套接字文件（不是TCP）。                                         |
|  **debug**      | `False`        | 开启 DEBUG 输出 （降低服务器性能）。                                 |
|  **ssl**        | `None`         | SSLContext，子进程用于 SSL 加密。                                   |
|  **sock**       | `None`         | 服务器接受连接的套接字。                                            |
|  **workers**    | `1`            | 要生成的子进程数量。                                                |
|  **loop**       | `None`         | 一个兼容 asyncio 的事件循环。如果没有指定，Sanic 会创建自己的事件循环。|
|  **protocol**   | `HttpProtocol` | asyncio.protocol 子类。                                            |
|  **access_log** | `True`         | 启用请求访问日志（显著降低服务器速度）。                              |

---:1

在该样例中，我们关闭输出访问日志来提升性能。

:--:1

```python
# server.py
app = Sanic("My App")
app.run(host='0.0.0.0', port=1337, access_log=False)
```

:---

---:1

现在，执行包含 `app.run(...)` 代码的 Python 脚本。

:--:1

```bash
python server.py
```

:---

### 子进程(Workers)

---:1

在默认情况下，Sanic 在主进程中只占用一个 CPU 核心进行服务的监听。要想增加并发，只需在运行参数中指定 workers 的数量即可。

:--:1

```python
app.run(host='0.0.0.0', port=1337, workers=4)
```

:---

::: tip 小提示

Sanic 会自动管理多个进程，并在它们之间进行负载均衡。我们建议将子进程数量设置的和您机器的 CPU 核心数量一样。

在基于 Linux 的操作系统上，有一个通用的方式来检查 CPU 核心数量：

```
$ nproc
```

或者，我们可以使用 Python 来获取该值：

```python
import multiprocessing
workers = multiprocessing.cpu_count()
app.run(..., workers=workers)
```

:::

### 通过命令行运行(Running via command)

#### Sanic 命令行界面(Sanic CLI)

---:1

Sanic 也提供一个简单的命令行界面，来帮助您通过命令行启动。

比如，如果您在 `server.py` 文件中初始化了一个 Sanic 应用，您可以使用右侧命令运行程序：

:--:1

```bash
sanic server.app --host=0.0.0.0 --port=1337 --workers=4
```

:---

---:1

您还可以使用 `sanic --help` 来查看所有选项。

:--:1

```bash
$ sanic --help
usage: sanic [-h] [--host HOST] [--port PORT] [--unix UNIX] [--cert CERT] [--key KEY] [--workers WORKERS] [--debug] module

positional arguments:
  module

optional arguments:
  -h, --help         show this help message and exit
  --host HOST
  --port PORT
  --unix UNIX
  --cert CERT        location of certificate for SSL
  --key KEY          location of keyfile for SSL.
  --workers WORKERS
  --debug

```

:---

#### 作为模块运行 (As a module)

---:1

Sanic 也可以被当做模板直接调用。

:--:1

```bash
python -m sanic server.app --host=0.0.0.0 --port=1337 --workers=4
```

:---

::: tip 小提示

无论使用哪种方法(CLI 或模块），都再不需要在 Python 文件中调用 `app.run()`。如果您想调用该方法，请确认将其包装起来，使它只有在使用解释器运行文件时才会被执行。

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337, workers=4)
```
:::

## ASGI

Sanic 同样兼容 ASGI。这意味着您可以使用您喜爱的 ASGI 服务器来运行 Sanic。现在有三大主流的 ASGI 服务器， [Daphne](http://github.com/django/daphne)，[Uvicorn](https://www.uvicorn.org/)，和 [Hypercorn](https://pgjones.gitlab.io/hypercorn/index.html) 。


您需要参考他们的文档来找到运行 ASGI 应用的正确方式，这些启动命令大概看起来像这样：

```
daphne myapp:app
uvicorn myapp:app
hypercorn myapp:app
```

当使用 ASGI 时，您需要关注以下几件事情：

1. 当使用 Sanic 服务器，websocket 功能将使用 `websockets` 包来实现。在 ASGI 模式中，将不会使用该第三方包，因为 ASGI 服务器将会管理 websocket 链接。

2. [ASGI 生命周期协议](https://asgi.readthedocs.io/en/latest/specs/lifespan.html) 中规定 ASGI 只支持两种服务器事件：启动和关闭。而 Sanic 则有四个事件：启动前、启动后、关闭前和关闭后。因此，在ASGI模式下，启动和关闭事件将连续运行，并不是根据服务器进程的实际状态来运行（因为此时是由 ASGI 服务器控制状态）。因此，最好使用 `after_server_start` 和 `before_server_stop` 。

### Trio

Sanic 对使用 Trio 运行有着实验性的支持：

```
hypercorn -k trio myapp:app
```


## Gunicorn

[Gunicorn](http://gunicorn.org/) ("Green Unicorn") 是一个基于 UNIX 操作系统的 WSGI HTTP 服务器。它是从 Ruby 的 Unicorn 项目中移植而来，采用的是 pre-fork worker 模型。

为了使用 Gunicorn 来运行 Sanic 应用程序，您需要使用 Sanic 提供的 `sanic.worker.GunicornWorker` 类作为 Gunicorn worker-class 参数。

```bash
gunicorn myapp:app --bind 0.0.0.0:1337 --worker-class sanic.worker.GunicornWorker
```

如果您的应用有内存泄漏的困扰，您可以通过配置 Gunicorn 使子进程在处理了一定数量的请求后平滑重启。这种方法可以很方便得减少内存泄漏带来的影响。

查看 [Gunicorn 文档](http://docs.gunicorn.org/en/latest/settings.html#max-requests) 来获取更多信息。

::: warning

当通过 `gunicorn` 运行Sanic时，您将失去 `async/await` 带来的诸多性能优势。对于该种部署方式，请三思而后行。的确，Gunicorn 提供了很多配置选项，但它不是让 Sanic 全速运行的最佳坏境。

:::

## 性能方面的考虑 (Performance considerations)

---:1

当部署在生产环境时，请确保 `debug` 模式处于关闭状态。

:--:1

```python
app.run(..., debug=False)
```

:---

---:1

如果您选择关闭了 `access_log` ，Sanic 将会全速运行。

如果您的确需要请求访问日志，又想获得更好的性能，可以考虑使用 [Nginx](./nginx.md) 作为代理，让 Nginx 来处理您的访问日志。这种方式要比用 Python 处理快得多得多。

:--:1

```python
app.run(..., access_log=False)
```

:---
