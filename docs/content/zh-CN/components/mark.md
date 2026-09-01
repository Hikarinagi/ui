---
title: Mark
description: 标记文字，用于标出搜索命中或者需要注意的片段。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/mark/Mark.vue
  - label: Tag
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tag/Tag.vue
---

<Demo name="mark/hero" />

## 用法 {#usage}

```ts
import { Mark } from '@hikarinagi/ui'
```

组件渲染为原生的 `mark`，带浅色底与很小的圆角，文字颜色不变，因此在段落中不打断阅读。

<Demo name="mark/basic" />

## 示例 {#examples}

### 标出搜索命中 {#search}

按关键词切分文本，命中的片段用组件包裹。一段文字中可以出现多处标记。

<Demo name="mark/search" />

### 正文中的标记 {#prose}

`Prose` 会为其中的原生 `mark` 标签应用同一套样式。渲染 Markdown 或者富文本时不需要替换标签。

<Demo name="mark/prose" />

## 无障碍 {#a11y}

- 组件渲染为原生的 `mark`，部分屏幕阅读器会播报标记的起止。
- 底色只用于引导视线，不表达状态，因此没有色调。

## API {#api}

### Props {#props}

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `class` | `string` | —      | 追加至根元素的类名 |

### Slots {#slots}

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 被标记的文字 |
