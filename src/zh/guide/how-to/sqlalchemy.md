# SQLAlchemy

> 我该如何在 Sanic 中集成 SQLAlchemy ？

Sanic 可以与所有的 ORM 工具一起使用，但是非异步的 ORM 框架将会拖累 Sanic 的性能。在 [SQLAlchemy 1.4](https://docs.sqlalchemy.org/en/14/changelog/changelog_14.html) 版本中，添加了对 asyncio 的原生支持，至此，Sanic 终于可以和 ORM 界的老前辈愉快的玩耍了。


---:1

定义 ORM 模型。

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

创建 Sanic app 与异步数据库引擎。

> 这里我们使用 postgresql 作为数据库，您也可以选择 MySQL，注意要将驱动从 `asyncpg` 换为 `aiomysql`

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

注册中间件。

在这里，请求中间件为我们创建了一个可用的 `AsyncSession` 对象并且将其绑定至 `request.ctx` 中，而 `_base_model_session_ctx` 也会在这是被赋予可用的值，如果您需要在其他地方使用 session 对象（而非从 `request.ctx` 中取值）,该全局变量或许能帮助您（它是线程安全的）。

响应中间件会将创建的 `AsyncSession` 关闭，并重置 `_base_model_session_ctx` 的值，进而释放资源。

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

注册路由。

根据 SQLAlchemy 的官方文档，`session.query` 将在 2.0 版本中被淘汰，取而代之的是使用 `select` 查询 ORM 对象。

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


启动服务并发送请求：

```sh
curl --location --request POST 'http://127.0.0.1:8000/user'
{"name":"foo","cars":[{"brand":"Tesla"}]}
```

```sh
curl --location --request GET 'http://127.0.0.1:8000/user/1'
{"name":"foo","cars":[{"brand":"Tesla"}]}
```


> 如果您还在使用 1.3 版本的 SQLAlchemy，建议您使用 [GINO](https://github.com/python-gino/gino) 。

> 还有一些其他优秀的 ORM 框架，如拥有和 Django ORM 类似 API 的 [tortoise-orm](https://tortoise-orm.readthedocs.io/en/latest/examples/sanic.html) 也可以在 Sanic 应用中使用。
