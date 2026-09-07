---
title: Statistic
description: 突出显示一个关键数字，附带标签与变化。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/statistic/Statistic.vue
---

<Demo name="statistic/hero" />

## 用法 {#usage}

```ts
import { Statistic } from '@hina-ui/vue'
```

`label` 说明这个数字是什么，`value` 是数字本身。数值按当前界面语言的习惯加千分位，字符串则原样显示。组件本身没有边框与底色，放进 [Card](/components/card) 或 [Panel](/components/panel) 里使用。

<Demo name="statistic/basic" />

## 示例 {#examples}

### 变化 {#delta}

`delta` 是相对上一期的变化比例，以带正负号的百分比显示，上升为成功色，下降为危险色，`deltaLabel` 说明比较的对象。对于越低越好的指标，设置 `invert` 反转好坏。

<Demo name="statistic/delta" />

### 数值格式 {#format}

`format` 与 [NumberFormat](/components/number-format) 相同：`compact` 缩写大数，`percent` 显示百分比，`currency` 配合 `currency` 显示货币；`precision` 限制小数位数。

<Demo name="statistic/format" />

### 前缀与后缀 {#affix}

`prefix` 与 `suffix` 以较小的字号贴在数字两侧，用于单位或符号。

<Demo name="statistic/affix" />

### 图标 {#icon}

`icon` 插槽的图标显示在右侧，只是装饰。

<Demo name="statistic/icon" />

### 加载中 {#loading}

`loading` 为真时数字与变化各自以骨架占位，标签保持可见，加载前后布局不跳动。

<Demo name="statistic/loading" />

### 尺寸 {#sizes}

三档只改变数字的字号，`md` 是默认值。

<Demo name="statistic/sizes" />

## 无障碍 {#a11y}

- 标签、数字与变化都是普通文字，按阅读顺序朗读。
- 变化的箭头与右侧图标只是装饰，对辅助技术隐藏；升降由带正负号的百分比表达。

## API {#api}

### Props {#props}

| 属性         | 类型                                                | 默认值      | 说明                      |
| ------------ | --------------------------------------------------- | ----------- | ------------------------- |
| `label`      | `string`                                            | —           | 必填。数字的说明          |
| `value`      | `number \| string \| null`                          | —           | 数值，空值显示破折号      |
| `format`     | `'decimal' \| 'compact' \| 'percent' \| 'currency'` | `'decimal'` | 数值格式                  |
| `currency`   | `string`                                            | —           | 货币代码，配合 `currency` |
| `precision`  | `number`                                            | —           | 最多保留的小数位数        |
| `prefix`     | `string`                                            | —           | 数字前的符号              |
| `suffix`     | `string`                                            | —           | 数字后的单位              |
| `delta`      | `number`                                            | —           | 变化比例，`0.12` 即 12%   |
| `deltaLabel` | `string`                                            | —           | 变化的说明                |
| `invert`     | `boolean`                                           | `false`     | 下降视为好的变化          |
| `loading`    | `boolean`                                           | `false`     | 是否显示骨架              |
| `size`       | `'sm' \| 'md' \| 'lg'`                              | `'md'`      | 数字的字号                |
| `class`      | `string`                                            | —           | 追加至根元素的类名        |

### 插槽 {#slots}

| 插槽    | 说明           |
| ------- | -------------- |
| default | 数字下方的内容 |
| `icon`  | 右侧的图标     |
