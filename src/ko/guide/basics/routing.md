# 라우팅

---:1

지금까지 우리는 서로 다른 형식의 많은 데코레이터들을 보아왔습니다.

그런데 이것이 과연 무엇일까요? 그리고 우리는 어떻게 이것을 사용할까요?
:--:1
```python
@app.route("/stairway")
...

@app.get("/to")
...

@app.post("/heaven")
...
```
:---

## 라우트 추가하기

---:1

핸들러를 엔드포인트에 연결하는 가장 기본적인 방법은 `app.add_route()` 를 사용하는 것입니다.

자세한 내용은 [API 문서]() 를 참고하세요.
:--:1
```python
async def handler(request):
    return text("OK")

app.add_route(handler, "/test")
```
:---

---:1

기본적으론, 라우트들은 HTTP `GET` 호출에 응답합니다. 핸들러를 변경하여 하나 이상의 HTTP 메서드에 응답할 수 있습니다.
:--:1
```python
app.add_route(
    handler,
    '/test',
    methods=["POST", "PUT"],
)
```
:---

---:1

데코레이터 구문을 사용하면 위의 예제는 다음과 같습니다.
:--:1
```python
@app.route('/test', methods=["POST", "PUT"])
async def handler(request):
    return text('OK')
```
:---

## HTTP 메서드

각각의 표준 HTTP 메서드들은 편리한 데코레이터들을 가지고 있습니다.

:::: tabs
::: tab GET

```python
@app.get('/test')
async def handler(request):
    return text('OK')
```

[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)
:::
::: tab POST

```python
@app.post('/test')
async def handler(request):
    return text('OK')
```

[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)
:::
::: tab PUT

```python
@app.put('/test')
async def handler(request):
    return text('OK')
```

[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT)
:::
::: tab PATCH

```python
@app.patch('/test')
async def handler(request):
    return text('OK')
```

[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH)
:::
::: tab DELETE

```python
@app.delete('/test')
async def handler(request):
    return text('OK')
```

[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE)
:::
::: tab HEAD

```python
@app.head('/test')
async def handler(request):
    return empty()
```

[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD)
:::
::: tab OPTIONS

```python
@app.options('/test')
async def handler(request):
    return empty()
```

[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS)
:::
::::

## 경로 매개변수

---:1

Sanic은 패턴 매칭을 사용할 수 있고, URL 경로에서 값을 추출할 수 있습니다. 이러한 매개변수들은 라우트 핸들러에서 키워드 인수로 추가됩니다.
:--:1
```python
@app.get("/tag/<tag>")
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---

---:1

매개변수에 대한 자료형을 선언할 수 있습니다. 이것은 매칭할 때 검사되며, 변수에 캐스팅될 것입니다.
:--:1
```python
@app.get("/foo/<foo_id:uuid>")
async def uuid_handler(request, foo_id: UUID):
    return text("UUID - {}".format(foo_id))
```
:---

### 지원되는 자료형

:::: tabs

::: tab 문자열

```python
@app.route("/path/to/<foo:string>")
async def handler(request, foo: str):
    ...
```
**적용된 정규 표현식**: `r"[^/]+")`  
**캐스트 자료형**: `str`  
**매칭 예제**:
- `/path/to/Bob`
- `/path/to/Python%203`
:::
::: tab  정수

```python
@app.route("/path/to/<foo:int>")
async def handler(request, foo: int):
    ...
```
**적용된 정규 표현식**: `r"-?\d+")`  
**캐스트 자료형**: `int`  
**매칭 예제**:
- `/path/to/10`
- `/path/to/-10`

_부동 소수점, 16진수, 8진수, 기타는 매칭되지 않습니다._
:::
::: tab 숫자

```python
@app.route("/path/to/<foo:number>")
async def handler(request, foo: float):
    ...
