# 装饰器（Decorators）

为了更好的创建一个web API，在编码时遵循“一次且仅一次”的原则很有必要的，而使用装饰器则是遵循这些原则的最好方式之一，您可以将特定的逻辑进行封装，灵活的在各种响应程序上复用。

---:1

因此，在Sanic的视图函数上使用多个装饰器是十分常见的。
:--:1
```python
@app.get("/orders")
@authorized("view_order")
@validate_list_params()
@inject_user()
async def get_order_details(request, params, user):
    ...
```
:---


### 例子

这里有一个入门模板来帮助您创建装饰器。

在下面的例子中，假设您想去检查某个用户是否对特定的路由有访问的权限。您可以创建一个装饰器来装饰一个响应程序，检查发送请求的客户端是否有权限来访问该资源，并返回正确的响应。
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
