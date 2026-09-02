---
title: Section
description: 带标题的内容分节。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/section/Section.vue
---

<Demo name="section/hero" />

## 用法 {#usage}

```ts
import { Section } from '@hina-ui/vue'
```

`Section` 把一段内容连同它的标题归为一节。`title` 渲染为二级标题，节内的子元素之间保持统一间距。

它通常放在 `PageBody` 里，一页由若干节纵向排开。节与节之间的间距由 `PageBody` 决定，节内的由 `Section` 决定。

<Demo name="section/basic" />

## 示例 {#examples}

### 不带标题 {#untitled}

不写 `title` 时不渲染标题，只保留分组语义与内部间距。用于一段无需命名、但仍应独立成节的内容。

<Demo name="section/untitled" />

### 锚点定位 {#anchor}

写上 `id` 即可成为锚点目标，配合 `Anchor` 使用。节自带滚动落点的上边距，跳转后标题不会紧贴容器顶缘。

<Demo name="section/anchor" />

## 行为 {#behavior}

- 渲染为 `section` 元素，子元素纵向排列，间距 4 个单位。
- 标题固定为二级标题，不随嵌套层级变化。
- 滚动定位时在顶部留出 6 个单位的余量。

## 无障碍 {#a11y}

- `section` 元素只有在具备可访问名时才被视为地标，因此写了 `title` 的节会被屏幕阅读器列入地标，未写的不会。
- 标题层级固定为二级，页面的一级标题应当来自 `PageHeader`。

## API {#api}

### Props {#props}

| 属性    | 类型     | 默认值 | 说明                   |
| ------- | -------- | ------ | ---------------------- |
| `title` | `string` | —      | 节标题，渲染为二级标题 |
| `id`    | `string` | —      | 元素 id，用作锚点目标  |
| `class` | `string` | —      | 追加到根元素的类       |

### Slots {#slots}

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 节内内容 |
