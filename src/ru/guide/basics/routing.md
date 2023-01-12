# Маршрутизация

---:1

До сих пор мы часто встречали этот декоратор в различных формах.

Но что это такое? И как мы это используем? :--:1
```python
@app.route("/stairway")
...

@app.get("/to")
...

@app.post("/heaven")
...
```
:---

## Добавление маршрута

---:1

Самым простым способом привязать обработчик к эндпоинту является `app.add_route()`.

Смотрите [API документацию](https://sanic.readthedocs.io/en/stable/sanic/api_reference.html#sanic.app.Sanic.url_for) для получения более подробной информации. :--:1
```python
async def handler(request):
    return text("OK")

app.add_route(handler, "/test")
```
:---

---:1

По умолчанию маршрут обрабатывает HTTP `GET` вызов. Вы можете настроить хендлер для ответа на один или несколько HTTP-методов. :--:1
```python
app.add_route(
    handler,
    '/test',
    methods=["POST", "PUT"],
)
```
:---

---:1

Предыдущий пример соответствует следующему варианту с использованием синтаксиса декоратора. :--:1
```python
@app.route('/test', methods=["POST", "PUT"])
async def handler(request):
    return text('OK')
```
:---

## HTTP методы

Каждый из стандартных методов HTTP имеет удобный декоратор.

:::: tabs
::: tab GET

```python
@app.get('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) :::
::: tab POST

```python
@app.post('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) :::
::: tab PUT

```python
@app.put('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) :::
::: tab PATCH

```python
@app.patch('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH) :::
::: tab DELETE

```python
@app.delete('/test')
async def handler(request):
    return text('OK')
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) :::
::: tab HEAD

```python
@app.head('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD) :::
::: tab OPTIONS

```python
@app.options('/test')
async def handler(request):
    return empty()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS) :::
::::

::: Предупреждение По умолчанию, Sanic **будет ожидать** входящее тело запроса на небезопасных методах HTTP (`POST`, `PUT`, `PATCH`). Если вы хотите получать данные в HTTP-запросе любым другим методом, вам нужно выбрать один из следующих двух вариантов:

**Вариант #1 - Сказать Sanic ожидать тело с помощью параметра `ignore_body`**
```python
@app.delete("/path", ignore_body=False)
async def handler(_):
    ...
```

**Вариант #2 - Получать тело вручную внутри обработчика с помощью метода запроса `receive_body`**
```python
@app.delete("/path")
async def handler(request: Request):
    await request.receive_body()
```
:::

## Параметры пути

---:1

Sanic позволяет использовать встроенное сопоставление шаблонов и извлечение значений из URL-пути. Затем эти значения передаются в обработчик маршрута в качестве ключевых аргументов. :--:1
```python
@app.get("/tag/<tag>")
async def tag_handler(request, tag):
    return text("Tag - {}".format(tag))
```
:---

---:1

Вы можете указать тип параметра. Это будет применено при сопоставлении, а также приведёт переменную к соответствующему типу. :--:1
```python
@app.get("/foo/<foo_id:uuid>")
async def uuid_handler(request, foo_id: UUID):
    return text("UUID - {}".format(foo_id))
```
:---

### Поддерживаемые типы

:::: tabs

::: tab str

```python
@app.route("/path/to/<foo:str>")
async def handler(request, foo: str):
    ...
```
**Применяемое регулярное выражение**: `r"[^/]+")`  
**Тип приведения**: `str`  
**Пример соответствия**:
- `/path/to/Bob`
- `/path/to/Python%203`

Начиная с версии 22.3 `str` *не определяет * пустые строки. Для этого поведения используйте `strorempty`.

:::
::: tab strorempty

```python
@app.route("/path/to/<foo:strorempty>")
async def handler(request, foo: str):
    ...
```
**Применяемое регулярное выражение**: `r"[^/]*")`  
**Тип приведения**: `str`  
**Пример соответствия**:
- `/path/to/Bob`
- `/path/to/Python%203`
- `/path/to/`

В отличие от типа параметра `str`, `strorempty` также может определять пустой строковый сегмент пути.

*Добавлено в v22.3* :::
::: int

```python
@app.route("/path/to/<foo:int>")
async def handler(request, foo: int):
    ...
```
**Применяемое регулярное выражение**: `r"-?\d+")`  
**Тип приведения**: `int`  
**Пример соответствия**:
- `/path/to/10`
- `/path/to/-10`

_Не соответствует float, hex, octal, и т. д._ :::
::: tab float

```python
@app.route("/path/to/<foo:float>")
async def handler(request, foo: float):
    ...
```
**Применяемое регулярное выражение**: `r"-?(?:\d+(?:\.\d*)?|\.\d+)")`  
**Тип приведения**: `float`  
**Пример соответствия**:
- `/path/to/10`
- `/path/to/-10`
- `/path/to/1.5`

:::
::: tab alpha

```python
@app.route("/path/to/<foo:alpha>")
async def handler(request, foo: str):
    ...
