# Sanic Application

## Instance

---:1
The most basic building block is the `Sanic()` instance. It is not required, but the custom is to instatiate this in a file called `server.py`.
:--:1
```python
# /path/to/server.py

from sanic import Sanic

app = Sanic("My Hello, world app")
```
:---

## Application context
::: new NEW in v21.3
Most applications will have the need to share/reuse data or objects across different parts of the code base. The most common example is DB connections. 

---:1
In versions of Sanic prior to v21.3, this was commonly done by attaching an attribute to the application instance
:--:1
```python
# Raises a warning as deprecated feature in 21.3
app = Sanic("MyApp")
app.db = Database()
```
:---

---:1
Because this can create potential problems with name conflicts, and to be consistent with [request context](./request.md#context) objects, v21.3 introduces application level context object.
:--:1
```python
# Correct way to attach objects to the application
app = Sanic("MyApp")
app.ctx.db = Database()
```
:---
:::

## App Registry

---:1

When you instantiate a Sanic instance, that can be retrieved at a later time from the Sanic app registry. This can be useful, for example, if you need to access your Sanic instance from a location where it is not otherwise accessible.
:--:1
```python
# ./path/to/server.py
from sanic import Sanic

app = Sanic("my_awesome_server")

# ./path/to/somewhere_else.py
from sanic import Sanic

app = Sanic.get_app("my_awesome_server")
```
:---

---:1

If you call `Sanic.get_app("non-existing")` on an app that does not exist, it will raise `SanicException` by default. You can, instead, force the method to return a new instance of Sanic with that name.
:--:1
```python
app = Sanic.get_app(
    "non-existing",
    force_create=True,
)
```
:---

---:1
::: new NEW in v21.3
If there is **only one** Sanic instance registered, then calling `Sanic.get_app()` with no arguments will return that instance
:::
:--:1
```python
Sanic("My only app")

app = Sanic.get_app()
```
:---

## Configuration


---:1

Sanic holds the configuration in the `config` attribute of the `Sanic` instance. Configuration can be modified **either** using dot-notation **OR** like a dictionary.
:--:1
```python
app = Sanic('myapp')

app.config.DB_NAME = 'appdb'
app.config['DB_USER'] = 'appuser'

db_settings = {
    'DB_HOST': 'localhost',
    'DB_NAME': 'appdb',
    'DB_USER': 'appuser'
}
app.config.update(db_settings)
```
:---

::: tip Heads up
Config keys _should_ be uppercase. But, this is mainly by convention, and lowercase will work most of the time.
```
app.config.GOOD = "yay!"
app.config.bad = "boo"
```
:::

There is much [more detail about configuration](/guide/deployment/configuration.md) later on.

<!-- ## Methods

### Run
### Stop -->
