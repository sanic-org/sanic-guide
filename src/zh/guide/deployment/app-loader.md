# Dynamic Applications

Running Sanic has been optimized to work with the CLI. If you have not read it yet, you should read [Running Sanic](./running.md#sanic-server) to become familiar with the options.

---:1 This includes running it as a global scope object... :--:1
```python
# server.py
app = Sanic("TestApp")

@app.get("/")
async def handler(request: Request):
    return json({"foo": "bar"})
```
```
sanic path.to.server:app
```
:---


---:1 ...or, a factory function that creates the `Sanic` application object. :--:1
```python
# server.py
def create_app():
    app = Sanic("TestApp")

    @app.get("/")
    async def handler(request: Request):
        return json({"foo": "bar"})

    return app
```
```
sanic path.to.server:create_app --factory
```
:---


**Sometimes, this is not enough ... :thinking:**

Introduced in [v22.9](../release-notes/v22.9.md), Sanic has an `AppLoader` object that is responsible for creating an application in the various [worker processes](./manager.md#how-sanic-server-starts-processes). You can take advantage of this if you need to create a more dynamic startup experience for your application.

---:1 An `AppLoader` can be passed a callable that returns a `Sanic` instance. That `AppLoader` could be used with the low-level application running API. :--:1
```python
from sanic import Request, Sanic, json
from sanic.worker.loader import AppLoader


def attach_endpoints(app: Sanic):
    @app.get("/")
    async def handler(request: Request):
        return json({"foo": "bar"})


def create_app() -> Sanic:
    app = Sanic("TestApp")
    attach_endpoints(app)
    return app


if __name__ == "__main__":
    loader = AppLoader(factory=create_app)
    app = loader.load()
    app.prepare(port=9999, dev=True)
    Sanic.serve(primary=app, app_loader=loader)
```
:---

In the above example, the `AppLoader` is created with a `factory` that can be used to create copies of the same application across processes. When doing this, you should explicitly use the `Sanic.serve` pattern shown above so that the `AppLoader` that you create is not replaced.
