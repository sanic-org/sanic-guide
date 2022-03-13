# 라우팅(Routing)

---:1

지금까지 우리는 이 데코레이터를 다양한 형태로 많이 보았습니다.

그러나 이것은 뭘까요? 어떻게 사용할까요?

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

## 라우터 추가 하기(Adding a route)

---:1

핸들러를 엔드포인트에 연결하는 가장 기본적인 방법은 `app.add_route()`를 사용하는 것입니다.

자세한 내용은 [API 문서](https://sanic.readthedocs.io/en/stable/sanic/api_reference.html#sanic.app.Sanic.url_for)를 참조하세요.
:--:1
```python
async def handler(request):
    return text("OK")

app.add_route(handler, "/test")
```
:---

---:1

기본적으로 경로는 HTTP 'GET' 호출로 사용할 수 있습니다. 하나 이상의 HTTP 메서드에 응답하도록 핸들러를 변경할 수 있습니다.
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

HTTP 메소드(HTTP methods)
:--:1
```python
@app.route('/test', methods=["POST", "PUT"])
async def handler(request):
    return text('OK')
```
:---

## HTTP methods

각 표준 HTTP 메소드에는 편리한 데코레이터가 있습니다.

:::: tabs
::: tab GET

```python
@app.get('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)
:::
::: tab POST

```python
@app.post('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)
:::
::: tab PUT

```python
@app.put('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT)
:::
::: tab PATCH

```python
@app.patch('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH)
:::
::: tab DELETE

```python
@app.delete('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE)
:::
::: tab HEAD

```python
@app.head('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD)
:::
::: tab OPTIONS

```python
@app.options('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS)
:::
::::

## 경로 매개 변수(Path parameters)

---:1

Sanic은 패턴 일치를 허용하고 URL 경로에서 값을 추출 할 수 있습니다. 그런 다음 이러한 매개 변수는 경로 처리기에서 키워드 인수로 삽입됩니다.

:--:1
```python
@app.get("/tag/<tag>")
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---

---:1

매개 변수의 유형을 선언 할 수 있습니다. 일치 할 때 적용되며 변수를 형변환합니다.
:--:1
```python
@app.get("/foo/<foo_id:uuid>")
async def uuid_handler(request, foo_id: UUID):
    return text("UUID - {}".format(foo_id))
```
:---

### 지원되는 타입들(Supported types)

:::: tabs

::: tab str

```python
@app.route("/path/to/<foo:str>")
async def handler(request, foo: str):
    ...
```
**적용된 정규 표현식**: `r"[^/]+")`  
**캐스트 타입**: `str`  
**일치하는 예시**:
- `/path/to/Bob`
- `/path/to/Python%203`


Sanic의 이전 버전에서는 `<foo:string>`이었습니다. 해당 양식은 더 이상 사용되지 않으며 v21.12에서 제거됩니다.

:::
::: tab  int

```python
@app.route("/path/to/<foo:int>")
async def handler(request, foo: int):
    ...
```
**적용된 정규 표현식**: `r"-?\d+")`  
**캐스트 타입**: `int`  
**일치하는 예시**:
- `/path/to/10`
- `/path/to/-10`

_부동 소수점, 16진수, 8진수, 기타는 매칭되지 않습니다._
:::
::: tab float

```python
@app.route("/path/to/<foo:float>")
async def handler(request, foo: float):
    ...
```
**적용된 정규 표현식**: `r"-?(?:\d+(?:\.\d*)?|\.\d+)")`  
**캐스트 타입**: `float`  
**일치하는 예시**:
- `/path/to/10`
- `/path/to/-10`
- `/path/to/1.5`
  
Sanic의 이전 버전에서는 `<foo:number>`이었습니다. 해당 양식은 더 이상 사용되지 않으며 v21.12에서 제거됩니다.
:::
::: tab alpha

```python
@app.route("/path/to/<foo:alpha>")
async def handler(request, foo: str):
    ...
```
**적용된 정규 표현식**: `r"[A-Za-z]+")`  
**캐스트 타입**: `str`  
**일치하는 예시**:
- `/path/to/Bob`
- `/path/to/Python`

_숫자나 공간 또는 기타 특수 문자는 매칭되지 않습니다_
:::
::: tab slug

```python
@app.route("/path/to/<article:slug>")
async def handler(request, article: str):
    ...
```
**적용된 정규 표현식**: `r"[a-z0-9]+(?:-[a-z0-9]+)*")`  
**캐스트 타입**: `str`  
**일치하는 예시**:
- `/path/to/some-news-story`
- `/path/to/or-has-digits-123`

:::
::: tab path

```python
@app.route("/path/to/<foo:path>")
async def handler(request, foo: str):
    ...
```
**적용된 정규 표현식**: `r"[^/].*?")`  
**캐스트 타입**: `str`  
**일치하는 예시**:
- `/path/to/hello`
- `/path/to/hello.txt`
- `/path/to/hello/world.txt`

::: warning
여기선 `/`가 매칭되기 때문에, `path` 를 사용하는 패턴을 주의 깊게 검사해, 다른 엔드포인트의 트래픽을 포착하지 않도록 해야 합니다.
:::
::: tab ymd

```python
@app.route("/path/to/<foo:ymd>")
async def handler(request, foo: datetime.date):
    ...
```
**적용된 정규 표현식**: `r"^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"`  
**캐스트 타입**: `datetime.date`  
**일치하는 예시**:
- `/path/to/2021-03-28`
:::

::: tab uuid

```python
@app.route("/path/to/<foo:uuid>")
async def handler(request, foo: UUID):
    ...
```
**적용된 정규 표현식**: `r"[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}"`  
**캐스트 타입**: `UUID`  
**일치하는 예시**:
- `/path/to/123a123a-a12a-1a1a-a1a1-1a12a1a12345`

:::

::: tab regex

```python
@app.route(r"/path/to/<foo:^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))>")
async def handler(request, foo: str):
    ...
```
**적용된 정규 표현식**: _whatever you insert_  
**캐스트 타입**: `str`  
**일치하는 예시**:
- `/path/to/2021-01-01`

이를 통해 사용 사례에 대한 특정 일치 패턴을 자유롭게 정의할 수 있습니다.

표시된 예에서 'YYYY-MM-DD' 형식의 날짜를 찾고 있습니다.

::::

### 정규식 일치(Regex Matching)

복잡한 라우팅에 비해 위의 예는 너무 단순하고 완전히 다른 라우팅 일치 패턴을 사용하므로 여기서는 정규식 일치의 고급 사용법에 대해 자세히 설명합니다.

때로는 경로의 일부를 일치시키고 싶을 때가 있습니다.

```text
/image/123456789.jpg
```

파일 패턴을 일치시키고 싶지만 숫자 부분만 캡처하려면 정규식을 재미있게 해야 합니다 😄:

```python
app.route(r"/image/<img_id:(?P<img_id>\d+)\.jpg>")
```

또한 다음 사항이 모두 허용되어야 합니다.

```python
@app.get(r"/<foo:[a-z]{3}.txt>")                # matching on the full pattern
@app.get(r"/<foo:([a-z]{3}).txt>")              # defining a single matching group
@app.get(r"/<foo:(?P<foo>[a-z]{3}).txt>")       # defining a single named matching group
@app.get(r"/<foo:(?P<foo>[a-z]{3}).(?:txt)>")   # defining a single named matching group, with one or more non-matching groups
```

또한 명명된 일치 그룹을 사용하는 경우 세그먼트 레이블과 동일해야 합니다.

```python
@app.get(r"/<foo:(?P<foo>\d+).jpg>")  # OK
@app.get(r"/<foo:(?P<bar>\d+).jpg>")  # NOT OK
```

보다 일반적인 사용 방법은 [정규식 연산](https://docs.python.org/3/library/re.html)을 참조하세요.

## URL 생성(Generating a URL)

---:1

Sanic은 핸들러 메소드 이름: `app.url_for ()` 를 기반으로 URL을 생성하는 메소드를 제공합니다. 이는 앱에 URL 경로를 하드 코딩하지 않으려는 경우에 유용합니다. 대신 핸들러 이름 만 참조 할 수 있습니다.
:--:1
```python
@app.route('/')
async def index(request):
    # generate a URL for the endpoint `post_handler`
    url = app.url_for('post_handler', post_id=5)
    
    # Redirect to `/posts/5`
    return redirect(url)

@app.route('/posts/<post_id>')
async def post_handler(request, post_id):
    ...
```
:---

---:1

임의의 수의 키워드 인수를 전달할 수 있습니다. 요청 매개 변수가 _아닌_ 모든 것은 쿼리 문자열의 일부로 구현됩니다.
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

또한 단일 쿼리 키에 대해 여러 값을 전달하는 것도 지원됩니다.
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

### 특수 키워드 인수(Special keyword arguments)

자세한 내용은 [API Docs]()를 참조하세요.

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

### 사용자 지정 경로 이름 (Customizing a route name)

---:1

사용자 지정 경로 이름은 경로를 등록하는 동안 `name` 인수를 전달하여 사용할 수 있습니다.
:--:1
```python
@app.get("/get", name="get_handler")
def handler(request):
    return text("OK")
```
:---

---:1

이제 이 사용자 지정 이름을 사용하여 URL을 검색합니다.
:--:1
```python
>>> app.url_for("get_handler", foo="bar")
'/get?foo=bar'
```
:---

## 웹소켓 경로 (Websockets routes)

---:1

Websocket 라우팅은 HTTP 메서드와 유사하게 작동합니다.
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

편리한 데코레이터도 있습니다.
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

작동 방식에 대해 자세히 알아보려면 [웹소켓 섹션](/guide/advanced/websockets.md)을 읽어보세요.

## 엄격한 슬래시 (Strict slashes)


---:1

Sanic 경로는 후행 슬래시(`/`)가 있는지 여부에 대해 엄격하게 일치하도록 구성할 수 있습니다. 이것은 몇 가지 수준에서 구성할 수 있으며 다음 우선 순위를 따릅니다.

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
    name="bp2",
    url_prefix="/bp2",
    strict_slashes=False,
)

# This will enforce strict slashes check on the routes
# under bp1 but ignore bp2 as that has an explicitly
# set the strict slashes check to false
group = Blueprint.group([bp1, bp2], strict_slashes=True)
```
:---

## 정적 파일(Static files)

---:1

Sanic에서 정적 파일을 제공하려면, `app.static()` 을 사용하세요.

인자의 순서는 중요합니다:

1. 파일이 제공될 경로
2. 서버의 파일 경로

자세한 내용은 [API Docs]()를 참고하세요.
:--:1
```python
app.static("/static", "/path/to/directory")
```
:---

---:1

개별 파일을 제공할 수도 있습니다.
:--:1
```python
app.static("/", "/path/to/index.html")
```
:---

---:1

때로는 엔드포인트의 이름을 지정하는 것이 도움이 됩니다.
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

URL 검색은 핸들러와 유사하게 작동합니다. 그러나 디렉토리 내부에 특정 파일이 필요할 때 `filename` 인수를 추가할 수도 있습니다.
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

::: tip
여러 `static()` 경로를 사용하려는 경우, 수동으로 이름을 지정하는 것이 *매우* 좋습니다. 이것은 버그를 발견하기 어려운 잠재적 가능성을 거의 확실히 완화할 것입니다.

```python
app.static("/user/uploads", "/path/to/uploads", name="uploads")
app.static("/user/profile", "/path/to/profile", name="profile_pics")
```
