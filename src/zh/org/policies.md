# 策略(Policies)

## 版本号(Versioning)

Sanic 使用 [calendar versioning](https://calver.org/)，别名 "calver"。 具体使用如下格式：

```
YY.MM.MICRO
```

通常来说，版本号是以 `YY.MM` 的格式来进行编排的，小版本号表示从 `0` 开始的增量补丁。 The `MICRO` number indicates an incremental patch version, starting at `0`.

## 发行安排(Release Schedule)

每年有 4 次预定发布：3月，6月，9月，12月。 因此，每年发布 4 个版本：`YY.3`, `YY.6`, `YY.9` 和 `YY.12`。

该发行安排提供:

- 可预测的发布节奏。
- 相对较短的开发期，允许定期发布功能。
- 受控制的 [弃用](#deprecation) 功能。
- 与年度 LTS 版保持一致的稳定性。

我们还将年度发布周期与我们的治理模型结合使用，具体内容请查阅 [S.C.O.P.E.](./scope.md)。

### 长期支持版 v 临时版本(Long term support v Interim releases)

Sanic 将在每年的 12 月发布一次长期支持版本（TLS 版本）TLS 版本会在 24个月内得到错误修复与安全更新。 The LTS releases receive bug fixes and security updates for **24 months**. 每年的 3 个临时发行版本每 3 个月发行一次，并且在后续版本发布之前一直受支持。

| Version    | LTS           | Supported                 |
| ---------- | ------------- | ------------------------- |
| 22.12      | until 2024-12 | :white_check_mark:      |
| 22.9       |               | :x:                       |
| 22.6       |               | :x:                       |
| 22.3       |               | :x:                       |
| 2021-12 为止 | 2022-12 为止    | :ballot_box_with_check: |
| 21.9       |               | :x:                       |
| 21.6       |               | :x:                       |
| 21.3       |               | :x:                       |
| 20.12      |               | :x:                       |
| 20.9       |               | :x:                       |
| 20.6       |               | :x:                       |
| 20.3       |               | :x:                       |
| 19.12      |               | :x:                       |
| 19.9       |               | :x:                       |
| 19.6       |               | :x:                       |
| 19.3       |               | :x:                       |
| 18.12      |               | :x:                       |
| 0.8.3      |               | :x:                       |
| 0.7.0      |               | :x:                       |
| 0.6.0      |               | :x:                       |
| 0.5.4      |               | :x:                       |
| 0.4.1      |               | :x:                       |
| 0.3.1      |               | :x:                       |
| 0.2.0      |               | :x:                       |
| 0.1.9      |               | :x:                       |

:ballot_box_with_check: = 安全/错误 修复 :white_check_mark: = 长期支持

## 弃用(Deprecation)

在一个特性被否决之前，或者在接口中引入突破性的变化之前，它应该被公开，并在两个发布周期中出现弃用警告。 在LTS版本中不得有任何弃用行为。

绝对必要时，可能会在这些准则之外发生中断更新或功能删除的状况。 这些情况应该很少见。 例如，当没有替代方案来解决重大安全问题时，就可能发生这种情况。