```
**적용된 정규 표현식**: `r"-?(?:\d+(?:\.\d*)?|\.\d+)")`  
**캐스트 자료형**: `float`  
**매칭 예제**:
- `/path/to/10`
- `/path/to/-10`
- `/path/to/1.5`
:::
::: tab 알파

```python
@app.route("/path/to/<foo:alpha>")
async def handler(request, foo: str):
    ...
```
**적용된 정규 표현식**: `r"[A-Za-z]+")`  
**캐스트 자료형**: `str`  
**매칭 예제**:
- `/path/to/Bob`
- `/path/to/Python`

_숫자나 공간 또는 기타 특수 문자는 매칭되지 않습니다_
:::
::: tab 경로

```python
@app.route("/path/to/<foo:path>")
async def handler(request, foo: str):
    ...
```
**적용된 정규 표현식**: `r"[^/].*?")`  
**캐스트 자료형**: `str`  
**매칭 예제**:
- `/path/to/hello`
- `/path/to/hello.txt`
- `/path/to/hello/world.txt`

::: warning
여기선 `/`가 매칭되기 때문에, `경로` 를 사용하는 패턴을 주의 깊게 검사해, 다른 엔드포인트의 트래픽을 포착하지 않도록 해야 합니다.
:::
::: tab 날짜

```python
@app.route("/path/to/<foo:ymd>")
async def handler(request, foo: datetime.date):
    ...
```
::: new v21.3에 추가됨
**적용된 정규 표현식**: `r"^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"`  
**캐스트 자료형**: `datetime.date`  
**매칭 예제**:
- `/path/to/2021-03-28`
:::
::: tab uuid

```python
@app.route("/path/to/<foo:uuid>")
async def handler(request, foo: UUID):
    ...
```
**적용된 정규 표현식**: `r"[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}"`  
**캐스트 자료형**: `UUID`  
**매칭 예제**:
- `/path/to/123a123a-a12a-1a1a-a1a1-1a12a1a12345`
:::
::: tab 정규표현식

```python
@app.route("/path/to/<foo:^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))>")
async def handler(request, foo: str):
    ...
```
**적용된 정규 표현식**: _입력된 값_  
**캐스트 자료형**: `str`  
**매칭 예제**:
- `/path/to/2021-01-01`

이렇게 하면 사용 사례에 대한 특정 일치 패턴을 정의할 수 있는 자유가 주어집니다.

아래의 예제에서는, YYYY-MM-DD 형식의 날짜를 찾고 있습니다.
:::
::::
## URL 생성하기

---:1

Sanic은 핸들러 메서드 `app.url_for()`을 기반으로 하는 URL을 생성하는 메서드를 제공합니다. 이것은 당신의 앱에서 url 경로를 하드코딩하는 것을 방지하기에 유용할 것입니다.
:--:1
```python
@app.route('/')
async def index(request):
    # `post_handler` 엔드포인트를 위한 URL을 생성합니다.
    url = app.url_for('post_handler', post_id=5)
    
    # `/posts/5` 로 리다이렉트
    return redirect(url)

@app.route('/posts/<post_id>')
async def post_handler(request, post_id):
    ...
```
:---

---:1

임의의 수의 키워드 인수를 전달할 수 있습니다. 요청 매개변수가 _아닌_ 모든 것들은 편리하게 쿼리스트링의 일부가 됩니다.
:--:1
```python
>>> app.url_for(
    "post_handler",
    post_id=5,
    arg_one="one",
    arg_two="two",
)
'/posts/5?arg_one=one&arg_two=two'
```
:---

---:1

또한, 단일 쿼리 키가 여러 값을 가지게 하는 것도 지원합니다.
:--:1
```python
>>> app.url_for(
    "post_handler",
    post_id=5,
    arg_one=["one", "two"],
)
'/posts/5?arg_one=one&arg_one=two'
```
:---

### 특수 키워드 인자

자세한 내용은 [API 문서]() 를 참고하세요.

```python
>>> app.url_for("post_handler", post_id=5, arg_one="one", _anchor="anchor")
'/posts/5?arg_one=one#anchor'

