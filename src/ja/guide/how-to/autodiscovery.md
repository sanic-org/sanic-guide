---
title: Autodiscovery
---


# Blueprints、ミドルウェア、listenersの自動検出

> アプリケーションの構築に使用しているコンポーネントを自動検出するにはどうすればよいですか。

アプリケーションを構築する際に直面する最初の問題の1つは、プロジェクトを 「どのように」 構築するかということです。Sanicはルートハンドラ、ミドルウェア、リスナーの登録にデコレータを多用しています。また、設計図を作成した後、アプリケーションにマウントする必要があります。

可能な解決策は、**すべて**がインポートされ、Sanicインスタンスに適用される単一のファイルです。もう1つは、グローバル変数としてSanicインスタンスを渡す方法です。どちらの解決策にも欠点があります。

もう1つの方法は、自動検出です。アプリケーションをモジュール(すでにインポートされている、または文字列)に向け、すべてを接続します。

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
