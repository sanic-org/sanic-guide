# 시작하기(Getting Started)

시작하기 전에 Python 3.7 이상을 사용 중인지 확인하세요. 현재 Python 버전 3.7, 3.8 및 3.9에서 작동하는 것으로 알려져 있습니다.

## 설치(Install)

```bash
pip install sanic
```

## Hello, world 애플리케이션(Hello, world application)

---:1

데코레이터 기반 프레임워크를 사용해 본 적이 있다면 아마 익숙할 것입니다.

::: tip
Flask 또는 다른 프레임워크를 사용하다 온 경우 몇 가지 짚고 넘어가야 할 중요한 것들이 있습니다. 기억하세요, Sanic은 성능, 유연성 및 사용 편의성을 목표로 합니다. 이러한 지침 원칙은 API 및 작동 방식에 실질적인 영향을 미칩니다.
:::



:--:1

```python
from sanic import Sanic
from sanic.response import text

app = Sanic("My Hello, world app")

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

:---

### 중요 사항(Important to note)

- 모든 요청 핸들러는 동기 (`def hello_world`) 또는 비동기 (`async def hello_world`) 둘 다 사용할 수 있습니다. 하지만 명확한 이유가 없는 한 항상 `async`를 사용하세요.
- `request` 객체는 항상 핸들러의 첫 번째 인수입니다. 다른 프레임워크는 가져올 컨텍스트 변수에서 이를 전달합니다. `비동기(async)`환경에서는 이런 기능이 제대로 작동하지 않을 수 있으며, 명시적으로 전달하는것이 (보다 깨끗하고 성능이 뛰어난 것은 말할 것도 없고) 훨씬 더 쉽게 사용할 수 있습니다.
- 응답 유형(response type)을 **반드시** 사용해야 합니다. 대부분의 다른 프레임워크에서는 `return "Hello, world."`또는`return {"foo": "bar"}`와 같은 반환 값을 사용할 수 있습니다. 그러나 이러한 암시적인 호출을 수행하려면 체인 어딘가에서 의미를 파악하는 데 귀한 시간이 소비됩니다. 따라서 Sanic은 이러한 편의성을 희생하면서 명시적인 호출을 요구하기로 결정했습니다.

### 실행(Running)

---:1 위에서 작성한 파일을 `server.py`로 저장하고 실행해 보겠습니다. And launch it. :--:1
```bash
sanic server.app
```
:---

::: tip **또 다른** 중요한 차이점입니다. 다른 프레임워크는 개발 서버가 내장되어 있으며 개발 전용이라고 _명시적_ 으로 말합니다. Sanic은 그 반대입니다.

**프로덕션 환경에서 사용할 수 있는 서버가 준비되있습니다.** :::

## Sanic Extensions

Sanic intentionally aims for a clean and unopinionated feature list. The project does not want to require you to build your application in a certain way, and tries to avoid prescribing specific development patterns. There are a number of third-party plugins that are built and maintained by the community to add additional features that do not otherwise meet the requirements of the core repository.

However, in order **to help API developers**, the Sanic organization maintains an official plugin called [Sanic Extensions](../plugins/sanic-ext/getting-started.md) to provide all sorts of goodies, including:

- **OpenAPI** documentation with Redoc and/or Swagger
- **CORS** protection
- **Dependency injection** into route handlers
- Request query arguments and body input **validation**
- Auto create `HEAD`, `OPTIONS`, and `TRACE` endpoints
- Predefined, endpoint-specific response serializers

The preferred method to set it up is to install it along with Sanic, but you can also install the packages on their own.

---:1
```
$ pip install sanic[ext]
```
:--:1
```
$ pip install sanic sanic-ext
```
:---

Starting in v21.12, Sanic will automatically setup Sanic Extensions if it is in the same environment. You will also have access to two additional application properties:

- `app.extend()` - used to configure Sanic Extensions
- `app.ext` - the `Extend` instance attached to the application

See [the plugin documenataion](../plugins/sanic-ext/getting-started.md) for more information about how to use and work with the plugin
