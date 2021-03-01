# 异常处理(Exceptions)

## 使用 Sanic 预置异常(Using Sanic exceptions)

Sanic 预置了许多标准异常。它们每个都会在您的响应中自动触发适当的 HTTP 状态代码。查看[接口文档](https://sanic.readthedocs.io/en/latest/)了解更多详细信息。

---:1

您应该自己实现的更常见的异常包括:

- `InvalidUsage` (400)
- `Unauthorized` (401)
- `Forbidden` (403)
- `NotFound` (404)
- `ServerError` (500)

:--:1

```python
from sanic import exceptions

@app.route("/login")
async def login(request):
    user = await some_login_func(request)
    if not user:
        raise exceptions.NotFound(
            f"Could not find user with username={request.json.username}"
        )
    ...
```
:---

## 终止(Abort)

---:1

有时候, 您只需要 Sanic 终止执行一个响应程序, 并返回一个状态代码, 您可以使用 `abort()`

:--:1

```python
from sanic.exceptions import abort

@app.route("/youshallnotpass")
async def no_no(request):
        abort(401)
        # this won't happen
        text("OK")
```

:---

## 处理(Handling)


当您的响应程序遇到异常时，您应该主动处理它。Sanic为此提供了一种方法。但是，如果您选择不处理，Sanic 也同样提供了一个后备选项。

这不仅适用于 Sanic 标准异常，也适用于您的应用程序可能引发的任何异常。


---:1

添加处理程序最简单的方法是使用 `@app.exception()` 并向其传递一个或多个异常。

:--:1

```python
from sanic.exceptions import NotFound

@app.exception(NotFound, SomeCustomException)
async def ignore_404s(request, exception):
    return text("Yep, I totally found the page: {}".format(request.url))
```
:---

---:1

您也可以通过捕获 `Exception` 来创建一个异常捕获处理程序。

:--:1


```python
@app.exception(Exception)
async def catch_anything(request, exception):
    ...
```
:---

---:1

您也可以使用 `app.error_handler.add()` 来添加异常处理程序。

:--:1

```python
async def server_error_handler(request, exception):
    return text("Oops, server error", status=500)

app.error_handler.add(Exception, server_error_handler)
```
:---

## 自定义异常处理(Custom error handling)

在某些情况下，您可能希望在默认设置的基础上增加更多的错误处理功能。在这种情况下，您可以将 Sanic 的默认错误处理程序子类化，例如:

```python
from sanic.handlers import ErrorHandler

class CustomErrorHandler(ErrorHandler):
    def default(self, request, exception):
        ''' handles errors that have no error handlers assigned '''
        # You custom error handling logic...
        return super().default(request, exception)

app.error_handler = CustomErrorHandler()
```

## 异常格式(Fallback handler)

Sanic comes with three fallback exception handlers:
Sanic 自带了三种异常格式。

1. HTML (*default*)
2. Text
3. JSON

根据您的应用程序是否处于 [调试模式](/zh/guide/deployment/development.md)，这些异常内容将呈现不同级别的细节。

### HTML

```python
app.config.FALLBACK_ERROR_FORMAT = "html"
```
---:1

```python
app.config.DEBUG = True
```

![Error](~@assets/images/error-html-debug.png)

:--:1

```python
app.config.DEBUG = False
```

![Error](~@assets/images/error-html-no-debug.png)

:---

### Text

```python
app.config.FALLBACK_ERROR_FORMAT = "text"
```

---:1

```python
app.config.DEBUG = True
```

```bash
$ curl localhost:8000/exc -i
HTTP/1.1 500 Internal Server Error
content-length: 590
connection: keep-alive
content-type: text/plain; charset=utf-8

⚠️ 500 — Internal Server Error
==============================
That time when that thing broke that other thing? That happened.

ServerError: That time when that thing broke that other thing? That happened. while handling path /exc
Traceback of __BASE__ (most recent call last):

  ServerError: That time when that thing broke that other thing? That happened.
    File /path/to/sanic/app.py, line 986, in handle_request
    response = await response

    File /path/to/server.py, line 222, in exc
    raise ServerError(
```

:--:1


```python
app.config.DEBUG = False
```

```bash
$ curl localhost:8000/exc -i
HTTP/1.1 500 Internal Server Error
content-length: 134
connection: keep-alive
content-type: text/plain; charset=utf-8

⚠️ 500 — Internal Server Error
==============================
That time when that thing broke that other thing? That happened.
```

:---

### JSON

```python
app.config.FALLBACK_ERROR_FORMAT = "json"
```

---:1

```python
app.config.DEBUG = True
```

```bash
$ curl localhost:8000/exc -i
HTTP/1.1 500 Internal Server Error
content-length: 129
connection: keep-alive
content-type: application/json

{
  "description": "Internal Server Error",
  "status": 500,
  "message": "That time when that thing broke that other thing? That happened.",
  "path": "/exc",
  "args": {},
  "exceptions": [
    {
      "type": "ServerError",
      "exception": "That time when that thing broke that other thing? That happened.",
      "frames": [
        {
          "file": "/path/to/sanic/app.py",
          "line": 986,
          "name": "handle_request",
          "src": "response = await response"
        },
        {
          "file": "/path/to/server.py",
          "line": 222,
          "name": "exc",
          "src": "raise ServerError("
        }
      ]
    }
  ]
}


```

:--:1

```python
app.config.DEBUG = False
```

```bash
$ curl localhost:8000/exc -i
HTTP/1.1 500 Internal Server Error
content-length: 530
connection: keep-alive
content-type: application/json

{
  "description": "Internal Server Error",
  "status": 500,
  "message": "That time when that thing broke that other thing? That happened."
}

```

:---

### Auto

Sanic 还提供了一个选项，用于猜测使用哪种异常格式。该功能依旧处于**试验阶段**。

```python
app.config.FALLBACK_ERROR_FORMAT = "auto"
```
