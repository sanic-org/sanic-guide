# Exceptions

## Using Sanic exceptions

Sometimes you just need to tell Sanic to halt execution of a handler and send back a status code response. You can raise a `SanicException` for this and Sanic will do the rest for you.

You can pass an optional `status_code` argument. By default, a SanicException will return an internal server error 500 response.

```python
from sanic.exceptions import SanicException

@app.route("/youshallnotpass")
async def no_no(request):
        raise SanicException("Something went wrong.", status_code=501)
```

Sanic provides a number of standard exceptions. They each automatically will raise the appropriate HTTP status code in your response. [Check the API reference](https://sanic.readthedocs.io/en/latest/sanic/api_reference.html#module-sanic.exceptions) for more details. 

---:1

The more common exceptions you _should_ implement yourself include:

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

## Exception properties

All exceptions in Sanic derive from `SanicException`. That class has a few properties on it that assist the developer in consistently reporting their exceptions across an application.

- `message`
- `status_code`
- `quiet`
- `context`
- `extra`

All of these properties can be passed to the exception when it is created, but the first three can also be used as class variables as we will see.

---:1
### `message`

The `message` property obviously controls the message that will be displayed as with any other exception in Python. What is particularly useful is that you can set the `message` property on the class definition allowing for easy standardization of language across an application
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
### `status_code`

This property is used to set the response code when the exception is raised. This can particularly be useful when creating custom 400 series exceptions that are usually in response to bad information coming from the client.
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
### `quiet`

By default, exceptions will be output by Sanic to the `error_logger`. Sometimes this may not be desirable, especially if you are using exceptions to trigger events in exception handlers (see [the following section](./exceptions.md#handling)). You can suppress the log output using `quiet=True`.
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
::: new NEW in v21.12
Sometimes while debugging you may want to globally ignore the `quiet=True` property. You can force Sanic to log out all exceptions regardless of this property using `NOISY_EXCEPTIONS`
:::
:--:1
```python
app.config.NOISY_EXCEPTIONS = True
```
:---

---:1
::: new NEW in v21.12
### `extra`

See [contextual exceptions](./exceptions.md#contextual-exceptions)
:::
:--:1
```python
raise SanicException(..., extra={"name": "Adam"})
```
:---

---:1
::: new NEW in v21.12
### `context`

See [contextual exceptions](./exceptions.md#contextual-exceptions)
:::
:--:1
```python
raise SanicException(..., context={"foo": "bar"})
```
:---


## Handling

Sanic handles exceptions automatically by rendering an error page, so in many cases you don't need to handle them yourself. However, if you would like more control on what to do when an exception is raised, you can implement a handler yourself.

Sanic provides a decorator for this, which applies to not only the Sanic standard exceptions, but **any** exception that your application might throw.

---:1

The easiest method to add a handler is to use `@app.exception()` and pass it one or more exceptions.

:--:1

```python
from sanic.exceptions import NotFound

@app.exception(NotFound, SomeCustomException)
async def ignore_404s(request, exception):
    return text("Yep, I totally found the page: {}".format(request.url))
```

:---

---:1

You can also create a catchall handler by catching `Exception`.

:--:1

```python
@app.exception(Exception)
async def catch_anything(request, exception):
    ...
```

:---

---:1

You can also use `app.error_handler.add()` to add error handlers.

:--:1

```python
async def server_error_handler(request, exception):
    return text("Oops, server error", status=500)

app.error_handler.add(Exception, server_error_handler)
```

:---

## Built-in error handling

Sanic ships with three formats for exceptions: HTML, JSON, and text. You can see examples of them below in the [Fallback handler](#fallback-handler) section.

---:1

You can control _per route_ which format to use with the `error_format` keyword argument.

:--:1

```python
@app.request("/", error_format="text")
async def handler(request):
    ...
```

:---


## Custom error handling

In some cases, you might want to add some more error handling functionality to what is provided by default. In that case, you can subclass Sanic's default error handler as such:

```python
from sanic.handlers import ErrorHandler

class CustomErrorHandler(ErrorHandler):
    def default(self, request, exception):
        ''' handles errors that have no error handlers assigned '''
        # You custom error handling logic...
        return super().default(request, exception)

app.error_handler = CustomErrorHandler()
```

## Fallback handler

Sanic comes with three fallback exception handlers:

1. HTML (*default*)
2. Text
3. JSON

These handlers present differing levels of detail depending upon whether your application is in [debug mode](/guide/deployment/development.md) or not.

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

Sanic also provides an option for guessing which fallback option to use. This is still an **experimental feature**.

```python
app.config.FALLBACK_ERROR_FORMAT = "auto"
```
## Contextual Exceptions

::: new NEW in v21.12
Default exception messages that simplify the ability to consistently raise exceptions throughout your application.

```python
class TeapotError(SanicException):
    status_code = 418
    message = "Sorry, I cannot brew coffee"

raise TeapotError
```

But this lacks two things:

1. A dynamic and predictable message format
2. The ability to add additional context to an error message (more on this in a moment)

### Dynamic and predictable message using `extra`

Sanic exceptions can be raised using `extra` keyword arguments to provide additional information to a raised exception instance.

```python
class TeapotError(SanicException):
    status_code = 418

    @property
    def message(self):
        return f"Sorry {self.extra['name']}, I cannot make you coffee"

raise TeapotError(extra={"name": "Adam"})
```

The new feature allows the passing of `extra` meta to the exception instance, which can be particularly useful as in the above example to pass dynamic data into the message text. This `extra` info object **will be suppressed** when in `PRODUCTION` mode, but displayed in `DEVELOPMENT` mode.

---:1
**PRODUCTION**

![image](https://user-images.githubusercontent.com/166269/139014161-cda67cd1-843f-4ad2-9fa1-acb94a59fc4d.png)
:--:1
**DEVELOPMENT**

![image](https://user-images.githubusercontent.com/166269/139014121-0596b084-b3c5-4adb-994e-31ba6eba6dad.png)
:---

### Additional `context` to an error message

Sanic exceptions can also be raised with a `context` argument to pass intended information along to the user about what happened. This is particularly useful when creating microservices or an API intended to pass error messages in JSON format. In this use case, we want to have some context around the exception beyond just a parseable error message to return details to the client.

```python
raise TeapotError(context={"foo": "bar"})
```

This is information **that we want** to always be passed in the error (when it is available). Here is what it should look like:

---:1
**PRODUCTION**

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
**DEVELOPMENT**

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
:::
