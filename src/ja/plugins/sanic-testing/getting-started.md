# スタートアップ

Sanic Testing は Sanic の *公式* テストクライアントです。 主な用途は、Sanicプロジェクト自体のテストを強化することです。 しかし、それはまた、あなたのAPIテストを素早く立ち上げ、実行するための使いやすいクライアントとして意図されています。

## 最低要件

- **Python**: 3.7+
- **Sanic**: 21.3+

バージョン21.3より古いSanicでは、このモジュールが `sanic.testing` としてSanic自体に統合されています。

## インストール

Sanic TestingはPyPIからインストール可能です:

```
pip install sanic-testing
```

## 基本的な使用方法

`sanic-testing` パッケージが環境にある限り、これを使い始めるために必要なことは何もありません。


### 同期テストの作成

テストクライアントを使用するには、アプリケーションインスタンスの `test_client` プロパティにアクセスするだけです。

```python
import pytest
from sanic import Sanic, response


@pytest.fixture
def app():
    sanic_app = Sanic("TestSanic")

    @sanic_app.get("/")
    def basic(request):
        return response.text("foo")

    return sanic_app

def test_basic_test_client(app):
    request, response = app.test_client.get("/")

    assert request.method.lower() == "get"
    assert response.body == b"foo"
    assert response.status == 200
```

### 非同期テストの書き方

`pytest` で非同期テストクライアントを使用するには、`pytest-asyncio` プラグインをインストールする必要があります。

```
pip install pytest-asyncio
```

その後、非同期テストを作成し、ASGIクライアントを使用することができます:

```python
import pytest
from sanic import Sanic, response

@pytest.fixture
def app():
    sanic_app = Sanic(__name__)

    @sanic_app.get("/")
    def basic(request):
        return response.text("foo")

    return sanic_app

@pytest.mark.asyncio
async def test_basic_asgi_client(app):
    request, response = await app.asgi_client.get("/")

    assert request.method.lower() == "get"
    assert response.body == b"foo"
    assert response.status == 200
```