# _external requires you to pass an argument _server or set SERVER_NAME in app.config if not url will be same as no _external
>>> app.url_for("post_handler", post_id=5, arg_one="one", _external=True)
'//server/posts/5?arg_one=one'

# when specifying _scheme, _external must be True
>>> app.url_for("post_handler", post_id=5, arg_one="one", _scheme="http", _external=True)
'http://server/posts/5?arg_one=one'

# you can pass all special arguments at once
>>> app.url_for("post_handler", post_id=5, arg_one=["one", "two"], arg_two=2, _anchor="anchor", _scheme="http", _external=True, _server="another_server:8888")
'http://another_server:8888/posts/5?arg_one=one&arg_one=two&arg_two=2#anchor'
```

### Customizing a route name

---:1

A custom route name can be used by passing a `name` argument while registering the route.
:--:1
```python
@app.get("/get", name="get_handler")
def handler(request):
    return text("OK")
```
:---

---:1

Now, use this custom name to retrieve the URL
:--:1
```python
>>> app.url_for("get_handler", foo="bar")
'/get?foo=bar'
```
:---

## Websockets routes

---:1

Websocket routing works similar to HTTP methods.
:--:1
```python
async def handler(request, ws):
    messgage = "Start"
    while True:
        await ws.send(message)
        message = ws.recv()

app.add_websocket_route(handler, "/test")
```
:---

---:1

It also has a convenience decorator.
:--:1
```python
@app.websocket("/test")
async def handler(request, ws):
    messgage = "Start"
    while True:
        await ws.send(message)
        message = ws.recv()
```
:---

Read the [websockets section](/guide/advanced/websockets.md) to learn more about how they work.

## Strict slashes


---:1

Sanic routes can be configured to strictly match on whether or not there is a trailing slash: `/`. This can be configured at a few levels and follows this order of precedence:

1. Route
2. Blueprint
3. BlueprintGroup
4. Application

:--:1
```python
# provide default strict_slashes value for all routes
app = Sanic(__file__, strict_slashes=True)
```

```python
# overwrite strict_slashes value for specific route
@app.get("/get", strict_slashes=False)
def handler(request):
    return text("OK")
```

```python
# it also works for blueprints
bp = Blueprint(__file__, strict_slashes=True)

@bp.get("/bp/get", strict_slashes=False)
def handler(request):
    return text("OK")
```

```python
bp1 = Blueprint(name="bp1", url_prefix="/bp1")
bp2 = Blueprint(
    name="bp1",
    url_prefix="/bp2",
    strict_slashes=False,
)

# This will enforce strict slashes check on the routes
# under bp1 but ignore bp2 as that has an explicitly
# set the strict slashes check to false
group = Blueprint.group([bp1, bp2], strict_slashes=True)
```
:---

## 정적 파일

---:1

Sanic에서 정적 파일을 제공하려면, `app.static()` 을 사용하세요.

인자의 순서는 중요합니다:

1. 파일이 제공될 경로
2. 서버의 파일 경로

자세한 내용은 [API 문서]() 를 참고하세요.
:--:1
```python
app.static("/static", "/path/to/directory")
```
:---

---:1

정적 파일을 제공할 수도 있습니다.
:--:1
```python
app.static("/", "/path/to/index.html")
```
:---

---:1

또한 엔드포인트의 이름을 지정하는 것도 도움이 됩니다.
:--:1
```python
app.static(
    "/user/uploads",
    "/path/to/uploads",
    name="uploads",
)
```
:---

---:1

Retrieving the URLs works similar to handlers. But, we can also add the `filename` argument when we need a specific file inside a directory.
:--:1
```python
>>> app.url_for(
    "static",
    name="static",
    filename="file.txt",
)
'/static/file.txt'

```python
>>> app.url_for(
    "static",
    name="uploads",
    filename="image.png",
)
'/user/uploads/image.png'

```
:---
