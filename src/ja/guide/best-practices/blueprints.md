# Blueprints

## 概要

設計図は、アプリケーション内のサブルーティングに使用できるオブジェクトです。設計図では、アプリケーション・インスタンスにルートを追加する代わりに、ルートを追加するための同様のメソッドを定義し、それを柔軟でプラグ可能な方法でアプリケーションに登録します。

設計図は、アプリケーション・ロジックを複数のグループまたは責任領域に分けることができる大規模なアプリケーションに特に役立ちます。

## 作成と登録

---:1

まず、設計図を作成する必要があります。これは、多くの同じデコレータを持つ`Sanic()`アプリケーションインスタンスと非常に似たAPIを持っています。
:--:1
```python
# ./my_blueprint.py
from sanic.response import json
from sanic import Blueprint

bp = Blueprint("my_blueprint")

@bp.route("/")
async def bp_root(request):
    return json({"my": "blueprint"})
```
:---


---:1

次に、アプリケーションインスタンスに登録します。
:--:1
```python
from sanic import Sanic
from my_blueprint import bp

app = Sanic(__name__)
app.blueprint(bp)
```
:---

Blueprintには、websocketsを実装するための同じ`websocket()`デコレータと`add_websocket_route`メソッドもあります。

---:1

::: new NEW in v21.12
v21.12 以降では、ブループリントはオブジェクトを追加する前でも後でも登録することができます。以前は、登録時にブループリントにアタッチされたオブジェクトのみがアプリケーション インスタンスにロードされました。
:--:1
```python
app.blueprint(bp)

@bp.route("/")
async def bp_root(request):
    ...
```
:---
## Copying

---:1

`copy()`メソッドを使用すると、設計図とそれにアタッチされているすべてのものを新しいインスタンスにコピーできます。唯一必要な引数は、新しい`name`を渡すことです。ただし、これを使用して、古い設計図の値をオーバーライドすることもできます。

:--:1

```python
v1 = Blueprint("Version1", version=1)

@v1.route("/something")
def something(request):
    pass

v2 = v1.copy("Version2", version=2)

app.blueprint(v1)
app.blueprint(v2)
```

```
Available routes:
/v1/something
/v2/something

```

:---

## Blueprintグループ

設計図は、リストまたはタプルの一部として登録することもでき、レジストラは、設計図のサブシーケンスを再帰的に巡回し、それに従って登録する。Blueprint.groupメソッドは、このプロセスを単純化するために提供されており、フロントエンドから見えるものを模倣する`モック`バックエンドディレクトリ構造を可能にする。次の (かなり不自然な) 例を考えてみましょう。

```text
api/
├──content/
│ ├──authors.py
│ ├──static.py
│ └──__init__.py
├──info.py
└──__init__.py
app.py
```

---:1

#### blueprint 最初に

:--:1
```python
# api/content/authors.py
from sanic import Blueprint

authors = Blueprint("content_authors", url_prefix="/authors")
```
:---

---:1

#### blueprint 次に

:--:1
```python
# api/content/static.py
from sanic import Blueprint

static = Blueprint("content_static", url_prefix="/static")
```
:---

---:1

#### Blueprint グループ

:--:1
```python
# api/content/__init__.py
from sanic import Blueprint
from .static import static
from .authors import authors

content = Blueprint.group(static, authors, url_prefix="/content")
```
:---

---:1

#### blueprint 三つ目に

:--:1
```python
# api/info.py
from sanic import Blueprint

info = Blueprint("info", url_prefix="/info")
```
:---

---:1

#### 他のblueprintグループ

:--:1
```python
# api/__init__.py
from sanic import Blueprint
from .content import content
from .info import info

api = Blueprint.group(content, info, url_prefix="/api")
```
:---

---:1

#### メインサーバー

すべての設計図が登録されました

:--:1
```python
# app.py
from sanic import Sanic
from .api import api

app = Sanic(__name__)
app.blueprint(api)
```
:---

## ミドルウェアー

---:1

Blueprintsは、エンドポイント専用に登録されたミドルウェアを持つこともできます。
:--:1
```python
@bp.middleware
async def print_on_request(request):
    print("I am a spy")

@bp.middleware("request")
async def halt_request(request):
    return text("I halted the request")

@bp.middleware("response")
async def halt_response(request, response):
    return text("I halted the response")
```
:---

---:1

