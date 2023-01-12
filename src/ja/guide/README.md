---
pageClass: intro
---

# 紹介

Sanicは、Python 3.7以上のWebサーバーとWebフレームワークで、高速に機能するように書かれています。 Python 3.5で追加された非同期/待機構文の使用が可能になり、コードがノンブロッキングでスピーディーになります。

|        |                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------ |
| 構築     | [![Build Status][1]][1] [![AppVeyor Build Status][3]][2] [![Codecov]][3]                                     |
| ドキュメント | [![Documentation]][4]                                                                                        |
| パッケージ  | [![PyPI][7]][5] [![PyPI バージョン][9]][5] [![PyPI ホイール][11]][6] [![サポートされている実装][13]][6] [![Code style black]][7] |
| サポート   | [![フォーラム][16]][8] [![Discord][18]][9] [![Awesome Sanic List]][10]                                            |
| ステータス  | [![ダウンロード][21]][11] [![ダウンロード][23]][11]                                                                      |

## これは何？

まず第一に、水に飛び込む前に、サニックは他のフレームワークとは異なることを知っておく必要があります。

その最初の文では、Sanicは**フレームワーク**と**ウェブサーバー**の両方であるため、大きな間違いがあります。 展開セクションでは、これについてもう少し話します。

しかし、箱から出してすぐにSanicには、本番グレードのWebアプリケーションの作成、展開、拡張に必要なものがすべて付属していることを忘れないでください。 :rocket:

## 目標

> 構築、拡張、最終的に拡張が簡単な高性能HTTPサーバーを起動して実行する簡単な方法を提供する。
## 機能

---:1

### コア

- **_速い_**ウェブサーバーを構築する
- 生産準備完了
- 非常にスケーラブル
- ASGI準拠
- シンプルで直感的なAPIデザイン
- コミュニティによって、コミュニティのために

:--:1

### Sanic Extensions [[詳細](../plugins/sanic-ext/getting-started.md)]

- CORSの保護
- Jinjaによるテンプレートのレンダリング
- ルートハンドラへの依存性インジェクション
- Redocや Swagger を使用した OpenAPI ドキュメント
- 定義済み、エンドポイント固有のレスポンスシリアライザー
- リクエストのクエリ引数とボディ入力の検証
- `HEAD`、`OPTIONS`、`TRACE` のエンドポイントの自動作成

:---



## スポンサー

Sanicへの資金援助の詳細については、 [open collective](https://opencollective.com/sanic-org) を参照してください。


## コミュニティーに参加

議論のメインチャンネルは[コミュニティフォーラム](https://community.sanicframework.org/)にあります。 ライブディスカッションとチャット用の[Discord Server](https://discord.gg/FARQzAEMAA)もあります。

Stackoverflowの`[sanic]` タグは [積極的に](https://stackoverflow.com/questions/tagged/sanic) プロジェクト管理者によって監視されています。

## コントリビューション

私たちは常に新しい貢献を喜んでいます。 私たちは[始めるために探している人のために良いマークされた問題](https://github.com/sanic-org/sanic/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner)、ようこそ[フォーラムの質問/回答/ディスカッション](https://community.sanicframework.org/)。 [貢献ガイドライン](https://github.com/sanic-org/sanic/blob/master/CONTRIBUTING.rst)をご覧ください。

## 我々について

<Contributions />

[1]: https://travis-ci.com/sanic-org/sanic.svg?branch=master
[1]: https://travis-ci.com/sanic-org/sanic
[3]: https://ci.appveyor.com/api/projects/status/d8pt3ids0ynexi8c/branch/master?svg=true
[2]: https://ci.appveyor.com/project/sanic-org/sanic
[3]: https://codecov.io/gh/sanic-org/sanic
[4]: http://sanic.readthedocs.io/en/latest/?badge=latest
[7]: https://img.shields.io/pypi/v/sanic.svg
[5]: https://pypi.python.org/pypi/sanic/
[9]: https://img.shields.io/pypi/pyversions/sanic.svg
[5]: https://pypi.python.org/pypi/sanic/
[11]: https://img.shields.io/pypi/wheel/sanic.svg
[6]: https://pypi.python.org/pypi/sanic
[13]: https://img.shields.io/pypi/implementation/sanic.svg
[6]: https://pypi.python.org/pypi/sanic
[7]: https://github.com/ambv/black
[16]: https://img.shields.io/badge/forums-community-ff0068.svg
[8]: https://community.sanicframework.org/
[18]: https://img.shields.io/discord/812221182594121728?logo=discord
[9]: https://discord.gg/FARQzAEMAA
[10]: https://github.com/mekicha/awesome-sanic
[21]: https://pepy.tech/badge/sanic/month
[11]: https://pepy.tech/project/sanic
[23]: https://pepy.tech/badge/sanic/week
[11]: https://pepy.tech/project/sanic
