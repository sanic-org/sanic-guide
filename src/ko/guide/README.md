---
pageClass: intro
---

# 소개

Sanic은 빠르게 작동하도록 작성된 Python 3.7+ 웹 서버 및 웹 프레임워크입니다. Python 3.5에 추가된 async / await 구문을 사용할 수 있어 코드가 차단(Blocking)되지 않고 빠릅니다.

|         |                                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------- |
| Build   | [![Build Status][]][1] [![AppVeyor Build Status][]][2] [![Codecov]][3]                                                  |
| Docs    | [![Documentation]][4]                                                                                                   |
| Package | [![PyPI][]][5] [![PyPI version][]][5] [![PyPI Wheel][]][6] [![Supported implementations][]][6] [![Code style black]][7] |
| Support | [![Forums][]][8] [![Discord][]][9] [![Awesome Sanic List]][10]                                                          |
| Stats   | [![Downloads][]][11] [![Downloads][12]][11]                                                                             |

## 이게 뭔가요?

Sanic에 뛰어들기 전에, Sanic이 다른 프레임워크들과 다르다는 것을 알아야합니다.

바로 저 첫 번째 문장에 큰 실수가 있었습니다. 왜냐하면 Sanic은 **프레임워크**이자 **웹 서버**입니다. 배포 섹션에서 이에 대해 조금 더 이야기 할 것입니다.

그러나 기본적으로 Sanic은 프로덕션 등급의 웹 애플리케이션을 작성, 배포 및 확장하는 데 필요한 모든 것을 제공합니다. :rocket:

## 목표

> 구축, 확장 및 궁극적으로 확장이 쉬운 고성능 HTTP 서버를 시작하고 실행하는 간단한 방법을 제공합니다.

## 기능들

---:1

- _빠른_ 웹 서버 내장
- 프로덕션 준비
- 뛰어난 확장성
- ASGI 준수
- 간단하고 직관적인 API 디자인
- 커뮤니티에 의한, 커뮤니티를 위해
:--:1

:---

## 스폰서

[![CodeStream을 시도해보세요][]][99]

전체 소스 트리 컨텍스트를 사용하여 IDE에서 pull 요청을 관리하고 코드 검토를 수행합니다. diff뿐만 아니라 모든 줄에 주석을 추가하십시오. 더 많은 워크 플로에서 정의로 이동, 즐겨 찾는 키 바인딩 및 코드 인텔리전스를 사용하십시오.

[자세히 보기](https://codestream.com/?utm_source=github&amp;utm_campaign=sanicorg&amp;utm_medium=banner)

저희의 스폰서에게 감사합니다. [오픈 콜렉티브](https://opencollective.com/sanic-org)를 확인하여 Sanic 자금 지원에 대해 자세히 알아보십시오.

## 커뮤니티에 참가

토론을 위한 메인 채널은 [커뮤니티 포럼](https://community.sanicframework.org/)입니다. 또한 [디스코드 서버](https://discord.gg/FARQzAEMAA)에서 실시간 토론 및 채팅이 가능합니다.

Stackoverflow의 `[sanic]` 태그는 프로젝트 유지보수자들에 의해 [적극적으로 모니터링](https://stackoverflow.com/questions/tagged/sanic)되고 있습니다.

## 기여

우리는 새로운 기여를 받을 때마다 항상 행복합니다. 저희는 [시작하려는 모든 사용자에게 유용하도록 마크를 해두었습니다](https://github.com/sanic-org/sanic/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner), 그리고 [포럼에서의 질문/답변/토론](https://community.sanicframework.org/)을 환영합니다. 저희의 [기여 가이드라인](https://github.com/sanic-org/sanic/blob/master/CONTRIBUTING.rst)을 확인해주세요.

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
[Discord]: https://img.shields.io/discord/812221182594121728?logo=discord
[9]: https://discord.gg/FARQzAEMAA
[Awesome Sanic List]: https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg
[10]: https://github.com/mekicha/awesome-sanic
[Downloads]: https://pepy.tech/badge/sanic/month
[11]: https://pepy.tech/project/sanic
[12]: https://pepy.tech/badge/sanic/week
[Try CodeStream]: https://alt-images.codestream.com/codestream_logo_sanicorg.png
[99]: https://codestream.com/?utm_source=github&amp;utm_campaign=sanicorg&amp;utm_medium=banner
