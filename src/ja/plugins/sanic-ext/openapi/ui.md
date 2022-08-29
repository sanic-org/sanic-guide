# UI

Sanic Extensionsには、RedocとSwaggerの両方のインターフェイスが付属しています。 どちらかを使うか、両方を使うかを選択することができます。 以下のエンドポイントが自動でセットアップされており、素の `/docs` はRedocを表しています。

- `/docs`
- `/docs/openapi.json`
- `/docs/redoc`
- `/docs/swagger`
- `/docs/openapi-config`

## 設定オプション

| **キー**                     | **タイプ**         | **デフォルト**           | **説明**                                                                                                                             |
| -------------------------- | --------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `OAS_IGNORE_HEAD`          | `bool`          | `True`              | `HEAD`エンドポイントを表示するかどうかを指定する。                                                                                                       |
| `OAS_IGNORE_OPTIONS`       | `bool`          | `True`              | `OPTIONS` 端末を表示するかどうかを指定する。                                                                                                        |
| `OAS_PATH_TO_REDOC_HTML`   | `Optional[str]` | `None`              | デフォルトの Redoc HTML を上書きするための HTML へのパス。                                                                                             |
| `OAS_PATH_TO_SWAGGER_HTML` | `Optional[str]` | `None`              | デフォルトの Swagger HTML をオーバーライドするための HTML へのパス。                                                                                       |
| `OAS_UI_DEFAULT`           | `Optional[str]` | `"redoc"`           | `redoc`または `swagger` に設定することができ、ベースルートに表示するUIを制御します。 Controls which UI to display on the base route. `None` に設定すると、ベースルートは設定されません。 |
| `OAS_UI_REDOC`             | `bool`          | `True`              | Redoc UI を有効にするかどうか。                                                                                                               |
| `OAS_UI_SWAGGER`           | `bool`          | `True`              | Swagger UI を使用可能にするかどうか。                                                                                                           |
| `OAS_URI_TO_CONFIG`        | `str`           | `"/openapi-config"` | Swagger が使用する OpenAPI コンフィグへの URI パス                                                                                               |
| `OAS_URI_TO_JSON`          | `str`           | `"/openapi.json"`   | JSON ドキュメントへの URI パス。                                                                                                              |
| `OAS_URI_TO_REDOC`         | `str`           | `"/redoc"`          | Redoc への URI パス。                                                                                                                   |
| `OAS_URI_TO_SWAGGER`       | `str`           | `"/swagger"`        | Swagger への URI パス。                                                                                                                 |
| `OAS_URL_PREFIX`           | `str`           | `"/docs"`           | Blueprint for OpenAPI ドキュメントに使用する URL のプレフィックス。                                                                                    |
