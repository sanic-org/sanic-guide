# 設定

Sanic Extensionsは、 [Sanic](../../guide/deployment/configuration.md)と同じ方法で設定できます。 これにより、Sanic Extensionsの設定が非常に簡単になります。

```python
app = Sanic("MyApp")
app.config.OAS_URL_PREFIX = "/apidocs"
```

しかし、検討すべき設定オプションはいくつかあります。

## マニュアル`拡張`

---:1 Sanic Extensionsは自動的にアプリケーションにアタッチしますが、手動で `拡張`を選択することができます。 これを行うと、すべての設定値をキーワード引数(小文字) として渡すことができます。 :--:
```python
app = Sanic("MyApp")
app.extend(oas_url_prefix="/apidocs")
```
:---

---:1 または、代わりに、 `dict` で一度にすべてを渡すことができます。 :--:
```python
app = Sanic("MyApp")
app.extend(config={"oas_url_prefix": "/apidocs"})
```
:---

---:1 どちらのソリューションも、構成設定の名前がIDEによって検出できないという事実に苦しんでいます。 したがって、使用できる型注釈付きオブジェクトもあります。 これは、開発の経験に役立つはずです。 :--:
```python
from sanic_ext import Config

app = Sanic("MyApp")
app.extend(config=Config(oas_url_prefix="/apidocs"))
```
:---

## 設定

### `cors`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: CORS保護を有効にするかどうか

### `cors_allow_headers`

- **型**: `str`
- **デフォルト**: `"*"`
- **説明**: `access-control-allow-headers`ヘッダーの値

### `cors_always_send`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: 常に`access-control-allow-origin`ヘッダーを送信するかどうか

### `cors_automatic_options`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: `OPTIONS` ルートの *まだ定義されていない* エンドポイントを自動的に生成するかどうか

### `cors_expose_headers`

- **型**: `str`
- **デフォルト**: `""`
- **説明**: `access-control-expose-headers`ヘッダーの値

### `cors_max_age`

- **型**: `int`
- **デフォルト**: `5`
- **説明**: `access-control-max-age`ヘッダーの値

### `cors_methods`

- **型**: `str`
- **デフォルト**: `""`
- **説明**: `access-control-allow-methods`ヘッダーの値

### `cors_origins`

- **型**: `str`
- **デフォルト**: `""`
- **説明**: `access-control-allow-origin`ヘッダーの値

::: warning `*` をここに置く場合は注意してください。 セキュリティの問題である可能性があるため、何をしているかを知っていない限り、これをしないでください。 :::

### `cors_send_wildcard`

- **型**: `bool`
- **デフォルト**: `False`
- **説明**: リクエスト元の代わりにワイルドカードを送信するかどうか

### `cors_supports_credentials`

- **型**: `bool`
- **デフォルト**: `False`
- **説明**: `access-control-allow-credentials`ヘッダーの値

### `cors_vary_header`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: `vary` (訳注:「変化」) ヘッダーを追加するかどうか

### `http_all_methods`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: HTTP `CONNECT` と `TRACE` メソッドを allowable として追加する。

### `http_auto_head`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: 任意の `GET` ルートに `HEAD` ハンドラーを自動的に追加する。

### `http_auto_options`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: 自動的に `OPTIONS` ハンドラーを任意のルートに追加する

### `http_auto_trace`

- **型**: `bool`
- **デフォルト**: `False`
- **説明**: 自動的に `TRACE` ハンドラーを任意のルートに追加する

### `oas`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: OpenAPI仕様の生成を有効にするか

### `oas_autodoc`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: ルート関数のdocstringからOpenAPIの詳細を自動的に抽出するかどうか

### `oas_ignore_head`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: `True`なら, OpenAPI 仕様に `HEAD` エンドポイントを追加しません

### `oas_ignore_options`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: `True`なら, OpenAPI 仕様に `OPTIONS` エンドポイントを追加しません

### `oas_path_to_redoc_html`

- **型**: `Optional[str]`
- **デフォルト**: `None`
- **説明**: 既存の Redoc HTML をオーバーライドする HTML ファイルへのパス

### `oas_path_to_swagger_html`

- **型**: `Optional[str]`
- **デフォルト**: `None`
- **説明**: 既存の Swagger HTML をオーバーライドする HTML ファイルへのパス

### `oas_ui_default`

- **型**: `Optional[str]`
- **デフォルト**: `"redoc"`
- **説明**: `oas_url_prefix`エンドポイントにどのOASドキュメントを提供するか; `None`の場合、その場所にドキュメントはありません

### `oas_ui_redoc`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: Redoc UI を有効にするかどうか

### `oas_ui_swagger`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: Swagger UI を有効にするかどうか

### `oas_ui_swagger_version`

- **型**: `str`
- **デフォルト**: `"4.1.0"`
- **説明**: 使用するSwaggerバージョン

### `oas_uri_to_config`

- **型**: `str`
- **デフォルト**: `"/swagger-config"`
- **説明**: Swaggerの設定を提供するパス

### `oas_uri_to_json`

- **型**: `str`
- **デフォルト**: `"/openapi.json"`
- **説明**: OpenAPI JSON を提供するパス

### `oas_uri_to_redoc`

- **型**: `str`
- **デフォルト**: `"/redoc"`
- **説明**: Redocのパス

### `oas_uri_to_swagger`

- **型**: `str`
- **デフォルト**: `"/swagger"`
- **説明**: Swagger のパス

### `oas_url_prefix`

- **型**: `str`
- **デフォルト**: `"/docs"`
- **説明**: OASドキュメントのすべてのwitllが添付するブループリントのURL接頭辞。

### `swagger_ui_configuration`

- **型**: `Dict[str, Any]`
- **デフォルト**: `{"apisSorter": "alpha", "operationsSorter": "alpha", "docExpansion": "full"}`
- **説明**: フロントエンドに提供される Swagger ドキュメント

### `templating_enable_async`

- **型**: `bool`
- **デフォルト**: `True`
- **説明**: Jinjaの `Environment` で `enable_async` を設定するかどうか

### `templating_path_to_templates`

- **型**: `Union[str, os.PathLike, Sequence[Union[str, os.PathLike]]]`
- **デフォルト**: `templates`
- **説明**: テンプレートファイルがある場所への単一のパス、または複数のパス

### `trace_excluded_headers`

- **型**: `Sequence[str]`
- **デフォルト**: `("authorization", "cookie")`
- **説明**: `TRACE` リクエストに対するレスポンスから抑制されるヘッダー。
