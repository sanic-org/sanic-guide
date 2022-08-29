# 运行 Sanic(Running Sanic)

Sanic 自带了一个 Web 服务器。 在大多数情况下，推荐使用该服务器来部署您的 Sanic 应用。 除此之外，您还可以使用支持 ASGI 应用的服务器来部署 Sanic，或者使用 Gunicorn。

## Sanic 服务器(Sanic Server)

当定义了 `sanic.Sanic` 实例后，我们可以调用其 `run` 方法，该方法支持以下几个关键字参数：

|      参数名称      |      默认值       | 参数说明                                         |
|:--------------:|:--------------:|:-------------------------------------------- |
|    **host**    | `"127.0.0.1"`  | 服务器监听的地址。                                    |
|    **port**    |     `8000`     | 服务器监听的端口。                                    |
|    **unix**    |     `None`     | Unix 套接字文件（不是 TCP）。                          |
|   **debug**    |    `False`     | 开启 DEBUG 输出 （降低服务器性能）。                       |
|    **ssl**     |     `None`     | SSLContext，子进程用于 SSL 加密。                     |
|    **sock**    |     `None`     | 服务器接受连接的套接字。                                 |
|  **workers**   |      `1`       | 要生成的子进程数量。                                   |
|    **loop**    |     `None`     | 一个兼容 asyncio 的事件循环。 如果没有指定，Sanic 会创建自己的事件循环。 |
|  **protocol**  | `HttpProtocol` | asyncio.protocol 子类。                         |
| **access_log** |     `True`     | 启用请求访问日志（显著降低服务器速度）。                         |

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

在默认情况下，Sanic 在主进程中只占用一个 CPU 核心进行服务的监听。 要想增加并发，只需在运行参数中指定 workers 的数量即可。 :--:1
```python
app.run(host='0.0.0.0', port=1337, workers=4)
```
:---

Sanic 会自动管理多个进程，并在它们之间进行负载均衡。 我们建议将子进程数量设置的和您机器的 CPU 核心数量一样。

获得最大 CPU 性能的最简单方法是使用 `fast` 参数。 This will automatically run the maximum number of workers given the system constraints. :--:1
```python
app.run(host='0.0.0.0', port=1337, fast=True)
```
```python
$ sanic server:app --host=0.0.0.0 --port=1337 --fast
```
:---

在没有 `fast` 选项的旧版 Sanic 中, 在基于 Linux 的操作系统上，有一个通用的方式来检查 CPU 核心数量：

```
$ nproc
```

Or, let Python do it:

```python
import multiprocessing
workers = multiprocessing.cpu_count()
app.run(..., workers=workers)
```

### 通过命令行运行(Running via command)

#### Sanic 命令行界面(Sanic CLI)

Sanic 也提供一个简单的命令行界面，来帮助您通过命令行启动。

比如，如果您在 `server.py` 文件中初始化了一个 Sanic 应用，您可以使用右侧命令运行程序：
```bash
sanic server.app --host=0.0.0.0 --port=1337 --workers=4
```

:---

或者，我们可以使用 Python 来获取该值：

