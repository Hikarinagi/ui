---
title: Blockquote
description: 引用他处的整段文字，并标明出处。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/blockquote/Blockquote.vue
  - label: Callout
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/callout/Callout.vue
---

<Demo name="blockquote/hero" />

## 用法 {#usage}

```ts
import { Blockquote } from '@hikarinagi/ui'
```

组件渲染为原生的 `blockquote`，起始一侧带一条竖线，文字使用次级颜色，与正文拉开距离。

<Demo name="blockquote/basic" />

## 示例 {#examples}

### 标明出处 {#cite}

`cite` 会在引用的下方生成一行落款，颜色比引用文字更淡。出处可以是人名、书名或者来源链接的说明。

<Demo name="blockquote/cite" />

### 多段引用 {#paragraphs}

默认插槽可以放入多个段落。段落之间的间距由调用方决定。

<Demo name="blockquote/paragraphs" />

### 正文中的引用 {#prose}

`Prose` 会为其中的原生 `blockquote` 套用同一套样式。渲染 Markdown 或者富文本时不需要替换标签。

<Demo name="blockquote/prose" />

## 无障碍 {#a11y}

- 组件渲染为原生的 `blockquote`，屏幕阅读器会按引用朗读。
- `cite` 生成的落款位于 `footer` 中，跟随引用一同朗读。

## API {#api}

### Props {#props}

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `cite`  | `string` | —      | 出处，显示为落款   |
| `class` | `string` | —      | 追加至根元素的类名 |

### Slots {#slots}

| 插槽      | 说明       |
| --------- | ---------- |
| `default` | 引用的正文 |
