---
pageClass: intro
---

# 介绍

::: warning 🚧正在施工🚧  

这些文件仍在建设中。它最终将会取代 readthedocs 上的文档。另外该文档将是严格的API文档。欢迎在                                                       [Github仓库](https://github.com/sanic-org/sanic-guide) 或 [论坛](https://community.sanicframework.org/t/frontpage-and-documentation-overhaul/770) 上提出任何建议 或 提供任何支持。

最终版本预计将与21.3版本一致。

*更新于 2021 年 1 月*
:::

Sanic 是 Python 3.6+ Web 服务器和 Web 框架，旨在提高性能。它允许使用 Python 3.5 中添加的 `async`/`await`等待语法，这使得您的代码有效的避免阻塞从而达到提升响应速度的目的。

|         |                                                                                                                         |
|---------|-------------------------------------------------------------------------------------------------------------------------|
| Build   | [![Build Status][]][1] [![AppVeyor Build Status][]][2] [![Codecov]][3]                                                  |
| Docs    | [![Documentation]][4]                                                                                                   |
| Package | [![PyPI][]][5] [![PyPI version][]][5] [![PyPI Wheel][]][6] [![Supported implementations][]][6] [![Code style black]][7] |
| Support | [![Forums][]][8] [![Join the chat at <https://gitter.im/sanic-python/Lobby>][]][9] [![Awesome Sanic List]][10]          |
| Stats   | [![Downloads][]][11] [![Downloads][12]][11]                                                                             |

## 它是什么?

首先，在入坑之前， 你应该知道 Sanic 框架和其他的框架相比是与众不同的。

哦，纠正一下，就在上面的那一句中，隐藏了一个巨大的错误，因为 Sanic 不仅仅是一个 **框架**，它还是一个 **Web 服务器**， 在后面的 **部署** 环节中，我们将仔细地探讨这个问题。

但是，请记住，Sanic具备开箱即用的功能，它可以用于编写，部署和扩展生产级Web应用程序​ :rocket:。 

## 目标

> 提供一种简单且快速，集创建和启动于一体的方法，来实现一个易于修改和拓展的 HTTP 服务
## 特征

---:1

- 内置极速 web server
- 生产准备就绪
- 极高的拓展性
- 支持 ASGI 
- 简单直观的 API 设计
- 社区保障
:--:1

:---



## 加入社区

Sanic 的主要讨论渠道是通过 [社区论坛](https://community.sanicframework.org/)  当然也有 [Gitter 频道](https://gitter.im/sanic-python/Lobby) 但是我们更喜欢使用社区论坛，因为这样可以使我们更方便在未来管理历史讨论记录。

项目维护人员正在积极监视  Stackoverflow  `[sanic]标签`， 点此 [快速访问](https://stackoverflow.com/questions/tagged/sanic)

## 贡献

我们总是很高兴有新的贡献。 我们已经为那些希望入门的人提供了 [标记好的问题](https://github.com/sanic-org/sanic/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner)，并欢迎您在[论坛上的问题/解答/讨论](https://community.sanicframework.org/)。 请查看我们的[贡献准则](https://sanic.readthedocs.io/en/latest/sanic/contributing.html)。

[Build Status]: https://travis-ci.com/sanic-org/sanic.svg?branch=master
[1]: https://travis-ci.com/sanic-org/sanic
[AppVeyor Build Status]: https://ci.appveyor.com/api/projects/status/d8pt3ids0ynexi8c/branch/master?svg=true
[2]: https://ci.appveyor.com/project/sanic-org/sanic
[Codecov]: https://codecov.io/gh/sanic-org/sanic/branch/master/graph/badge.svg
[3]: https://codecov.io/gh/sanic-org/sanic
[Documentation]: https://readthedocs.org/projects/sanic/badge/?version=latest
[4]: http://sanic.readthedocs.io/en/latest/?badge=latest
[PyPI]: https://img.shields.io/pypi/v/sanic.svg
[5]: https://pypi.python.org/pypi/sanic/
[PyPI version]: https://img.shields.io/pypi/pyversions/sanic.svg
[PyPI Wheel]: https://img.shields.io/pypi/wheel/sanic.svg
[6]: https://pypi.python.org/pypi/sanic
[Supported implementations]: https://img.shields.io/pypi/implementation/sanic.svg
[Code style black]: https://img.shields.io/badge/code%20style-black-000000.svg
[7]: https://github.com/ambv/black
[Forums]: https://img.shields.io/badge/forums-community-ff0068.svg
[8]: https://community.sanicframework.org/
[Join the chat at <https://gitter.im/sanic-python/Lobby>]: https://badges.gitter.im/sanic-python/Lobby.svg
[9]: https://gitter.im/sanic-python/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[Awesome Sanic List]: https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg
[10]: https://github.com/mekicha/awesome-sanic
[Downloads]: https://pepy.tech/badge/sanic/month
[11]: https://pepy.tech/project/sanic
[12]: https://pepy.tech/badge/sanic/week
