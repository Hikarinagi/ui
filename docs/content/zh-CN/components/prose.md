---
title: Prose
description: 富文本容器，统一接管其中的原生标签。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/prose/Prose.vue
---

<Demo name="prose/hero" />

## 用法 {#usage}

```ts
import { Prose } from '@hina-ui/vue'
```

把一段 HTML 放入容器，其中的原生标签自动获得排版样式。渲染 Markdown、接口返回的富文本或编辑器产出的内容时使用它。

<Demo name="prose/basic" />

## 示例 {#examples}

### 接管的标签 {#elements}

标题、段落、列表、描述列表、引用、代码、表格、分隔线、标记与按键都在接管范围内，呈现与对应组件一致。

<Demo name="prose/elements" />

### 容器标签 {#as}

`as` 指定渲染成哪个标签，默认为 `div`。整篇文章可以用 `article`。

<Demo name="prose/as" />

### 首尾外边距 {#spacing}

元素之间有纵向间距，但容器内第一个元素的上外边距与最后一个元素的下外边距会被清除，因此放入卡片时不会多出一段空白。

<Demo name="prose/spacing" />

## 行为 {#behavior}

- 行高为 1.7，长单词与长链接会换行，不会撑破容器。
- 接管只作用于容器内的原生标签，容器外不受影响。

## API {#api}

### Props {#props}

| 属性      | 类型                  | 默认值  | 说明                           |
| --------- | --------------------- | ------- | ------------------------------ |
| `as`      | `string \| Component` | `'div'` | 渲染的元素或组件               |
| `asChild` | `boolean`             | `false` | 不渲染自身，合并至唯一的子元素 |
| `class`   | `string`              | —       | 追加至根元素的类名             |

### Slots {#slots}

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 富文本的内容 |
