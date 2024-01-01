# ORM

> SQLAlchemyをSanicと共に使用する方法?

すべてのORMツールはSanicで動作しますが、非同期ORMツールはSanicのパフォーマンスに影響します。
これをサポートするormパッケージがいくつかあります。

At present, there are many ORMs that support Python's `async`/`await` keywords. Some possible choices include：

- [Mayim](https://ahopkins.github.io/mayim/)
- [SQLAlchemy 1.4](https://docs.sqlalchemy.org/en/14/changelog/changelog_14.html)
- [tortoise-orm](https://github.com/tortoise/tortoise-orm)

のSanicアプリケーションへの統合は非常に簡単です。

## Mayim

Mayim ships with [an extension for Sanic Extensions](https://ahopkins.github.io/mayim/guide/extensions.html#sanic), which makes it super simple to get started with Sanic. It is certainly possible to run Mayim with Sanic without the extension, but it is recommended because it handles all of the [lifecycle events](https://sanic.dev/en/guide/basics/listeners.html) and [dependency injections](https://sanic.dev/en/plugins/sanic-ext/injection.html).

---:1
### Dependencies

First, we need to install the required dependencies. See [Mayim docs](https://ahopkins.github.io/mayim/guide/install.html#postgres) for the installation needed for your DB driver.
:--:1
```shell
pip install sanic-ext
pip install mayim[postgres]
```
:---

---:1
### Define ORM Model

Mayim allows you to use whatever you want for models. Whether it is [dataclasses](https://docs.python.org/3/library/dataclasses.html), [pydantic](https://pydantic-docs.helpmanual.io/), [attrs](https://www.attrs.org/en/stable/), or even just plain `dict` objects. Since it works very nicely [out of the box with Pydantic](https://ahopkins.github.io/mayim/guide/pydantic.html), that is what we will use here.
:--:1
```python
# ./models.py
from pydantic import BaseModel


class City(BaseModel):
    id: int
    name: str
    district: str
    population: int


class Country(BaseModel):
    code: str
    name: str
    continent: str
    region: str
    capital: City
```
:---

---:1
### Define SQL

If you are unfamiliar, Mayim is different from other ORMs in that it is one-way, SQL-first. This means you define your own queries either inline, or in a separate `.sql` file, which is what we will do here.
:--:1
```sql
-- ./queries/select_all_countries.sql
SELECT country.code,
    country.name,
    country.continent,
    country.region,
    (
        SELECT row_to_json(q)
        FROM (
                SELECT city.id,
                    city.name,
                    city.district,
                    city.population
            ) q
    ) capital
FROM country
    JOIN city ON country.capital = city.id
ORDER BY country.name ASC
LIMIT $limit OFFSET $offset;
```
:---

---:1
### Create Sanic App and Async Engine

We need to create the app instance and attach the `SanicMayimExtension` with any executors.
:--:1
```python
# ./server.py
from sanic import Sanic, Request, json
from sanic_ext import Extend
from mayim.executor import PostgresExecutor
from mayim.extensions import SanicMayimExtension
from models import Country


class CountryExecutor(PostgresExecutor):
    async def select_all_countries(
        self, limit: int = 4, offset: int = 0
    ) -> list[Country]:
        ...


app = Sanic("Test")
Extend.register(
    SanicMayimExtension(
        executors=[CountryExecutor],
        dsn="postgres://...",
    )
)
```
:---

---:1
### Register Routes

Because we are using Mayim's extension for Sanic, we have the automatic `CountryExecutor` injection into the route handler. It makes for an easy, type-annotated development experience.
:--:1
```python
@app.get("/")
async def handler(request: Request, executor: CountryExecutor):
    countries = await executor.select_all_countries()
    return json({"countries": [country.dict() for country in co
```
:---

---:1
### Send Requests
:--:1
```sh
curl 'http://127.0.0.1:8000'
{"countries":[{"code":"AFG","name":"Afghanistan","continent":"Asia","region":"Southern and Central Asia","capital":{"id":1,"name":"Kabul","district":"Kabol","population":1780000}},{"code":"ALB","name":"Albania","continent":"Europe","region":"Southern Europe","capital":{"id":34,"name":"Tirana","district":"Tirana","population":270000}},{"code":"DZA","name":"Algeria","continent":"Africa","region":"Northern Africa","capital":{"id":35,"name":"Alger","district":"Alger","population":2168000}},{"code":"ASM","name":"American Samoa","continent":"Oceania","region":"Polynesia","capital":{"id":54,"name":"Fagatogo","district":"Tutuila","population":2323}}]}
```
:---


## SQLAlchemy

[SQLAlchemy 1.4関数](https://docs.sqlalchemy.org/en/14/changelog/changelog_14.html)が`asyncio`のネイティブサポートを追加したので、SanicはついにSQLAlchemyでうまく動作するようになりました。SQLAlchemyプロジェクトでは、この機能はまだ*ベータ*と見なされていることに注意してください。


---:1
### 依存関係

まず、必要な依存関係をインストールする必要があります。以前は、インストールされる依存関係は`sqlalchemy'と`pymysql'でしたが、現在は`sqlalchemy'と`aiomysql'が必要です。
:--:1
```shell
pip install -U sqlalchemy
pip install -U aiomysql
```
:---

---:1
### ORMモデルの定義

ORMモデルの作成は同じままです。
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
### Sanicアプリケーションと非同期エンジンの作成

ここではデータベースとしてmysqlを使用しますが、PostgreSQL/SQLiteを選択することもできます。ドライバを`aiomysql`から`asyncpg`/`aiosqlite`に変更することに注意してください。
:--:1
```python
# ./server.py
from sanic import Sanic
from sqlalchemy.ext.asyncio import create_async_engine

app = Sanic("my_app")

bind = create_async_engine("mysql+aiomysql://root:root@localhost/test", echo=True)
```
:---

---:1
### ミドルウェアの登録

リクエスト・ミドルウェアは、使用可能な`AsyncSession`オブジェクトを作成し、それを`request.ctx`および`_base_model_session_ctx`に設定します。

スレッドセーフな変数`_base_model_session_ctx`を使用すると、`request.ctx`からセッション・オブジェクトをフェッチするかわりにセッション・オブジェクトを使用できます。
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
### ルートの登録

sqlalchemyの公式ドキュメントによると、`session.query`は2.0年にレガシーになり、ORMオブジェクトをクエリする2.0の方法は`select`を使用します。
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

---:1
### リクエストを送信
---:1
```sh
curl --location --request POST 'http://127.0.0.1:8000/user'
{"name":"foo","cars":[{"brand":"Tesla"}]}
```

```sh
curl --location --request GET 'http://127.0.0.1:8000/user/1'
{"name":"foo","cars":[{"brand":"Tesla"}]}
```
:---


## Tortoise-ORM

---:1
### 依存関係

tortoise-ormの依存関係は非常に単純で、tortoise-ormをインストールするだけです。
:--:1
```shell
pip install -U tortoise-orm
```
:---

---:1
### ORMモデルの定義

Djangoに精通している方であれば、この部分は非常に馴染みがあるはずです。
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
### Sanicアプリケーションと非同期エンジンの作成

Tortoise-ormは、ユーザーにとって便利な登録インタフェースのセットを提供し、これを使用してデータベース接続を簡単に作成できます。
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
### ルートの登録
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

---:1
### リクエストを送信
---:1
```sh
curl --location --request POST 'http://127.0.0.1:8000/user'
{"users":["I am foo", "I am bar"]}
```

```sh
curl --location --request GET 'http://127.0.0.1:8000/user/1'
{"user": "I am foo"}
```
:---
