# Class Based Views

## Why use them?

<!-- panels:start -->
<!-- div:left-panel -->
### The problem

A common pattern when designing an API is to have multiple functionality on the same endpoint that depends upon the HTTP method.

While both of these options work, they are not good design practices and may be hard to maintain over time as your project grows.
<!-- div:right-panel -->
```python
@app.get("/foo")
async def foo_get(request):
    ...

@app.post("/foo")
async def foo_post(request):
    ...

@app.put("/foo")
async def foo_put(request):
    ...

@app.route("/bar", methods=["GET", "POST", "PATCH"])
async def bar(request):
    if request.method == "GET":
        ...
    elif request.method == "POST":
        ...
    elif request.method == "PATCH":
        ...
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
### The solution

Class-based views are simply classes that implement response behaviour to requests. They provide a way to compartmentalise handling of different HTTP request types at the same endpoint.
<!-- div:right-panel -->
```python
from sanic.views import HTTPMethodView

class FooBar(HTTPMethodView):
    async def get(self, request):
        ...
        
    async def post(self, request):
        ...
        
    async def put(self, request):
        ...

app.add_route(FooBar.as_view(), "/foobar)
```
<!-- panels:end -->

## Defining a view

A class-based view should subclass `HTTPMethodView`. You can then implement class methods with the name of the corresponding HTTP method. If a request is received that has no defined method, a `405: Method not allowed` response will be generated.

<!-- panels:start -->
<!-- div:left-panel -->
To register a class-based view on an endpoint, the `app.add_route` method is used. The first argument should be the defined class with the method `as_view` invoked, and the second should be the URL endpoint.

The available methods are:

- get
- post
- put
- patch
- delete
- head
- options
<!-- div:right-panel -->
```python
from sanic.views import HTTPMethodView
from sanic.response import text

class SimpleView(HTTPMethodView):

  def get(self, request):
      return text("I am get method")

  # You can also use async syntax
  async def post(self, request):
      return text("I am post method")

  def put(self, request):
      return text("I am put method")

  def patch(self, request):
      return text("I am patch method")

  def delete(self, request):
      return text("I am delete method")

app.add_route(SimpleView.as_view(), "/")
```
<!-- panels:end -->

## Path parameters

<!-- panels:start -->
<!-- div:left-panel -->
You can use path parameters exactly as discussed in [the routing section](/basics/routing.md).
<!-- div:right-panel -->
```python
class NameView(HTTPMethodView):

  def get(self, request, name):
    return text("Hello {}".format(name))

app.add_route(NameView.as_view(), "/<name>")
```
<!-- panels:end -->

## Decorators

As discussed in [the decorators section](/best-practices/decorators.md), oftern you will need to add funcitonality to endpoints with the use of decorators. You have two options with CBV:

1. Apply to _all_ HTTP methods in the view
2. Apply individually to HTTP methods in the view


<!-- panels:start -->
<!-- div:left-panel -->
### Apply to all methods

If you want to add any decorators to the class, you can set the `decorators` class variable. These will be applied to the class when `as_view` is called.
<!-- div:right-panel -->
```python
class ViewWithDecorator(HTTPMethodView):
  decorators = [some_decorator_here]

  def get(self, request, name):
    return text("Hello I have a decorator")

  def post(self, request, name):
    return text("Hello I also have a decorator")

app.add_route(ViewWithDecorator.as_view(), "/url")
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
### Apply to individual methods

But if you just want to decorate some methods and not all methods, you can as shown here.
<!-- div:right-panel -->
```python
class ViewWithSomeDecorator(HTTPMethodView):

    @staticmethod
    @some_decorator_here
    def get(request, name):
        return text("Hello I have a decorator")

    def post(self, request, name):
        return text("Hello I don"t have any decorators")

    @some_decorator_here
    def patch(self, request, name):
        return text("Hello I have a decorator")
```
<!-- panels:end -->

## Generating a URL
<!-- panels:start -->
<!-- div:left-panel -->
This works just like [generating any other URL](/basics/routing.md?id=generating-a-url), except that the class name is a part of the endpoint.
<!-- div:right-panel -->
```python
@app.route("/")
def index(request):
    url = app.url_for("SpecialClassView")
    return redirect(url)


class SpecialClassView(HTTPMethodView):
    def get(self, request):
        return text("Hello from the Special Class View!")


app.add_route(SpecialClassView.as_view(), "/special_class_view")
```
<!-- panels:end -->

## Composition view

As an alternative to the `HTTPMethodView`, you can use `CompositionView` to move handler functions outside of the view class.

Handler functions for each supported HTTP method are defined elsewhere in the source, and then added to the view using the `CompositionView.add` method. The first parameter is a list of HTTP methods to handle (e.g. `["GET", "POST"]`), and the second is the handler function.

```python
from sanic.views import CompositionView

def get_handler(request):
    return text("I am a get method")

view = CompositionView()
view.add(["GET"], get_handler)
view.add(["POST", "PUT"], lambda request: text("I am a post/put method"))

# Use the new view to handle requests to the base URL
app.add_route(view, "/")
```

!> **Warning** Currently you cannot build a URL for a `CompositionView` using url_for.
