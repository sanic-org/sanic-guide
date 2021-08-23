# 便利功能（Convenience）

## 固定序列化器（Fixed serializer）

---:1

通常在开发应用程序的时候，总会有一些路由返回相同类型的响应。在这种情况下，您可以在响应程序上定义一个返回序列化程序，之后您只需要返回响应内容即可。

:--:1

```python
from sanic_ext import serializer


@app.get("/<name>")
@serializer(text)
async def hello_world(request, name: str):
    if name.isnumeric():
        return "hello " * int(name)
    return f"Hello, {name}"
```

:---

---:1

`serializer` 装饰器同样支持设置 HTTP 状态码

:--:1

```python
from sanic_ext import serializer


@app.post("/")
@serializer(text, status=202)
async def create_something(request):
    ...
```

:---

## 自定义序列化器（Custom serializer）

---:1

使用 `@serializer` 装饰器，您也可以传递自定义函数，只要它们返回的是一个有效地响应类型（`HTTPResonse`）。

:--:1

```python
def message(retval, request, action, status):
    return json(
        {
            "request_id": str(request.id),
            "action": action,
            "message": retval,
        },
        status=status,
    )


@app.post("/<action>")
@serializer(message)
async def do_action(request, action: str):
    return "This is a message"
```

:---

---:1

现在，返回一个字符串应该会得到一个不错的序列化输出。

:--:1

```python
$ curl
localhost: 8000 / eat_cookies - X
POST
{
    "request_id": "ef81c45b-235c-46dd-9dbd-b550f8fa77f9",
    "action": "eat_cookies",
    "message": "This is a message"
}

```

:---
