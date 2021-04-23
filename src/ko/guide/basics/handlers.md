# 핸들러(Handlers)

다음으로 중요한 구성요소는 _handlers_ (핸들러) 입니다. 이를 "views" (뷰) 라고도합니다..

Sanic에서 핸들러는 적어도 `Request` 인스턴스를 인수로 취하는 모든 호출가능한 함수(Callable) 입니다, 그리고 `HTTP Response` 인스턴스 또는 같은 작업을 수행하는 코루틴(coroutine)을 반환합니다.

---:1

어? :confused:

이것은 일반 함수일 수도 있고, 비동기 함수일 수도 있습니다.

핸들러의 역할은 엔드 포인트에 응답하고 무언가를하는 것입니다. 이것은 대부분의 비즈니스 로직이 적용 되는 곳입니다.

:--:1

```python
def i_am_a_handler(request):
    return HTTPResponse()

async def i_am_ALSO_a_handler(request):
    return HTTPResponse()
```

:---

::: tip Heads up
논리 캡슐화에 대해 자세히 알아 보려면 [클래스 기반 뷰](/guide/advanced/class-based-views.md)를 확인하세요.
:::
---:1
그런 다음 엔드포인트(endpoint)에 연결하기 만하면됩니다. [routing soon](./routing.md)에 대해 자세히 알아 보겠습니다.

실용적인 예를 살펴 보겠습니다.

- 앱 인스턴스에 편리한 데코레이터를 사용합니다 :`@ app.get ()`
- 응답 객체를 생성하기 위한 편리한 방법: `text()`

임무 완수 :muscle:
:--:1

```python

from sanic.response import text

@app.get("/foo")
async def foo_handler(request):
    return text("I said foo!")
```

:---

---

## _비동기(Async)_ 란 단어에 대하여...(A word about async...)

---:1

동기식 핸들러를 작성하는 것은 전적으로 가능합니다.

이 예에서는 _블로킹(blocking)_ `time.sleep()`을 사용하여 100ms의 처리 시간을 시뮬레이션합니다.
이것은 DB 또는 타사 웹 사이트에서 데이터를 가져오는 것을 나타냅니다.

4개의 작업자(worker) 프로세스와 평범한 벤치마킹 도구를 사용합니다.:

- 30.10초 동안 **956**건의 요청이 이뤄졌습니다.
- 또는 약 **31.76** 요청/초입니다.
  
:--:1

```python
@app.get("/sync")
def sync_handler(request):
    time.sleep(0.1)
    return text("Done.")
```

:---

---:1

비동기식 대안 `asyncio.sleep()`으로 변경하는 것만으로도 성능이 크게 변하는 것을 볼 수 있습니다.

동일한 4 개의 작업자(worker) 프로세스 사용:

- 30.08 초에 **115,590** 개의 요청
- 또는 초당 약 **3,843.17** 개 요청

:flushed:

이건 말도 안되게 과장된 결과입니다 그리고 여러분이 보는 어떤 벤치마크도 본질적으로 매우 편향되어 있습니다. 이 예는 웹 세계에서 'async/wait'의 이점을 과장되게 보여주기 위한 것입니다. 결과는 확실히 다를 것입니다. Sanic 및 기타 비동기 Python 라이브러리와 같은 도구는 더 빠르게 만드는 마법 총알이 아닙니다. 그것들은 _그것들을 더 효율적_으로 만듭니다.

이 예에서는 비동기 버전이 훨씬 더 낫습니다. 한 요청이 잠자고 있는 동안 다른 요청을 시작할 수 있고, 다른 요청을 시작할 수 있고, 다른 요청을 시작할 수 있고, 다른 요청을 시작할 수 있기 때문입니다.

하지만, 이것이 요점입니다! Sanic은 사용 가능한 리소스를 사용하고 성능을 압축하기 때문에 속도가 빠릅니다. 동시에 많은 요청을 처리할 수 있으므로 초당 더 많은 요청을 처리할 수 있습니다.

:--:1

```python
@app.get("/async")
async def async_handler(request):
    await asyncio.sleep(0.1)
    return text("Done.")
```

:---

::: 경고 일반적인 실수입니다!

이러지 마세요! 웹 사이트를 ping해야 합니다. 뭘 쓰시나요? `pip install your-fav-request-library` :see_no_evil:

대신 `async / await` 가 가능한 클라이언트를 사용해보세요. 귀하의 서버가 고마워할것입니다. 차단(Blocking) 도구를 사용하지 말고 비동기 생태계에서 잘 작동하는 도구를 선호하십시오. 추천이 필요한 경우 [Awesome Sanic](https://github.com/mekicha/awesome-sanic)을 확인하세요.

Sanic은 테스트 패키지 (sanic-testing) 내에서 [httpx](https://www.python-httpx.org/)를 사용합니다. :wink:.

:::

---

## 완전히 주석이 달린 핸들러(A fully annotated handler)

주석 유형(type annotations)을 사용하는 경우...

```python
from sanic.response import HTTPResponse, text
from sanic.request import Request

@app.get("/typed")
async def typed_handler(request: Request) -> HTTPResponse:
    return text("Done.")
```
