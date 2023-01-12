# 路由(Routing)

---:1

So far we have seen a lot of this decorator in different forms.

But what is it? 我们该如何使用它？ :--:1
```python
@app.route("/stairway")

...

@app.get("/to")

...

@app.post("/heaven")

...

@app.get("/to")
...

@app.post("/heaven")
...
```
:---

## 添加路由(Adding a route)

---:1

将响应函数进行挂载的最基本方式就是使用 `app.add_route()`，具体的细节请查看 [API 文档](https://sanic.readthedocs.io/en/stable/sanic/api_reference.html#sanic.app.Sanic.url_for)

您可以在 [API Docs](https://sanic.readthedocs.io/en/stable/sanic/api_reference.html#sanic.app.Sanic.url_for) 查看更多详细信息。 :--:1
```python
async def handler(request):
    return text("OK")


app.add_route(handler, "/test")
```
:---

---:1

By default, routes are available as an HTTP `GET` call. You can change a handler to respond to one or more HTTP methods. :--:1
```python
app.add_route(
    handler,
    '/test',
    methods=["POST", "PUT"],
)
```
:---

---:1

Using the decorator syntax, the previous example is identical to this. :--:1
```python
@app.route('/test', methods=["POST", "PUT"])
async def handler(request):
    return text('OK')
```
:---

## HTTP 方法(HTTP methods)

Each of the standard HTTP methods has a convenience decorator.

::: tab PATCH

```python
@app.get('/test')
async def handler(request):
    return text('OK')
```

每一个标准的 HTTP 请求方式都对应封装了一个简单易用的装饰器：

```python
@app.post('/test')
async def handler(request):
    return text('OK')
```

https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST

```python
@app.put('/test')
async def handler(request):
    return text('OK')
```

::: tab GET

```python
@app.patch('/test')
async def handler(request):
    return text('OK')
```

https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH

```python
@app.delete('/test')
async def handler(request):
    return text('OK')
```

https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD

```python
@app.head('/test')
async def handler(request):
    return empty()
```

::: tab POST

```python
@app.options('/test')
async def handler(request):
    return empty()
```

https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS

默认情况下，Sanic 将 **仅** 在不安全的 HTTP 方法(`POST`、`PUT`、`PATCH`) 上使用传入的请求体。 如果你想以任何其他方法中接收 HTTP 请求中的数据，您需要从以下两种方法中任选其一:

**方法 #1 - 通过 `ignore_body` 告诉 Sanic 不要忽略请求体**
```python
@app.delete("/path", ignore_body=False)
async def handler(_):
    ...
```

**方法 #2 - 通过 `receive_body` 在请求中手动使用**
```python
@app.delete("/path")
async def handler(request: Request):
    await request.receive_body()
```
:::

## 路由参数(Path parameters)

---:1

Sanic 允许模式匹配，并从 URL 中提取值。 These parameters are then injected as keyword arguments in the route handler. :--:1
```python
@app.get("/tag/<tag>")
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---

---:1

You can declare a type for the parameter. This will be enforced when matching, and also will type cast the variable. :--:1
```python
@app.get("/foo/<foo_id:uuid>")
async def uuid_handler(request, foo_id: UUID):
    return text("UUID - {}".format(foo_id))
```
:---

### 匹配类型(Supported types)

:::: tabs

::: tab "str"

```python
@app.route("/path/to/<foo:str>")
async def handler(request, foo: str):
    ...
```
**使用的正则表达式**: `r"[^/].*?")`
- `/path/to/Bob`
- `/path/to/Python%203`

Beginning in v22.3 `str` will *not* match on empty strings. See `strorempty` for this behavior.

::: tab PUT

```python
@app.route("/path/to/<foo:strorempty>")
async def handler(request, foo: str):
    ...
```
**使用的正则表达式**: _whatever you insert_
- `/path/to/Bob`
- `/path/to/Python%203`
- `/path/to/`

Unlike the `str` path parameter type, `strorempty` can also match on an empty string path segment.

::: warning 注意

```python
@app.route("/path/to/<foo:int>")
async def handler(request, foo: int):
    ...
```
**使用的正则表达式**: `r"[a-z0-9]+(?:-[a-z0-9]+)*")`
- `/path/to/10`
- `/path/to/-10`

无法匹配 float，hex，octal，etc 等数字类型。

```python
@app.route("/path/to/<foo:float>")
async def handler(request, foo: float):
    ...
