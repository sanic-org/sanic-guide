---
pageClass: intro
---

# 소개

Sanic은 빠르게 작동하도록 작성된 Python 3.7+ 웹 서버 및 웹 프레임워크입니다. Python 3.5에 추가된 async / await 구문을 사용할 수 있어 코드가 차단(Blocking)되지 않고 빠릅니다.

|         |                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Build   | [![Build Status][1]][1] [![AppVeyor Build Status][3]][2] [![Codecov]][3]                                                      |
| Docs    | [![Documentation]][4]                                                                                                         |
| Package | [![PyPI][7]][5] [![PyPI version][9]][5] [![PyPI Wheel][11]][6] [![Supported implementations][13]][6] [![Code style black]][7] |
| Support | [![Forums][16]][8] [![Discord][18]][9] [![Awesome Sanic List]][10]                                                            |
| Stats   | [![Downloads][21]][11] [![Downloads][23]][11]                                                                                 |

## 이게 뭔가요?

Sanic에 뛰어들기 전에, Sanic이 다른 프레임워크들과 다르다는 것을 알아야 합니다.

맨 위의 가장 첫 번째 문장에 큰 실수가 있습니다. 바로 Sanic은 **프레임워크**_이면서_ **웹 서버**이기 때문입니다. 배포 섹션에서 이에 대해 조금 더 이야기 할 것입니다.

그러나 기본적으로 Sanic은 프로덕션 등급의 웹 애플리케이션을 작성, 배포 및 확장하는 데 필요한 모든 것을 제공합니다. :rocket:

## 목표

> 구축, 확장 및 궁극적으로 확장이 쉬운 고성능 HTTP 서버를 시작하고 실행하는 간단한 방법을 제공합니다.
## 기능들

---:1

### Core

- _빠른_ 웹 서버 내장
- 프로덕션 준비
- 뛰어난 확장성
- ASGI 준수
- 간단하고 직관적인 API 디자인
- 커뮤니티에 의한, 커뮤니티를 위해 :--:1

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



## 스폰서

[오픈 콜렉티브](https://opencollective.com/sanic-org)를 확인하여 Sanic 자금 지원에 대해 자세히 알아보세요.


## 커뮤니티에 참가

토론을 위한 메인 채널은 [커뮤니티 포럼](https://community.sanicframework.org/)입니다. 또한 [디스코드 서버](https://discord.gg/FARQzAEMAA)에서 실시간 토론 및 채팅이 가능합니다.

Stackoverflow의 `[sanic]` 태그는 프로젝트 유지보수자들에 의해 [적극적으로 모니터링](https://stackoverflow.com/questions/tagged/sanic)되고 있습니다.

## 기여

우리는 새로운 기여를 받을 때마다 기쁩니다. 저희는 [기여하려는 사용자들에게 유용하도록 이슈에 마크를 해두었습니다](https://github.com/sanic-org/sanic/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner), 그리고 [포럼에서의 질문/답변/토론](https://community.sanicframework.org/)을 환영합니다. 저희의 [기여 가이드라인](https://github.com/sanic-org/sanic/blob/master/CONTRIBUTING.rst)을 확인해주세요.

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
