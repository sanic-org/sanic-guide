# SQLAlchemy

> How do I use SQLAlchemy with Sanic?

All ORM tools can work with Sanic, but non-async ORM tool have a impact on Sanic performance. 

[SQLAlchemy 1.4](https://docs.sqlalchemy.org/en/14/changelog/changelog_14.html) has native support for asyncio, Sanic finally can play happily with sqlalchemy.

---:1

Define ORM models.

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

Create Sanic app and async engine

> We use postgresql as an example, you can use MySQL too, remember to change db driver from `asyncpg` to `aiomysql`.

:--:1

```python
# ./server.py
from sanic import Sanic
from sqlalchemy.ext.asyncio import create_async_engine

app = Sanic("my_app")

bind = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost/test", echo=True)
```

:---

---:1

Register middlewares.

The request middleware creates an usable `AsyncSession` object and set it to `request.ctx` and `_base_model_session_ctx`. 

Thread-safe variable `_base_model_session_ctx` helps you to use the session object instead of fetching it from `request.ctx`.

:--:1

```python
# ./server.py
from contextvars import ContextVar 

_base_model_session_ctx = ContextVar("session")

@app.middleware("request")
async def inject_session(request):
    request.ctx.session = sessionmaker(bind, AsyncSession, expire_on_commit=False)()
    request.ctx.session_ctx_token = _base_model_session_ctx.set(request.ctx.session)


@app.middleware("response")
async def close_session(request, response):
    if hasattr(request.ctx, "session_ctx_token"):
        _base_model_session_ctx.reset(request.ctx.session_ctx_token)
        await request.ctx.session.close()
```

:---

---:1

Register routes.

According to sqlalchemy official docs, `session.query` will be legacy in 2.0, and a 2.0's way to query ORM object is using `select`.

:--:1

```python
# ./server.py
from models import Car, Person
from sqlalchemy.orm import selectinload


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


Send requests:

```sh
curl --location --request POST 'http://127.0.0.1:8000/user'
{"name":"foo","cars":[{"brand":"Tesla"}]}
```

```sh
curl --location --request GET 'http://127.0.0.1:8000/user/1'
{"name":"foo","cars":[{"brand":"Tesla"}]}
```


> If you are using 1.3 version of SQLAlchemy, we suggest [GINO](https://github.com/python-gino/gino) 
