# Sanic 애플리케이션(Sanic Application)

## 인스턴스(Instance)

---:1
가장 기본적인 구성 요소는 `Sanic()` 인스턴스입니다. 꼭 필요한 것은 아니지만 `server.py`라는 파일에서 이를 인스턴스화하는 것이 암묵적인 규칙입니다.
:--:1

```python
# /path/to/server.py

from sanic import Sanic

app = Sanic("My Hello, world app")
```

:---

## 애플리케이션 컨텍스트(Application context)

대부분의 애플리케이션은 코드베이스의 여러 부분에서 데이터 또는 객체를 공유/재사용할 것입니다. 가장 흔한 예로는 DB 연결이 있겠네요.

---:1
v21.3 이전의 Sanic 버전에서는 일반적으로 애플리케이션 인스턴스에 속성을 추가하는 방식을 사용했습니다.
:--:1

```python
# 21.3에서는 사용하지 않는 기능으로 경고를 발생시킵니다.
app = Sanic("MyApp")
app.db = Database()
```

:---

---:1
하지만 이로 인해 이름 충돌 등의 잠재적인 문제가 발생할 수 있고 [요청 컨텍스트](./request.md#context)객체와 일관성을 유지하기 위해 v21.3에서는 응용 프로그램 수준 컨텍스트 객체를 도입했습니다.
:--:1

```python

# 객체를 응용프로그램에 추가하는 올바른 방법입니다.
app = Sanic("MyApp")
app.ctx.db = Database()
```

:---

## 앱 레지스트리(App Registry)

---:1

Sanic 인스턴스를 인스턴스화하면 Sanic 앱 레지스트리에서 나중에 검색할 수 있습니다. 이 기능은 달리 액세스할 수 없는 위치에서 Sanic 인스턴스에 액세스해야 하는 경우 등에서 유용할 것입니다.
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

존재하지 않는 앱에서 `Sanic.get_app'("non-existing")`을 호출하면 기본적으로 `SanicException`이 발생합니다. 대신 메소드가 해당 이름의 새 Sanic 인스턴스를 반환하도록 강제할 수 있습니다.
:--:1

```python
app = Sanic.get_app(
    "non-existing",
    force_create=True,
)
```

:---

---:1
등록된 Sanic 인스턴스가 **하나만** 있는 경우 인수 없이 `Sanic.get_app()`을 호출하면 해당 인스턴스가 반환됩니다.
:--:1

```python
Sanic("My only app")

app = Sanic.get_app()
```

:---

## 구성(Configuration)

---:1

Sanic은 `Sanic` 인스턴스의 `config` 속성에 구성을 보유합니다.
구성은 **속성** 또는 **딕셔너리** 를 사용하여 구성을 수정할 수 있습니다.

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

::: tip 주의 사항
구성 키는 _대문자_ 여야 합니다. 하지만 이건 거의 암묵적인 규칙일 뿐이며 소문자도 대부분의 경우에는 잘 작동할 것입니다.

```py
app.config.GOOD = "yay!"
app.config.bad = "boo"
```

:::

나중에 [구성에 대한 자세한 내용](/guide/deployment/configuration.md)에서 자세히 소개됩니다.

## 커스터마이징(Customization)

Sanic 애플리케이션 인스턴스는 인스턴스화 할 경우 다양한 방식으로 애플리케이션 요구사항에 맞게 사용자 정의할 수 있습니다.

### 사용자 정의 구성(Custom configuration)

---:1

이 가장 간단한 형태의 사용자 지정 구성은 Sanic 응용 프로그램 인스턴스에 직접 객체를 전달하는 것입니다.

사용자 지정 구성 객체를 생성하는 경우 Sanic `Config` 옵션을 하위 클래스로 지정하여 해당 동작을 상속하는 것이 *매우* 권장됩니다. 속성을 추가하거나 고유한 사용자 정의 로직을 추가하는 데 이 옵션을 사용할 수 있습니다.

:--:1
```python
from sanic.config import Config

class MyConfig(Config):
    FOO = "bar"

app = Sanic(..., config=MyConfig())
```
:---

---:1
이 기능의 유용한 예는 [지원하는](../deployment/configuration.md#using-sanic-update-config)다른 형식으로 구성 파일을 사용하려는 경우입니다.
:--:1
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
### 사용자 정의 컨텍스트(Custom context)
---:1

기본적으로 애플리케이션 컨텍스트는 원하는 속성을 설정할 수 있는 [`SimpleNamespace()`](https://docs.python.org/3/library/types.html#types.SimpleNamespace)입니다. 그러나 대신 객체를 전달할 수도 있습니다.

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

### 사용자 정의 요청(Custom requests)

---:1
때로는 자신만의 `Request` 클래스를 갖고 Sanic에게 기본값 대신 사용하도록 지시하는 것이 도움이 됩니다. 한 가지 예는 기본 `request.id` 생성기를 수정하려는 경우입니다.

::: tip 중요

클래스의 인스턴스가 아닌 *class*를 전달한다는 것을 기억하는 것이 중요합니다.

:::
:--:1
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

### 사용자 정의 에러 핸들러(Custom error handler)

---:1
자세한 내용은 [exception handling](../best-practices/exceptions.md#custom-error-handling)를 참조하세요.
:--:1
```python
from sanic.handlers import ErrorHandler

class CustomErrorHandler(ErrorHandler):
    def default(self, request, exception):
        ''' handles errors that have no error handlers assigned '''
        # You custom error handling logic...
        return super().default(request, exception)

app = Sanic(..., error_handler=CustomErrorHandler())
```
:---

