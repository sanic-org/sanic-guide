# 注入（Injection）

依赖注入是一种根据定义的函数签名向响应程序中添加参数的方法。 这在许多情况下很有用，例如：

- 基于请求头获取对象（如当前 Session 用户）
- 将某些对象重构为指定的格式
- 通过 request 对象对数据进行预处理
- 自动注入服务

当您 `扩展` 应用程序时，响应程序上会挂载一个 `注入` 方法。该方法接受以下参数：

- *类*： 一些独特的类，将成为对象的类型
- *构造函数*（可选）： 将返回该类型的函数

让我们通过一些例子来实际体会一下：

## 基本实现（Basic implementation）

最简单的例子就是用它来重写一个值。

---:1

如果您想要基于匹配的路径参数生成一个模型，这可能会很有用。

:--:1

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
```

```
$ curl localhost:8000/chocolate
You chose Chocolate (Yum!)
```

:---

## 附加构造函数（Additional constructors）

---:1

有时您可能还需要传递一个构造函数。这可能是一个函数，甚至可能是一个充当构造函数的类方法。在这个例子中，我们正在创建一个名为 `Person.create` 的注入。

同样需要注意的是，在这个例子中，我们实际上是在注入 **两个对象** ！当然并不需要这样，但是我们将基于函数签名注入对象。

当构造函数没有传递给 `ext.injection` 时，将通过调用该类型来创建对象。

:--:1

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

```
$ curl localhost:8000/person/123
PersonID(person_id=123)
Person(person_id=PersonID(person_id=123), name='noname', age=111)
```

:---

## 来自 `Request` 的对象（Objects from the `Request`）

---:1

有时，您可能希望从请求中提取细节并对它们进行预处理。例如，您可以将请求 JSON 转换为 Python 对象，然后基于数据库查询添加一些额外的逻辑。

::: warning 注意

如果您计划使用这种方法，您应该注意到注入操作实际上是在 Sanic 读取请求体之前发生的。请求头应该已经被处理。因此，如果您确实想要访问请求体，您将需要手动消费，如本例所示。

```python
await request.receive_body()
```

:::

这可以用于以下情况:

- 使用中间件对 `request.ctx` 进行预处理并添加内容
- 使用装饰器对请求处理程序进行预处理并注入参数

:--:1

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
$ curl localhost:8000/profile -X PATCH -d '{"name": "Alice", "birthday": "2000-01-01"}'
{
    "name":"Alice",
    "age":21,
    "email":"alice@something.com"
}
```

:---

## 注入服务（Injecting services）

---:1

创建数据库连接池之类的对象并将它们存储在 `app.ctx` 对象上是一种常见的模式。这使得它们可以在整个应用程序中使用，这是一种非常方便的做法。

但是这样做的缺点是您将不再拥有一个类型化的对象可以使用。您可以通过注入来解决这个问题。

:--:1

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
$ curl localhost:8000/
result
```

:---
