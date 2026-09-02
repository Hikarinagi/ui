---
title: NumberFormat
description: 按当前语言格式化数字。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/number-format/NumberFormat.vue
  - label: Time
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/time/Time.vue
---

<Demo name="number-format/hero" />

## 用法 {#usage}

```ts
import { NumberFormat } from '@hina-ui/vue'
```

`value` 是要显示的数字。组件按当前语言输出，默认加千位分隔。

<Demo name="number-format/basic" />

## 示例 {#examples}

### 格式 {#formats}

共四档。`decimal` 是普通数字，`compact` 缩写大数，`percent` 把小数显示为百分比，`currency` 需要同时提供 `currency` 代码。

<Demo name="number-format/formats" />

### 小数位 {#precision}

`precision` 限制最多显示几位小数，不足的位数不会补零。

<Demo name="number-format/precision" />

### 随语言变化 {#locale}

输出跟随 `provideUiLocale` 提供的语言。同一个数字在简体中文下按万进位，在英文下按千进位。

<Demo name="number-format/locale" />

### 无效值 {#invalid}

`value` 为 `null`、`NaN` 或者无穷大时显示一条短横线，不会渲染成 `NaN`。

<Demo name="number-format/invalid" />

## 行为 {#behavior}

- `compact` 档会把完整数字写入 `title`，指针悬停即可看到未缩写的数值。
- `currency` 档缺少 `currency` 代码时退回 `decimal`，并在开发环境输出告警。

## 无障碍 {#a11y}

- 组件渲染为 `span`，屏幕阅读器按文本朗读格式化后的结果。
- 缩写会损失精度，完整数值保留在 `title` 中。

## API {#api}

### Props {#props}

| 属性        | 类型                                                | 默认值      | 说明                        |
| ----------- | --------------------------------------------------- | ----------- | --------------------------- |
| `value`     | `number \| null`                                    | —           | 要显示的数字                |
| `format`    | `'decimal' \| 'compact' \| 'percent' \| 'currency'` | `'decimal'` | 输出格式                    |
| `currency`  | `string`                                            | —           | 货币代码，`currency` 档必填 |
| `precision` | `number`                                            | —           | 最多显示的小数位            |
| `class`     | `string`                                            | —           | 追加至根元素的类名          |
