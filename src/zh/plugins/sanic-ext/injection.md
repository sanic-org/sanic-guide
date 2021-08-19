# Injection

Dependency injection is a method to add arguments to a route handler based upon the defined function signature. This can be useful in a number of cases like:

- Fetching an object based upon request headers (like the current session user)
- Recasting certain objects into a specific type
- Using the request object to prefetch data
- Auto inject services

When you `Extend` your application, the return instance has an `injection` method on it. That method accepts the following arguments:

- *type*: some unique class that will be the type of the oject
- *constructor* (OPTIONAL): a function that will return that type

Let's explore some use cases here.

## Basic implementation

The simplest use case would be simply to recast a value.

---:1

This could be useful if you have a model that you want to generate based upon the matched path parameters.

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

## Additional constructors

---:1

Sometimes you may need to also pass a constructor. This could be a function, or perhaps even a classmethod that acts as a constructor. In this example, we are creating an injection that will call `Person.create` first.

Also important to note on this example, we are actually injecting **two (2)** objects! It of course does not need to be this way, but we will inject objects based upon the function signature.

When a constructor is not passed to `ext.injection`, then the object will be created by calling the type.

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

## Objects from the `Request`

---:1

Sometimes you may want to extract details from the request and preprocess them. You could, for example, cast the request JSON to a Python object, and then add some additional logic based upon DB queries.

::: warning
If you plan to use this method, you should note that the injection actually happens *before* Sanic has had a chance to read the request body. The headers should already have been consumer. So, if you do want access to the body, you will need to manually consume as seen in this example.

```python
await request.receive_body()
```
:::

This could be used in cases where you otherwise might:

- use middleware to preprocess and add something to the `request.ctx`
- use decorators to preprocess and inject arguments into the request handler

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

## Injecting services

---:1

It is a common pattern to create things like DB connection pools and store them on the `app.ctx` object. This makes them available throughout your application, which is certainly a convenience.

One downside, however, is that you no longer have a typed object to work with. You could use injections to fix this.

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
