# Handlers

The next important building block are your _handlers_. These are also sometimes called "views".

In Sanic, a handler is any callable that takes at least a `Request` instance as an argument, and returns either an `HTTPResonse` instance, or a coroutine that does the same.



<!-- panels:start -->
<!-- div:left-panel -->
Huh? :confused:

It is a **function**; either synchronous or asynchronous.

The job of the handler is to respond to an endpoint and do something. This is where the majority of your business logic will go.
<!-- div:right-panel -->
```python
def i_am_a_handler(request):
    return HTTPResonse()

async def i_am_ALSO_a_handler(request):
    return HTTPResonse()
```
<!-- panels:end -->

?> **Heads up** If you want to learn more about encapsulating your logic, checkout [class based views](/advanced/class-based-views.md).

<!-- panels:start -->
Then, all you need to do is wire it up to an endpoint. We'll learn more about routing [in the next section](routing.md).
<!-- div:left-panel -->
Let's look at a practical example.

- We use a convenience decorator on our app instance: `@app.get()`
- And a handy convenience method for generating out response object: `text()`

Mission accomplished :muscle:
<!-- div:right-panel -->
```python
from sanic.response import text

@app.get("/foo")
async def foo_handler(request):
    return text("I said foo!")
```
<!-- panels:end -->
## Request

The `Request` instance contains **a lot** of helpful information available on its parameters. Refer to the [API documentation](https://sanic.readthedocs.io/) for full details.

### Body

<!-- tabs:start -->
#### ** JSON data **

**Parameter**: `request.json`  
**Description**: The parsed JSON object

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```


```python
>>> print(request.json)
{'foo': 'bar'}
```

#### ** Raw body **

**Parameter**: `request.body`  
**Description**: The raw bytes from the request body

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```

```python
>>> print(request.body)
b'{"foo": "bar"}'
```

#### ** Form data **

**Parameter**: `request.form`  
**Description**: The form data

```bash
$ curl localhost:8000 -d 'foo=bar'
```

```python
>>> print(request.body)
b'foo=bar'

>>> print(request.form)
{'foo': ['bar']}

>>> print(request.form.get("foo"))
bar

>>> print(request.form.getlist("foo"))
['bar']
```

?> :bulb: **FYI** The `request.form` object is one of a few types that is a dictionary with each value being a list. This is because HTTP allows a single key to be reused to send multiple values.  
Most of the time you will want to use the `.get()` method can be used to access the first element and not a list. If you do want a list of all items, you can user `.getlist()`.

#### ** Uploaded files **

**Parameter**: `request.files`  
**Description**: The files uploaded to the server

```bash
$ curl -F 'my_file=@/path/to/TEST' http://localhost:8000
```

```python
>>> print(request.body)
b'--------------------------cb566ad845ad02d3\r\nContent-Disposition: form-data; name="my_file"; filename="TEST"\r\nContent-Type: application/octet-stream\r\n\r\nhello\n\r\n--------------------------cb566ad845ad02d3--\r\n'

>>> print(request.files)
{'my_file': [File(type='application/octet-stream', body=b'hello\n', name='TEST')]}

>>> print(request.files.get("my_file"))
File(type='application/octet-stream', body=b'hello\n', name='TEST')

>>> print(request.files.getlist("my_file"))
[File(type='application/octet-stream', body=b'hello\n', name='TEST')]
```
?> :bulb: **FYI** The `request.files` object is one of a few types that is a dictionary with each value being a list. This is because HTTP allows a single key to be reused to send multiple values.  
Most of the time you will want to use the `.get()` method can be used to access the first element and not a list. If you do want a list of all items, you can user `.getlist()`.

<!-- tabs:end -->
### Context
`request.ctx`

### Parameters

### Arguments
`request.args`


## Response


<!-- tabs:start -->

#### ** Text **

```python
from sanic.response import text

@app.route("/")
def handler(request):
    return text(...)
```

#### ** HTML **

```python
from sanic.response import text

@app.route("/")
def handler(request):
    return text(...)
```

#### ** JSON **

```python
from sanic.response import text

@app.route("/")
def handler(request):
    return text(...)
```

#### ** File **

```python
from sanic.response import text

@app.route("/")
def handler(request):
    return text(...)
```

#### ** Streaming **

```python
from sanic.response import text

@app.route("/")
def handler(request):
    return text(...)
```

#### ** File Streaming **

```python
from sanic.response import text

@app.route("/")
def handler(request):
    return text(...)
```

#### ** Redirect **

```python
from sanic.response import text

@app.route("/")
def handler(request):
    return text(...)
```

#### ** Raw **

```python
from sanic.response import text

@app.route("/")
def handler(request):
    return text(...)
```

#### ** Empty **

```python
from sanic.response import text

@app.route("/")
def handler(request):
    return text(...)
```

<!-- tabs:end -->
