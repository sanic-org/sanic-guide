# 装饰器(Decorators)

为了更好的创建一个 web API，在编码时遵循“一次且仅一次”的原则很有必要的，而使用装饰器则是遵循这些原则的最好方式之一，您可以将特定的逻辑进行封装，灵活的在各种响应函数上复用。

---:1

因此，在 Sanic 的视图函数上使用多个装饰器是十分常见的。 :--:1
```python
@app.get("/orders")
@authorized("view_order")
@validate_list_params()
@inject_user()
async def get_order_details(request, params, user):
    ...
```
:---


## 例子(Example)

这里有一个入门模板来帮助您创建装饰器。

在下面的例子中，假设您想去检查某个用户是否对特定的路由有访问的权限。 您可以创建一个装饰器来装饰一个响应函数，检查发送请求的客户端是否有权限来访问该资源，并返回正确的响应。
```python
from functools import wraps
from sanic.response import json

def authorized():
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            # run some method that checks the request
            # for the client's authorization status
            is_authorized = await check_request_for_authorization_status(request)

            if is_authorized:
                # the user is authorized.
                # run the handler method and return the response
                response = await f(request, *args, **kwargs)
                return response
            else:
                # the user is not authorized.
                return json({"status": "not_authorized"}, 403)
        return decorated_function
    return decorator


@app.route("/")
@authorized()
async def test(request):
    return json({"status": "authorized"})
```

## Templates

Decorators are **fundamental** to building applications with Sanic. They increase the portability and maintainablity of your code.

In paraphrasing the Zen of Python: "[decorators] are one honking great idea -- let's do more of those!"

To make it easier to implement them, here are three examples of copy/pastable code to get you started.

---:1

Don't forget to add these import statements. Although it is *not* necessary, using `@wraps` helps keep some of the metadata of your function intact. [See docs](https://docs.python.org/3/library/functools.html#functools.wraps). Also, we use the `isawaitable` pattern here to allow the route handlers to by regular or asynchronous functions.

:--:1

```python
from inspect import isawaitable
from functools import wraps
```

:---

### With args

---:1

Often, you will want a decorator that will *always* need arguments. Therefore, when it is implemented you will always be calling it.

```python
@app.get("/")
@foobar(1, 2)
async def handler(request: Request):
    return text("hi")
```

:--:1

```python
from functools import wraps
from sanic.response import json

def authorized():
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            # run some method that checks the request
            # for the client's authorization status
            is_authorized = await check_request_for_authorization_status(request)

            if is_authorized:
                # the user is authorized.
                # run the handler method and return the response
                response = await f(request, *args, **kwargs)
                return response
            else:
                # the user is not authorized.
                return json({"status": "not_authorized"}, 403)
        return decorated_function
    return decorator


@app.route("/")
@authorized()
async def test(request):
    return json({"status": "authorized"})
```

:---

### Without args

---:1

Sometimes you want a decorator that will not take arguments. When this is the case, it is a nice convenience not to have to call it

```python
@app.get("/")
@foobar
async def handler(request: Request):
    return text("hi")
```

:--:1

```python
def foobar(func):
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):

            response = f(request, *args, **kwargs)
            if isawaitable(response):
                response = await response

            return response

        return decorated_function

    return decorator(func)
```

:---

### With or Without args

---:1

If you want a decorator with the ability to be called or not, you can follow this pattern. Using keyword only arguments is not necessary, but might make implementation simpler.

```python
@app.get("/")
@foobar(arg1=1, arg2=2)
async def handler(request: Request):
    return text("hi")
```

```python
@app.get("/")
@foobar
async def handler(request: Request):
    return text("hi")
```

:--:1

```python
def foobar(maybe_func=None, *, arg1=None, arg2=None):
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):

            response = f(request, *args, **kwargs)
            if isawaitable(response):
                response = await response

            return response

        return decorated_function

    return decorator(maybe_func) if maybe_func else decorator
```

:---
