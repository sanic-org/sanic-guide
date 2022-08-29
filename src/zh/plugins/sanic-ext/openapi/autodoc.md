# 自动文档（Auto-documentation）

为了更容易地记录响应函数，Sanic 拓展将使用函数的文档字符串来填充您的文档。

## 总结和描述（Summary and description）

函数的文档字符串将用于创建摘要和描述。 从这个例子中可以看出，文档字符串已经被解析，使用第一行作为摘要，字符串的剩余部分作为描述。 :--:1
```python
@app.get("/foo")
async def handler(request, something: str):
    """This is a simple foo handler

    It is helpful to know that you could also use **markdown** inside your
    docstrings.

    - one
    - two
    - three"""
    return text(">>>")

    - one
    - two
    - three"""
    return text(">>>")
```
```json
{
  "paths": {
    "/foo": {
      "get": {
        "summary": "This is a simple foo handler",
        "description": "It is helpful to know that you could also use **markdown** inside your<br>docstrings.<br><br>- one<br>- two<br>- three",
        "responses": {
          "default": {
            "description": "OK"
          }
        },
        "operationId": "get_handler"
      }
    }
  }
}
```
:---

## YAML 级操作（Operation level YAML）

您可以通过在文档字符串中添加有效的 OpenAPI YAML 来对此进行扩展。 只需添加一行包含 `openapi:` 的内容，后跟您的 YAML。

示例中显示的 `---` 不是必需的。 它只是在那里帮助视觉识别 YAML 作为文档字符串的一个独特部分。 :--:1
```python
@app.get("/foo")
async def handler(request, something: str):
    """This is a simple foo handler

    Now we will add some more details

    openapi:
    ---
    operationId: fooDots
    tags:
      - one
      - two
    parameters:
      - name: limit
        in: query
        description: How many items to return at one time (max 100)
        required: false
        schema:
          type: integer
          format: int32
    responses:
      '200':
        description: Just some dots
    """
    return text("...")
```
```json
{
  "paths": {
    "/foo": {
      "get": {
        "operationId": "fooDots",
        "summary": "This is a simple foo handler",
        "description": "Now we will add some more details",
        "tags": [
          "one",
          "two"
        ],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "How many items to return at one time (max 100)",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Just some dots"
          }
        }
      }
    }
  }
}
```

:---

当 YAML 文档和装饰器都被使用时，在生成文档时将优先使用装饰器中的内容。 :::

## 排除文档字符串（Excluding docstrings）

有时，函数的文档字符串中可能包含并不打算展示在文档中的字符串。

:--:1

**选项 2**: 使用 `@openapi.no_autodoc` 装饰器为某个指定的响应程序禁用自动文档生成功能。
```python
@app.get("/foo")
@openapi.no_autodoc
async def handler(request, something: str):
    """This is a docstring about internal info only. Do not parse it.
    """
    return text("...") Do not parse it.
    """
    return text("...")
```
:---