```
**使用的正则表达式**: `r"-?(?:\d+(?:\.\d*)?|\.\d+)")`
- `/path/to/10`
- `/path/to/-10`
- `/path/to/1.5`

::: tab alpha

```python
@app.route("/path/to/<foo:alpha>")
async def handler(request, foo: str):
    ...
```
**使用的正则表达式**: `r"^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"`
- `/path/to/Bob`
- `/path/to/Python`

该方法 _不_ 不支持 `path` 类型的参数。

```python
@app.route("/path/to/<article:slug>")
async def handler(request, article: str):
    ...
```
**使用的正则表达式**: `r"[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}"`
- `/path/to/some-news-story`
- `/path/to/or-has-digits-123`

*Added in v21.6* :::
::: tab path

```python
@app.route("/path/to/<foo:path>")
async def handler(request, foo: str):
    ...
```
**使用的正则表达式**: n/a
- `/path/to/hello`
- `/path/to/hello.txt`
- `/path/to/hello/world.txt`

::: warning Because this will match on `/`, you should be careful and thoroughly test your patterns that use `path` so they do not capture traffic intended for another endpoint. ::: tab "ext 🌟"

```python
@app.route("/path/to/<foo:ymd>")
async def handler(request, foo: datetime.date):
    ...
```
**类型转换**: `str`
- /path/to/2021-03-28

::: tab uuid

```python
@app.route("/path/to/<foo:uuid>")
async def handler(request, foo: UUID):
    ...
```
**转换类型**: _varies_
- `/path/to/123a123a-a12a-1a1a-a1a1-1a12a1a12345`

:::

**使用的正则表达式**: `r"[^/]+")`

```python
@app.route("/path/to/<foo:ext>")
async def handler(request, foo: str, ext: str):
    ...
```
**转换类型**: `str`

<table spaces-before="0">
  <tr>
    <th>
      定义
    </th>
    
    <th>
      示例
    </th>
    
    <th>
      文件名
    </th>
    
    <th>
      拓展名
    </th>
  </tr>
  
  <tr>
    <td>
      \<file:ext>
    </td>
    
    <td>
      page.txt
    </td>
    
    <td>
      <code>"page"</code>
    </td>
    
    <td>
      <code>"txt"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      \<file:ext=jpg>
    </td>
    
    <td>
      cat.jpg
    </td>
    
    <td>
      <code>"cat"</code>
    </td>
    
    <td>
      <code>"jpg"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      \<file:ext=jpg\
    </td>
    
    <td>
      png\
    </td>
    
    <td>
      gif\
    </td>
    
    <td>
      svg>    | cat.jpg     | <code>"cat"</code>  | <code>"jpg"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      <file=int:ext>
    </td>
    
    <td>
      123.txt
    </td>
    
    <td>
      <code>123</code>
    </td>
    
    <td>
      <code>"txt"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      <file=int:ext=jpg\
    </td>
    
    <td>
      png\
    </td>
    
    <td>
      gif\
    </td>
    
    <td>
      svg> | 123.svg     | <code>123</code>    | <code>"svg"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      <file=float:ext=tar.gz>
    </td>
    
    <td>
      3.14.tar.gz
    </td>
    
    <td>
      <code>3.14</code>
    </td>
    
    <td>
      <code>"tar.gz"</code>
    </td>
  </tr>
</table>

可以使用特殊的 `ext` 参数类型匹配文件扩展名。 它使用一种特殊的格式，允许您指定其他类型的参数类型作为文件名，以及一个或多个特定的扩展名，如上表所示。

::: new v22.3 新特征

`str` 将不再匹配空字符串, 更多信息请参照 `strorempty`

::: tab regex

```python
@app.route(r"/path/to/<foo:([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))>")
async def handler(request, foo: str):
    ...
