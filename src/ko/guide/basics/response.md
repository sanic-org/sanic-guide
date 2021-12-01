# 응답 (Response)

모든 [핸들러](./handlers.md)는 **반드시** 응답 개체를 반환해야하고 [미들웨어](./middleware.md)는 선택적으로 응답 개체를 반환할 수 있습니다.

## 메소드 (Methods)

응답 객체를 생성하는 가장 쉬운 방법은 9가지 편리한 방법 중 하나를 사용하는 것입니다.

:::: tabs

::: tab Text

**기본 콘텐츠 유형**: `text/plain; charset=utf-8`  
**설명**: 일반 텍스트를 반환

```python
from sanic.response import text

@app.route("/")
async def handler(request):
    return text("Hi 😎")
```
:::
::: tab HTML

**기본 콘텐츠 유형**: `text/html; charset=utf-8`  
**설명**: HTML 문서를 반환

```python
from sanic.response import html

@app.route("/")
async def handler(request):
    return html('<!DOCTYPE html><html lang="en"><meta charset="UTF-8"><div>Hi 😎</div>')
```
:::
::: tab JSON

**기본 콘텐츠 유형**: `application/json`  
**설명**: JSON 문서를 반환

```python
from sanic.response import json

@app.route("/")
async def handler(request):
    return json({"foo": "bar"})
```

기본적으로 Sanic은 선택한 JSON 인코더로 [`ujson`](https://github.com/ultrajson/ultrajson)과 함께 제공됩니다. 원하는 경우 이를 변경하는 것은 매우 간단합니다.

```python
from orjson import dumps

json({"foo": "bar"}, dumps=dumps)
```

`ujson`이 설치되지 않은 경우 표준 라이브러리 `json` 모듈로 대체됩니다.

초기화 시 애플리케이션 전체에서 전역적으로 사용할 구현을 추가로 선언할 수 있습니다.

```python
from orjson import dumps

app = Sanic(..., dumps=dumps)
```
:::
::: tab File

**기본 콘텐츠 유형**: N/A  
**설명**: 파일을 반환


```python
from sanic.response import file

@app.route("/")
async def handler(request):
    return await file("/path/to/whatever.png")
```

Sanic은 파일을 검사하고 MIME 유형을 추측하고 콘텐츠 유형에 적절한 값을 사용합니다. 
원하는 경우 명시적일 수 있습니다:

```python
file("/path/to/whatever.png", mime_type="image/png")
```

또한 파일 이름을 재정의하도록 선택할 수도 있습니다:

```python
file("/path/to/whatever.png", filename="super-awesome-incredible.png")
```
:::
::: tab Streaming

**기본 콘텐츠 유형**: `text/plain; charset=utf-8`  
**설명**: 클라이언트에 데이터 스트리밍

```python
from sanic.response import stream

@app.route("/")
async def handler(request):
    return stream(streaming_fn)

async def streaming_fn(response):
    await response.write('foo')
    await response.write('bar')
```

기본적으로 Sanic은 클라이언트가 지원하는 경우 청크 인코딩을 사용하여 클라이언트로 다시 스트리밍합니다. 
비활성화할수도 있습니다:

```python
stream(streaming_fn, chunked=False)
```
:::
::: tab "File Streaming"

**기본 콘텐츠 유형**: N/A  
**설명**: 파일을 클라이언트로 스트리밍하며, 동영상과 같은 대용량 파일을 스트리밍할 때 유용합니다.

```python
from sanic.response import file_stream

@app.route("/")
async def handler(request):
    return await file_stream("/path/to/whatever.mp4")
```

`file()` 메소드와 마찬가지로 `file_stream()`은 파일의 MIME 유형을 결정하려고 시도합니다.
:::
::: tab Raw

**기본 콘텐츠 유형**: `application/octet-stream`  
**설명**: 본문을 인코딩하지 않고 원시 바이트 보내기

```python
from sanic.response import raw

@app.route("/")
async def handler(request):
    return raw(b"raw bytes")
```
:::
::: tab Redirect

**기본 콘텐츠 유형**: `text/html; charset=utf-8`  
**설명**: 클라이언트를 다른 경로로 리디렉션하기 위해 `302` 응답을 보냅니다.

```python
from sanic.response import redirect

@app.route("/")
async def handler(request):
    return redirect("/login")
```

:::
::: tab Empty

**기본 콘텐츠 유형**: N/A  
**설명**: [RFC 2616](https://tools.ietf.org/search/rfc2616#section-7.2.1)에 정의된 대로 빈 메시지로 응답

```python
from sanic.response import empty

@app.route("/")
async def handler(request):
    return empty()
```
기본값은 `204` 상태입니다.
:::
::::

## 기본 상태 (Default status)

응답에 대한 기본 HTTP 상태 코드는 `200`입니다. 변경해야 하는 경우 응답 방식으로 변경할 수 있습니다.


```python
@app.post("/")
async def create_new(request):
    new_thing = await do_create(request)
    return json({"created": True, "id": new_thing.thing_id}, status=201)
```
