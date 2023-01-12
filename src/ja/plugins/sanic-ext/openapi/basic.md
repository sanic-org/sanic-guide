# 基本事項

::: tip ちょこっとメモ Sanic ExtensionsのOpenAPI実装は、[`sanic-openapi`](https://github.com/sanic-org/sanic-openapi)のOAS3実装がベースになっています。 実際、Sanic Extensionsはそのプロジェクトの後継であり、Sanic Extensionsのリリースと同時にメンテナンスモードに入りました。 もしあなたが以前 OAS3 を `sanic-openapi` で使っていたなら、Sanic Extensions にアップグレードするのは簡単なはずです。 残念ながら、このプロジェクトは OAS2 仕様をサポートして*いません*。 :::

---:1

Sanic Extensionsは、[v3.0 OpenAPI仕様](https://swagger.io/specification/)を用いて自動生成されたAPIドキュメントをそのまま提供します。 特別なことは何もする必要がありません。

:--:1

```python
from sanic import Sanic
from sanic_ext import Extend

app = Sanic("MyApp")
Extend(app)
```

:---

これを行うと、既存のアプリケーションに基づいてすでに生成された美しいドキュメントが表示されます。

- [http://localhost:8000/docs](http://localhost:8000/docs)
- [http://localhost:8000/docs/redoc](http://localhost:8000/docs/redoc)
- [http://localhost:8000/docs/swagger](http://localhost:8000/docs/swagger)

[設定のセクション](../configuration.md) をチェックして、ドキュメントのルート変更について学びましょう。 2 つの UI のいずれかをオフにして、 `/docs`ルートでどのUIが利用できるかをカスタマイズすることもできます。

---:1

[Redoc](https://github.com/Redocly/redoc)を使う

![Redoc](~@assets/images/sanic-ext-redoc.png)


:--:1

もしくは[Swagger UI](https://github.com/swagger-api/swagger-ui)

![Swagger UI](~@assets/images/sanic-ext-swagger.png)


:---

## 仕様メタデータの変更

---:1 メタデータを変更したい場合は、 `describe` メソッドを使用してください。

この例では、`dedent`は`description`引数を使用して、複数行の文字列を少しクリーンにします。 これは必要ありません。任意の文字列値を渡すことができます。 :--:1
```python
from textwrap import dedent

app.ext.openapi.describe(
    "Testing API",
    version="1.2.3",
    description=dedent(
        """
        # 情報
        こちらは説明です。 いくつかの _拡張的_ な文章を追加するには良い場所ですよ。

        **markdown** がサポートされています。
        """
    ),
)
```
:---
