# 便利功能（Convenience）

## 固定序列化器（Fixed serializer）

---:1 Often when developing an application, there will be certain routes that always return the same sort of response. 在这种情况下，您可以在响应程序上定义一个返回序列化程序，之后您只需要返回响应内容即可。 :--:1
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


---:1 The `serializer` decorator also can add status codes. :--:1
```python
from sanic_ext import serializer


@app.post("/")
@serializer(text, status=202)
async def create_something(request):
    ...
```
:---

## 自定义序列化器（Custom serializer）

---:1 Using the `@serializer` decorator, you can also pass your own custom functions as long as they also return a valid type (`HTTPResonse`). :--:1
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

---:1 Now, returning just a string should return a nice serialized output. :--:1

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


## Request counter

---:1 Sanic Extensions comes with a subcleass of `Request` that can be setup to automatically keep track of the number of requests processed per worker process. To enable this, you should pass the `CountedRequest` class to your application contructor. :--:1
```python
from sanic.request import CountedRequest

app = Sanic(..., request_class=CountedRequest)
```
:---

---:1 You will now have access to the number of requests served during the lifetime of the worker process. :--:1
```python
@app.get("/")
async def handler(request: CountedRequest):
    return json({"count": request.count})
```
:---

If possible, the request count will also be added to the [worker state](../../guide/deployment/manager.md#worker-state).

![](https://user-images.githubusercontent.com/166269/190922460-43bd2cfc-f81a-443b-b84f-07b6ce475cbf.png)
