# Getting Started

Before we begin, make sure you are running Python 3.6 or higher. Currently, is known to work with Python versions 3.6, 3.7 and 3.8.

## Install

```bash
pip install sanic
```

## Hello, world application

---:1

If you have ever used one of the many decorator based frameworks, this probably looks somewhat familiar to you.

::: tip 
If you are coming from Flask or another framework, there are a few important things to point out. Remember, Sanic aims for performance, flexibility, and ease of use. These guiding principles have tangible impact on the API and how it works.
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

### Important to note

- Every request handler can either be sync (`def hello_world`) or async (`async def hello_world`). Unless you have a clear reason for it, always go with `async`.
- The `request` object is always the first argument of your handler. Other frameworks pass this around in a context variable to be imported. In the `async` world, this would not work so well and it is far easier (not to mention cleaner and more performant) to be explicit about it. 
- You **must** use a response type. MANY other frameworks allow you to have a return value like this: `return "Hello, world."` or this: `return {"foo": "bar"}`. But, in order to do this implicit calling, somewhere in the chain needs to spend valuable time trying to determine what you meant. So, at the expense of this ease, Sanic has decided to require an explicit call.

### Running

---:1
Let's save the above file as `server.py`. And launch it.
:--:1
```bash
sanic server.app
```
:---

::: tip 
This **another** important distinction. Other frameworks come with a built in development server and explicitly say that it is _only_ intended for development use. The opposite is true with Sanic. 

**The packaged server is production ready.**
:::