```
**Применяемое регулярное выражение**: `r"[A-Za-z]+")`  
**Тип приведения**: `str`  
**Пример соответствия**:
- `/path/to/Bob`
- `/path/to/Python`

_Не соответствует цифре, пробелу или другому специальному символу_ :::
::: tab slug

```python
@app.route("/path/to/<article:slug>")
async def handler(request, article: str):
    ...
```
**Применяемое регулярное выражение**: `r"[a-z0-9]+(?:-[a-z0-9]+)*")`  
**Тип приведения**: `str`  
**Пример соответствия**:
- `/path/to/some-news-story`
- `/path/to/or-has-digits-123`

*Added in v21.6* :::
::: tab path

```python
@app.route("/path/to/<foo:path>")
async def handler(request, foo: str):
    ...
```
**Применяемое регулярное выражение**: `r"[^/].*?")`  
**Тип приведения**: `str`  
**Пример соответствия**:
- `/path/to/hello`
- `/path/to/hello.txt`
- `/path/to/hello/world.txt`

::: Предупреждение Поскольку соспоставление проводится по `/`, вам следует очень тщательно протестировать шаблоны, которые используют `path`, чтобы они не перехватывали трафик, предназначенный для другого эндпоинта. :::
::: tab ymd

```python
@app.route("/path/to/<foo:ymd>")
async def handler(request, foo: datetime.date):
    ...
```
**Применяемое регулярное выражение**: `r"^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))`  
**Тип приведения**: `datetime.date`  
**Пример соответствия**:
- `/path/to/2021-03-28` :::

::: tab uuid

```python
@app.route("/path/to/<foo:uuid>")
async def handler(request, foo: UUID):
    ...
```
**Применяемое регулярное выражение**: `r"[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}"`  
**Тип приведения**: `UUID`  
**Пример соответствия**:
- `/path/to/123a123a-a12a-1a1a-a1a1-1a12a1a12345`

:::

::: tab ext

```python
@app.route("/path/to/<foo:ext>")
async def handler(request, foo: str, ext: str):
    ...
```
**Применяемое регулярное выражение**: n/a  
**Тип приведения**: `вариативный`  
**Пример соответствия**:

<table spaces-before="0">
  <tr>
    <th>
      определение
    </th>
    
    <th>
      пример
    </th>
    
    <th>
      имя файла
    </th>
    
    <th>
      расширение
    </th>
  </tr>
  
  <tr>
    <td>
      \<file:ext>
    </td>
    
    <td>
      page.txt
    </td>
    
    <td>
      <code>"page"</code>
    </td>
    
    <td>
      <code>"txt"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      \<file:ext=jpg>
    </td>
    
    <td>
      cat.jpg
    </td>
    
    <td>
      <code>"cat"</code>
    </td>
    
    <td>
      <code>"jpg"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      \<file:ext=jpg\
    </td>
    
    <td>
      png\
    </td>
    
    <td>
      gif\
    </td>
    
    <td>
      svg>    | cat.jpg     | <code>"cat"</code>     | <code>"jpg"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      <file=int:ext>
    </td>
    
    <td>
      123.txt
    </td>
    
    <td>
      <code>123</code>
    </td>
    
    <td>
      <code>"txt"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      <file=int:ext=jpg\
    </td>
    
    <td>
      png\
    </td>
    
    <td>
      gif\
    </td>
    
    <td>
      svg> | 123.svg     | <code>123</code>       | <code>"svg"</code>
    </td>
  </tr>
  
  <tr>
    <td>
      <file=float:ext=tar.gz>
    </td>
    
    <td>
      3.14.tar.gz
    </td>
    
    <td>
      <code>3.14</code>
    </td>
    
    <td>
      <code>"tar.gz"</code>
    </td>
  </tr>
