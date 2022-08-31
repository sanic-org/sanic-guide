---
pageClass: intro
---

# Introduction

Sanic is a Python 3.7+ web server and web framework that’s written to go fast. It allows the usage of the async/await syntax added in Python 3.5, which makes your code non-blocking and speedy.

|         |                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Build   | [![Build Status][1]][1] [![AppVeyor Build Status][3]][2] [![Codecov]][3]                                                      |
| Docs    | [![Documentation]][4]                                                                                                         |
| Package | [![PyPI][7]][5] [![PyPI version][9]][5] [![PyPI Wheel][11]][6] [![Supported implementations][13]][6] [![Code style black]][7] |
| Support | [![Forums][16]][8] [![Discord][18]][9] [![Awesome Sanic List]][10]                                                            |
| Stats   | [![Downloads][21]][11] [![Downloads][23]][11]                                                                                 |

## What is it?

First things first, before you jump in the water, you should know that Sanic is different than other frameworks.

Right there in that first sentence there is a huge mistake because Sanic is _both_ a **framework** and a **web server**. In the deployment section we will talk a little bit more about this.

But, remember, out of the box Sanic comes with everything you need to write, deploy, and scale a production grade web application. :rocket:

## Goal

> To provide a simple way to get up and running a highly performant HTTP server that is easy to build, to expand, and ultimately to scale.
## Features

---:1

### Core

- Built in, **_fast_** web server
- Production ready
- Highly scalable
- ASGI compliant
- Simple and intuitive API design
- By the community, for the community

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



## Sponsor

Check out [open collective](https://opencollective.com/sanic-org) to learn more about helping to fund Sanic.


## Join the Community

The main channel for discussion is at the [community forums](https://community.sanicframework.org/). There also is a [Discord Server](https://discord.gg/FARQzAEMAA) for live discussion and chat.

The Stackoverflow `[sanic]` tag is [actively monitored](https://stackoverflow.com/questions/tagged/sanic) by project maintainers.

## Contribution

We are always happy to have new contributions. We have [marked issues good for anyone looking to get started](https://github.com/sanic-org/sanic/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner), and welcome [questions/answers/discussion on the forums](https://community.sanicframework.org/). Please take a look at our [Contribution guidelines](https://github.com/sanic-org/sanic/blob/master/CONTRIBUTING.rst).

## Who we are

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
