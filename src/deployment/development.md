# Development

The first thing that should be mentioned is that the webserver that is integrated into Sanic is **not** just a development server. 

It is production ready, provided you are *not* in debug mode.

## Debug mode

By setting the debug mode a more verbose output from Sanic will be output and the Automatic Reloader will be activated.

```python
from sanic import Sanic
from sanic.response import json

app = Sanic(__name__)

@app.route("/")
async def hello_world(request):
    return json({"hello": "world"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1234, debug=True)
```

!> **Warning** Sanic's debug more will slow down the server's performance and is therefore advised to enable it only in development environments.

## Automatic Reloader

<!-- panels:start -->
<!-- div:left-panel -->
Sanic offers a way to enable or disable the Automatic Reloader manually (and independent from debug mode). The `auto_reload` argument will activate or deactivate the Automatic Reloader.
<!-- div:right-panel -->
```python
app.run(auto_reload=True)
```
<!-- panels:end -->
