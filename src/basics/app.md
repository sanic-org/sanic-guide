# Sanic Application

## Instance

<!-- panels:start -->
<!-- div:left-panel -->

The most basic building block is the `Sanic()` instance. It is not required, but the custom is to instatiate this in a file called `server.py`.

<!-- div:right-panel -->
```python
# /path/to/server.py

from sanic import Sanic

app = Sanic("My Hello, world app")

```

<!-- panels:end -->

## App Registry

<!-- panels:start -->
<!-- div:left-panel -->
When you instantiate a Sanic instance, that can be retrieved at a later time from the Sanic app registry. This can be useful, for example, if you need to access your Sanic instance from a location where it is not otherwise accessible.
<!-- div:right-panel -->
```python
# ./path/to/server.py
from sanic import Sanic

app = Sanic("my_awesome_server")

# ./path/to/somewhere_else.py
from sanic import Sanic

app = Sanic.get_app("my_awesome_server")
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:left-panel -->
If you call `Sanic.get_app("non-existing")` on an app that does not exist, it will raise `SanicException` by default. You can, instead, force the method to return a new instance of Sanic with that name.
<!-- div:right-panel -->
```python
app = Sanic.get_app(
    "non-existing",
    force_create=True,
)
```
<!-- panels:end -->

## Configuration


<!-- panels:start -->
<!-- div:left-panel -->
Sanic holds the configuration in the `config` attribute of the `Sanic` instance. Configuration can be modified **either** using dot-notation **OR** like a dictionary.
<!-- div:right-panel -->
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
<!-- panels:end -->

?> **Heads up** Config keys _should_ be uppercase. But, this is by convention online. Feel free to break the rules :wink:
```
app.config.GOOD = "yay!"
app.config.bad = "boo"
```

There is much [more detail about configuration](/deployment/configuration.md) later on.

## Methods

### Run
### Stop
