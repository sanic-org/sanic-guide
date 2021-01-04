# Decorators

One of the best ways to create a consistent and DRY web API is to make use of decorators to remove functionality from the handlers, and make it repeatable across your views.

<!-- panels:start -->
<!-- div:left-panel -->
Therefore, it is very common to see a Sanic view handler with several decorators on it.
<!-- div:right-panel -->
```python
@app.get("/orders")
@authorized("view_order")
@validate_list_params()
@inject_user()
async def get_order_details(request, params, user):
    ...
```
<!-- panels:end -->


### Example

Here is a starter template to help you create decorators.

In this example, let’s say you want to check that a user is authorized to access a particular endpoint. You can create a decorator that wraps a handler function, checks a request if the client is authorized to access a resource, and sends the appropriate response.
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