```
::: tab "strorempty 🌟"
- `/path/to/2021-01-01`

::: new v22.3 新特征

**使用正则表达式**: `r"[^/]*")`

::::

### 正则匹配(Regex Matching)



**匹配示例**:

与 `str` 不同，`strorempty` 还能够匹配空字符串路径

```text
/image/123456789.jpg
```

如果您想匹配文件模式，但只捕获数字部分，您需要做一些正则表达式的适配, 来体会编写正则表达式的乐趣 😄 :

```python
app.route(r"/image/<img_id:(?P<img_id>\d+)\.jpg>")
```

::: tab int

```python
@app.get(r"/<foo:[a-z]{3}.txt>")                # 全模式匹配
@app.get(r"/<foo:([a-z]{3}).txt>")              # 定义单个匹配组
@app.get(r"/<foo:(?P<foo>[a-z]{3}).txt>")       # 定义单个命名匹配组
@app.get(r"/<foo:(?P<foo>[a-z]{3}).(?:txt)>")   # 用一个或多个不匹配组定义单个命名匹配组
```

**使用的正则表达式**: `r"-?\d+")`

```python
@app.get(r"/<foo:(?P<foo>\d+).jpg>")  # 正确示例
@app.get(r"/<foo:(?P<bar>\d+).jpg>")  # 错误示例
```

**转换类型**: `int`

## 动态访问(Generating a URL)

---:1

Sanic 提供了一种基于处理程序方法名生成 url 的方法：`app.url_for()`，您只需要函数名称即可实现响应函数之间的处理权力的移交。 This is useful if you want to avoid hardcoding url paths into your app; instead, you can just reference the handler name. :--:1
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

You can pass any arbitrary number of keyword arguments. Anything that is _not_ a request parameter will be implemented as a part of the query string. :--:1
```python
>> > app.url_for(
    "post_handler",
    post_id=5,
    arg_one="one",
    arg_two="two",
)
'/posts/5?arg_one=one&arg_two=two'
```
:---

---:1

该方法同样支持为一个键名传递多个值。 :--:1
```python
>> > app.url_for(
    "post_handler",
    post_id=5,
    arg_one=["one", "two"],
)
'/posts/5?arg_one=one&arg_one=two'
```
:---

### 特殊关键字参数(Special keyword arguments)

**使用的正则表达式**: `r"[A-Za-z]+")`

```python
>> > app.url_for("post_handler", post_id=5, arg_one="one", _anchor="anchor")
'/posts/5?arg_one=one#anchor'

# _external requires you to pass an argument _server or set SERVER_NAME in app.config if not url will be same as no _external
>> > app.url_for("post_handler", post_id=5, arg_one="one", _external=True)
'//server/posts/5?arg_one=one'

# when specifying _scheme, _external must be True
>> > app.url_for("post_handler", post_id=5, arg_one="one", _scheme="http", _external=True)
'http://server/posts/5?arg_one=one'

# you can pass all special arguments at once
>> > app.url_for("post_handler", post_id=5, arg_one=["one", "two"], arg_two=2, _anchor="anchor", _scheme="http",
                 _external=True, _server="another_server:8888")
'http://another_server:8888/posts/5?arg_one=one&arg_one=two&arg_two=2#anchor'
```

### 自定义路由名称(Customizing a route name)

---:1

在注册路由的时候，可以通过给定 `name` 参数来自定义路由名称 :--:1
```python
@app.get("/get", name="get_handler")
def handler(request):
    return text("OK")
