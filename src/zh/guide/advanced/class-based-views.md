# 基于类的视图(Class Based Views)

## 为什么要使用它？(Why use them?)

---:1

### 困境(The problem)

在日常的 API 设计过程中，将不同的响应函数通过不同的 HTTP 方法挂载到同一路由上是一种常用的设计模式。

虽然我们之前讲到的方式也能够实现同样的效果，但事实证明它们并不是一种好的设计实践。随着时间的推移以及项目的发展，它们将变得越来越难以维护：

:--:1

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

:---

---:1

### 破局(The solution)

基于类的视图是一种实现了响应请求行为的类，该类提供了一种在同一路由上分隔处理不同 HTTP 请求类型的方法。 

:--:1

```python
from sanic.views import HTTPMethodView

class FooBar(HTTPMethodView):
    async def get(self, request):
        ...
        
    async def post(self, request):
        ...
        
    async def put(self, request):
        ...

app.add_route(FooBar.as_view(), "/foobar")
```

:---

## 定义视图(Defining a view)

基于类的视图应该是 `HTTPMethodView` 的子类 。您可以使用相应的 HTTP 方法的名称实现类方法。如果收到的请求没有定义的方法，将生成  `405: Method not allowed` 响应。

---:1

若想要将基于类的视图挂载到路由上，则应该使用 `app.add_route` 方法，其中第一个参数是使用 `as_view` 调用后的已经定义好的类，第二个参数是要分配的 URL 路由。

HTTPMethodView 支持的方法有：

- get
- post
- put
- patch
- delete
- head
- options

:--:1

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

:---

## 路由参数(Path parameters)

---:1

您完全可以按照我们在 [路由](/zh/guide/basics/routing.md) 这一章节所讨论的使用方式来使用路由参数。

:--:1

```python
class NameView(HTTPMethodView):

  def get(self, request, name):
    return text("Hello {}".format(name))

app.add_route(NameView.as_view(), "/<name>")
```

:---

## 装饰器(Decorators)

就像 [装饰器](/zh/guide/best-practices/decorators.md) 这一章节所述，您可能经常需要使用装饰器来对您的响应函数添加额外的功能，基于类的视图给出了两种方式来添加装饰器：

1.  应用于视图中的 *所有*  HTTP 方法
2.  独自应用于视图中的 *指定*  HTTP 方法

---:1

### 用于所有方法(Apply to all methods)

如果您想要添加应用于所有方法的类，您可以通过类变量 `decorators` 来实现，设置后，这些装饰器将在调用 `as_view` 时应用于类。

:--:1

```python
class ViewWithDecorator(HTTPMethodView):
  decorators = [some_decorator_here]

  def get(self, request, name):
    return text("Hello I have a decorator")

  def post(self, request, name):
    return text("Hello I also have a decorator")

app.add_route(ViewWithDecorator.as_view(), "/url")
```
:---

---:1

### 应用于单个方法(Apply to individual methods)

但是，如果您只是想装饰一些方法，而不是所有的方法，您可以这样使用：

:--:1

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
:---

## URL生成(Generating a URL)

---:1

和路由章节中的 [URL生成](/zh/guide/basics/routing.md#generating-a-url) 一样，除了指定需要添加的类之外，其他的使用方法是一致的。

:--:1

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

:---

## 合成视图(Composition view)

作为 `HTTPMethodView` 的替代方法，可以使用 `CompositionView` 将处理程序函数移至视图类之外。

每个支持的 HTTP 方法的响应函数都在源代码的其他地方定义，然后使用 `CompositionView.add` 方法添加到视图中来。 第一个参数是要处理的 HTTP 方法的列表（例如 `[“ GET”，“ POST”]`），第二个参数是响应函数。

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

::: warning

目前为止，Sanic 暂时不支持您使用 `url_for` 来为 `CompositionView` 生成 URL

:::
