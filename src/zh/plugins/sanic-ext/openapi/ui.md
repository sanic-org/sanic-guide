# 用户界面（UI）

Sanic Extensions 带有 Redoc 和 Swagger 接口。 您可以选择使用其中之一，或同时使用两者。 开箱即用，为您设置了以下端点，`/docs` 显示 Redoc。

- `/docs`
- `/docs/openapi.json`
- `/docs/redoc`
- `/docs/swagger`
- `/docs/openapi-config`

## 配置选项（Config options）

| **配置名称**               | **类型**        | **默认值**          | **说明**                                                           |
| -------------------------- | --------------- | ------------------- | -------------------------------------------------------------- |
| `OAS_IGNORE_HEAD`          | `bool`          | `True`              | 是否显示 `HEAD` 响应函数                                          |
| `OAS_IGNORE_OPTIONS`       | `bool`          | `True`              | 是否显示 `OPTIONS` 响应函数                                       |
| `OAS_PATH_TO_REDOC_HTML`   | `Optional[str]` | `None`              | 用于覆盖默认 Redoc HTML 的 HTML 路径                              |
| `OAS_PATH_TO_SWAGGER_HTML` | `Optional[str]` | `None`              | 用于覆盖默认 Swagger HTML 的 HTML 路径                            |
| `OAS_UI_DEFAULT`           | `Optional[str]` | `"redoc"`           | 可以设置为 `redoc` 或 `swagger`。 控制要在基本路由上显示的 UI。 如果设置为 `None`，则不会设置文档路由 |
| `OAS_UI_REDOC`             | `bool`          | `True`              | 是否启用 Redoc UI                                               |
| `OAS_UI_SWAGGER`           | `bool`          | `True`              | 是否启用 Swagger UI                                             |
| `OAS_URI_TO_CONFIG`        | `str`           | `"/openapi-config"` | Swagger 使用的 OpenAPI 配置的 URI 路径                            |
| `OAS_URI_TO_JSON`          | `str`           | `"/openapi.json"`   | JSON 文档的 URI 路径                                             |
| `OAS_URI_TO_REDOC`         | `str`           | `"/redoc"`          | Redoc 的 URI 路径                                               |
| `OAS_URI_TO_SWAGGER`       | `str`           | `"/swagger"`        | Swagger 的 URI 路径                                             |
| `OAS_URL_PREFIX`           | `str`           | `"/docs"`           | 用于 OpenAPI 文档蓝图的 URL 前缀                                  |