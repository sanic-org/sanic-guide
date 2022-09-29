# Sanic 应用(Sanic Application)

## 实例(Instance)

---:1 The most basic building block is the `Sanic()` instance. `Sanic()` 是最基础的组成部分，通常我们会在一个名为 `server.py` 的文件中将其实例化，当然文件名称并不是必须的, 但是我们还是推荐使用 `server.py` 做为文件名称来实例化 Sanic 对象。 :--:1
```python
# /path/to/server.py

from sanic import Sanic

app = Sanic("My Hello, world app")
```
:---

## 应用上下文(Application context)

大多数应用程序都需要跨代码库的不同部分共享/重用数据或对象。 最常见的例子是数据库连接。

在 21.3 版之前的 Sanic 版本中，这通常是通过将属性附加到应用程序上来实现的。
```python
# Raises a warning as deprecated feature in 21.3
app = Sanic("MyApp")
app.db = Database()
```
:---

在 v21.3 版本中，我们引入了应用级的上下文对象，且使用方法与 [请求上下文](./request.md#context) 一致， 这有效的避免了命名冲突可能导致的潜在问题。 :--:1
```python
# Correct way to attach objects to the application
app = Sanic("MyApp")
app.ctx.db = Database()
```
:---

## App 注册表(App Registry)

---:1

When you instantiate a Sanic instance, that can be retrieved at a later time from the Sanic app registry. This can be useful, for example, if you need to access your Sanic instance from a location where it is not otherwise accessible. :--:1
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

如果您希望使用 `Sanic.get_app（"non-existing"）` 来获取不存在的 Sanic 对象， 您应该通过添加 `force_create` 参数，此参数意味着如果要获取的 Sanic 对象不存在，则主动创建一个同名的 Sanic 对象并返回。 如果不设置该参数，那么默认情况下将会抛出 `SanicException` 异常。 You can, instead, force the method to return a new instance of Sanic with that name. :--:1
```python
app = Sanic.get_app(
    "non-existing",
    force_create=True,
)
```
:---

---:1 If there is **only one** Sanic instance registered, then calling `Sanic.get_app()` with no arguments will return that instance :--:1
```python
Sanic("My only app")

app = Sanic.get_app()
```
:---

## 配置(Configuration)

Sanic 将配置保存在 Sanic 对象的 `config` 属性中。 可以使用 **属性操作** 或 **字典操作** 的方式来修改配置。 :--:1
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

::: tip Heads up Config keys _should_ be uppercase. But, this is mainly by convention, and lowercase will work most of the time.
```
app.config.GOOD = "yay!"
app.config.bad = "boo"
```
:::

之后还有更多关于 [配置](/zh/guide/deployment/configuration.md) 的细节。


## 自定义(Customization)

The Sanic application instance can be customized for your application needs in a variety of ways at instantiation.

### 自定义配置(Custom configuration)
---:1

如果 **只有一个** Sanic 实例被注册了，那么调用 `Sanic.get_app()` 时如果不传入任何参数则将返回该实例。

如果您使用了自定义配置对象类，*强烈建议* 您将自定义类继承 Sanic 的 `Config` 类，以保持与父类行为一致。 You could use this option for adding properties, or your own set of custom logic.

:--:1
```python
from sanic.config import Config


class MyConfig(Config):
    FOO = "bar"


app = Sanic(..., config=MyConfig())
```
:---

如果您想使用一个与[通用配置](../deployment/configuration.md#使用通用方法加载-using-sanic-update-config)格式不一样的配置文件时会比较有用。 :--:1
```python
from sanic import Sanic, text
from sanic.config import Config


class TomlConfig(Config):
    def __init__(self, *args, path: str, **kwargs):
        super().__init__(*args, **kwargs)

        with open(path, "r") as f:
            self.apply(toml.load(f))

    def apply(self, config):
        self.update(self._to_uppercase(config))

    def _to_uppercase(self, obj: Dict[str, Any]) -> Dict[str, Any]:
        retval: Dict[str, Any] = {}
        for key, value in obj.items():
            upper_key = key.upper()
            if isinstance(value, list):
                retval[upper_key] = [
                    self._to_uppercase(item) for item in value
                ]
            elif isinstance(value, dict):
                retval[upper_key] = self._to_uppercase(value)
            else:
                retval[upper_key] = value
        return retval


toml_config = TomlConfig(path="/path/to/config.toml")
app = Sanic(toml_config.APP_NAME, config=toml_config)
```
:---
### 自定义上下文(Custom context)
---:1

在默认情况下，应用程序上下文是一个 [`SimpleNamespace`](https://docs.python.org/3/library/types.html#types.SimpleNamespace) 实例，它允许您在上面设置任何您想要的属性。 然而，您也可以选择使用其他对象来代替。

:--:1
```python
app = Sanic(..., ctx=1)
```

```python
app = Sanic(..., ctx={})
```

```python
class MyContext:
    ...

class MyContext:
    ...


app = Sanic(..., ctx=MyContext())
```
:---
### 自定义请求(Custom requests)
有时，自定义一个 `Request` 类显得很重要。 举一个简单的例子，设置自定义的 `request.id` 属性。

Sanic 应用在实例化时可以根据您的需求以多种方式进行定制。

记住，您应该传入 *类* 对象作为参数，而不是该类的实例。

自定义配置最简单的方式，就是将您自己的配置对象直接传递到 Sanic 实例中
```python
import time

from sanic import Request, Sanic, text


class NanoSecondRequest(Request):
    @classmethod
    def generate_id(*_):
        return time.time_ns()


app = Sanic(..., request_class=NanoSecondRequest)


@app.get("/")
async def handler(request):
    return text(str(request.id))
```
:---

### 自定义错误响应函数(Custom error handler)

详见 [exception handling](../best-practices/exceptions.md#自定义异常处理-custom-error-handling)
```python
from sanic.handlers import ErrorHandler


class CustomErrorHandler(ErrorHandler):
    def default(self, request, exception):
        ''' handles errors that have no error handlers assigned '''
        # You custom error handling logic...
        return super().default(request, exception)


app = Sanic(..., error_handler=CustomErrorHandler())
        return super().default(request, exception)

app = Sanic(..., error_handler=CustomErrorHandler())
```
:---

### Custom dumps function

---:1 It may sometimes be necessary or desirable to provide a custom function that serializes an object to JSON data. :--:1
```python
import ujson

dumps = partial(ujson.dumps, escape_forward_slashes=False)
app = Sanic(__name__, dumps=dumps)
```
:---

---:1 Or, perhaps use another library or create your own. :--:1
```python
from orjson import dumps

app = Sanic(__name__, dumps=dumps)
```
:---

::: new NEW in v 22.9
### Custom loads function

---:1 Similar to `dumps`, you can also provide a custom function for deserializing data. :--:1
```python
from orjson import loads

app = Sanic(__name__, loads=loads)
```
:--- :::
