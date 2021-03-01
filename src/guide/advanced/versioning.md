# Versioning

It is standard practice in API building to add versions to your endpoints. This allows you to easily differentiate incompatible endpoints when you try and change your API down the road in a breaking manner.

Adding a version will add a `/v{version}` url prefix to your endpoints.

::: new NEW in v21.3
The version can be a `int`, `float`, or `str`. Acceptable values:

- `1`, `2`, `3`
- `1.1`, `2.25`, `3.0`
- `"1"`, `"v1"`, `"v1.1"`
:::

## Per route

---:1

You can pass a version number to the routes directly.
:--:1
```python
# /v1/text
@app.route("/text", version=1)
def handle_request(request):
    return response.text("Hello world! Version 1")

# /v2/text
@app.route("/text", version=2)
def handle_request(request):
    return response.text("Hello world! Version 2")
```
:---

## Per Blueprint

---:1

You can also pass a version number to the blueprint, which will apply to all routes in that blueprint.
:--:1
```python
bp = Blueprint("test", url_prefix="/foo" version=1)

# /v1/foo/text
@bp.route("/html")
def handle_request(request):
    return response.html("<p>Hello world!</p>")
```
:---
