---
title: Tag
description: 标注状态、分类与属性的短标签。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tag/Tag.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tag/tag.variants.ts
---

<Demo name="tag/hero" />

## 用法 {#usage}

```ts
import { Tag } from '@hikarinagi/ui'
```

标签渲染为 `span`，内容放在默认插槽中。

标签只做标注，没有点击、选中与移除。需要点击触发操作时使用 `Button`。

<Demo name="tag/basic" />

## 示例 {#examples}

### 变体 {#variants}

共三种：`soft` 带浅色底，`solid` 带实心底，`outline` 只有边框。默认为 `soft`。

同一处列表中的标签应当使用同一种变体，只用色调区分含义。

<Demo name="tag/variants" />

### 色调 {#tones}

共六种色调。`neutral` 用于分类与属性，其余五种用于表达状态：`accent` 表示强调，`success` 表示成功，`warning` 表示需要注意，`danger` 表示错误或者失败，`info` 表示补充说明。

<Demo name="tag/tones" />

### 尺寸 {#sizes}

`sm` 用于列表与表格，与正文并排时高度更协调；`md` 用于详情页的标题旁。

<Demo name="tag/sizes" />

### 胶囊 {#pill}

设置 `pill` 之后两端变为半圆。

<Demo name="tag/pill" />

### 带图标 {#icons}

图标直接放入默认插槽，位于文字之前，尺寸随标签的尺寸变化。

<Demo name="tag/icons" />

### 超长内容 {#truncate}

标签内的文字不换行。内容可能很长时，为标签设置最大宽度，并让内部的文字截断。

<Demo name="tag/truncate" />

### 语义标签 {#as}

`as` 换掉渲染出来的标签。一组标签在语义上是列表，容器用 `ul`，每个标签用 `li`。它只改变标签名，不会让标签变成可点击的控件：需要点击或者删除的标签是 Chip，不是 Tag。

<Demo name="tag/as" />

## 无障碍 {#a11y}

- 标签本身是普通文本，不带角色，屏幕阅读器按正文朗读。
- 颜色不能作为唯一的区分方式，文字应当说明状态本身，例如“已驳回”而不只是红色。
- 标签不可聚焦，键盘操作不会停留在它上面。

## API {#api}

### Props {#props}

| 属性      | 类型                                                                    | 默认值      | 说明               |
| --------- | ----------------------------------------------------------------------- | ----------- | ------------------ |
| `variant` | `'soft' \| 'solid' \| 'outline'`                                        | `'soft'`    | 视觉样式           |
| `tone`    | `'neutral' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | 语义色调           |
| `size`    | `'sm' \| 'md'`                                                          | `'sm'`      | 尺寸               |
| `pill`    | `boolean`                                                               | `false`     | 是否呈胶囊形       |
| `as`      | `string`                                                                | `'span'`    | 渲染出来的标签     |
| `class`   | `string`                                                                | —           | 追加至根元素的类名 |

### Slots {#slots}

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 标签的图标与文字 |
