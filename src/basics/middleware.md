# Middleware

Whereas listeners allow you to attach functionality to the lifecycle of a worker process, middleware allows you to attach functionality to the lifecycle of an HTTP stream.

You can execute middleware either _before_ the handler is executed, or _after_.

```text
event       <http connection is made, parsed, routed>
middleware        request

event                 <route handler executed>

middleware        response
event       <response is delivered and stram is closed>
```

## Attaching middleware

<!-- panels:start -->
<!-- div:left-panel -->
This should probably look familar by now. All you need to do is declare when you would like the middleware to execute: on the `request` or on the `response`.
<!-- div:right-panel -->
```python
async def extract_user(request):
    request.ctx.user = await extract_user_from_request(request)

app.register_middleware(extract_user, "request")
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
Again, the `Sanic` app instance also has a convenience decorator.
<!-- div:right-panel -->
```python
@app.middleware("request")
async def extract_user(request):
    request.ctx.user = await extract_user_from_request(request)
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
Response middleware receives both the `request` and `response` arguments.
<!-- div:right-panel -->
```python
@app.middleware('response')
async def prevent_xss(request, response):
    response.headers["x-xss-protection"] = "1; mode=block"
```
<!-- panels:end -->

## Modification

<!-- panels:start -->
<!-- div:left-panel -->
Middleware can modify the request or response parameter it is given, _as long as it does not return it_.
<!-- div:right-panel -->
```python
app = Sanic(__name__)


@app.middleware("request")
async def add_key(request):
    # Arbitrary data may be stored in request context:
    request.ctx.foo = "bar"


@app.middleware("response")
async def custom_banner(request, response):
    response.headers["Server"] = "Fake-Server"


@app.middleware("response")
async def prevent_xss(request, response):
    response.headers["x-xss-protection"] = "1; mode=block"


@app.get("/")
async def index(request):
    return text(request.ctx.foo)


app.run(host="0.0.0.0", port=8000)
```
<!-- panels:end -->

## Resonding early

## Order of execution

exception caveat in request middleware