```text
$ sanic --help
usage: sanic [-h] [--version] [--factory] [-s] [-H HOST] [-p PORT] [-u UNIX] [--cert CERT] [--key KEY] [--tls DIR] [--tls-strict-host]
             [-w WORKERS | --fast] [--access-logs | --no-access-logs] [--debug] [-d] [-r] [-R PATH] [--motd | --no-motd] [-v]
             [--noisy-exceptions | --no-noisy-exceptions]
             module

   ▄███ █████ ██      ▄█▄      ██       █   █   ▄██████████
  ██                 █   █     █ ██     █   █  ██
   ▀███████ ███▄    ▀     █    █   ██   ▄   █  ██
               ██  █████████   █     ██ █   █  ▄▄
  ████ ████████▀  █         █  █       ██   █   ▀██ ███████

 To start running a Sanic application, provide a path to the module, where
 app is a Sanic() instance:

     $ sanic path.to.server:app

 Or, a path to a callable that returns a Sanic() instance:

     $ sanic path.to.factory:create_app --factory

 Or, a path to a directory to run as a simple HTTP server:

     $ sanic ./path/to/static --simple

Required
========
  Positional:
    module                         Path to your Sanic app. Example: path.to.server:app
                                   If running a Simple Server, path to directory to serve. Example: ./

Optional
========
  General:
    -h, --help                     show this help message and exit
    --version                      show program's version number and exit

  Application:
    --factory                      Treat app as an application factory, i.e. a () -> <Sanic app> callable
    -s, --simple                   Run Sanic as a Simple Server, and serve the contents of a directory
                                   (module arg should be a path)

  Socket binding:
    -H HOST, --host HOST           Host address [default 127.0.0.1]
    -p PORT, --port PORT           Port to serve on [default 8000]
    -u UNIX, --unix UNIX           location of unix socket

  TLS certificate:
    --cert CERT                    Location of fullchain.pem, bundle.crt or equivalent
    --key KEY                      Location of privkey.pem or equivalent .key file
    --tls DIR                      TLS certificate folder with fullchain.pem and privkey.pem
                                   May be specified multiple times to choose multiple certificates
    --tls-strict-host              Only allow clients that send an SNI matching server certs

  Worker:
    -w WORKERS, --workers WORKERS  Number of worker processes [default 1]
    --fast                         Set the number of workers to max allowed
    --access-logs                  Display access logs
    --no-access-logs               No display access logs

  Development:
    --debug                        Run the server in debug mode
    -d, --dev                      Currently is an alias for --debug. But starting in v22.3,
                                   --debug will no longer automatically trigger auto_restart.
                                   However, --dev will continue, effectively making it the
                                   same as debug + auto_reload.
    -r, --reload, --auto-reload    Watch source directory for file changes and reload on changes
    -R PATH, --reload-dir PATH     Extra directories to watch and reload on changes

  Output:
    --motd                         Show the startup display
    --no-motd                      No show the startup display
    -v, --verbosity                Control logging noise, eg. -vv or --verbosity=2 [default 0]
    --noisy-exceptions             Output stack traces for all exceptions
    --no-noisy-exceptions          No output stack traces for all exceptions Example: path.to.server:app
                                   If running a Simple Server, path to directory to serve. Example: ./

Optional
========
  General:
    -h, --help                     show this help message and exit
    --version                      show program's version number and exit

  Application:
    --factory                      Treat app as an application factory, i.e. a () -> <Sanic app> callable
    -s, --simple                   Run Sanic as a Simple Server, and serve the contents of a directory
                                   (module arg should be a path)

  Socket binding:
    -H HOST, --host HOST           Host address [default 127.0.0.1]
    -p PORT, --port PORT           Port to serve on [default 8000]
    -u UNIX, --unix UNIX           location of unix socket

  TLS certificate:
    --cert CERT                    Location of fullchain.pem, bundle.crt or equivalent
    --key KEY                      Location of privkey.pem or equivalent .key file
    --tls DIR                      TLS certificate folder with fullchain.pem and privkey.pem
                                   May be specified multiple times to choose multiple certificates
    --tls-strict-host              Only allow clients that send an SNI matching server certs

  Worker:
    -w WORKERS, --workers WORKERS  Number of worker processes [default 1]
    --fast                         Set the number of workers to max allowed
    --access-logs                  Display access logs
    --no-access-logs               No display access logs

  Development:
    --debug                        Run the server in debug mode
    -d, --dev                      Currently is an alias for --debug. But starting in v22.3, 
                                   --debug will no longer automatically trigger auto_restart. 
                                   However, --dev will continue, effectively making it the 
                                   same as debug + auto_reload.
    -r, --reload, --auto-reload    Watch source directory for file changes and reload on changes
    -R PATH, --reload-dir PATH     Extra directories to watch and reload on changes

  Output:
    --motd                         Show the startup display
    --no-motd                      No show the startup display
    -v, --verbosity                Control logging noise, eg. -vv or --verbosity=2 [default 0]
    --noisy-exceptions             Output stack traces for all exceptions
    --no-noisy-exceptions          No output stack traces for all exceptions
```

#### 作为模块运行 (As a module)

---:1 It can also be called directly as a module. :--:1
```bash
python -m sanic server.app --host=0.0.0.0 --port=1337 --workers=4
```
:---

