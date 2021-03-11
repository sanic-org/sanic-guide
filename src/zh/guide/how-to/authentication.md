# 认证（Authentication）

> 我该如何控制认证和权限？

这是一个*十分*复杂的话题，很难用几行代码阐述清楚。尽管如此，本章节也许能够为您提供一些解决问题的思路。

下面的例子使用了[JWTs](https://jwt.io/)来实现，如果您想使用session或者是其他的方式，那做法应该是类似的。

:::: tabs
::: tab server.py
```python
from sanic import Sanic, text

from auth import protected
from login import login

app = Sanic("AuthApp")
app.config.SECRET = "KEEP_IT_SECRET_KEEP_IT_SAFE"
app.blueprint(login)


@app.get("/secret")
@protected
async def secret(request):
    return text("To go fast, you must be fast.")
```
:::
::: tab login.py
```python
import jwt
from sanic import Blueprint, text

login = Blueprint("login", url_prefix="/login")


@login.post("/")
async def do_login(request):
    token = jwt.encode({}, request.app.config.SECRET)
    return text(token)
```
:::
::: tab auth.py
```python
from functools import wraps

import jwt
from sanic import text


def check_token(request):
    if not request.token:
        return False

    try:
        jwt.decode(
            request.token, request.app.config.SECRET, algorithms=["HS256"]
        )
    except jwt.exceptions.InvalidTokenError:
        return False
    else:
        return True


def protected(wrapped):
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            is_authenticated = check_token(request)

            if is_authenticated:
                response = await f(request, *args, **kwargs)
                return response
            else:
                return text("You are unauthorized.", 401)

        return decorated_function

    return decorator(wrapped)
```
这一段装饰器的代码来自于[装饰器](/zh/guide/best-practices/decorators.md)一节
:::
::::

```bash
$ curl localhost:9999/secret -i
HTTP/1.1 401 Unauthorized
content-length: 21
connection: keep-alive
content-type: text/plain; charset=utf-8

You are unauthorized.

$ curl localhost:9999/login -X POST                                                                                                                                                                               7 ↵
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.rjxS7ztIGt5tpiRWS8BGLUqjQFca4QOetHcZTi061DE

$ curl localhost:9999/secret -i -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.rjxS7ztIGt5tpiRWS8BGLUqjQFca4QOetHcZTi061DE"
HTTP/1.1 200 OK
content-length: 29
connection: keep-alive
content-type: text/plain; charset=utf-8

To go fast, you must be fast.

$ curl localhost:9999/secret -i -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.BAD"                                        
HTTP/1.1 401 Unauthorized
content-length: 21
connection: keep-alive
content-type: text/plain; charset=utf-8

You are unauthorized.
```

同时，您可以查看一下社区内提供的资源：
 
- Awesome Sanic - [认证（Authentication）](https://github.com/mekicha/awesome-sanic/blob/master/README.md#authentication) & [会话（Session）](https://github.com/mekicha/awesome-sanic/blob/master/README.md#session)
- [EuroPython 2020 - Overcoming access control in web APIs](https://www.youtube.com/watch?v=Uqgoj43ky6A)
