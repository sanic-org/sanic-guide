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
- **Default**: `True`
- **Description**: Automatically adds `HEAD` handlers to any `GET` routes

### `http_auto_options`

- **Type**: `bool`
- **Default**: `True`
- **Description**: Automatically adds `OPTIONS` handlers to any routes without

### `http_auto_trace`

- **Type**: `bool`
- **Default**: `False`
- **Description**: Automatically adds `TRACE` handlers to any routes without

### `oas`

- **Type**: `bool`
- **Default**: `True`
- **Description**: Whether to enable OpenAPI specification generation

### `oas_autodoc`

- **Type**: `bool`
- **Default**: `True`
- **Description**: Whether to automatically extract OpenAPI details from the docstring of a route function

### `oas_ignore_head`

- **Type**: `bool`
- **Default**: `True`
- **Description**: WHen `True`, it will not add `HEAD` endpoints into the OpenAPI specification

### `oas_ignore_options`

- **Type**: `bool`
- **Default**: `True`
- **Description**: WHen `True`, it will not add `OPTIONS` endpoints into the OpenAPI specification

### `oas_path_to_redoc_html`

- **Type**: `Optional[str]`
- **Default**: `None`
- **Description**: Path to HTML file to override the existing Redoc HTML

### `oas_path_to_swagger_html`

- **Type**: `Optional[str]`
- **Default**: `None`
- **Description**: Path to HTML file to override the existing Swagger HTML

### `oas_ui_default`

- **Type**: `Optional[str]`
- **Default**: `"redoc"`
- **Description**: Which OAS documentation to serve on the bare `oas_url_prefix` endpoint; when `None` there will be no documentation at that location

### `oas_ui_redoc`

- **Type**: `bool`
- **Default**: `True`
- **Description**: Whether to enable the Redoc UI

### `oas_ui_swagger`

- **Type**: `bool`
- **Default**: `True`
- **Description**: Whether to enable the Swagger UI

### `oas_ui_swagger_version`

- **Type**: `str`
- **Default**: `"4.1.0"`
- **Description**: Which Swagger version to use

### `oas_uri_to_config`

- **Type**: `str`
- **Default**: `"/swagger-config"`
- **Description**: Path to serve the Swagger configurtaion

### `oas_uri_to_json`

- **Type**: `str`
- **Default**: `"/openapi.json"`
- **Description**: Path to serve the OpenAPI JSON

### `oas_uri_to_redoc`

- **Type**: `str`
- **Default**: `"/redoc"`
- **Description**: Path to Redoc

### `oas_uri_to_swagger`

- **Type**: `str`
- **Default**: `"/swagger"`
- **Description**: Path to Swagger

### `oas_url_prefix`

- **Type**: `str`
- **Default**: `"/docs"`
- **Description**: URL prefix for the Blueprint that all of the OAS documentation witll attach to

### `swagger_ui_configuration`

- **Type**: `Dict[str, Any]`
- **Default**: `{"apisSorter": "alpha", "operationsSorter": "alpha", "docExpansion": "full"}`
- **Description**: The Swagger documentation to be served to the frontend

### `templating_enable_async`

- **Type**: `bool`
- **Default**: `True`
- **Description**: Whether to set `enable_async` on the Jinja `Environment`

### `templating_path_to_templates`

- **Type**: `Union[str, os.PathLike, Sequence[Union[str, os.PathLike]]]`
- **Default**: `templates`
- **Description**: A single path, or multiple paths to where your template files are located

### `trace_excluded_headers`

- **Type**: `Sequence[str]`
- **Default**: `("authorization", "cookie")`
- **Description**: Which headers should be suppresed from responses to `TRACE` requests
