# インジェクション

依存性インジェクションは、定義された関数シグネチャに基づいてルートハンドラに引数を追加する方法です。これは、次のようなさまざまなケースで役に立ちます。

- リクエストヘッダに基づいてオブジェクトを取得する（現在のセッションユーザーのように）。
- 特定のオブジェクトを特定のタイプにリキャストする
- リクエストオブジェクトを使用したデータのプリフェッチ
- サービスの自動挿入

アプリケーションを `Extend` したとき、その戻り値のインスタンスには `injection` というメソッドがあります。そのメソッドは以下の引数を受け取リます。

- *type*: オブジェクトの型となるユニークなクラス。
- *constructor* (OPTIONAL): その型を返す関数。

ここでは、いくつかの使用例を探ってみましょう。

## 基本的な実装

最も単純な使用例は、単に値を再キャストすることです。

---:1

これは、マッチしたパスパラメータに基づいて生成したいモデルがある場合に便利です。

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

## 追加コンストラクタ

---:1

時には、コンストラクタを渡す必要があるかもしれません。これは関数でもいいですし、クラスメソッドでコンストラクタとして動作させることもできます。この例では、最初に `Person.create` を呼び出すインジェクションを作成します。

また、この例で重要なのは、実際に**2個**のオブジェクトをインジェクションしていることです! もちろん、このようにする必要はありませんが、関数のサインに基づいてオブジェクトをインジェクトすることになります。

コンストラクタが`ext.injection`に渡されない場合、オブジェクトは型を呼び出して作成されます。

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

## `Request`からのオブジェクト

---:1

時には、リクエストから詳細を抽出し、前処理を行いたい場合があります。例えば、リクエストのJSONをPythonのオブジェクトにキャストし、DBクエリに基づいていくつかの追加ロジックを追加することができます。

::: warning
このメソッドを使うつもりなら、Sanic がリクエストボディを読む機会がある**前**に、 インジェクションが実際に起こるということに注意すべきです。ヘッダはすでに消費されているはずです。したがって、ボディにアクセスしたい場合、この例で見られるように手動で消費する必要があります。

```python
await request.receive_body()
```
:::

そうでない場合にも使えるかもしれません:

- ミドルウェアを使用して、前処理と `request.ctx` への追加を行う。
- デコレータを使用して、前処理とリクエストハンドラへの引数の注入を行う。

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

## サービスのインジェクション

---:1

DB コネクションプールのようなものを作成して、それを `app.ctx` オブジェクトに格納するのはよくあるパターンです。これにより、アプリケーション全体でそれらを利用できるようになり、確かに便利です。

しかし、欠点としては、型付けされたオブジェクトを扱うことができなくなることです。これを解決するために、インジェクションを使うことができます。

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
