# 路由(Routing)

---:1

到目前为止，我们已经接触了各式各样的装饰器，但是这些装饰器是干什么用的？我们该如何使用它？

:--:1

```python
@app.route("/stairway")
...

@app.get("/to")
...

@app.post("/heaven")
...
```
:---

## 添加路由

---:1

将响应程序进行挂载的最基本方式就是使用 `app.add_route()`，具体的细节请查看 [API文档]()

:--:1

```python
async def handler(request):
    return text("OK")

app.add_route(handler, "/test")
```
:---

---:1

默认的情况下，路由会绑定监听 HTTP `GET` 请求方式， 你可以通过修改 `methods` 参数，从而达到使用一个响应函数响应 HTTP 的多种请求方式。

:--:1

```python
app.add_route(
    handler,
    '/test',
    methods=["POST", "PUT"],
)
```
:---

---:1

你也可以使用装饰器来进行路由绑定，下面是使用装饰器的方式进行路由绑定的例子，实现的效果和上一个例子相同。

:--:1

```python
@app.route('/test', methods=["POST", "PUT"])
async def handler(request):
    return text('OK')
```
:---

## HTTP methods

每一个标准的HTTP请求方式都对应封装了一个简单易用的装饰器：

:::: tabs

::: tab GET

```python
@app.get('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)

:::

::: tab POST

```python
@app.post('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)

:::

::: tab PUT

```python
@app.put('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT)

:::

::: tab PATCH

```python
@app.patch('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH)

:::

::: tab DELETE

```python
@app.delete('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE)

:::

::: tab HEAD

```python
@app.head('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD)

:::

::: tab OPTIONS

```python
@app.options('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS)

:::

::::

## 路由参数(Path parameters)

---:1

Sanic允许模式匹配，并从URL中提取值。然后将这些参数作为关键字参数传递到响应程序中。

:--:1

```python
@app.get("/tag/<tag>")
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---

---:1

你可以为路由参数指定类型，它将在匹配时进行强制类型转换。

:--:1

```python
@app.get("/foo/<foo_id:uuid>")
async def uuid_handler(request, foo_id: UUID):
    return text("UUID - {}".format(foo_id))
```
:---

### Supported types

:::: tabs

::: tab string

```python
@app.route("/path/to/<foo:string>")
async def handler(request, foo: str):
    ...
```
**使用的正则表达式**: `r"[^/]+")`  

**转换类型**: `str`  

**匹配示例**:

- `/path/to/Bob`
- `/path/to/Python%203`

:::

::: tab  int

```python
@app.route("/path/to/<foo:int>")
async def handler(request, foo: int):
    ...
```
**使用的正则表达式**: `r"-?\d+")`  

**转换类型**: `int`  

**匹配示例**:

- `/path/to/10`

- `/path/to/-10`

    无法匹配 float，hex，octal，etc 等数字类型。

:::

::: tab number

```python
@app.route("/path/to/<foo:number>")
async def handler(request, foo: float):
    ...
```
**使用的正则表达式**: `r"-?(?:\d+(?:\.\d*)?|\.\d+)")`  

**转换类型**: `float`  

**匹配示例**:

- `/path/to/10`
- `/path/to/-10`
- `/path/to/1.5`

:::

::: tab alpha

```python
@app.route("/path/to/<foo:alpha>")
async def handler(request, foo: str):
    ...
```
**使用的正则表达式**: `r"[A-Za-z]+")`  

**转换类型**: `str`  

**匹配示例**:

- `/path/to/Bob`

- `/path/to/Python`

    无法匹配数字，空格以及其他特殊字符。

:::

::: tab path

```python
@app.route("/path/to/<foo:path>")
async def handler(request, foo: str):
    ...
```
**使用的正则表达式**: `r"[^/].*?")`  

**转换类型**: `str`  

**匹配示例**:

- `/path/to/hello`
- `/path/to/hello.txt`
- `/path/to/hello/world.txt`

::: warning

因为这将从 `/`开始进行匹配，所以您应该小心使用，并测试您的正则表达式是否正确，以免匹配错误而调用了错误的响应程序。

:::

::: tab uuid

```python
@app.route("/path/to/<foo:uuid>")
async def handler(request, foo: UUID):
    ...
```
**使用的正则表达式**: `r"[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}"`  

**转换类型**: `UUID`  

**匹配示例**:

`/path/to/123a123a-a12a-1a1a-a1a1-1a12a1a12345`

:::

::: tab regex

```python
@app.route("/path/to/<foo:^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))>")
async def handler(request, foo: str):
    ...
```
**使用的正则表达式**: _whatever you insert_  

**转换类型**: `str`  

**匹配示例**:

- `/path/to/2021-01-01`

该方法允许您使用自定义的匹配模式，在上面的示例中，我们通过指定的正则表达式，来匹配符合 `YYYY-MM-DD` 格式的路由参数。

:::

::::

## Generating a URL

---:1

Sanic provides a method to generate URLs based on the handler method name: `app.url_for()`. This is useful if you want to avoid hardcoding url paths into your app; instead, you can just reference the handler name.
:--:1
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
:---

---:1

You can pass any arbitrary number of keyword arguments. Anything that is _not_ a request parameter will be implemented as a part of the query string.
:--:1
```python
>>> app.url_for(
    "post_handler",
    post_id=5,
    arg_one="one",
    arg_two="two",
)
'/posts/5?arg_one=one&arg_two=two'
```
:---

---:1

Also supported is passing multiple values for a single query key.
:--:1
```python
>>> app.url_for(
    "post_handler",
    post_id=5,
    arg_one=["one", "two"],
)
'/posts/5?arg_one=one&arg_one=two'
```
:---

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

### Customizing a route name

---:1

A custom route name can be used by passing a `name` argument while registering the route.
:--:1
```python
@app.get("/get", name="get_handler")
def handler(request):
    return text("OK")
```
:---

---:1

Now, use this custom name to retrieve the URL
:--:1
```python
>>> app.url_for("get_handler", foo="bar")
'/get?foo=bar'
```
:---

## Websockets routes

---:1

Websocket routing works similar to HTTP methods.
:--:1
```python
async def handler(request, ws):
    messgage = "Start"
    while True:
        await ws.send(message)
        message = ws.recv()

app.add_websocket_route(handler, "/test")
```
:---

---:1

It also has a convenience decorator.
:--:1
```python
@app.websocket("/test")
async def handler(request, ws):
    messgage = "Start"
    while True:
        await ws.send(message)
        message = ws.recv()
```
:---

Read the [websockets section](/guide/advanced/websockets.md) to learn more about how they work.

## Strict slashes


---:1

Sanic routes can be configured to strictly match on whether or not there is a trailing slash: `/`. This can be configured at a few levels and follows this order of precedence:

1. Route
2. Blueprint
3. Application
:--:1
```python
# provide default strict_slashes value for all routes
app = Sanic(__file__, strict_slashes=True)
```

```python
# overwrite strict_slashes value for specific route
@app.get("/get", strict_slashes=False)
def handler(request):
    return text("OK")
```

```python
# it also works for blueprints
bp = Blueprint(__file__, strict_slashes=True)

@bp.get("/bp/get", strict_slashes=False)
def handler(request):
    return text("OK")
```
:---

## Static files

---:1

In order to serve static files from Sanic, use `app.static()`.

The order of arguments is important:

1. Route the files will be served from
2. Path to the files on the server

See [API docs]() for more details.
:--:1
```python
app.static("/static", "/path/to/directory")
```
:---

---:1

You can also serve individual files.
:--:1
```python
app.static("/", "/path/to/index.html")
```
:---

---:1

It is also sometimes helpful to name your endpoint
:--:1
```python
app.static(
    "/user/uploads",
    "/path/to/uploads",
    name="uploads",
)
```
:---

---:1

Retrieving the URLs works similar to handlers. But, we can also add the `filename` argument when we need a specific file inside a directory.
:--:1
```python
>>> app.url_for(
    "static",
    name="static",
    filename="file.txt",
)
'/static/file.txt'

​```python
>>> app.url_for(
    "static",
    name="uploads",
    filename="image.png",
)
'/user/uploads/image.png'

```
:---
