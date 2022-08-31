# Приложение Sanic

## Экземпляр объекта

---:1 Экземпляр объекта приложения `Sanic()` является самым основным кирпичиком. Это не обязательно, но обычно создание экземпляра приложения происходит в файле, называемом `server.py`. :--:1
```python
# /path/to/server.py

from sanic import Sanic

app = Sanic("MyHelloWorldApp")
```
:---

## Контекст приложения

Большинство приложений будут иметь необходимость совместного или повторного использования данных или объектов в различных местах кода. Наиболее распространенным примером является соединение с базой данных.

---:1 В версиях Sanic до v21.3 это делалось путем добавления атрибута к экземпляру приложения :--:1
```python
# Выкидывает предупреждение об исключении подобного использования в версии 21.3
app = Sanic("MyApp")
app.db = Database()
```
:---

---:1 В связи с возможностью возникновения потенциальных проблем с конфликтами имён, v21.3 вводит объект контекста на уровне самого приложения для сохранения консистентности объектов [контекста запроса](./request.md#context). :--:1
```python
# Правильный способ прикрепления объектов к приложению
app = Sanic("MyApp")
app.ctx.db = Database()
```
:---

## Реестр приложений

---:1

Когда вы создаете экземпляр Sanic, его можно будет позже позже из реестра приложения Sanic. Это может быть полезно, например, если вам нужен доступ к вашему экземпляру Sanic из места, где он недоступен. :--:1
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

Если вы вызовете `Sanic.get_app("non-existing")` в приложении, которое не существует, то по умолчанию это вызовет `SanicException`. Однако, вместо этого вы можете принудительно вернуть новый экземпляр Sanic с таким именем. :--:1
```python
app = Sanic.get_app(
    "non-existing",
    force_create=True,
)
```
:---

---:1 Если **зарегистрирован только один** экземпляр Sanic, то вызов без аргументов `Sanic.get_app()` возвращает этот экземпляр :--:1
```python
Sanic("My only app")

app = Sanic.get_app()
```
:---

## Настройки

---:1 Настройки экземпляра приложения `Sanic` располагаются в атрибуте `config`. Конфигурация может быть изменена посредством **ЛИБО** точечной **ЛИБО** словарной нотации. :--:1
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

::: Совет Конфигурационные ключи _должны_ быть указаны заглавными буквами. Но это общее следование конвенции. В нижнем регистре в целом тоже будет работать.
```
app.config.GOOD = "yay!"
app.config.bad = "boo"
```
:::

Далее есть [более подробное описание настроек](/guide/deployment/configuration.md).


## Персональные настройки

Экземпляр приложения Sanic может быть настроен различными способами в момент его создания с учетом потребностей вашего приложения.

### Пользовательская конфигурация
---:1

Простейшей формой пользовательской конфигурации будет являться передача своего собственного объекта непосредственно в экземпляр приложения Sanic

Если вы создаете пользовательский объект конфигурации, *настоятельно* рекомендуется наследовать его от объекта Sanic `Config`, чтобы перенять его поведение. Вы можете использовать эту опцию для добавления свойств или вашего собственного набора пользовательской логики.

:--:1
```python
from sanic.config import Config

class MyConfig(Config):
    FOO = "bar"

app = Sanic(..., config=MyConfig())
```
:---

---:1 Например, вы хотите использовать конфигурационный файл в форме, отличающейся от того, что изначально [ поддерживается](../deployment/configuration.md#using-sanic-update-config). :--:1
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
### Переопределение контекста
---:1

По умолчанию, контекст приложения является объектом [`SimpleNamespace()`](https://docs.python.org/3/library/types.html#types.SimpleNamespace), который позволяет вам добавить в него любые свойства, которые вы хотите. Тем не менее, у вас также есть возможность передать любой объект по вашему выбору.

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

app = Sanic(..., ctx=MyContext())
```
:---
### Переопределение объекта запроса
---:1 Иногда может быть полезно иметь собственный класс `Request` и передать его Sanic для использования вместо стандартного. Например, вы хотите изменить поведение стандартного генератора `request.id`.

::: Совет Важно

Важно помнить, что вы передаёте объект *class*, а не экземпляр класса.

::: :--:1
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

### Переопределение обработчика ошибок

---:1 Более подробная информация в разделе [Обработка исключений](../best-practices/exceptions.md#custom-error-handling) :--:1
```python
from sanic.handlers import ErrorHandler

class CustomErrorHandler(ErrorHandler):
    def default(self, request, exception):
        ''' Обрабатывает ошибки, для которых нет иных назначенных обработчиков '''
        # Здесь ваша собственная логика обработки...
        return super().default(request, exception)

app = Sanic(..., error_handler=CustomErrorHandler())
```
:---
