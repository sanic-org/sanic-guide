# Request

The `Request` instance contains **a lot** of helpful information available on its parameters. Refer to the [API documentation](https://sanic.readthedocs.io/) for full details.

## Body

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
## Context

The `request.ctx` object is your playground to store whatever information you need to about the request.

This is often used to store items like authenticated user details. We will get more into [middleware](middleware.md) later, but here is a simple example.

```python
@app.middleware("request")
async def run_before_handler(request):
    request.ctx.user = await fetch_user_by_token(request.token)

@app.route('/hi')
async def hi_my_name_is(request):
    return text("Hi, my name is {}".format(request.ctx.user.name))
```

A typical use case would be to store the user object acquired from database in an authentication middleware. Keys added are accessible to all later middleware as well as the handler over the duration of the request.

Custom context is reserved for applications and extensions. Sanic itself makes no use of it.

## Parameters

<!-- panels:start -->
<!-- div:left-panel -->
Values that are extracted from the path are injected into the handler as parameters, or more specifically as keyword arguments. There is much more detail about this in the [Routing section](routing.md).
<!-- div:right-panel -->
```python
@app.route('/tag/<tag>')
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
<!-- panels:end -->


## Arguments

There are two attibutes on the `request` instance to get query parameters:

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

?> :bulb: **FYI** The `request.args` object is one of a few types that is a dictionary with each value being a list. This is because HTTP allows a single key to be reused to send multiple values.  
Most of the time you will want to use the `.get()` method can be used to access the first element and not a list. If you do want a list of all items, you can user `.getlist()`.
