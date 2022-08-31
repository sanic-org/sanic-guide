# Объекты представления на основе классов

## Зачем их использовать?

---:1

### Проблема

Стандартным шаблоном при проектировании API является наличие у одного и того же эндпоинта разной функциональности, которая зависит от HTTP метода.

Несмотря на то, что оба этих варианта работают, они являются не самыми лучшими методами проектирования и возможно их будет трудно поддерживать в будущем по мере роста вашего проекта. :--:1
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

### Решение

Объекты представления на основе классов - это просто классы, которые реализуют поведение ответов на запросы. Они обеспечивают способ разделения обработки различных типов HTTP-запросов в одном и том же эндпоинте. :--:1
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

## Определение представления

Объект представления на основе классов должен быть подклассом `HTTPMethodView`. Затем вы можете реализовать методы класса с названием соответствующего HTTP-метода. Если запрос содержит метод, который не был определен в представлении, будет сгенерирован ответ `405: Method not allowed`.

---:1

Для регистрации объекта представления на основе классов в эндпоинте используется метод `app.add_route`. Первым аргументом должен быть заданный класс с методом `as_view`, а вторым должен быть URL-путь к эндпоинту.

Доступные методы включают в себя:

- get
- post
- put
- patch
- delete
- head
- options :--:1
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

## Параметры пути

---:1

You can use path parameters exactly as discussed in [the routing section](/guide/basics/routing.md). :--:1
```python
class NameView(HTTPMethodView):

  def get(self, request, name):
    return text("Hello {}".format(name))

app.add_route(NameView.as_view(), "/<name>")
```
:---

## Decorators

As discussed in [the decorators section](/guide/best-practices/decorators.md), often you will need to add functionality to endpoints with the use of decorators. You have two options with CBV:

1. Apply to _all_ HTTP methods in the view
2. Apply individually to HTTP methods in the view

Let's see what the options look like:

---:1

### Apply to all methods

If you want to add any decorators to the class, you can set the `decorators` class variable. These will be applied to the class when `as_view` is called. :--:1
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

### Apply to individual methods

But if you just want to decorate some methods and not all methods, you can as shown here. :--:1
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

## Generating a URL
---:1

This works just like [generating any other URL](/guide/basics/routing.md#generating-a-url), except that the class name is a part of the endpoint. :--:1
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