同様に、設計図グループを使用すると、ネストされた設計図グループ全体にミドルウェアを適用できます。
:--:1
```python
bp1 = Blueprint("bp1", url_prefix="/bp1")
bp2 = Blueprint("bp2", url_prefix="/bp2")

@bp1.middleware("request")
async def bp1_only_middleware(request):
    print("applied on Blueprint : bp1 Only")

@bp1.route("/")
async def bp1_route(request):
    return text("bp1")

@bp2.route("/<param>")
async def bp2_route(request, param):
    return text(param)

group = Blueprint.group(bp1, bp2)

@group.middleware("request")
async def group_middleware(request):
    print("common middleware applied for both bp1 and bp2")

# Register Blueprint group under the app
app.blueprint(group)
```
:---

## 例外

---:1

他の[例外処理](./exceptions.md)を使用して、設計図固有のハンドラーを定義できます。
:--:1
```python
@bp.exception(NotFound)
def ignore_404s(request, exception):
    return text("Yep, I totally found the page: {}".format(request.url))
```
:---

## 静的ファイル

---:1

Blueprintsは独自の静的ハンドラを持つこともできます。
:--:1
```python
bp = Blueprint("bp", url_prefix="/bp")
bp.static("/web/path", "/folder/to/serve")
bp.static("/web/path", "/folder/to/server", name="uploads")
```
:---

---:1

これは、`url_for()`を使用して取得できます。詳細については、[ルーティング](/guide/basics/routing.md) を参照してください。
:--:1
```python
>>> print(app.url_for("static", name="bp.uploads", filename="file.txt"))
'/bp/web/path/file.txt'
```
:---

## リスナー

---:1

Blueprintsは[listeners](/guide/basics/listeners.md)も実装できます。
:--:1
```python
@bp.listener("before_server_start")
async def before_server_start(app, loop):
    ...

@bp.listener("after_server_stop")
async def after_server_stop(app, loop):
    ...
```
:---

## バージョン

[versioning section](/guide/advanced/versioning.md)で説明したように、設計図を使用してさまざまなバージョンのWeb APIを実装できます。

---:1

`version`は、ルートの前に`/v1`または`/v2`のように付加されます。
:--:1
```python
auth1 = Blueprint("auth", url_prefix="/auth", version=1)
auth2 = Blueprint("auth", url_prefix="/auth", version=2)
```
:---

---:1

アプリケーションに設計図を登録すると、ルート`/v1/auth`と`/v2/auth`は個々の設計図を指すようになり、各APIバージョンのサブサイトを作成できるようになります。
:--:1
```python
from auth_blueprints import auth1, auth2

app = Sanic(__name__)
app.blueprint(auth1)
app.blueprint(auth2)
```
:---

---:1

設計図を`BlueprintGroup`エンティティの下にグループ化し、同じ時間。
:--:1
```python
auth = Blueprint("auth", url_prefix="/auth")
metrics = Blueprint("metrics", url_prefix="/metrics")

group = Blueprint.group([auth, metrics], version="v1")

# This will provide APIs prefixed with the following URL path
# /v1/auth/ and /v1/metrics
```
:---

## 合成可能

`Blueprint`は複数のグループに登録することができ、`BlueprintGroup`自体もそれぞれ登録してさらにネストすることができる。これにより、無限の可能性を持つ`Blueprint`コンポジションが作成されます。

---:1
この例を見て、2つのハンドラーが実際には5つの異なるルートとしてマウントされていることを確認してください。
:--:1
```python
app = Sanic(__name__)
blueprint_1 = Blueprint("blueprint_1", url_prefix="/bp1")
blueprint_2 = Blueprint("blueprint_2", url_prefix="/bp2")
group = Blueprint.group(
    blueprint_1,
    blueprint_2,
    version=1,
    version_prefix="/api/v",
    url_prefix="/grouped",
    strict_slashes=True,
)
primary = Blueprint.group(group, url_prefix="/primary")


@blueprint_1.route("/")
def blueprint_1_default_route(request):
    return text("BP1_OK")


@blueprint_2.route("/")
def blueprint_2_default_route(request):
    return text("BP2_OK")


app.blueprint(group)
app.blueprint(primary)
app.blueprint(blueprint_1)

# The mounted paths:
# /api/v1/grouped/bp1/
# /api/v1/grouped/bp2/
# /api/v1/primary/grouped/bp1
# /api/v1/primary/grouped/bp2
# /bp1

```
:---


## URLを生成

`url_for()`を使用してURLを生成する場合、エンドポイント名は次の形式になります。

```text
{blueprint_name}.{handler_name}
```
