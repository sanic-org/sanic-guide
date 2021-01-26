# Sanic 应用

## 实例(Instance)

---:1

`Sanic()` 是最基础的组成部分，通常我们会在一个名为 `server.py` 的文件中将其实例化，当然文件名称并不必须叫做 `server.py` , 但是我们还是推荐使用 `server.py` 做为文件名称来实例化 Sanic
对象。

:--:1

```python
# /path/to/server.py

from sanic import Sanic

app = Sanic("My Hello, world app")

```

:---

## App 注册表(App Registry)

---:1

当您实例化一个 Sanic 对象之后， 你就可以随时通过 Sanic 注册表来获取该对象了，尤其是当您在无法通过其他方式来获取 Sanic 对象的时候， 这种方式将对您有非常大的帮助。

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

如果您希望使用 `Sanic.get_app（"non-existing"）` 来获取不存在的 Sanic 对象， 您应该通过添加 `force_creat` 参数，此参数意味着如果要获取的 Sanic 对象不存在，则主动创建一个同名的
Sanic 对象并返回。如果不设置该参数，那么默认情况下将会抛出 `SanicException` 异常。

:--:1

```python
app = Sanic.get_app(
    "non-existing",
    force_create=True,
)
```

:---

## 配置(Configuration)

---:1

Sanic 将配置保存在 Sanic 对象的 `config` 属性中。可以使用**属性操作**或**字典操作**的方式来修改配置。

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

按照惯例，配置中的键名都需要完全大写，但是多数情况下小写也会起作用，不过我们仍旧建议您使用大写作为配置的键名。

```
app.config.GOOD = "yay!"
app.config.bad = "boo"
```

:::

后面还有更多关于 [配置](/guide/zh/deployment/configuration.md) 的细节

<!-- ## Methods

### 运行

### 停止 -->