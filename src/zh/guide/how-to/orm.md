# ORM

> 我该如何在 Sanic 中集成 ORM ？

Sanic 可以与所有的 ORM 工具一起使用，但是非异步的 ORM 框架将会拖累 Sanic 的性能。 目前已经支持异步的 orm 有很多， 比较好用的有：

At present, there are many ORMs that support asynchronicity. Two of the more common libraries are：

- [SQLAlchemy 1.4](https://docs.sqlalchemy.org/en/14/changelog/changelog_14.html)
- [pip install tortoise-orm](https://github.com/tortoise/tortoise-orm)

Integration in to your Sanic application is fairly simple:

## SQLAlchemy

是的，您没有听错，在 [SQLAlchemy 1.4](https://docs.sqlalchemy.org/en/14/changelog/changelog_14.html) 版本中，添加了对 asyncio 的原生支持，至此，Sanic 终于可以和 ORM 界的老前辈愉快的玩耍了。 Be aware that this functionality is still considered *beta* by the SQLAlchemy project.


---:1

### 安装依赖

First, we need to install the required dependencies. 首先，我们需要安装依赖，在以前的时候，我们安装的依赖是 `sqlalchemy` 和 `pymysql` 但是现在我们需要的是 `sqlalchemy` 和 `aiomysql`

:--:1

```shell
pip install sqlalchemy, aiomysql
```

:---

---:1

### 定义 ORM 模型

您依旧可以按照以前的方式来创建 ORM 模型

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

### 创建 Sanic app 与异步数据库引擎。

这里我们使用 mysql 作为数据库，您也可以选择 PostgreSQL / SQLite，注意要将驱动从 `aiomysql` 换为 `asyncpg` / `aiosqlite` Pay attention to changing the driver from `aiomysql` to `asyncpg`/`aiosqlite`. :--:1


```python
# ./server.py
from sanic import Sanic
from sqlalchemy.ext.asyncio import create_async_engine

app = Sanic("my_app")

bind = create_async_engine("mysql+aiomysql://root:root@localhost/test", echo=True)
```

:---

---:1

### 注册中间件

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

### 注册路由

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

### 发送请求

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

### 安装依赖

tortoise-orm 的依赖非常简单，您只需要安装它即可。

:--:1

```shell
pip install sqlalchemy, asyncpg
```

:---

---:1

### 定义 ORM 模型

如果您熟悉 Django 那您应该会觉得这一部分非常熟悉，是的，它就是仿照 Django 来的。

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

### 创建 Sanic app 与异步数据库引擎

tortoise-orm 专门提供了一套注册接口，方便用户的使用，您可以使用它轻松地创建数据库连接。

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

### 注册路由

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

### 启动服务并发送请求：

```sh
curl --location --request POST 'http://127.0.0.1:8000/user'
{"users":["I am foo", "I am bar"]}
```

```sh
curl --location --request GET 'http://127.0.0.1:8000/user/1'
{"user": "I am foo"}
```
