---
title: List
description: 有序列表与无序列表。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/list/List.vue
  - label: DescriptionList
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/description-list/DescriptionList.vue
---

<Demo name="list/hero" />

## 用法 {#usage}

```ts
import { List } from '@hikarinagi/ui'
```

默认渲染为 `ul`，条目写作 `li`。列表带有缩进，项目符号使用比正文更淡的颜色。

<Demo name="list/basic" />

## 示例 {#examples}

### 有序列表 {#ordered}

设置 `ordered` 渲染为 `ol`，项目符号变为序号。

<Demo name="list/ordered" />

### 嵌套 {#nested}

条目中可以嵌套列表，缩进逐层累加。

<Demo name="list/nested" />

### 序号的起点与方向 {#numbering}

组件不拦截属性，`ol` 的原生属性可以直接书写：`start` 指定起始序号，`reversed` 让序号递减。

<Demo name="list/numbering" />

### 正文中的列表 {#prose}

`Prose` 会为其中的原生 `ul` 与 `ol` 应用同一套样式。渲染 Markdown 或者富文本时不需要替换标签。

<Demo name="list/prose" />

## 无障碍 {#a11y}

- 组件渲染为原生的 `ul` 或者 `ol`，屏幕阅读器会播报条目数量。
- 条目必须是列表的直接子元素，中间不要插入其他容器。

## API {#api}

### Props {#props}

| 属性      | 类型      | 默认值  | 说明               |
| --------- | --------- | ------- | ------------------ |
| `ordered` | `boolean` | `false` | 是否渲染为有序列表 |
| `class`   | `string`  | —       | 追加至根元素的类名 |

其余属性传递至根元素，例如 `start` 与 `reversed`。

### Slots {#slots}

| 插槽      | 说明       |
| --------- | ---------- |
| `default` | 列表的条目 |
