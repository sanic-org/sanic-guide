# Versioning

API構築では、エンドポイントにバージョンを追加するのが標準プラクティスです。これにより、APIを断りなく変更しようとすると、互換性のないエンドポイントを簡単に区別できます。

バージョンを追加すると、エンドポイントに`/v{version}` URLプレフィックスが追加されます。

バージョンは `int`、`float`、または `str` にすることができます。許容値:

- `1`, `2`, `3`
- `1.1`, `2.25`, `3.0`
- `"1"`, `"v1"`, `"v1.1"`

## Per route

---:1

バージョン番号をルートに直接渡すことができます。
:--:1
```python
# /v1/text
@app.route("/text", version=1)
def handle_request(request):
    return response.text("Hello world! Version 1")

# /v2/text
@app.route("/text", version=2)
def handle_request(request):
    return response.text("Hello world! Version 2")
```
:---

## Per Blueprint

---:1

ブループリントにバージョン番号を渡すこともできます。これは、そのブループリント内のすべてのルートに適用されます。
:--:1
```python
bp = Blueprint("test", url_prefix="/foo", version=1)

# /v1/foo/html
@bp.route("/html")
def handle_request(request):
    return response.html("<p>Hello world!</p>")
```
:---

## Per Blueprint Group

---:1
バージョン管理を簡素化するために、ブループリントにバージョン番号を提供できます
グループ。青写真がまだ上書きされていない場合、その下にグループ化されたすべての青写真にも同じことが継承されます
ブループリントインスタンスの作成中に指定された値と同じ情報。

バージョンの管理にブループリントグループを使用する場合は、バージョンプレフィックスを登録されているルート。

1. ルートレベルの設定
2. ブループリントレベルの構成
3. ブループリントグループレベルの構成

より尖ったバージョニング仕様を見つけたら、より一般的なバージョニング仕様よりもそれを選びますブループリントまたはブループリントグループの下で提供

:--:1
```python
from sanic.blueprints import Blueprint
from sanic.response import json

bp1 = Blueprint(
    name="blueprint-1",
    url_prefix="/bp1",
    version=1.25,
)
bp2 = Blueprint(
    name="blueprint-2",
    url_prefix="/bp2",
)

group = Blueprint.group(
    [bp1, bp2],
    url_prefix="/bp-group",
    version="v2",
)

# GET /v1.25/bp-group/bp1/endpoint-1
@bp1.get("/endpoint-1")
async def handle_endpoint_1_bp1(request):
    return json({"Source": "blueprint-1/endpoint-1"})

# GET /v2/bp-group/bp2/endpoint-2
@bp2.get("/endpoint-1")
async def handle_endpoint_1_bp2(request):
    return json({"Source": "blueprint-2/endpoint-1"})

# GET /v1/bp-group/bp2/endpoint-2
@bp2.get("/endpoint-2", version=1)
async def handle_endpoint_2_bp2(request):
    return json({"Source": "blueprint-2/endpoint-2"})
```
:---

## Version prefix

上記のように、ルートに適用される `version` は、生成された URI パスの最初のセグメントを **常に** です。したがって、バージョンの前にパスセグメントを追加できるように、`version`引数が渡されるすべての場所で、`version_prefix`を渡すこともできます。 

`version_prefix`引数は次のように定義できます。

- `app.route` and `bp.route` decorators (and all the convenience decorators also)
- `Blueprint` instantiation
- `Blueprint.group` constructor
- `BlueprintGroup` instantiation
- `app.blueprint` registration

複数の場所に定義がある場合、より具体的な定義はより一般的な定義を上書きします。このリストはその階層を提供します。

`version_prefix`のデフォルト値は`/v`です。

---:1
頻繁に要求される機能は、バージョン管理されたルートを `/api` にマウントできるようにすることです。これは「version_prefix」で簡単に実現できます。
:--:1
```python
# /v1/my/path
app.route("/my/path", version=1, version_prefix="/api/v")
```
:---

---:1
おそらく、より説得力のある使用法は、すべての「/api」ルートを単一の「BlueprintGroup」にロードすることです。
:--:1
```python
# /v1/my/path
app = Sanic(__name__)
v2ip = Blueprint("v2ip", url_prefix="/ip", version=2)
api = Blueprint.group(v2ip, version_prefix="/api/version")

# /api/version2/ip
@v2ip.get("/")
async def handler(request):
    return text(request.ip)

app.blueprint(api)
```
:---

したがって、ルートのURIは次のとおりです。

```
version_prefix + version + url_prefix + URI definition
```

::: tip
`url_prefix`と同様に、`version_prefix`内にパスパラメータを定義することができます。これを行うことは完全に合法です。すべてのルートには、そのパラメータがハンドラーに注入されることを覚えておいてください。

```python
version_prefix="/<foo:str>/v"
```
:::