无论使用哪种方法(CLI 或模块），都再不应该在 Python 文件中调用 `app.run()`。 如果您想调用该方法，请确认将其包装起来，使它只有在使用解释器运行文件时才会被执行。

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337, workers=4)
```
:::


### Sanic 简易服务器

---:1 Sometimes you just have a directory of static files that need to be served. This especially can be handy for quickly standing up a localhost server. 现在，只要指定一个特定的目录，Sanic 就能为您搭建一个简易的静态文件服务器。 :--:1
```bash
sanic ./path/to/dir --simple
```
:---

---:1 This could also be paired with auto-reloading. :--:1
```bash
sanic ./path/to/dir --simple --reload --reload-dir=./path/to/dir
```
:---


::: new NEW in v22.6

### HTTP/3


Sanic server offers HTTP/3 support using [aioquic](https://github.com/aiortc/aioquic). This **must** be installed to use HTTP/3:

```
pip install sanic aioquic
```

```
pip install sanic[http3]
```

::: tip 小提示

---:1
```
$ sanic path.to.server:app --http=3
```

```
$ sanic path.to.server:app -3
```
:--:1

```python
app.run(version=3)
```
:---

To run both an HTTP/3 and HTTP/1.1 server simultaneously, you can use [application multi-serve](http://localhost:8080/en/guide/release-notes/v22.3.html#application-multi-serve) introduced in v22.3. This will automatically add an [Alt-Svc](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Alt-Svc) header to your HTTP/1.1 requests to let the client know that it is also available as HTTP/3.


---:1
```
$ sanic path.to.server:app --http=3 --http=1
```

```
$ sanic path.to.server:app -3 -1
```
:--:1

```python
app.prepre(version=3)
app.prepre(version=1)
Sanic.serve()
```
:---

Because HTTP/3 requires TLS, you cannot start a HTTP/3 server without a TLS certificate. You should [set it up yourself](http://localhost:8080/en/guide/how-to/tls.html) or use `mkcert` if in `DEBUG` mode. Currently, automatic TLS setup for HTTP/3 is not compatible with `trustme`. See [development](./development.md) for more details.

:::

## ASGI

Sanic 同样兼容 ASGI。 这意味着您可以使用您喜爱的 ASGI 服务器来运行 Sanic。 现在有三大主流的 ASGI 服务器， [Daphne](http://github.com/django/daphne)，[Uvicorn](https://www.uvicorn.org/)，和 [Hypercorn](https://pgjones.gitlab.io/hypercorn/index.html) 。

Daphne 不支持 ASGI 中的 `lifespan` 协议，因此并不能用于 Sanic。 更多详细信息请参考 [Issue #264](https://github.com/django/daphne/issues/264)。 :::

::: warning 警告

```
uvicorn myapp:app
hypercorn myapp:app
```

A couple things to note when using ASGI:

1. 当使用 Sanic 服务器，websocket 功能将使用 `websockets` 包来实现。 在 ASGI 模式中，将不会使用该第三方包，因为 ASGI 服务器将会管理 websocket 链接。
2. [ASGI 生命周期协议](https://asgi.readthedocs.io/en/latest/specs/lifespan.html) 中规定 ASGI 只支持两种服务器事件：启动和关闭。 而 Sanic 则有四个事件：启动前、启动后、关闭前和关闭后。 因此，在 ASGI 模式下，启动和关闭事件将连续运行，并不是根据服务器进程的实际状态来运行（因为此时是由 ASGI 服务器控制状态）。 因此，最好使用 `after_server_start` 和 `before_server_stop` 。

### Trio

Sanic 对使用 Trio 运行有着实验性的支持：

```
hypercorn -k trio myapp:app
```


## Gunicorn

[Gunicorn](http://gunicorn.org/) ("Green Unicorn") 是一个基于 UNIX 操作系统的 WSGI HTTP 服务器。 它是从 Ruby 的 Unicorn 项目中移植而来，采用的是 pre-fork worker 模型。

当使用 ASGI 时，您需要关注以下几件事情：

```bash
gunicorn myapp:app --bind 0.0.0.0:1337 --worker-class sanic.worker.GunicornWorker
```

如果您的应用有内存泄漏的困扰，您可以通过配置 Gunicorn 使子进程在处理了一定数量的请求后平滑重启。 这种方法可以很方便得减少内存泄漏带来的影响。

查看 [Gunicorn 文档](http://docs.gunicorn.org/en/latest/settings.html#max-requests) 来获取更多信息。

当通过 `gunicorn` 运行 Sanic 时，您将失去 `async/await` 带来的诸多性能优势。 Weigh your considerations carefully before making this choice. 的确，Gunicorn 提供了很多配置选项，但它不是让 Sanic 全速运行的最佳坏境。 :::

## 性能方面的考虑 (Performance considerations)

当部署在生产环境时，请确保 `debug` 模式处于关闭状态。 :--:1
```python
app.run(..., debug=False)
```
:---

::: warning

如果您的确需要请求访问日志，又想获得更好的性能，可以考虑使用 [Nginx](./nginx.md) 作为代理，让 Nginx 来处理您的访问日志。 这种方式要比用 Python 处理快得多得多。 :--:1
```python
app.run(..., access_log=False)
```
:---
