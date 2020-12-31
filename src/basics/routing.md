# Routing

<!-- panels:start -->
<!-- div:left-panel -->
So far we have seen a lot of this decorator in different forms.

But what is it? And how do we use it?
<!-- div:right-panel -->
```python
@app.route("/stairway")
...

@app.get("/to")
...

@app.post("/heaven")
...
```
<!-- panels:end -->

## Adding a route

<!-- panels:start -->
<!-- div:left-panel -->
The most basic way to wire up a handler to an endpoing is with `app.add_route()`. See [API docs]() for more details.
<!-- div:right-panel -->
```python
async def handler(request):
    return text('OK')

app.add_route(handler, '/test')
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
By default, routes are available as an HTTP `GET` call. You can change a handler to respond to one or more HTTP methods.
<!-- div:right-panel -->
```python
app.add_route(
    handler,
    '/test',
    methods=["POST", "PUT"],
)
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
Using the decorator syntax, the previous example is identical to this.
<!-- div:right-panel -->
```python
@app.route('/test', methods=["POST", "PUT"])
async def handler(request):
    return text('OK')
```
<!-- panels:end -->

## HTTP methods

Each of the standard HTTP methods has a convenience decorator.

<!-- tabs:start -->
#### ** GET **

```python
@app.get('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)

#### ** POST **

```python
@app.post('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)

#### ** PUT **

```python
@app.put('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT)

#### ** PATCH **

```python
@app.patch('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH)

#### ** DELETE **

```python
@app.delete('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE)

#### ** HEAD **

```python
@app.head('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD)

#### ** OPTIONS **

```python
@app.options('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS)

<!-- tabs:end -->

## Path parameters

<!-- panels:start -->
<!-- div:left-panel -->
Sanic allows for pattern matching, and for extracting values from URL paths. These parameters are then injected as keyword arguments in the route handler.
<!-- div:right-panel -->
```python
@app.get("/tag/<tag>")
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
You can declare a type for the parameter. This will be enforced when matching, and also will type cast the variable.
<!-- div:right-panel -->
```python
@app.get("/foo/<foo_id:uuid>")
async def uuid_handler(request, foo_id: UUID):
    return text("UUID - {}".format(foo_id))
```
<!-- panels:end -->

### Supported types

<!-- tabs:start -->

#### ** string **

```python
@app.route("/path/to/<foo:string>")
async def handler(request, foo: str):
    ...
```
**Regular expression applied**: `r"[^/]+")`  
**Cast type**: `str`  
**Example matches**:
- `/path/to/Bob`
- `/path/to/Python%203`

#### ** int **

```python
@app.route("/path/to/<foo:int>")
async def handler(request, foo: int):
    ...
```
**Regular expression applied**: `r"-?\d+")`  
**Cast type**: `int`  
**Example matches**:
- `/path/to/10`
- `/path/to/-10`

_Does not match float, hex, octal, etc_

#### ** number **

```python
@app.route("/path/to/<foo:number>")
async def handler(request, foo: float):
    ...
```
**Regular expression applied**: `r"-?(?:\d+(?:\.\d*)?|\.\d+)")`  
**Cast type**: `float`  
**Example matches**:
- `/path/to/10`
- `/path/to/-10`
- `/path/to/1.5`

#### ** alpha **

```python
@app.route("/path/to/<foo:alpha>")
async def handler(request, foo: str):
    ...
```
**Regular expression applied**: `r"[A-Za-z]+")`  
**Cast type**: `str`  
**Example matches**:
- `/path/to/Bob`
- `/path/to/Python`

_Does not match a digit, or a space or other special character_

#### ** path **

```python
@app.route("/path/to/<foo:path>")
async def handler(request, foo: str):
    ...
```
**Regular expression applied**: `r"[^/].*?")`  
**Cast type**: `str`  
**Example matches**:
- `/path/to/hello`
- `/path/to/hello.txt`
- `/path/to/hello/world.txt`

!> **Be careful** Because this will match on `/`, you should be careful and thoroughly test your patterns that use path so they do not capture traffic intended for another endpoint.

#### ** uuid **

```python
@app.route("/path/to/<foo:uuid>")
async def handler(request, foo: UUID):
    ...
```
**Regular expression applied**: `r"[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}"`  
**Cast type**: `UUID`  
**Example matches**:
- `/path/to/123a123a-a12a-1a1a-a1a1-1a12a1a12345`

#### ** regex **

```python
@app.route("/path/to/<foo:^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))>")
async def handler(request, foo: str):
    ...
```
**Regular expression applied**: _whatever you insert_  
**Cast type**: `str`  
**Example matches**:
- `/path/to/2021-01-01`

This gives you the freedom to define specific matching patterns for your use case. 

In the example shown, we are looking for a date that is in `YYYY-MM-DD` format.

<!-- tabs:end -->
## Generating a URL

<!-- panels:start -->
<!-- div:left-panel -->
Sanic provides a method to generate URLs based on the handler method name: `app.url_for()`. This is useful if you want to avoid hardcoding url paths into your app; instead, you can just reference the handler name.
<!-- div:right-panel -->
```python
@app.route('/')
async def index(request):
    # generate a URL for the endpoint `post_handler`
    url = app.url_for('post_handler', post_id=5)
    
    # Redirect to `/posts/5`
    return redirect(url)

@app.route('/posts/<post_id>')
async def post_handler(request, post_id):
    ...
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
You can pass any arbitrary number of keyword arguments. Anything that is _not_ a request parameter will be implemented as a part of the query string.
<!-- div:right-panel -->
```python
>>> app.url_for(
    "post_handler",
    post_id=5,
    arg_one="one",
    arg_two="two",
)
'/posts/5?arg_one=one&arg_two=two'
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
Also supported is passing multiple values for a single query key.
<!-- div:right-panel -->
```python
>>> app.url_for(
    "post_handler",
    post_id=5,
    arg_one=["one", "two"],
)
'/posts/5?arg_one=one&arg_one=two'
```
### Special keyword arguments

See [API Docs]() for more details.

```python
>>> app.url_for("post_handler", post_id=5, arg_one="one", _anchor="anchor")
'/posts/5?arg_one=one#anchor'

# _external requires you to pass an argument _server or set SERVER_NAME in app.config if not url will be same as no _external
>>> app.url_for("post_handler", post_id=5, arg_one="one", _external=True)
'//server/posts/5?arg_one=one'

# when specifying _scheme, _external must be True
>>> app.url_for("post_handler", post_id=5, arg_one="one", _scheme="http", _external=True)
'http://server/posts/5?arg_one=one'

# you can pass all special arguments at once
>>> app.url_for("post_handler", post_id=5, arg_one=["one", "two"], arg_two=2, _anchor="anchor", _scheme="http", _external=True, _server="another_server:8888")
'http://another_server:8888/posts/5?arg_one=one&arg_one=two&arg_two=2#anchor'
```

## Websockets routes

## Strict slashes

## Route naming

## Static files
