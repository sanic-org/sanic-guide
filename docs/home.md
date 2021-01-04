# Sanic

?> **UNDER CONSTRUCTION**  :construction_worker: These documents are still under construction. Ultimately they will replace the docs at readthedocs, and that page will be strictly API documentation. Any suggestions or support will be welcome [at the repo](https://github.com/huge-success/sanic-guide).
Final version expected to conincide with 21.3 release.  
*Updated January 2021*

Sanic is a Python 3.6+ web server and web framework that’s written to go fast. It allows the usage of the async/await syntax added in Python 3.5, which makes your code non-blocking and speedy.

|         |                                                                                                                         |
|---------|-------------------------------------------------------------------------------------------------------------------------|
| Build   | [![Build Status][]][1] [![AppVeyor Build Status][]][2] [![Codecov]][3]                                                  |
| Docs    | [![Documentation]][4]                                                                                                   |
| Package | [![PyPI][]][5] [![PyPI version][]][5] [![PyPI Wheel][]][6] [![Supported implementations][]][6] [![Code style black]][7] |
| Support | [![Forums][]][8] [![Join the chat at <https://gitter.im/sanic-python/Lobby>][]][9] [![Awesome Sanic List]][10]          |
| Stats   | [![Downloads][]][11] [![Downloads][12]][11]                                                                             |

## What is it?

First things first, before you jump in the water, you should know that Sanic is different than other frameworks.

Right there in that first sentence there is a huge mistake because Sanic is _both_ a **framework** and a **web server**. In the [deployment](/deployment) section we will talk a little bit more about this. 

But, remember, out of the box Sanic comes with everything you need to write, deploy, and scale a production grade web application. :rocket:

## Goal

> To provide a simple way to get up and running a highly performant HTTP server that is easy to build, to expand, and ultimately to scale.
## Features

<!-- panels:start -->
<!-- div:left-panel -->
- Built in _fast_ web server
- Production ready
- Highly scalable
- ASGI compliant
- Simple and intuitive API design
- By the community, for the community
<!-- div:right-panel -->

<!-- panels:end -->



## Join the Community

The main channel for discussion is at the [community forums]([https://](https://community.sanicframework.org/). There also is a [Gitter channel](https://gitter.im/sanic-python/Lobby), but we prefer to use the discourse board since it makes history more searchable in the future.

The Stackoverflow `[sanic]` tag is [actively monitored](https://stackoverflow.com/questions/tagged/sanic) by project maintainers.

## Contribution

We are always happy to have new contributions. We have [marked issues good for anyone looking to get started](https://github.com/huge-success/sanic/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner), and welcome [questions/answers/discussion on the forums](https://community.sanicframework.org/). Please take a look at our [Contribution guidelines](https://sanic.readthedocs.io/en/latest/sanic/contributing.html).

[Build Status]: https://travis-ci.com/huge-success/sanic.svg?branch=master
[1]: https://travis-ci.com/huge-success/sanic
[AppVeyor Build Status]: https://ci.appveyor.com/api/projects/status/d8pt3ids0ynexi8c/branch/master?svg=true
[2]: https://ci.appveyor.com/project/huge-success/sanic
[Codecov]: https://codecov.io/gh/huge-success/sanic/branch/master/graph/badge.svg
[3]: https://codecov.io/gh/huge-success/sanic
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
