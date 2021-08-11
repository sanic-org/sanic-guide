# Convenience

## Fixed serializer

---:1

Often when developing an application, there will be certain routes that always return the same sort of response. When this is the case, you can predefine the return serializer and on the endpoint, and then all that needs to be returned is the content.

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

The `serializer` decorator also can add status codes.

:--:1
```python
from sanic_ext import serializer

@app.post("/")
@serializer(text, status=202)
async def create_something(request):
    ...
```
:---

## Custom serializer


---:1

Using the `@serializer` decorator, you can also pass your own custom functions as long as they also return a valid type (`HTTPResonse`).

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

Now, returning just a string should return a nice serialized output.

:--:1

```python
$ curl localhost:8000/eat_cookies -X POST
{
  "request_id": "ef81c45b-235c-46dd-9dbd-b550f8fa77f9",
  "action": "eat_cookies",
  "message": "This is a message"
}

```

:---
