# CORS protection

Cross-Origin Resource Sharing (aka CORS) is a *huge* topic by itself. The documentation here cannot go into enough detail about *what* it is. You are highly encouraged to do some research on your own to understand the security problem presented by it, and the theory behind the solutions. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) are a great first step.

In super brief terms, CORS protection is a framework that browsers use to facilitate how and when a web page can access information from another domain. It is extremely relevant to anyone building a single-page application. Often times your frontend might be on a domain like `https://portal.myapp.com`, but it needs to access the backend from `https://api.myapp.com`.

The implementation here is heavily inspired by [`sanic-cors`](https://github.com/ashleysommer/sanic-cors), which is in turn based upon [`flask-cors`](https://github.com/corydolphin/flask-cors). It is therefore very likely that you can achieve a near drop-in replacement of `sanic-cors` with `sanic-ext`. The main difference is that Sanic Extensions applies CORS protection to an entire application and cannot be limited to specific resources or routes.

## Basic implementation

---:1

As shown in the example in the [auto-endpoints example](methods.md#options), Sanic Extensions will automatically enable CORS protection without further action. But, it does not offer too much out of the box.

:--:1
```python
@app.get("/")
async def hello_world(request):
    return text("Hello, world.")
```

```
$ curl localhost:8000 -X OPTIONS -i
HTTP/1.1 204 No Content
allow: GET,HEAD,OPTIONS
access-control-allow-origin: *
connection: keep-alive
```
:---

## Configuration

The true power of CORS protection, however, comes into play once you start configuring it. Here is a table of all of the options.

| Key | Type | Default| Description |
|--|--|--|--|
| `CORS_ALLOW_HEADERS` | `str` or `List[str]` | `"*"` | The list of headers that will appear in `access-control-allow-headers`. |
| `CORS_ALWAYS_SEND` | `bool` | `True` | When `True`, will always set a value for `access-control-allow-origin`. When `False`, will only set it if there is an `Origin` header. |
| `CORS_AUTOMATIC_OPTIONS` | `bool` | `True` | When the incoming request has `access-control-request-method` set, whether to automatically set values for `access-control-allow-headers`, `access-control-max-age`, and `access-control-allow-methods` headers |
| `CORS_EXPOSE_HEADERS` | `str` or `List[str]` | `""` | Specific list of headers to be set in `access-control-expose-headers` header. |
| `CORS_MAX_AGE` | `str`, `int`, `timedelta` | `0` | The maximum number of seconds the preflight response may be cached using the `access-control-max-age` header. A falsey value will cause the header to not be set. |
| `CORS_METHODS` | `str` or `List[str]` | `""` | The HTTP methods that the allowed origins can access, as set on the `access-control-allow-methods` header. |
| `CORS_ORIGINS` | `str`, `List[str]`, `re.Pattern` | `"*"` | The origins that are allowed to access the resource, as set on the `access-control-allow-origin` header. |
| `CORS_SEND_WILDCARD` | `bool` | `False` | If `True`, will send the wildcard `*` origin instead of the `origin` request header. |
| `CORS_SUPPORTS_CREDENTIALS` | `bool` | `False` | Whether to set the `access-control-allow-credentials` header. |
| `CORS_VARY_HEADER` | `bool` | `True` | Whether to add `vary` header, when appropriate. |

*For the sake of brevity, where the above says `List[str]` any instance of a `list`, `set`, `frozenset`, or `tuple` will be acceptable. Alternatively, if the value is a `str`, it can be a comma delimited list.*
