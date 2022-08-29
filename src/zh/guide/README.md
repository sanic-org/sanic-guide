---
pageClass: intro
---

# 介绍(Introduction)

Sanic 是 Python3.7+ Web 服务器和 Web 框架，旨在提高性能。 它允许使用 Python3.5 中添加的 `async`/`await` 语法，这使得您的代码有效的避免阻塞从而达到提升响应速度的目的。

|         |                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Build   | [![Build Status][1]][1] [![AppVeyor Build Status][3]][2] [![Codecov]][3]                                                      |
| Docs    | [![Documentation]][4]                                                                                                         |
| Package | [![PyPI][7]][5] [![PyPI version][9]][5] [![PyPI Wheel][11]][6] [![Supported implementations][13]][6] [![Code style black]][7] |
| Support | [![Forums][16]][8] [![Join the chat at <https://gitter.im/sanic-pytho][18]][9] [![Awesome Sanic List]][10]                    |
| Stats   | [![Downloads][21]][11] [![Downloads][23]][11]                                                                                 |

## 它是什么？

首先，在入坑之前， 您应该知道 Sanic 框架和其他的框架相比是与众不同的。

Right there in that first sentence there is a huge mistake because Sanic is _both_ a **framework** and a **web server**. In the deployment section we will talk a little bit more about this.

但是，请记住，Sanic 具备开箱即用的功能，它可以用于编写，部署和扩展生产级 Web 应用程序。 :rocket:

## 目标(Goal)

> 提供一种简单且快速，集创建和启动于一体的方法，来实现一个易于修改和拓展的 HTTP 服务
## 特征(Features)

---:1

### Core

- 哦，纠正一下，就在上面的那一句中，隐藏了一个巨大的错误，因为 Sanic 不仅仅是一个 **框架**，它还是一个 **Web 服务器**， 在后面的 **部署** 环节中，我们将仔细地探讨这个问题。
- 生产准备就绪
- 极高的拓展性
- 支持 ASGI
- 简单直观的 API 设计
- 社区保障

:--:1

### Sanic Extensions [[learn more](../plugins/sanic-ext/getting-started.md)]

- CORS protection
- Template rendering with Jinja
- Dependency injection into route handlers
- OpenAPI documentation with Redoc and/or Swagger
- Predefined, endpoint-specific response serializers
- Request query arguments and body input validation
- Auto create `HEAD`, `OPTIONS`, and `TRACE` endpoints

:---



## 赞助商(Sponsor)

请查看 [open collective](https://opencollective.com/sanic-org) 来了解更多关于资助 Sanic 的信息。


## 加入社区(Join the Community)

Sanic 的主要讨论渠道是通过 [社区论坛](https://community.sanicframework.org/) 当然也有 [Discord Server](https://discord.gg/FARQzAEMAA) 但是我们更喜欢使用社区论坛，因为这样可以使我们更方便在未来管理历史讨论记录。 There also is a [Discord Server](https://discord.gg/FARQzAEMAA) for live discussion and chat.

项目维护人员正在积极监视 Stackoverflow 的 `[sanic]` 标签，[点此](https://stackoverflow.com/questions/tagged/sanic) 快速访问。

## 贡献(Contribution)

我们非常欢迎新的贡献者加入。 我们已经为那些希望加入的人提供了 [标记好的问题](https://github.com/sanic-org/sanic/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner)，并欢迎您在 [论坛](https://community.sanicframework.org/) 上进行提问/讨论/解答。 详情请查看我们的 [贡献准则](https://github.com/sanic-org/sanic/blob/master/CONTRIBUTING.rst)

## 我们是谁(who we are)

<Contributions />

[1]: https://travis-ci.com/sanic-org/sanic.svg?branch=master
[9]: https://img.shields.io/pypi/pyversions/sanic.svg
[23]: https://pepy.tech/badge/sanic/week
[21]: https://pepy.tech/badge/sanic/month
[18]: https://img.shields.io/discord/812221182594121728?logo=discord
[16]: https://img.shields.io/badge/forums-community-ff0068.svg
[11]: https://img.shields.io/pypi/wheel/sanic.svg
[13]: https://img.shields.io/pypi/implementation/sanic.svg
[3]: https://ci.appveyor.com/api/projects/status/d8pt3ids0ynexi8c/branch/master?svg=true
[7]: https://img.shields.io/pypi/v/sanic.svg
[1]: https://travis-ci.com/sanic-org/sanic
[2]: https://ci.appveyor.com/project/sanic-org/sanic
[3]: https://codecov.io/gh/sanic-org/sanic
[4]: http://sanic.readthedocs.io/en/latest/?badge=latest
[5]: https://pypi.python.org/pypi/sanic/
[5]: https://pypi.python.org/pypi/sanic/
[6]: https://pypi.python.org/pypi/sanic
[6]: https://pypi.python.org/pypi/sanic
[7]: https://github.com/ambv/black
[8]: https://community.sanicframework.org/
[9]: https://discord.gg/FARQzAEMAA
[10]: https://github.com/mekicha/awesome-sanic
[11]: https://pepy.tech/project/sanic
[11]: https://pepy.tech/project/sanic
