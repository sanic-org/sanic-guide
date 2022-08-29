# 自動ドキュメンテーション

エンドポイントのドキュメント化を容易にするために、Sanic Extensionsは関数のdocstringを使用してドキュメントを入力します。

## 概要と説明

---:1 関数のdocstringは、要約と説明を作成するために使用されます。 この例からわかるように、docstringは最初の行を要約として、残りの文字列を説明として使用するように解析されます。 :--:1 :--:1
```python
@app.get("/foo")
@openapi.no_autodoc
async def handler(request, something: str):
    """このdocstringは情報専用。

    autodocしないでね。
    """
    return text("...")
```
```json
@app.get("/foo")
async def handler(request, something: str):
    """これはシンプルなfooハンドラです。

    docstringの内部で**markdown**を使用することも可能であることを知っておくと
    便利です。

    - いち
    - に
    - さん"""
    return text(">>>")
```
:---

## 動作レベルYAML

---:1 docstringに有効なOpenAPIのYAMLを追加することで、これを拡張することができます。 単に `openapi:` を含む行を追加し、その後にあなたのYAMLを追加します。

この例で示されている `---` は必要ありません。 これは YAML が docstring の個別のセクションであることを視覚的に識別するために存在します。 :--:1 :--:1
```python
@app.get("/foo")
async def handler(request, something: str):
    """これはシンプルなfooハンドラです。

    いくつかの詳細を追加しておきます。

    openapi:
    ---
    operationId: fooDots
    tags:
      - いち
      - に
    parameters:
      - name: limit
        in: query
        description: 一回でいくつのアイテムを返すか(最大100)
        required: false
        schema:
          type: integer
          format: int32
    responses:
      '200':
        description: いくつかのドットだよ
    """
    return text("...")
```
```json
"paths": {
  "/foo": {
    "get": {
      "operationId": "fooDots",
      "summary": "これはシンプルなfooハンドラです。 ",
      "description": "いくつかの詳細を追加しておきます。 ",
      "tags": [
        "いち",
        "に"
      ],
      "parameters": [
        {
          "name": "limit",
          "in": "query",
          "description": "一回でいくつのアイテムを返すか(最大100)",
          "required": false,
          "schema": {
            "type": "integer",
            "format": "int32"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "いくつかのドットだよ"
        }
      }
    }
  }
}
```

:---

::: tip
YAML ドキュメントとデコレータの両方が使用された場合、 ドキュメントを生成する際に優先されるのはデコレータからのコンテンツです。
::: :::

## docstringの除外

---:1 関数が、ドキュメント内で消費されることを意図していないdocstringを含むことがあります。

**方法 1**: `app.config.OAS_AUTODOC = False`で自動ドキュメンテーションを全体的にオフにする。

**方法 2**: `@openapi.no_autodoc` デコレータを使用し、単一のハンドラに対してこの機能を無効にする。 :--:1
```python
@app.get("/foo")
@openapi.no_autodoc
async def handler(request, something: str):
    """This is a docstring about internal info only. Do not parse it.
    """
    return text("...")
```
:---
