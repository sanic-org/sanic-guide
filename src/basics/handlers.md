# Handlers

The next important building block are your _handlers_. These are also sometimes called "views".

In Sanic, a handler is any callable that takes at least a `Request` instance as an argument, and returns either an `HTTPResonse` instance, or a coroutine that does the same.



<!-- panels:start -->
<!-- div:left-panel -->
Huh? :confused:

It is a **function**; either synchronous or asynchronous.
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

The `Request` instance has **a lot** of helpful information available. Here is some brief information about _some_ of the properties. Refer to the [API documentation](https://sanic.readthedocs.io/) for full details.

- `request.app` - blah blah
- `request.headers` - blah blah
- `request.version` - blah blah
- `request.method` - blah blah
- `request.endpoint` - blah blah
- `request.token` - blah blah
- `request.cookies` - blah blah
- `request.ip` - blah blah
- `request.path` - blah blah
- `request.host` - blah blah
- `request.url` - blah blah

### Body

#### JSON data
`request.json`
#### Raw body
`request.body`
#### Form data
`request.form`
#### Uploaded files
`request.files`

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