</table>

Используя специальный тип параметра `ext`, можно сопоставлять расширения файлов. Он использует специальный формат, который позволяет вам указывать другие типы для параметра имени файла, и одно или несколько конкретных расширений, как показано в приведенной выше таблице.

Он *не* поддерживает параметры типа `path`.

*Добавлено в v22.3* :::

::: tab regex

```python
@app.route(r"/path/to/<foo:([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))>")
async def handler(request, foo: str):
    ...
```
**Применяемое регулярное выражение**: _любое по вашему выбору_  
**Тип приведения**: `str`  
**Пример соответствия**:
- `/path/to/2021-01-01`

Это дает вам свободу определять подходящие шаблоны для вашего варианта использования.

В показанном примере мы ищем дату в формате `YYYY-MM-DD`.

::::

### Сопоставление по регулярному выражению



По сравнению со сложной маршрутизацией приведенный выше пример слишком прост, и чаще мы используем совершенно другой шаблон соответствия для маршрута. Поэтому здесь мы подробно опишем расширенное использование регулярных выражений.

Иногда вы хотите сопоставить часть маршрута:

```text
/image/123456789.jpg
```

Если вы хотите сопоставить паттерн файла, но только в его числовой части, вам придётся немного развлечься с регулярными выражениями 😄:

```python
app.route(r"/image/<img_id:(?P<img_id>\d+)\.jpg>")
```

Всё нижеуказанное должно подходить:

```python
@app.get(r"/<foo:[a-z]{3}.txt>")                # сопоставление полного паттерна
@app.get(r"/<foo:([a-z]{3}).txt>")              # определение единственной группы выборки
@app.get(r"/<foo:(?P<foo>[a-z]{3}).txt>")       # определение единственной именнованной группы выборки
@app.get(r"/<foo:(?P<foo>[a-z]{3}).(?:txt)>")   # определение единственной именнованной группы выборки с одной или более несопоставляемыми группами
```

Также, если используется именованная группа выборки, то она должна совпадать с меткой сегмента.

```python
@app.get(r"/<foo:(?P<foo>\d+).jpg>")  # OK
@app.get(r"/<foo:(?P<bar>\d+).jpg>")  # NOT OK
```

