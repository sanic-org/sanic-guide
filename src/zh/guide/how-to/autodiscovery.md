---
title: 自动发现(Autodiscovery)
---


# 自动发现蓝图，中间件和监听器

> 我该如何自动发现我正在使用的组件来构建我的应用程序？

当创建一个应用时，您可能碰到的第一个问题就是 *如何* 去组织一个项目。Sanic 十分依赖装饰器来注册路由、中间件和监听器。并且，在创建蓝图之后，也需要被挂载到应用上。

一种解决方案是创建一个文件，在这个文件中导入 *所有* 的东西并且被应用于 Sanic 应用实例。另一种解决方式是将 Sanic 应用实例作为全局变量在不同文件中传递并使用。这两种方式都会有他的缺点。

而自动发现函数作为另一种补充。您可以把应用程序与模块（已经导入的对象或字符串）传入自动发现的函数中，该工具函数就会自动加载一切。

:::: tabs

::: tab server.py

```python
from sanic import Sanic
from sanic.response import empty

import blueprints
from utility import autodiscover

app = Sanic("auto", register=True)
autodiscover(
    app,
    blueprints,
    "parent.child",
    "listeners.something",
    recursive=True,
)

app.route("/")(lambda _: empty())
```

```bash
[2021-03-02 21:37:02 +0200] [880451] [INFO] Goin' Fast @ http://127.0.0.1:9999
[2021-03-02 21:37:02 +0200] [880451] [DEBUG] something
[2021-03-02 21:37:02 +0200] [880451] [DEBUG] something @ nested
[2021-03-02 21:37:02 +0200] [880451] [DEBUG] something @ level1
[2021-03-02 21:37:02 +0200] [880451] [DEBUG] something @ level3
[2021-03-02 21:37:02 +0200] [880451] [DEBUG] something inside __init__.py
[2021-03-02 21:37:02 +0200] [880451] [INFO] Starting worker [880451]
```

:::

::: tab utility.py

```python

from glob import glob
from importlib import import_module, util
from inspect import getmembers
from pathlib import Path
from types import ModuleType
from typing import Union
import os

from sanic.blueprints import Blueprint


def autodiscover(
    app, *module_names: Union[str, ModuleType], recursive: bool = False
):
    mod = app.__module__
    blueprints = set()
    _imported = set()

    def _find_bps(module):
        nonlocal blueprints

        for _, member in getmembers(module):
            if isinstance(member, Blueprint):
                blueprints.add(member)

    for module in module_names:
        if isinstance(module, str):
            module = import_module(module, mod)
            _imported.add(module.__file__)
        _find_bps(module)

        if recursive:
            base = Path(module.__file__).parent
            for path in glob(f"{base}/**/*.py", recursive=True):
                if path not in _imported:
                    name = "module"
                    if "__init__" in path:
                        sep = "\\" if os.name == 'nt' else "/"
                        *_, name, __ = path.split(sep)
                    spec = util.spec_from_file_location(name, path)
                    specmod = util.module_from_spec(spec)
                    _imported.add(path)
                    spec.loader.exec_module(specmod)
                    _find_bps(specmod)

    for bp in blueprints:
        app.blueprint(bp)
```

:::

::: tab blueprints/level1.py

```python
from sanic import Blueprint
from sanic.log import logger

level1 = Blueprint("level1")


@level1.after_server_start
def print_something(app, loop):
    logger.debug("something @ level1")
```

:::

::: tab blueprints/one/two/level3.py

```python
from sanic import Blueprint
from sanic.log import logger

level3 = Blueprint("level3")


@level3.after_server_start
def print_something(app, loop):
    logger.debug("something @ level3")
```

:::

::: tab listeners/something.py

```python
from sanic import Sanic
from sanic.log import logger

app = Sanic.get_app("auto")


@app.after_server_start
def print_something(app, loop):
    logger.debug("something")
```

:::

::: tab parent/child/__init__.py

```python
from sanic import Blueprint
from sanic.log import logger

bp = Blueprint("__init__")


@bp.after_server_start
def print_something(app, loop):
    logger.debug("something inside __init__.py")
```

:::

::: tab parent/child/nested.py

```python
from sanic import Blueprint
from sanic.log import logger

nested = Blueprint("nested")


@nested.after_server_start
def print_something(app, loop):
    logger.debug("something @ nested")
```

:::

::::
