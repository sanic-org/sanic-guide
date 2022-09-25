# Running Sanic

Sanic ships with its own internal web server. Under most circumstances, this is the preferred method for deployment. In addition, you can also deploy Sanic as an ASGI app bundled with an ASGI-able web server, or using gunicorn.

## Sanic Server

After defining an instance of `sanic.Sanic`, we can call the run method with the following keyword arguments:

|    Parameter    |     Default    |                                           Description                                     |
| :-------------: | :------------: | :---------------------------------------------------------------------------------------- |
|  **host**       | `"127.0.0.1"`  | Address to host the server on.                                                            |
|  **port**       | `8000`         | Port to host the server on.                                                               |
|  **unix**       | `None`         | Unix socket name to host the server on (instead of TCP).                                  |
|  **debug**      | `False`        | Enables debug output (slows server).                                                      |
|  **ssl**        | `None`         | SSLContext for SSL encryption of worker(s).                                               |
|  **sock**       | `None`         | Socket for the server to accept connections from.                                         |
|  **workers**    | `1`            | Number of worker processes to spawn.                                                      |
|  **loop**       | `None`         | An asyncio-compatible event loop. If none is specified, Sanic creates its own event loop. |
|  **protocol**   | `HttpProtocol` | Subclass of asyncio.protocol.                                                             |
|  **access_log** | `True`         | Enables log on handling requests (significantly slows server).                            |

---:1

In the above example, we decided to turn off the access log in order to increase performance.

:--:1

```python
# server.py
app = Sanic("My App")
app.run(host='0.0.0.0', port=1337, access_log=False)
```

:---

---:1

Now, just execute the python script that has `app.run(...)`

:--:1

```bash
python server.py
```

:---

### Workers

---:1
By default, Sanic listens in the main process using only one CPU core. To crank up the juice, just specify the number of workers in the run arguments.
:--:1
```python
app.run(host='0.0.0.0', port=1337, workers=4)
```
:---

Sanic will automatically spin up multiple processes and route traffic between them. We recommend as many workers as you have available processors.

---:1
The easiest way to get the maximum CPU performance is to use the `fast` option. This will automatically run the maximum number of workers given the system constraints.
:--:1
```python
app.run(host='0.0.0.0', port=1337, fast=True)
```
```python
$ sanic server:app --host=0.0.0.0 --port=1337 --fast
```
:---

In older versions of Sanic without the `fast` option, a common way to check this on Linux based operating systems:

```
$ nproc
```

Or, let Python do it:

```python
import multiprocessing
workers = multiprocessing.cpu_count()
app.run(..., workers=workers)
```

### Running via command

#### Sanic CLI

---:1
Sanic also has a simple CLI to launch via command line.

For example, if you initialized Sanic as app in a file named `server.py`, you could run the server like so:
:--:1
```bash
sanic server.app --host=0.0.0.0 --port=1337 --workers=4
```

:---

Use `sanic --help` to see all the options.

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
    --no-noisy-exceptions          No output stack traces for all exceptions
```

#### As a module

---:1
It can also be called directly as a module.
:--:1
```bash
python -m sanic server.app --host=0.0.0.0 --port=1337 --workers=4
```
:---

::: tip FYI
With either method (CLI or module), you shoud *not* invoke `app.run()` in your Python file. If you do, make sure you wrap it so that it only executes when directly run by the interpreter.

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337, workers=4)
```
:::


### Sanic Simple Server

---:1
Sometimes you just have a directory of static files that need to be served. This especially can be handy for quickly standing up a localhost server. Sanic ships with a Simple Server, where you only need to point it at a directory.
:--:1
```bash
sanic ./path/to/dir --simple
```
:---

---:1
This could also be paired with auto-reloading.
:--:1
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

To start HTTP/3, you must explicitly request it when running your application.

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

To run both an HTTP/3 and HTTP/1.1 server simultaneously, you can use [application multi-serve](../release-notes/v22.3.html#application-multi-serve) introduced in v22.3. This will automatically add an [Alt-Svc](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Alt-Svc) header to your HTTP/1.1 requests to let the client know that it is also available as HTTP/3.


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

Because HTTP/3 requires TLS, you cannot start a HTTP/3 server without a TLS certificate. You should [set it up yourself](../how-to/tls.html) or use `mkcert` if in `DEBUG` mode. Currently, automatic TLS setup for HTTP/3 is not compatible with `trustme`. See [development](./development.md) for more details.

:::

## ASGI

Sanic is also ASGI-compliant. This means you can use your preferred ASGI webserver to run Sanic. The three main implementations of ASGI are [Daphne](http://github.com/django/daphne), [Uvicorn](https://www.uvicorn.org/), and [Hypercorn](https://pgjones.gitlab.io/hypercorn/index.html).

::: warning
Daphne does not support the ASGI `lifespan` protocol, and therefore cannot be used to run Sanic. See [Issue #264](https://github.com/django/daphne/issues/264) for more details.
:::

Follow their documentation for the proper way to run them, but it should look something like:

```
uvicorn myapp:app
hypercorn myapp:app
```

A couple things to note when using ASGI:

1. When using the Sanic webserver, websockets will run using the `websockets` package. In ASGI mode, there is no need for this package since websockets are managed in the ASGI server. 
2. The ASGI lifespan protocol <https://asgi.readthedocs.io/en/latest/specs/lifespan.html>, supports only two server events: startup and shutdown. Sanic has four: before startup, after startup, before shutdown, and after shutdown. Therefore, in ASGI mode, the startup and shutdown events will run consecutively and not actually around the server process beginning and ending (since that is now controlled by the ASGI server). Therefore, it is best to use `after_server_start` and `before_server_stop`.

### Trio

Sanic has experimental support for running on Trio with:

```
hypercorn -k trio myapp:app
```


## Gunicorn

[Gunicorn](http://gunicorn.org/) ("Green Unicorn") is a WSGI HTTP Server for UNIX based operating systems. It is a pre-fork worker model ported from Ruby’s Unicorn project.

In order to run Sanic application with Gunicorn, you need `pip install uvicorn` and use the special `uvicorn.workers.UvicornWorker` for Gunicorn worker-class argument:

```bash
gunicorn myapp:app --bind 0.0.0.0:1337 --worker-class uvicorn.workers.UvicornWorker
```

If your application suffers from memory leaks, you can configure Gunicorn to gracefully restart a worker after it has processed a given number of requests. This can be a convenient way to help limit the effects of the memory leak.

See the [Gunicorn Docs](http://docs.gunicorn.org/en/latest/settings.html#max-requests) for more information.

::: warning
When running Sanic via `gunicorn`, you are losing out on a lot of the performance benefits of `async`/`await`. Weigh your considerations carefully before making this choice. Gunicorn does provide a lot of configuration options, but it is not the best choice for getting Sanic to run at its fastest.
:::

## Performance considerations

---:1
When running in production, make sure you turn off `debug`.
:--:1
```python
app.run(..., debug=False)
```
:---

---:1
Sanic will also perform fastest if you turn off `access_log`.

If you still require access logs, but want to enjoy this performance boost, consider using [Nginx as a proxy](./nginx.md), and letting that handle your access logging. It will be much faster than anything Python can handle.
:--:1
```python
app.run(..., access_log=False)
```
:---
