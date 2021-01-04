# Exceptions

## Using Sanic exceptions

Sanic provides a number of standard exceptions. They each automatically will raise the appropriate HTTP status code in your response. [Check the API docs](https://sanic.readthedocs.io/en/latest/) for more details. 


<!-- panels:start -->
<!-- div:left-panel -->
The more common exceptions you _should_ implement yourself include:

- `InvalidUsage` (400)
- `Unauthorized` (401)
- `Forbidden` (403)
- `NotFound` (404)
- `ServerError` (500)
<!-- div:right-panel -->
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
<!-- panels:end -->

## Abort

<!-- panels:start -->
<!-- div:left-panel -->
Sometimes you just need to tell Sanic to halt execution of a handler and send back a status code response. You can use `abort()` for this.
<!-- div:right-panel -->
```python
from sanic.exceptions import abort

@app.route("/youshallnotpass")
async def no_no(request):
        abort(401)
        # this won't happen
        text("OK")
```
<!-- panels:end -->

## Handling

When your application encounters an exception, you _should_ handle it. Sanic provides a method for doing that. But, if you do not, it also provides a fallback option.

This applies to not only the Sanic standard exceptions, but *any* exception that your application might throw.

<!-- panels:start -->
<!-- div:left-panel -->
The easiest method to add a handler is to use `@app.exception()` and pass it one or more exceptions.
<!-- div:right-panel -->
```python
from sanic.exceptions import NotFound

@app.exception(NotFound, SomeCustomException)
async def ignore_404s(request, exception):
    return text("Yep, I totally found the page: {}".format(request.url))
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
You can also create a catchall handler by catching `Exception`.
<!-- div:right-panel -->
```python
@app.exception(Exception)
async def catch_anything(request, exception):
    ...
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
You can also use `app.error_handler.add()` to add error handlers.
<!-- div:right-panel -->
```python
async def server_error_handler(request, exception):
    return text("Oops, server error", status=500)

app.error_handler.add(Exception, server_error_handler)
```
<!-- panels:end -->

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

These handlers present differing levels of detail depending upon whether your application is in [debug mode](/deployment/development.md) or not.

### HTML

```python
app.config.FALLBACK_ERROR_FORMAT = "html"
```
<!-- panels:start -->
<!-- div:left-panel -->
```python
app.config.DEBUG = True
```
![Error](../dev/images/error-html-debug.png "Error")
<!-- div:right-panel -->
```python
app.config.DEBUG = False
```
![Error](../dev/images/error-html-no-debug.png "Error")
<!-- panels:end -->

### Text

```python
app.config.FALLBACK_ERROR_FORMAT = "text"
```
<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

### JSON

```python
app.config.FALLBACK_ERROR_FORMAT = "json"
```
<!-- panels:start -->
<!-- div:left-panel -->
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
<!-- div:right-panel -->
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
<!-- panels:end -->

### Auto

Sanic also provides an option for guessing which fallback option to use. This is still an **experimental feature**.
```python
app.config.FALLBACK_ERROR_FORMAT = "auto"
```
