# Exceptions

## Using Sanic exceptions

Sometimes you just need to tell Sanic to halt execution of a handler and send back a status code response. You can raise a `SanicException` for this and Sanic will do the rest for you.

You can pass an optional "status_code" argument. By default, a SanicException will return an internal server error 500 response.

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

## Handling

Sanic handles exceptions automatically by rendering an error page, so in many cases you don't need to handle them yourself. However, if you would like more control on what to do when an exception is raised, you can implement a handler yourself.

Sanic provides a decorator for this, which applies to not only the Sanic standard exceptions, but *any* exception that your application might throw.

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
