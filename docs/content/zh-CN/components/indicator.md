---
title: Indicator
description: 表示状态的小圆点。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/indicator/Indicator.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/indicator/indicator.variants.ts
---

<Demo name="indicator/hero" />

## 用法 {#usage}

```ts
import { Indicator } from '@hikarinagi/ui'
```

圆点只有颜色，没有文字。放在文字前表示该项的状态，或者用 `Badge` 钉在头像的角上表示在线状态。

<Demo name="indicator/basic" />

## 示例 {#examples}

### 色调 {#tones}

共六种色调，默认为 `neutral`。

<Demo name="indicator/tones" />

### 尺寸 {#sizes}

三档尺寸，默认为 `md`。

<Demo name="indicator/sizes" />

### 脉冲 {#pulse}

设置 `pulse` 后圆点向外扩散光晕，表示正在进行的状态，例如连载中、直播中。

<Demo name="indicator/pulse" />

### 朗读文字 {#label}

圆点旁边没有说明状态的文字时，用 `label` 提供屏幕阅读器朗读的文字。

<Demo name="indicator/label" />

### 钉在头像上 {#badge}

用 `Badge` 的 `bare` 模式把圆点钉在头像的角上，圆点放入 `content` 插槽。

<Demo name="indicator/badge" />

## 行为 {#behavior}

- 圆点不可交互，也不随宿主的状态变化。
- 系统开启减弱动态效果时，`pulse` 的光晕不显示。

## 无障碍 {#a11y}

- 没有 `label` 时圆点对辅助技术隐藏，状态应当由旁边的文字说明。
- 设置 `label` 后屏幕阅读器朗读该文字，例如“在线”。

## API {#api}

### Props {#props}

| 属性    | 类型                                                                    | 默认值      | 说明                 |
| ------- | ----------------------------------------------------------------------- | ----------- | -------------------- |
| `tone`  | `'neutral' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | 色调                 |
| `size`  | `'sm' \| 'md' \| 'lg'`                                                  | `'md'`      | 尺寸                 |
| `pulse` | `boolean`                                                               | `false`     | 是否向外扩散光晕     |
| `label` | `string`                                                                | —           | 屏幕阅读器朗读的文字 |
| `as`    | `string`                                                                | `'span'`    | 渲染的标签           |
| `class` | `string`                                                                | —           | 追加至根元素的类名   |
