# Sanic 应用

## 实例

---:1

`Sanic()`是最基础的组成部分，通常我们会在一个名为`server.py`的应用程序中将其实例化，当然文件名称并不必须叫做`server.py`, 但是我们还是推荐使用 `server.py`作为文件名称来实例化 Sanic 应用。

:--:1
```python
# /path/to/server.py

from sanic import Sanic

app = Sanic("My Hello, world app")

```

:---

## App 注册表

---:1

当您实例化一个 Sanic 实例之后， 你就可以随时通过 Sanic 注册表来获取该实例了，尤其是当您在无法通过其他方式来获取 Sanic 实例的时候， 这种方式将对您有非常大的帮助。

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

如果您在不存在的应用程序上调用 `Sanic.get_app（"non-existing"）`，默认情况下它将引发`SanicException`。您也可以通过添加`force_creat`参数来达到没有实例则创建一个同名的新实例的效果。 

:--:1

```python
app = Sanic.get_app(
    "non-existing",
    force_create=True,
)
```
:---

## 配置

---:1

Sanic 将配置保存在 Sanic 实例的 `config` 属性中。可以使用**属性操作**或**字典操作**的方式来修改配置。

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

::: tip 小提示：

按照惯例，配置中的键名都需要完全大写，但是多数情况下小写也会起作用的，不过我们仍旧建议您使用大写作为配置的键名。

```
app.config.GOOD = "yay!"
app.config.bad = "boo"
```
:::

后面还有更多[关于配置的细节](/guide/zh/deployment/configuration.md)

<!-- ## Methods

### 运行

### 停止 -->