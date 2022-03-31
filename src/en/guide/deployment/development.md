# Development

The first thing that should be mentioned is that the webserver that is integrated into Sanic is **not** just a development server. 

It is production ready, provided you are *not* in debug mode.

## Debug mode

By setting the debug mode, Sanic will be more verbose in its output and will disable several run-time optimizations.

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

::: warning
Sanic's debug mode will slow down the server's performance and is therefore advised to enable it only in development environments.
:::
## Automatic Reloader

---:1

Sanic offers a way to enable or disable the Automatic Reloader. The `auto_reload` argument will activate or deactivate the Automatic Reloader. Every time a Python file is changed, the reloader will restart your application automatically. This is very convenient while developing.
:--:1
```python
app.run(auto_reload=True)
```
:---

---:1
If you have additional directories that you would like to automatically reload on file save (for example, a directory of HTML templates), you can add that at run time.
:--:1
```python
app.run(auto_reload=True, reload_dir="/path/to/templates")
# or multiple directories
app.run(auto_reload=True, reload_dir=["/path/to/one", "/path/to/two"])
```
:---

## Best of both worlds
::: new NEW in v22.3
---:1
If you would like to be in debug mode **and** have the Automatic Reloader running, you can pass `dev=True`. This is equivalent to **debug + auto reload**.
:--:1
```python
app.run(dev=True)
```
:---
:::

## CLI

It should be noted that all of these have an equivalent in the Sanic CLI:

```
  Development:
    --debug                        Run the server in DEBUG mode. It includes DEBUG logging,
                                   additional context on exceptions, and other settings
                                   not-safe for PRODUCTION, but helpful for debugging problems.
    -r, --reload, --auto-reload    Watch source directory for file changes and reload on changes
    -R PATH, --reload-dir PATH     Extra directories to watch and reload on changes
    -d, --dev                      debug + auto reload.
```
