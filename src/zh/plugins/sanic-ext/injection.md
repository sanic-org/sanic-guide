# 注入（Injection）

依赖注入是一种根据定义的函数签名向响应程序中添加参数的方法。 Specifically, it looks at the **type annotations** of the arguments in the handler. 这在许多情况下很有用，例如：

- 基于请求头获取对象（如当前 Session 用户）
- 将某些对象重构为指定的格式
- 通过 request 对象对数据进行预处理
- 自动注入服务

The `Extend` instance has two basic methods on it used for dependency injection: a lower level `add_dependency`, and a higher level `dependency`.

让我们通过一些例子来实际体会一下：

- *类*： 一些独特的类，将成为对象的类型
- *构造函数*（可选）： 将返回该类型的函数

最简单的例子就是用它来重写一个值。

- 使用中间件对 `request.ctx` 进行预处理并添加内容
- 使用装饰器对请求处理程序进行预处理并注入参数

Let's explore some use cases here.

::: warning If you used dependency injection prior to v21.12, the lower level API method was called `injection`. It has since been renamed to `add_dependency` and starting in v21.12 `injection` is an alias for `add_dependency`. The `injection` method has been deprecated for removal in v22.6. :::

## 基本实现（Basic implementation）

The simplest use case would be simply to recast a value.

---:1 This could be useful if you have a model that you want to generate based upon the matched path parameters. :--:1
```python
@dataclass
class IceCream:
    flavor: str

    def __str__(self) -> str:
        return f"{self.flavor.title()} (Yum!)"


ext.injection(IceCream)


@app.get("/<flavor:str>")
async def ice_cream(request, flavor: IceCream):
    return text(f"You chose: {flavor}")


app.ext.add_dependency(IceCream)


@app.get("/<flavor:str>")
async def ice_cream(request, flavor: IceCream):
    return text(f"You chose: {flavor}")
```

```
$ curl localhost:8000/chocolate
You chose Chocolate (Yum!)
```
:---

---:1 This works by passing a keyword argument to the constructor of the `type` argument. The previous example is equivalent to this. :--:1
```python
@dataclass
class PersonID:
    person_id: int


@dataclass
class Person:
    person_id: PersonID
    name: str
    age: int

    @classmethod
    async def create(cls, request: Request, person_id: int):
        return cls(person_id=PersonID(person_id), name="noname", age=111)


ext.injection(Person, Person.create)
ext.injection(PersonID)


@app.get("/person/<person_id:int>")
async def person_details(
        request: Request, person_id: PersonID, person: Person
):
    return text(f"{person_id}\n{person}")
```
:---

## 附加构造函数（Additional constructors）

---:1 Sometimes you may need to also pass a constructor. 这可能是一个函数，甚至可能是一个充当构造函数的类方法。 在这个例子中，我们正在创建一个名为 `Person.create` 的注入。

同样需要注意的是，在这个例子中，我们实际上是在注入 **两个对象** ！ 当然并不需要这样，但是我们将基于函数签名注入对象。 :--:1
```python
@dataclass
class UserProfile:
    user: User
    age: int = field(default=0)
    email: str = field(default="")

    def __json__(self):
        return ujson.dumps(
            {
                "name": self.user.name,
                "age": self.age,
                "email": self.email,
            }
        )


async def fake_request_to_db(body):
    today = date.today()
    email = f'{body["name"]}@something.com'.lower()
    difference = today - date.fromisoformat(body["birthday"])
    age = int(difference.days / 365)
    return UserProfile(
        User(body["name"]),
        age=age,
        email=email,
    )


async def compile_profile(request: Request):
    await request.receive_body()
    profile = await fake_request_to_db(request.json)
    return profile


ext.injection(UserProfile, compile_profile)


@app.patch("/profile")
async def update_profile(request, profile: UserProfile):
    return json(profile)
```

```
$ curl localhost:8000/person/123
PersonID(person_id=123)
Person(person_id=PersonID(person_id=123), name='noname', age=111)
```
:---

When a `constructor` is passed to `ext.add_dependency` (like in this example) that will be called. 当构造函数没有传递给 `ext.injection` 时，将通过调用该类型来创建对象。 A couple of important things to note about passing a `constructor`:

