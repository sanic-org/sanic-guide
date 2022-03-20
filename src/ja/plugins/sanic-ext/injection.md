# 依存性インジェクション

依存性インジェクションは、定義された関数シグネチャに基づいてルートハンドラに引数を追加する方法です。具体的には、ハンドラ内の引数の**型アノテーション**を調べます。これは、次のようなさまざまなケースで役に立ちます。

- リクエストヘッダに基づいてオブジェクトを取得する（現在のセッションユーザーのように）。
- 特定のオブジェクトを特定のタイプにリキャストする
- リクエストオブジェクトを使用したデータのプリフェッチ
- サービスの自動挿入

`Extend` インスタンスには、依存性インジェクションに使用する 2 つの基本的なメソッドがあります。低レベルの `add_dependency` と高レベルの `dependency` です。

**下位レベル**: `app.ext.add_dependency(...)`

- `type: Type,`: オブジェクトの型となるユニークなクラスです。
- `constructor: Optional[Callable[..., Any]],` (OPTIONAL): その型を返す関数

**高レベル**: `app.ext.dependency(...)`

- `obj: Any`: インジェクションしたい任意のオブジェクト
- `name: Optional[str]`: 参照として代替可能な名前

ここでは、いくつかの使用例を探ってみましょう。

::: warning
v21.12より前に依存性インジェクションを使用していた場合、低レベルAPIメソッドは `injection` と呼ばれていました。その後、 `add_dependency` に名前が変更され、 v21.12 からは `injection` は `add_dependency` のエイリアスになっています。`injection` メソッドは非推奨となりv22.6で削除されます。
:::

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

---:1
これは、コンストラクタにキーワード引数 `type` を渡すことで動作します。前の例はこれと同等です。
:--:1
```python
flavor = IceCream(flavor="chocolate")
```
:---

## 追加コンストラクタ

---:1

時には、コンストラクタを渡す必要があるかもしれません。これは関数でもいいですし、クラスメソッドでコンストラクタとして動作させることもできます。この例では、最初に `Person.create` を呼び出すインジェクションを作成します。

また、この例で重要なのは、実際に**2個**のオブジェクトをインジェクションしていることです! もちろん、このようにする必要はありませんが、関数のサインに基づいてオブジェクトをインジェクトすることになります。

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



app.ext.add_dependency(Person, Person.create)
app.ext.add_dependency(PersonID)

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

この例のように `ext.add_dependency` に `constructor` が渡されると、それが呼び出されます。そうでない場合は、 `type` を呼び出してオブジェクトを生成します。`constructor`を渡す際に注意すべき点がいくつかある。

1. `request: request` の位置専用引数が期待されます。例として、上記の `Person.create` メソッドを参照してください。
1. マッチしたすべてのパスパラメータは、キーワード引数として注入されます。
1. 依存関係は、連鎖したり、ネストしたりすることができます。先ほどの例で、`Person`データクラスが`PersonID`を持っていることに注目しましたか？これは、 `PersonID` が最初に呼び出され、その値が `Person.create` を呼び出す際のキーワード引数に追加されることを意味します。

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

この例では、`compule_profile` コンストラクタで `Request` オブジェクトを使用して、偽の DB クエリを実行して `UserProfile` オブジェクトを生成し、それを返します。
 :--:1

 ```python
 @dataclass
 class User:
     name: str
 

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


app.ext.add_dependency(UserProfile, compile_profile)


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

データベースのコネクションプールのようなものを作成して、それを `app.ctx` オブジェクトに格納するのはよくあるパターンです。これにより、アプリケーション全体でそれらを利用できるようになり、確かに便利です。しかし、1つの欠点は、型付けされたオブジェクトを扱うことができなくなることです。これを解決するために、依存性注入を使用することができます。まず、これまでの例で使ってきたような低レベルの `add_dependency` を使って、そのコンセプトを紹介します。しかし、より高いレベルの `dependency` メソッドを使用することで、より良い方法があります。

---:1

### `add_dependency` を使った低レベル API

これは [最後の例](#objects-from-the-request) と非常によく似た動作で、ゴールは `Request` オブジェクトから何かを抽出することです。この例では、データベースオブジェクトが `app.ctx` インスタンスに作成され、依存性注入のコンストラクタで返されています。

:--:1

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

### 上位APIを使った`dependency`

依存性インジェクションを追加する際に利用できる実際の *オブジェクト* があるので、より高レベルの `dependency` メソッドを使用することができます。これにより、パターンを書くのがより簡単になります。

このメソッドは、アプリケーションインスタンスのライフタイムを通じて存在し、リクエストに依存しないものをインジェクションしたい場合に常に使用する必要があります。サービスやサードパーティークライアント、コネクションプールなどはリクエストに依存しないので、非常に便利です。

:--:1

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
