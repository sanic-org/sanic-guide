# 请求(Request)

`Request` 实例包含许多有关其参数的有用信息。 如果您想了解更多详细信息，请参考 [API文档](https://sanic.readthedocs.io/)。

## 请求体(Body)

:::: tabs

::: tab JSON

**参数名称**: `request.json`  

**参数说明**:  解析后的 JSON 对象

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```

```python
>>> print(request.json)
{'foo': 'bar'}
```

:::

::: tab Raw

**参数名称**: `request.body`  

**参数说明**: 请求正文中的原始字节

```bash
$ curl localhost:8000 -d '{"foo": "bar"}'
```

```python
>>> print(request.body)
b'{"foo": "bar"}'
```
:::

::: tab Form

**参数名称**: `request.form`  

**参数说明**: 表单数据

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

::: tip 小提示：

:bulb:  `request.form` 对象是少数几种字典之一，每个值都是一个列表。这是因为 HTTP 允许单个键名被重用以发送多个值。

大多数情况下您只需要使用 `.get()` 方法来获取列表中的第一个元素即可，如果您想获取列表中的全部元素，那么请使用 `.getlist()` 方法。

:::

::: tab Uploaded

**参数名称**: `request.files`  

**参数说明**: 上传到服务器的文件

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
::: tip 小提示：

:bulb:  和 `request.form` 对象一样， `request.files` 也是少数几种字典之一，每个值都是一个列表。这是因为 HTTP 同样允许单个键名被重用以发送多个文件。

获取方式也和 `request.form` 一致，大多数情况下您只需要使用 `.get()` 方法来获取列表中的第一个元素即可，如果您想获取列表中的全部元素，那么请使用 `.getlist()` 方法。

:::

::::

## 上下文(Context)

### 请求上下文(Request context)

`request.ctx` 对象是存储请求相关信息的地方。

这里通常被用来存储服务端通过某些验证后需要临时存储的身份认证信息以及专有变量等内容。更多的具体内容我们将在 [中间件](/zh/guide/advanced/middleware.md) 这一章节进行更多的描述，下面是一个简单的例子。

```python
@app.middleware("request")
async def run_before_handler(request):
    request.ctx.user = await fetch_user_by_token(request.token)

@app.route('/hi')
async def hi_my_name_is(request):
    return text("Hi, my name is {}".format(request.ctx.user.name))
```

最典型的用法就是将从数据库获取的用户对象存储在 `request.ctx` 中。所有该中间件之后的其他中间件以及请求期间的处理程序都可以对此进行访问。

自定义上下文是为了应用程序和拓展插件而保留的，Sanic 本身并不使用它。

### 连接上下文(Connection context)

---:1

通常情况下，您的应用程序需要向同一个客户端提供多个并发（或连续）的请求。这种情况通常发生在需要查询多个端点来获取数据的渐进式网络应用程序中。

在 HTTP 协议要求通过 [keep alive](../deployment/configuration.md#keep-alive-timeout) 请求头来减少频繁连接所造成的时间浪费。

当多个请求共享一个连接时，Sanic 将提供一个上下文对象来允许这些请求共享状态。

:--:1

```python
@app.on_request
async def increment_foo(request):
    if not hasattr(request.conn_info.ctx, "foo"):
        request.conn_info.ctx.foo = 0
    request.conn_info.ctx.foo += 1

@app.get("/")
async def count_foo(request):
    return text(f"request.conn_info.ctx.foo={request.conn_info.ctx.foo}")
```

```bash
$ curl localhost:8000 localhost:8000 localhost:8000
request.conn_info.ctx.foo=1
request.conn_info.ctx.foo=2
request.conn_info.ctx.foo=3
```

:---

## 路由参数(Parameter)

---:1

从路径提取的路由参数将作为参数（或更具体地作为关键字参数）传递到处理程序中。更多的详细内容我们将在 [路由](/zh/guide/basics/routing.md) 这一章节进行详细说明

:--:1

```python
@app.route('/tag/<tag>')
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---

## 请求参数(Arguments)

在 `request` 中，您可以通过两种属性来访问请求参数：

- `request.args`
- `request.query_args`

```bash
$ curl http://localhost:8000\?key1\=val1\&key2\=val2\&key1\=val3
```

```python
>>> print(request.args)
{'key1': ['val1', 'val3'], 'key2': ['val2']}

>>> print(request.args.get("key1"))
val1

>>> print(request.args.getlist("key1"))
['val1', 'val3']

>>> print(request.query_args)
[('key1', 'val1'), ('key2', 'val2'), ('key1', 'val3')]

>>> print(request.query_string)
key1=val1&key2=val2&key1=val3

```

::: tip 小提示：

:bulb: 和上述的​ `request.form`、`request.files` 对象一样，`request.args` 同样是少数几种字典之一，每个值都是一个列表。这是因为HTTP允许单个键名被重用以发送多个值。 

获取方式也和 它们一致，大多数情况下您只需要使用 `.get()` 方法来获取列表中的第一个元素即可，如果您想获取列表中的全部元素，那么请使用 `.getlist()` 方法。

:::
