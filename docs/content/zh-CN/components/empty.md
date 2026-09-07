---
title: Empty
description: 一块区域没有内容时的占位，说明为什么空以及接下来能做什么。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/empty/Empty.vue
---

<Demo name="empty/hero" />

## 用法 {#usage}

```ts
import { Empty } from '@hina-ui/vue'
```

`title` 用一句话说明这里为什么是空的，`description` 补充下一步能做什么。图标、文字与操作从上到下居中排列，组件占满所在容器的宽度。

<Demo name="empty/basic" />

## 示例 {#examples}

### 操作 {#actions}

`actions` 插槽放置让用户脱离空状态的操作，通常是一个主要按钮，或者再加一个次要按钮。

<Demo name="empty/actions" />

### 图标 {#icon}

默认图标是一个收件箱。`icon` 插槽换成更贴合场景的图标，例如搜索无结果时用带叉的放大镜；设为 `false` 时不显示图标。

<Demo name="empty/icon" />

### 插图 {#illustration}

`icon` 插槽也可以放图片。放入插槽的内容不再套圆形底色，尺寸由内容自己决定。

<Demo name="empty/illustration" />

### 尺寸 {#sizes}

三档尺寸同时改变图标、文字与内边距：`sm` 用于卡片内的小区域，`md` 是默认值，`lg` 用于整页的空状态。

<Demo name="empty/sizes" />

### 放在面板里 {#panel}

作为列表或表格的空态时，直接放进 [Panel](/components/panel) 或 [Card](/components/card) 的正文即可。

<Demo name="empty/panel" />

## 无障碍 {#a11y}

- 图标与插图只是装饰，对辅助技术隐藏；标题与说明以普通文字呈现。
- 操作区的按钮沿用各自的无障碍名，不需要额外标注。

## API {#api}

### Props {#props}

| 属性          | 类型                   | 默认值 | 说明               |
| ------------- | ---------------------- | ------ | ------------------ |
| `title`       | `string`               | —      | 标题               |
| `description` | `string`               | —      | 标题下方的说明     |
| `icon`        | `boolean`              | `true` | 是否显示默认图标   |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸               |
| `class`       | `string`               | —      | 追加至根元素的类名 |

### 插槽 {#slots}

| 插槽      | 说明                     |
| --------- | ------------------------ |
| default   | 文字下方的额外内容       |
| `icon`    | 替换默认图标的图标或插图 |
| `actions` | 最下方的操作             |
