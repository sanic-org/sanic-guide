# Sanic 애플리케이션(Sanic Application)

## 인스턴스(Instance)

---:1
`Sanic ()`은 가장 기본적인 구성 요소입니다. 꼭 필요한 것은 아니지만 `server.py`라는 파일에서 이를 인스턴스화하는 것이 암묵적인 규칙입니다.
:--:1

```python
# /path/to/server.py

from sanic import Sanic

app = Sanic("My Hello, world app")
```

:---

## 애플리케이션 컨텍스트(Application context)

::: new NEW in v21.3
대부분의 애플리케이션은 코드베이스의 여러 부분에서 데이터 또는 개체를 공유/재사용 해야 할 것입니다. 가장 흔한 예로는 DB 연결이 있습니다.

---:1
v21.3 이전의 Sanic 버전에서는 일반적으로 애플리케이션 인스턴스에 속성을 첨부하여 수행했습니다.
:--:1

```python
# Raises a warning as deprecated feature in 21.3
app = Sanic("MyApp")
app.db = Database()
```

:---

---:1
이로 인해 이름 충돌 등의 잠재적인 문제가 발생할 수 있고 [요청 컨텍스트](./request.md#context)개체와 일관성을 유지하기 위해 v21.3에서는 응용 프로그램 수준 컨텍스트 개체를 도입했습니다.
:--:1

```python

# Correct way to attach objects to the application
app = Sanic("MyApp")
app.ctx.db = Database()
```

:---
:::

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

존재하지 않는 앱에서 `Sanic.get_app'("non-existing")`을 호출하면 기본적으로 `SanicException`이 발생합니다. 대신 해당 이름의 새 Sanic 인스턴스를 반환하도록 메소드를 강제할 수 있습니다.
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
Sanic 인스턴스가 `하나만` 등록된 경우 인수 없이 `Sanic.get_app()`을 호출하면 해당 인스턴스가 반환됩니다.
:::
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

::: 작은 tip
구성 키는 _대문자_ 여야 합니다. 하지만 이것은 거의 암묵적인 규칙일 뿐이며 소문자도 대부분의 경우에는 잘 작동할 것입니다.

```py
app.config.GOOD = "yay!"
app.config.bad = "boo"
```

:::

나중에 [구성에 대한 자세한 내용](/guide/deployment/configuration.md)에서 자세히 소개됩니다.

<!-- ## Methods

### 실행(Run)
### 정지(Stop) -->
