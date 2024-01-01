# バージョン進行

API構築では、エンドポイントにバージョンを追加するのが標準プラクティスです。これにより、APIを断りなく変更しようとすると、互換性のないエンドポイントを簡単に区別できます。

バージョンを追加すると、エンドポイントに`/v{version}` URLプレフィックスが追加されます。

バージョンは `int`、`float`、または `str` にすることができます。許容値:

- `1`, `2`, `3`
- `1.1`, `2.25`, `3.0`
- `"1"`, `"v1"`, `"v1.1"`

## ルートごとのバージョン

---:1

バージョン番号をルートに直接渡すことができます。
:--:1
```python
# /v1/text
@app.route("/text", version=1)
def handle_request(request):
    return response.text("Hello world! バージョン1")

# /v2/text
@app.route("/text", version=2)
def handle_request(request):
    return response.text("Hello world! バージョン2")
```
:---

## Blueprintごとのバージョン

---:1

lueprintにバージョン番号を渡すこともできます。これは、そのBlueprint内のすべてのルートに適用されます。
:--:1
```python
bp = Blueprint("test", url_prefix="/foo", version=1)

# /v1/foo/html
@bp.route("/html")
def handle_request(request):
    return response.html("<p>Hello world!</p>")
```
:---

## Blueprintグループごとのバージョン

---:1
バージョン化されたBlueprintの管理を簡素化するために、グループにバージョン番号を提供できます。Blueprintインスタンスを作成する際に指定された値で同じ情報を上書きしない場合、 その下方でグループ化されたすべてのBlueprintにも同じ情報が継承されます。

バージョン管理にblueprintグループを使用する場合、登録中の経路にVersionプレフィックスを適用するには、以下の順序で行います。

1. ルートレベルの設定
2. Blueprintレベルの構成
3. Blueprintグループレベルの構成

もし、より尖ったバージョン管理仕様が見つかれば、BlueprintやBlueprintグループの下で提供される一般的なバージョン管理仕様よりも、そちらを選ぶことになります。

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

## バージョンプレフィックス

上で見たように、ルートに適用される`バージョン`は、**常に**生成されたURIパスの最初のセグメントになります。 したがって、バージョンの前にパスセグメントを追加できるように、`version`引数が渡されるすべての場所で、`version_prefix`を渡すこともできます。

`version_prefix`引数は次のように定義できます。

- `app.route` と `bp.route` デコレータ (そして、すべての便利なデコレータ)
- `Blueprint`のインスタンス化
- `Blueprint.group`コンストラクタ
- `BlueprintGroup`のインスタンス化
- `app.blueprint`の登録

複数の場所に定義がある場合、より具体的な定義はより一般的な定義を上書きします。このリストはその階層を提供します。

`version_prefix`のデフォルト値は`/v`です。

---:1
頻繁に要求される機能は、バージョン管理されたルートを `/api` にマウントできるようにすることです。これは`version_prefix`で簡単に実現できます。
:--:1
```python
# /v1/my/path
app.route("/my/path", version=1, version_prefix="/api/v")
```
:---

---:1
おそらく、より説得力のある使用法は、すべての`/api`ルートを単一の`BlueprintGroup`にロードすることです。
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
version_prefix + version + url_prefix + URI定義
```

::: tip
`url_prefix`と同様に、`version_prefix`内にパスパラメータを定義することができます。 これを行うのは完全に正当なことです。 すべてのルートには、そのパラメータがハンドラーに注入されることを覚えておいてください。

```python
version_prefix="/<foo:str>/v"
```
:::

*Added in v21.6*