---
title: Time
description: 按当前语言显示时间，可显示为相对时间。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/time/Time.vue
---

<Demo name="time/hero" />

## 用法 {#usage}

```ts
import { Time } from '@hina-ui/vue'
```

`value` 接受时间字符串、时间戳或者 `Date`。组件渲染为原生的 `time`，`datetime` 属性写入 ISO 格式，显示文本按当前语言排版。

<Demo name="time/basic" />

## 示例 {#examples}

### 格式 {#formats}

共四档。`datetime` 同时显示日期与时刻，`date` 与 `time` 各取其一，`relative` 显示相对现在的时间。

<Demo name="time/formats" />

### 相对时间 {#relative}

45 秒以内显示为“刚刚”，更早或更晚按秒、分、时、天、周、月、年逐级换算。措辞取当前语言的自然说法，例如两天之后显示为“后天”。

页面打开期间每 30 秒刷新一次，无需手动更新。指针悬停可以看到完整的日期与时刻。

<Demo name="time/relative" />

### 随语言变化 {#locale}

日期的顺序、月份的写法与相对时间的措辞都跟随 `provideUiLocale` 提供的语言。

<Demo name="time/locale" />

### 无法解析的值 {#invalid}

`value` 为空或者无法解析时显示“未知时间”，并且改为渲染 `span`，不会输出错误的 `datetime`。开发环境下会输出告警。

<Demo name="time/invalid" />

## 无障碍 {#a11y}

- `datetime` 属性始终是完整的 ISO 时间，辅助技术据此获得准确时刻。
- 相对时间会随时间变化，完整时刻保留在 `title` 中。

## API {#api}

### Props {#props}

| 属性     | 类型                                           | 默认值       | 说明               |
| -------- | ---------------------------------------------- | ------------ | ------------------ |
| `value`  | `string \| number \| Date \| null`             | —            | 要显示的时间       |
| `format` | `'datetime' \| 'date' \| 'time' \| 'relative'` | `'datetime'` | 显示格式           |
| `class`  | `string`                                       | —            | 追加至根元素的类名 |
