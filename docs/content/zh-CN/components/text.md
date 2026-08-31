---
title: Text
description: 正文文字，界面上绝大多数文字都用它。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/text/Text.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/text/text.variants.ts
---

<Demo name="text/hero" />

## 用法 {#usage}

```ts
import { Text } from '@hikarinagi/ui'
```

默认渲染为 `p`，正文字号，常规字重。绝大多数情况下不需要设置任何属性。

<Demo name="text/basic" />

## 示例 {#examples}

### 字号 {#sizes}

共七档，从 13 像素到 30 像素。`base` 是正文，`md` 用于导语，`sm` 用于界面上的辅助文字，`xs` 用于徽标一类的微小标签，`lg` 及以上通常交给 `Heading`。

<Demo name="text/sizes" />

### 色调 {#tones}

`default` 是正文色，`muted` 与 `faint` 依次减弱，`disabled` 用于不可用状态，其余四种表达语义。

<Demo name="text/tones" />

### 字重 {#weight}

三档字重。正文用常规，表头与标签用中等，需要强调时用半粗。

<Demo name="text/weight" />

### 截断 {#truncate}

设置 `truncate` 后，超出容器宽度的文字在末尾显示省略号，且不换行。

<Demo name="text/truncate" />

### 渲染的标签 {#as}

`as` 指定渲染成哪个标签。放进句子里时改为 `span`，避免段落打断行内排版。

<Demo name="text/as" />

## 无障碍 {#a11y}

- 色调只改变颜色，不改变语义。仅靠颜色区分的信息应当同时用文字说明。
- `faint` 与 `disabled` 的对比度较低，不要用于需要阅读的正文。

## API {#api}

### Props {#props}

| 属性       | 类型                                                                                                        | 默认值      | 说明                           |
| ---------- | ----------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| `size`     | `'xs' \| 'sm' \| 'base' \| 'md' \| 'lg' \| 'xl' \| '2xl'`                                                   | `'base'`    | 字号                           |
| `tone`     | `'default' \| 'muted' \| 'faint' \| 'disabled' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 色调                           |
| `weight`   | `'normal' \| 'medium' \| 'semibold'`                                                                        | `'normal'`  | 字重                           |
| `truncate` | `boolean`                                                                                                   | `false`     | 是否单行截断并显示省略号       |
| `as`       | `string \| Component`                                                                                       | `'p'`       | 渲染的元素或组件               |
| `asChild`  | `boolean`                                                                                                   | `false`     | 不渲染自身，合并至唯一的子元素 |
| `class`    | `string`                                                                                                    | —           | 追加至根元素的类名             |

### Slots {#slots}

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 文字内容 |
