# ORM

> How do I use SQLAlchemy with Sanic ?

All ORM tools can work with Sanic, but non-async ORM tool have a impact on Sanic performance. There are some orm packages who support

At present, there are many ORMs that support asynchronicity. Two of the more common libraries are：

- [SQLAlchemy 1.4](https://docs.sqlalchemy.org/en/14/changelog/changelog_14.html)
- [tortoise-orm](https://github.com/tortoise/tortoise-orm)

Integration in to your Sanic application is fairly simple:

## SQLAlchemy

Because [SQLAlchemy 1.4](https://docs.sqlalchemy.org/en/14/changelog/changelog_14.html) has added native support for `asyncio`, Sanic can finally work well with SQLAlchemy. Be aware that this functionality is still considered *beta* by the SQLAlchemy project.


---:1

### Dependencies

First, we need to install the required dependencies. In the past, the dependencies installed were `sqlalchemy` and `pymysql`, but now `sqlalchemy` and `aiomysql` are needed.

:--:1

```shell
pip install -U sqlalchemy
pip install -U aiomysql
```

:---

---:1

### Define ORM Model

ORM model creation remains the same.

:--:1

```python
# ./models.py
from sqlalchemy import INTEGER, Column, ForeignKey, String
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class BaseModel(Base):
    __abstract__ = True
    id = Column(INTEGER(), primary_key=True)


class Person(BaseModel):
    __tablename__ = "person"
    name = Column(String())
    cars = relationship("Car")

    def to_dict(self):
        return {"name": self.name, "cars": [{"brand": car.brand} for car in self.cars]}


class Car(BaseModel):
    __tablename__ = "car"

    brand = Column(String())
    user_id = Column(ForeignKey("person.id"))
    user = relationship("Person", back_populates="cars")
```

:---

---:1

### Create Sanic App and Async Engine

Here we use mysql as the database, and you can also choose PostgreSQL/SQLite. Pay attention to changing the driver from `aiomysql` to `asyncpg`/`aiosqlite`. :--:1


```python
# ./server.py
from sanic import Sanic
from sqlalchemy.ext.asyncio import create_async_engine

app = Sanic("my_app")

bind = create_async_engine("mysql+aiomysql://root:root@localhost/test", echo=True)
```

:---

---:1

### Register Middlewares

The request middleware creates an usable `AsyncSession` object and set it to `request.ctx` and `_base_model_session_ctx`.

Thread-safe variable `_base_model_session_ctx` helps you to use the session object instead of fetching it from `request.ctx`.


:--:1

```python
# ./server.py
from contextvars import ContextVar

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

_sessionmaker = sessionmaker(bind, AsyncSession, expire_on_commit=False)

_base_model_session_ctx = ContextVar("session")

@app.middleware("request")
async def inject_session(request):
    request.ctx.session = _sessionmaker()
    request.ctx.session_ctx_token = _base_model_session_ctx.set(request.ctx.session)


@app.middleware("response")
async def close_session(request, response):
    if hasattr(request.ctx, "session_ctx_token"):
        _base_model_session_ctx.reset(request.ctx.session_ctx_token)
        await request.ctx.session.close()
```

:---

---:1

### Register Routes

According to sqlalchemy official docs, `session.query` will be legacy in 2.0, and the 2.0 way to query an ORM object is using `select`.

:--:1

```python
# ./server.py
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sanic.response import json

from models import Car, Person


@app.post("/user")
async def create_user(request):
    session = request.ctx.session
    async with session.begin():
        car = Car(brand="Tesla")
        person = Person(name="foo", cars=[car])
        session.add_all([person])
    return json(person.to_dict())


@app.get("/user/<pk:int>")
async def get_user(request, pk):
    session = request.ctx.session
    async with session.begin():
        stmt = select(Person).where(Person.id == pk).options(selectinload(Person.cars))
        result = await session.execute(stmt)
        person = result.scalar()

    if not person:
        return json({})

    return json(person.to_dict())
```

:---

### Send Requests

```sh
curl --location --request POST 'http://127.0.0.1:8000/user'
{"name":"foo","cars":[{"brand":"Tesla"}]}
```

```sh
curl --location --request GET 'http://127.0.0.1:8000/user/1'
{"name":"foo","cars":[{"brand":"Tesla"}]}
```


## Tortoise-ORM

---:1

### Dependencies

tortoise-orm's dependency is very simple, you just need install tortoise-orm.

:--:1

```shell
pip install -U tortoise-orm
```

:---

---:1

### Define ORM Model

If you are familiar with Django, you should find this part very familiar.

:--:1

```python
# ./models.py
from tortoise import Model, fields


class Users(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(50)

    def __str__(self):
        return f"I am {self.name}"
```

:---


---:1

### Create Sanic App and Async Engine

Tortoise-orm provides a set of registration interface, which is convenient for users, and you can use it to create database connection easily.

:--:1

```python
# ./main.py

from models import Users
from tortoise.contrib.sanic import register_tortoise

app = Sanic(__name__)


register_tortoise(
    app, db_url="mysql://root:root@localhost/test", modules={"models": ["models"]}, generate_schemas=True
)

```

:---

---:1

### Register Routes

:--:1

```python

# ./main.py

from models import Users
from sanic import Sanic, response


@app.route("/user")
async def list_all(request):
    users = await Users.all()
    return response.json({"users": [str(user) for user in users]})


@app.route("/user/<pk:int>")
async def get_user(request, pk):
    user = await Users.query(pk=pk)
    return response.json({"user": str(user)})

if __name__ == "__main__":
    app.run(port=5000)
```

:---

### Send Requests

```sh
curl --location --request POST 'http://127.0.0.1:8000/user'
{"users":["I am foo", "I am bar"]}
```

```sh
curl --location --request GET 'http://127.0.0.1:8000/user/1'
{"user": "I am foo"}
```