Для получения дополнительной информации о методах использования обратитесь к разделу [Операции регулярных выражений](https://docs.python.org/3/library/re.html) официальной библиотеки Python

## Создание URL

---:1

Sanic предоставляет метод генерации URL-маршрутов, основанных на имени обработчика: `app.url_for()`. Это полезно, если вы хотите избежать жесткого прописывания url-путей в вашем приложении; вместо этого вы можете просто сослаться на имя хендлера. :--:1
```python
@app.route('/')
async def index(request):
    # создаёт URL для эндпоинта `post_handler`
    url = app.url_for('post_handler', post_id=5)

    # Перенаправление на `/posts/5`
    return redirect(url)

@app.route('/posts/<post_id>')
async def post_handler(request, post_id):
    ...
```
:---

---:1

Вы можете передавать произвольное количество аргументов. Все, что _не_ является параметром запроса, будет трактоваться как часть запросной строки. :--:1
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

Также поддерживается передача нескольких значений для одного ключа запроса. :--:1
```python
>>> app.url_for(
    "post_handler",
    post_id=5,
    arg_one=["one", "two"],
)
'/posts/5?arg_one=one&arg_one=two'
```
:---

### Специальные аргументы

Смотрите [API документацию]() для получения более подробной информации.

```python
>>> app.url_for("post_handler", post_id=5, arg_one="one", _anchor="anchor")
'/posts/5?arg_one=one#anchor'

# Параметр _external требует передачи аргумента _server or установки переменной SERVER_NAME в app.config в случае, если ни один url не будет совпадать с пустым _external
>>> app.url_for("post_handler", post_id=5, arg_one="one", _external=True)
'//server/posts/5?arg_one=one'

# при указании параметра _scheme, параметр _external должен быть True
>>> app.url_for("post_handler", post_id=5, arg_one="one", _scheme="http", _external=True)
'http://server/posts/5?arg_one=one'

# вы можете передать все специальные аргументы одновременно
>>> app.url_for("post_handler", post_id=5, arg_one=["one", "two"], arg_two=2, _anchor="anchor", _scheme="http", _external=True, _server="another_server:8888")
'http://another_server:8888/posts/5?arg_one=one&arg_one=two&arg_two=2#anchor'
```

### Настройка имени маршрута

---:1

Пользовательское имя маршрута может быть использовано при передаче аргумента `name` при регистрации маршрута. :--:1
```python
@app.get("/get", name="get_handler")
def handler(request):
    return text("OK")
```
:---

---:1

Теперь используйте это имя для получения URL :--:1
```python
>>> app.url_for("get_handler", foo="bar")
'/get?foo=bar'
```
:---

## Маршруты веб-сокетов

---:1

Маршрутизация веб-сокета работает аналогично методам HTTP. :--:1
```python
async def handler(request, ws):
    message = "Start"
    while True:
        await ws.send(message)
        message = await ws.recv()

app.add_websocket_route(handler, "/test")
```
:---

---:1

У него также есть удобный декоратор. :--:1
```python
@app.websocket("/test")
async def handler(request, ws):
    message = "Start"
    while True:
        await ws.send(message)
        message = await ws.recv()
```
:---

Прочтите раздел [Веб-сокеты](/guide/advanced/websockets.md), чтобы узнать больше о том, как они работают.

## Строгий слэш


---:1

Маршруты Sanic могут быть настроены на обязательное наличие слэша в конце: `/`. Это может быть указано на нескольких уровнях и в следующем порядке:

1. Route
2. Blueprint
3. BlueprintGroup
4. Application

:--:1
```python
# указать значение strict_slashes по умолчанию для всех маршрутов
= Sanic(__file__, strict_slashes=True)
```

```python
# переопределить значение strict_slashes для определенного маршрута
@app.get("/get", strict_slashes=False)
обработчик def (запрос):
    return text("OK")
```

```python
# также работает для блюпринтов
bp = Blueprint(__file__, strict_slashes=True)

@bp.get("/bp/get", strict_slashes=False)
def handler (request):
    return text("OK")
```

```python
bp1 = Blueprint(name="bp1", url_prefix="/bp1")
bp2 = Blueprint(
    name="bp2",
    url_prefix="/bp2",
    strict_slashes=False,
)

# Это включит строгую проверку наличия слэша в маршрутах bp1
# но будет её игнорировать в bp2 
# так как в его параметре strict_slashes явно указан False
group = Blueprint. roup([bp1, bp2], strict_slashes=True)
```
:---

## Статичные файлы

---:1

Для обработки статичных файлов используйте `app.static()`.

Порядок аргументов имеет важное значение:

1. Маршрут, в котором файлы будут обрабатываться
2. Путь к файлам на сервере

Смотрите [API документацию]() для получения более подробной информации. :--:1
```python
app.static("/static", "/path/to/directory")
```
:---

---:1

Вы также можете обрабатывать отдельные файлы. :--:1
```python
app.static("/", "/path/to/index.html")
```
:---

---:1

Также иногда полезно придать вашему эндпоинту конкретное имя :--:1
```python
app.static(
    "/user/uploads",
    "/path/to/uploads",
    name="uploads",
)
```
:---

---:1

Получение URL-адресов работает аналогично обработчикам. Но мы также можем добавить аргумент `filename`, когда нам нужен определенный файл внутри директории. :--:1
```python
>>> app.url_for(
    "static",
    name="static",
    filename="file.txt",
)
'/static/file.txt'
```
```python
>>> app.url_for(
    "static",
    name="uploads",
    filename="image.png",
)
'/user/uploads/image.png'

```
:---

::: Совет: Если вы собираетесь иметь несколько `static()` маршрутов, тогда *настоятельно* рекомендуется называть их вручную. Это почти наверняка облегчит поиск трудновыявляемых ошибки.

```python
app.static("/user/uploads", "/path/to/uploads", name="uploads")
app.static("/user/profile", "/path/to/profile", name="profile_pics")
```
:::

## Контекст маршрута

---:1 Когда маршрут определен, вы можете добавить в него любое количество аргументов с префиксом `ctx_`. Эти значения будут добавлены в объект маршрута `ctx`. :--:1
```python
@app.get("/1", ctx_label="something")
async def handler1(request):
    ...

@app.get("/2", ctx_label="something")
async def handler2(request):
    ...

@app.get("/99")
async def handler99(request):
    ...

@app.on_request
async def do_something(request):
    if request.route.ctx.label == "something":
        ...
```
:--- *Added in v21.12*
