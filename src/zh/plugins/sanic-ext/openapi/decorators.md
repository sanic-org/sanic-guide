# 装饰器（Decorators）

向架构添加内容的主要机制是装饰端点。 如果您过去使用过`sanic-openapi`，那么您应该很熟悉。 装饰器名称及其参数与 [OAS v3.0 规范](https://swagger.io/specification/) 完全一致。

---:1

以下的所有示例都将围绕一个路由展开。 当您创建它们时，您应该确保您的 Sanic 路由装饰器（`@app.route`、`@app.get` 等）是最外层的装饰器。 也就是说，您应该先放路由装饰器，然后再放下面示例中的一个或多个装饰器。

:--:1

```python
from sanic_ext import openapi


@app.get("/path/to/<something>")
@openapi.summary("This is a summary")
@openapi.description("This is a description")
async def handler(request, somethind: str):
    ...
```

:---

---:1

您还将看到以下许多示例都引用了模型对象。 为简单起见，示例将使用如下所示的 `UserProfile`。 这是一个非常简单的模型类。 您可以轻易的将其联想到 `数据类` 或其他的任何类型的模型对象。

:--:1

```python
class UserProfile:
    name: str
    age: int
    email: str
```

:---

## 多功能装饰器（Definition decorator）

### `@opanepi.definition`

`@openapi.definition` 装饰器允许您一次性定义文档中要展示的所有部分。 它是一个多功能装饰器，因为它具有与其他装饰器相同的定义功能。 使用多个特定字段的装饰器还是使用单个多功能装饰器取决于您自己的使用偏好。

这些字段特意允许接受多种类型，使您可以最轻松的定义您的文档。

**Arguments**

| 参数名称          | 参数类型                                                                 |
| ------------- | -------------------------------------------------------------------- |
| `body`        | ***dict, RequestBody, ***YourModel******                             |
| `deprecated`  | **bool**                                                             |
| `description` | **str**                                                              |
| `document`    | **str, ExternalDocumentation**                                       |
| `exclude`     | **bool**                                                             |
| `operation`   | **str**                                                              |
| `parameter`   | **dict, Parameter, *YourModel*, [dict], [Parameter], [*YourModel*]** |
| `response`    | **dict, Response, *YourModel*, [dict], [Response], [*YourModel*]**   |
| `summary`     | **str**                                                              |
| `tag`         | **str, Tag, [str], [Tag]**                                           |
| `secured`     | **Dict[str, Any]**                                                   |

**Examples**

---:1

```python
@openapi.definition(
    body=RequestBody(UserProfile, required=True),
    summary="User profile update",
    tag="one",
    response=[Success, Response(Failure, status=400)],
)
```

:--:1

:---

*有关更多示例，请参见以下示例。 以下装饰器的任何值都可以在相应的关键字参数中使用。*

## 特定字段装饰器（Field-specific decorators）

以下所有的装饰器都是以 `@openapi` 为基础展开的

:::: tabs

::: tab body

**Arguments**

| 参数名称        | 参数类型                               |
| ----------- | ---------------------------------- |
| **content** | ***YourModel*, dict, RequestBody** |

**Examples**

---:1

```python
@openapi.body(UserProfile)
```

```python
@openapi.body({"application/json": UserProfile})
```

```python
@openapi.body(RequestBody({"application/json": UserProfile}))
```

:--:1

```python
@openapi.body({"content": UserProfile})
```

```python
@openapi.body(RequestBody(UserProfile))
```

:---

:::

::: tab deprecated

**Arguments**

*None*

**Examples**

---:1

```python
@openapi.deprecated()
```

:--:1

```python
@openapi.deprecated
```

:---

:::

::: tab description

**Arguments**

| 参数名称   | 参数名称    |
| ------ | ------- |
| `text` | **str** |

**Examples**

---:1

```python
@openapi.description(
    """This is a **description**.

## You can use `markdown`

- And
- make
- lists.
"""
)

## You can use `markdown`

- And
- make
- lists.
"""
)
```

:--:1

:---

:::

::: tab document

**Arguments**

| 参数名称          | 参数类型    |
| ------------- | ------- |
| `url`         | **str** |
| `description` | **str** |

**Examples**

---:1

```python
@openapi.document("http://example.com/docs")
```

:--:1

```python
@openapi.document(ExternalDocumentation("http://example.com/more"))
```

:---

:::

::: tab exclude

可以像其他所有装饰器一样用在响应函数上，也可以作用在蓝图上

**Arguments**

| 参数名称   | 参数类型          | 默认值      |
| ------ | ------------- | -------- |
| `flag` | **bool**      | **True** |
| `bp`   | **Blueprint** |          |

**Examples**

---:1

```python
@openapi.exclude()
```

:--:1

```python
openapi.exclude(bp=some_blueprint)
```

:---

:::

::: tab operation

设置操作 ID。

**Arguments**

| 参数名称   | 参数类型    |
| ------ | ------- |
| `name` | **str** |

**Examples**

---:1

```python
@openapi.operation("doNothing")
```

:--:1

:---

:::

::: tab parameter

**Arguments**

| 参数名称       | 参数类型                                      | 默认值         |
| ---------- | ----------------------------------------- | ----------- |
| `name`     | **str**                                   |             |
| `schema`   | ***type***                                | **str**     |
| `location` | **"query", "header", "path" or "cookie"** | **"query"** |

**Examples**

---:1

```python
@openapi.parameter("thing")
```

```python
@openapi.parameter(parameter=Parameter("foobar", deprecated=True))
```

:--:1

```python
@openapi.parameter("Authorization", str, "header")
```

```python
@openapi.parameter("thing", required=True, allowEmptyValue=False)
```

:---

:::

::: tab response

**Arguments**

如果使用 `Response` 对象，则不应传递任何其他参数。

| 参数名称          | 参数类型                          |
| ------------- | ----------------------------- |
| `status`      | **int**                       |
| `content`     | ***type*, *YourModel*, dict** |
| `description` | **str**                       |
| `response`    | **Response**                  |

**Examples**

---:1

```python
@openapi.response(200, str, "This is endpoint returns a string")
```

```python
@openapi.response(200, {"text/plain": str}, "...")
```

```python
@openapi.response(response=Response(UserProfile, description="..."))
```

```python
@openapi.response(
    response=Response(
        {
            "application/json": UserProfile,
        },
        description="...",
        status=201,
    )
)
```

:--:1

```python
@openapi.response(200, UserProfile, "...")
```

```python
@openapi.response(
    200,
    {
        "application/json": UserProfile,
    },
    "Description...",
)
```

:---

:::

::: tab summary

**Arguments**

| 参数名称   | 参数类型    |
| ------ | ------- |
| `text` | **str** |

**Examples**

---:1

```python
@openapi.summary("This is an endpoint")
```

:--:1

:---

:::

::: tab tag

**Arguments**

| 参数名称    | 参数类型         |
| ------- | ------------ |
| `*args` | **str, Tag** |

**Examples**

---:1

```python
@openapi.tag("foo")
```

:--:1

```python
@openapi.tag("foo", Tag("bar"))
```

:---

:::

:::tab secured

**Arguments**

| Field             | Type                    |
| ----------------- | ----------------------- |
| `*args, **kwargs` | **str, Dict[str, Any]** |

**Examples**

---:1
```python
@openapi.secured()
```
:--:1 :---

---:1
```python
@openapi.secured("foo")
```
:--:1
```python
@openapi.secured("token1", "token2")
```
:---

---:1
```python
@openapi.secured({"my_api_key": []})
```
:--:1
```python
@openapi.secured(my_api_key=[])
```
:---

Do not forget to use `add_security_scheme`. See [security](./security.md) for more details.

:::

::::
