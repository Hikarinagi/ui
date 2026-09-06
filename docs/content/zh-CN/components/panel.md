---
title: Panel
description: 带有标准标题栏的卡片，标题、计数与操作各有固定位置。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/panel/Panel.vue
---

<Demo name="panel/hero" />

## 用法 {#usage}

```ts
import { Panel } from '@hina-ui/vue'
```

面板是一张 [Card](/components/card) 加一条标准标题栏：`title` 是标题，`description` 是标题下方的说明，`count` 在标题旁显示计数，`icon` 插槽放置标题前的图标，`actions` 插槽放置标题行末尾的操作，默认插槽是正文。同一页面中的各个面板因此外观一致，不必逐个手写标题行。

<Demo name="panel/basic" />

## 示例 {#examples}

### 操作 {#actions}

`actions` 插槽通常放置一两个小号按钮或一个链接。

<Demo name="panel/actions" />

### 图标与计数 {#count}

`icon` 插槽的图标显示在标题前，`count` 显示在标题后；两者都是为标题补充信息，不改变标题的层级。

<Demo name="panel/count" />

### 说明文字 {#description}

`description` 显示在标题下方，用一句话说明该区块的内容。

<Demo name="panel/description" />

### 无内边距的正文 {#unpadded}

`padded` 设为 `false` 时正文不带内边距，列表、表格这类自带行边距的内容可以贴至卡片边缘。

<Demo name="panel/unpadded" />

### 标题层级 {#level}

`level` 决定标题渲染为 `h2`、`h3` 还是 `h4`，默认 `h2`；页面中只有一个 `h1`，面板的标题从二级开始，嵌套在另一个区块内时再降一级。

<Demo name="panel/level" />

## 无障碍 {#a11y}

- 标题是真正的标题元素，层级由 `level` 决定，辅助技术可以按标题跳转。
- 图标只是装饰，对辅助技术隐藏；计数以文字呈现。

## API {#api}

### Props {#props}

| 属性          | 类型          | 默认值 | 说明             |
| ------------- | ------------- | ------ | ---------------- |
| `title`       | `string`      | —      | 必填。标题       |
| `description` | `string`      | —      | 标题下方的说明   |
| `count`       | `number`      | —      | 标题旁的计数     |
| `level`       | `2 \| 3 \| 4` | `2`    | 标题的层级       |
| `padded`      | `boolean`     | `true` | 正文是否带内边距 |
| `class`       | `string`      | —      | 追加至卡片的类名 |

### 插槽 {#slots}

| 插槽          | 说明             |
| ------------- | ---------------- |
| default       | 正文             |
| `icon`        | 标题前的图标     |
| `title`       | 标题内容         |
| `description` | 说明内容         |
| `actions`     | 标题行末尾的操作 |