```
:---

---:1

::: tab "slug"
```python
>> > app.url_for("get_handler", foo="bar")
'/get?foo=bar'
```
:---

## Websocket 路径(Websockets routes)

---:1

Websocket 的工作方式和 HTTP 是类似的。 :--:1
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

它也具备有一个独立的装饰器。 :--:1
```python
@app.websocket("/test")
async def handler(request, ws):
    messgage = "Start"
    while True:
        await ws.send(message)
        message = ws.recv()
```
:---

**匹配示例**:

## 严格匹配分隔符(Strict slashes)


---:1

Sanic 可以按需开启或关闭路由的严格匹配模式，开启后路由将会严格按照 `/` 作为分隔来进行路由匹配，您可以在以下几种方法中进行匹配，它们的优先级遵循： This can be configured at a few levels and follows this order of precedence:

1. 路由（Route）
2. 蓝图（Blueprint)
3. 蓝图组（BlueprintGroup）
4. 应用（Application）

:--:1
```python
# 为应用程序下所有的路由都启用严格匹配模式
app = Sanic(__file__, strict_slashes=True)
```

```python
# 为指定的路由启用严格匹配模式
@app.get("/get", strict_slashes=False)
def handler(request):
    return text("OK")
```

```python
# 为蓝图所属的路由启用严格匹配模式
bp = Blueprint(__file__, strict_slashes=True)


@bp.get("/bp/get", strict_slashes=False)
def handler(request):
    return text("OK")
```

```python
bp1 = Blueprint(name="bp1", url_prefix="/bp1")
bp2 = Blueprint(
    name="bp1",
    url_prefix="/bp2",
    strict_slashes=False,
)
# This will enforce strict slashes check on the routes
# under bp1 but ignore bp2 as that has an explicitly
# set the strict slashes check to false
group = Blueprint.group([bp1, bp2], strict_slashes=True)
```
:---

## 静态文件(Static files)

---:1

**转换类型**: `datetime.date`

**匹配示例**:

1. Route the files will be served from
2. Path to the files on the server

更多详细用法请参考 [API docs]() :--:1
```python
app.static("/static", "/path/to/directory")
```
:---

---:1

您也可以提供单独的文件 :--:1
```python
app.static("/", "/path/to/index.html")
```
:---

---:1

It is also sometimes helpful to name your endpoint :--:1
```python
app.static(
    "/user/uploads",
    "/path/to/uploads",
    name="uploads",
)
```
:---

---:1

Retrieving the URLs works similar to handlers. But, we can also add the `filename` argument when we need a specific file inside a directory. :--:1
```python
>>> app.url_for(
    "static",
    name="static",
    filename="file.txt",
)
'/static/file.txt'
```
```python
>>> app.url_for(
    "static",
    name="uploads",
    filename="image.png",
)
'/user/uploads/image.png'

```
:---

如果您想要设置多个静态文件路由，我们*强烈建议*您手动为 `static()` 加上 `name` 参数。 可以确定的是，这样做可以减少一些潜在且隐蔽的 bug。

```python
app.static("/user/uploads", "/path/to/uploads", name="uploads")
app.static("/user/profile", "/path/to/profile", name="profile_pics")
```
:::

## 路由上下文(Route context)

定义路由时，您可以添加任意数量的带有 `ctx_` 前缀的关键字参数。 这些值将被注入到路由的 `ctx` 对象中。 :--:1
```python
@app.get("/1", ctx_label="something")
async def handler1(request):
    ...

@app.get("/2", ctx_label="something")
async def handler2(request):
    ...

@app.get("/99")
async def handler99(request):
    ...

@app.on_request
async def do_something(request):
    if request.route.ctx.label == "something":
        ...

@app.get("/2", ctx_label="something")
async def handler2(request):
    ...

@app.get("/99")
async def handler99(request):
    ...

@app.on_request
async def do_something(request):
    if request.route.ctx.label == "something":
        ...
```
:--- *Added in v21.12*
