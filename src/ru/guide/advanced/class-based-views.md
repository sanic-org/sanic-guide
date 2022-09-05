# Объекты представления на основе классов

## Зачем их использовать?

---:1

### Проблема

Стандартным шаблоном проектирования API является наличие у одного и того же эндпоинта разной функциональности, которая зависит от HTTP метода.

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

Для регистрации объекта представления на основе классов в эндпоинте используется метод `app.add_route`. Первым аргументом должен быть заданный класс с методом `as_view`, а вторым - URL-путь к эндпоинту.

Перечень доступных методов:

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

  # Вы также можете использовать async
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

Вы можете использовать параметры пути точно так же, как это обсуждалось в разделе [Маршрутизация](/guide/basics/routing.md). :--:1
```python
class NameView(HTTPMethodView):

  def get(self, request, name):
    return text("Hello {}".format(name))

app.add_route(NameView.as_view(), "/<name>")
```
:---

## Декораторы

Как обсуждалось в разделе [Декораторы](/guide/best-practices/decorators.md), часто вам нужно добавить функционал в эндпоинты с использованием декораторов. С объектами представления на основе классов у вас есть два варианта:

1. Применить ко _всем_ HTTP-методам в представлении
2. Индивидуально применить к конкретным HTTP-методам

Давайте посмотрим, как это выглядит:

---:1

### Применение ко всем методам

Если вы хотите добавить какие-то декораторы к классу целиком, вы можете определить переменную класса `decorators`. Эти декораторы будут применены к классу, когда вызывается `as_view`. :--:1
```python
class ViewWithDecorator(HTTPMethodView):
  decorators = [список_объектов_декораторов]

  def get(self, request, name):
    return text("Hello I have a decorator")

  def post(self, request, name):
    return text("Hello I also have a decorator")

app.add_route(ViewWithDecorator.as_view(), "/url")
```
:---

---:1

### Применение к отдельным методам

Но если вы просто хотите задекорировать не все, а отдельные методы, вы можете сделать это так, как показано ниже. :--:1
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

## Создание URL
---:1

Это работает аналогично [созданию любого другого URL](/guide/basics/routing.md#generating-a-url) за исключением того, что имя класса является частью эндпоинта. :--:1
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
