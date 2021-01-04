# Versioning

It is standard practice in API building to add versions to your endpoints. This allows you to easily differentiate incompatible endpoints when you try and change your API down the road in a breaking manner.

Adding a version will add a `/v{version}` url prefix to your endpoints.

## Per route

<!-- panels:start -->
<!-- div:left-panel -->
You can pass a version number to the routes directly.
<!-- div:right-panel -->
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
<!-- panels:end -->

## Per Blueprint

<!-- panels:start -->
<!-- div:left-panel -->
You can also pass a version number to the blueprint, which will apply to all routes in that blueprint.
<!-- div:right-panel -->
```python
bp = Blueprint("test", url_prefix="/foo" version=1)

# /v1/foo/text
@bp.route("/html")
def handle_request(request):
    return response.html("<p>Hello world!</p>")
```
<!-- panels:end -->
