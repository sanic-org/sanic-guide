# 异常处理(Exceptions)

## 使用 Sanic 内置异常(Using Sanic exceptions)

有时，您只需要告诉 Sanic 终止执行响应函数，并返回一个状态码。此时，您可以抛出 `SanicException` 异常，之后，Sanic 将为您自动完成剩下的工作。

您可以选择传递一个参数 `status_code`。默认情况下，如果您不传递该参数，SanicException 将会返回一个 HTTP 500 内部服务错误的响应

```python
from sanic.exceptions import SanicException

@app.route("/youshallnotpass")
async def no_no(request):
        raise SanicException("Something went wrong.", status_code=501)
```

Sanic 预置了许多标准异常。它们每个都会在您的响应中自动触发适当的 HTTP 状态代码。查看 [接口文档](https://sanic.readthedocs.io/en/latest/sanic/api_reference.html#module-sanic.exceptions) 了解更多详细信息。

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

## 异常属性(Exception properties)

在 Sanic 中，所有异常都继承自 `SanicException`。该类有一些属性，可以帮助开发人员在整个应用程序中一致地报告异常。

- `message`
- `status_code`
- `quiet`
- `context`
- `extra`

所有这些属性都可以在异常创建时传递给它，但是前三个将会作为可见的信息被返回出来。

---:1

### 信息属性(`message`)

`message` 属性控制着 Python 中任何其他异常显示的消息。您可以在类定义上设置 `message` 属性，以便在整个应用程序中轻松实现语言的标准化。

:--:1

```python
class CustomError(SanicException):
    message = "Something bad happened"

raise CustomError
# or
raise CustomError("Override the default message with something else")
```

:---

---:1

### 状态码属性(`status_code`)

该属性用于设置异常时的响应码。这在创建自定义 400 系列异常时特别有用，这些异常通常是为了响应来自客户端的错误信息。

:--:1

```python
class TeapotError(SanicException):
    status_code = 418
    message = "Sorry, I cannot brew coffee"

raise TeapotError
# or
raise TeapotError(status_code=400)
```

:---

---:1

### 静默输出(`quiet`)

默认情况下，Sanic 会将异常输出到 `error_logger`。有时这可能并不理想，尤其是当您使用异常来触发异常处理程序中的事件时(参见[下一节](./exceptions.md#handling))。您可以使用`quiet=True` 来禁止日志输出。

:--:1

```python
class SilentError(SanicException):
    message = "Something happened, but not shown in logs"
    quiet = True

raise SilentError
# or
raise InvalidUsage("blah blah", quiet=True)
```

:---

---:1

有时在调试时，您可能希望全局忽略 `quiet=True` 属性。您可以使用 `NOISY_EXCEPTIONS` 来忽略 `quiet` 的设置，强制 Sanic 注销所有异常。

:--:1

```python
app.config.NOISY_EXCEPTIONS = True
```

:---

---:1

### 额外属性(`extra`)

请参考 [上下文异常](./exceptions.md#contextual-exceptions)

:--:1

```python
raise SanicException(..., extra={"name": "Adam"})
```

:---

---:1

### 上下文(`context`)

请参考 [上下文异常](./exceptions.md#contextual-exceptions)

:--:1

```python
raise SanicException(..., context={"foo": "bar"})
```

:---

## 处理(Handling)

Sanic 通过呈现错误页面来自动处理异常，因此在许多情况下，您不需要自己处理它们。但是，如果您希望在引发异常时更多地控制该做什么，您同样可以自己实现一个处理程序。

Sanic 为此提供了一个装饰器，它不仅适用于 Sanic 标准异常，还适用于您的应用程序可能抛出的**任何**异常。

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

## 内置异常处理(Built-in error handling)

Sanic 支持三种不同的异常格式: HTML、JSON 和 TEXT。您可以在下面的 [异常格式](#fallback-handler) 一节中看到它们的示例。

---:1

您可以通过设置 `error_format` 关键字参数来控制每一个路由所使用的异常格式。

:--:1

```python
@app.request("/", error_format="text")
async def handler(request):
    ...
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

1. HTML (_default_)
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

Sanic 还提供了一个选项，用于猜测使用哪种异常格式。该功能依旧处于 **试验阶段**。

```python
app.config.FALLBACK_ERROR_FORMAT = "auto"
```

## 上下文异常(Contextual Exceptions)

默认异常消息简化了在整个应用程序中一致引发异常的能力。

```python
class TeapotError(SanicException):
    status_code = 418
    message = "Sorry, I cannot brew coffee"

raise TeapotError
```

但这样会忽视两个非常重要的问题：

1. 如何设置动态且可预测的消息格式
2. 如何向错误消息中添加额外上下文内容(稍后将详细介绍)

### 使用 `extra` 来设置动态且可预测的消息(Dynamic and predictable message using `extra`)

Sanic 异常可以使用 `extra` 属性来获取传入的额外信息，例如：

```python
class TeapotError(SanicException):
    status_code = 418

    @property
    def message(self):
        return f"Sorry {self.extra['name']}, I cannot make you coffee"

raise TeapotError(extra={"name": "Adam"})
```

这个新特性允许将 `extra` 元传递给异常实例，这在上面的例子中将动态数据传递给消息文本时非常有用。在生产模式下，`extra` 信息对象 **将被隐藏**，但在开发模式下将s显示。

---:1

**生产模式**

![image](https://user-images.githubusercontent.com/166269/139014161-cda67cd1-843f-4ad2-9fa1-acb94a59fc4d.png)

:--:1

**开发模式**

![image](https://user-images.githubusercontent.com/166269/139014121-0596b084-b3c5-4adb-994e-31ba6eba6dad.png)

:---

### 在异常信息中附加上下文内容(Additional `context` to an error message)

Sanic 异常也可以通过 `context` 参数来引发，方便告诉开发者发生了什么。这对微服务或旨在以 JSON 格式传递错误消息的 API 特别有用。在这个用例中，我们希望有一些关于异常的上下文，而不仅仅是一个可解析的错误消息，以便向客户端返回详细信息。

```python
raise TeapotError(context={"foo": "bar"})
```

`context` 将始终被传递到异常信息中，这正是我们想要看到的，它看起来就像这样：

---:1

**生产模式**

```json
{
  "description": "I'm a teapot",
  "status": 418,
  "message": "Sorry Adam, I cannot make you coffee",
  "context": {
    "foo": "bar"
  }
}
```
:--:1

**开发模式**

```json
{
  "description": "I'm a teapot",
  "status": 418,
  "message": "Sorry Adam, I cannot make you coffee",
  "context": {
    "foo": "bar"
  },
  "path": "/",
  "args": {},
  "exceptions": [
    {
      "type": "TeapotError",
      "exception": "Sorry Adam, I cannot make you coffee",
      "frames": [
        {
          "file": "handle_request",
          "line": 83,
          "name": "handle_request",
          "src": ""
        },
        {
          "file": "/tmp/p.py",
          "line": 17,
          "name": "handler",
          "src": "raise TeapotError("
        }
      ]
    }
  ]
}
```
:---