1. A positional `request: Request` argument is *usually* expected. See the `Person.create` method above as an example using a `request` and [arbitrary constructors](#arbitrary-constructors) for how to use a callable that does not require a `request`.
1. All matched path parameters are injected as keyword arguments.
1. Dependencies can be chained and nested. Notice how in the previous example the `Person` dataclass has a `PersonID`? That means that `PersonID` will be called first, and that value is added to the keyword arguments when calling `Person.create`.

## Arbitrary constructors

---:1 Sometimes you may want to construct your injectable _without_ the `Request` object. This is useful if you have arbitrary classes or functions that create your objects. If the callable does have any required arguments, then they should themselves be injectable objects.

This is very useful if you have services or other types of objects that should only exist for the lifetime of a single request. For example, you might use this pattern to pull a single connection from your database pool. :--:1
```python
class Alpha:
    ...


class Beta:
    def __init__(self, alpha: Alpha) -> None:
        self.alpha = alpha

app.ext.add_dependency(Alpha)
app.ext.add_dependency(Beta)

@app.get("/beta")
async def handler(request: Request, beta: Beta):
    assert isinstance(beta.alpha, Alpha)
```
:---

*Added in v22.9*

## 来自 `Request` 的对象（Objects from the `Request`）

---:1 Sometimes you may want to extract details from the request and preprocess them. 例如，您可以将请求 JSON 转换为 Python 对象，然后基于数据库查询添加一些额外的逻辑。

如果您计划使用这种方法，您应该注意到注入操作实际上是在 Sanic 读取请求体之前发生的。 请求头应该已经被处理。 因此，如果您确实想要访问请求体，您将需要手动消费，如本例所示。

```python
await request.receive_body()
```
:::

这可以用于以下情况:

- use middleware to preprocess and add something to the `request.ctx`
- use decorators to preprocess and inject arguments into the request handler

In this example, we are using the `Request` object in the `compule_profile` constructor to run a fake DB query to generate and return a `UserProfile` object. :--:1
```python
class FakeConnection:
    async def execute(self, query: str, **arguments):
        return "result"


@app.before_server_start
async def setup_db(app, _):
    app.ctx.db_conn = FakeConnection()


def get_db(request: Request):
    return request.app.ctx.db_conn


ext.injection(FakeConnection, get_db)


@app.get("/")
async def handler(request, conn: FakeConnection):
    response = await conn.execute("...")
    return text(response)
```

```
$ curl localhost:8000/profile -X PATCH -d '{"name": "Alice", "birthday": "2000-01-01"}'
{
    "name":"Alice",
    "age":21,
    "email":"alice@something.com"
}
```
:---

## 注入服务（Injecting services）

创建数据库连接池之类的对象并将它们存储在 `app.ctx` 对象上是一种常见的模式。 这使得它们可以在整个应用程序中使用，这是一种非常方便的做法。 但是这样做的缺点是您将不再拥有一个类型化的对象可以使用。 You can use dependency injections to fix this. First we will show the concept using the lower level `add_dependency` like we have been using in the previous examples. But, there is a better way using the higher level `dependency` method.

---:1
### The lower level API using `add_dependency`

This works very similar to the [last example](#objects-from-the-request) where the goal is the extract something from the `Request` object. In this example, a database object was created on the `app.ctx` instance, and is being returned in the dependency injection constructor. :--:1
```python
class FakeConnection:
    async def execute(self, query: str, **arguments):
        return "result"


@app.before_server_start
async def setup_db(app, _):
    app.ctx.db_conn = FakeConnection()
    app.ext.add_dependency(FakeConnection, get_db)


def get_db(request: Request):
    return request.app.ctx.db_conn




@app.get("/")
async def handler(request, conn: FakeConnection):
    response = await conn.execute("...")
    return text(response)
```
```
$ curl localhost:8000/
result
```
:---

---:1
### The higher level API using `dependency`

Since we have an actual *object* that is available when adding the dependency injection, we can use the higher level `dependency` method. This will make the pattern much easier to write.

This method should always be used when you want to inject something that exists throughout the lifetime of the application instance and is not request specific. It is very useful for services, third party clients, and connection pools since they are not request specific. :--:1
```python
class FakeConnection:
    async def execute(self, query: str, **arguments):
        return "result"


@app.before_server_start
async def setup_db(app, _):
    db_conn = FakeConnection()
    app.ext.dependency(db_conn)


@app.get("/")
async def handler(request, conn: FakeConnection):
    response = await conn.execute("...")
    return text(response)
```
```
$ curl localhost:8000/
result
```
:---

## Generic types

Be carefule when using a [generic type](https://docs.python.org/3/library/typing.html#typing.Generic). The way that Sanic's dependency injection works is by matching the entire type definition. Therefore, `Foo` is not the same as `Foo[str]`. This can be particularly tricky when trying to use the [higher-level `dependency` method](#the-higher-level-api-using-dependency) since the type is inferred.

---:1 For example, this will **NOT** work as expected since there is no definition for `Test[str]`. :--:1
```python{12,16}
import typing
from sanic import Sanic, text

T = typing.TypeVar("T")


class Test(typing.Generic[T]):
    test: T


app = Sanic("testapp")
app.ext.dependency(Test())


@app.get("/")
def test(request, test: Test[str]):
    ...
```
:---

---:1 To get this example to work, you will need to add an explicit definition for the type you intend to be injected. :--:1
```python{13}
import typing
from sanic import Sanic, text

T = typing.TypeVar("T")


class Test(typing.Generic[T]):
    test: T


app = Sanic("testapp")
_singleton = Test()
app.ext.add_dependency(Test[str], lambda: _singleton)


@app.get("/")
def test(request, test: Test[str]):
    ...
```
:---

## Configuration

---:1 By default, dependencies will be injected after the `http.routing.after` [signal](../../guide/advanced/signals.md#built-in-signals). Starting in v22.9, you can change this to the `http.handler.before` signal. :--:1
```python
app.config.INJECTION_SIGNAL = "http.handler.before"
```
:---

*Added in v22.9*
