---
title: Page
description: 页面内容的骨架，含标题区、正文与侧栏。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/page/Page.vue
---

<Demo name="page/hero" />

## 用法 {#usage}

```ts
import { Page, PageAside, PageBody, PageHeader } from '@hina-ui/vue'
```

`Page` 是页面内容的容器，负责限宽、居中与上下留白。`PageHeader` 是标题区，`PageBody` 是正文区，`PageAside` 是右侧的次要栏，通过 `aside` 插槽传入。

`Page` 与 `AppShell` 是两层：`AppShell` 分的是侧栏、顶部条与主区域，`Page` 分的是主区域内部的结构。两者可以叠用，也可以只用其中一个。

<Demo name="page/basic" />

`PageHeader` 的 `title` 渲染为页面的一级标题，因此一个页面里只应有一个 `PageHeader`。

`size` 决定内容区的最大宽度，透传给内部的 `Container`：`sm` 为 48rem，`md` 为 64rem，`lg` 为 72rem，`xl` 为 80rem，默认 `md`。长文用窄一档，带侧栏的详情页用宽一档。

## 示例 {#examples}

### 标题区 {#header}

`eyebrow` 是标题上方的一行小字，通常放分类或所属；`title` 是标题；`description` 是标题下的一句说明。三者都可省略。

`actions` 插槽放页面级操作，窄屏时落到标题下方、宽屏时移到标题右侧。默认插槽在标题区末尾，用于标签、评分一类紧随标题的内容。

<Demo name="page/header" />

### 侧栏 {#aside}

`PageAside` 用于页内目录、相关条目一类的次要内容。它随页面滚动吸附在顶部，并且在视口窄于 1280 像素时整体不显示，因此不能把只有这里才有的信息放进去。

`label` 会渲染为侧栏的小标题，同时作为该区域的可访问名。

<Demo name="page/aside" />

## 行为 {#behavior}

- `Page` 的直接子节点之间间距为 8 个单位，`PageBody` 的子节点之间为 6 个单位。
- 侧栏与主栏并排，主栏占据剩余宽度，两者间距 10 个单位。
- 侧栏在容器内吸顶，滚动时保持在视口上方。
- 标题区在中等屏幕及以上把操作区移到标题右侧，窄屏时换行到下方。

## 无障碍 {#a11y}

- `PageHeader` 渲染为 `header`，`PageAside` 渲染为 `aside` 地标。
- `title` 是页面的一级标题，一个页面只应出现一次。
- 给 `PageAside` 写 `label` 时，它会生成一个二级标题并通过 `aria-labelledby` 关联，屏幕阅读器的地标列表因此能区分多个侧栏。
- 侧栏在窄屏被隐藏，其中的内容必须在别处也能获得。

## API {#api}

### Page {#props}

| 属性    | 类型                           | 默认值 | 说明             |
| ------- | ------------------------------ | ------ | ---------------- |
| `size`  | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 内容区的最大宽度 |
| `class` | `string`                       | —      | 追加到根元素的类 |

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 页面主栏内容 |
| `aside`   | 右侧的次要栏 |

### PageHeader {#header-api}

| 属性          | 类型     | 默认值 | 说明                     |
| ------------- | -------- | ------ | ------------------------ |
| `eyebrow`     | `string` | —      | 标题上方的一行小字       |
| `title`       | `string` | —      | 页面标题，渲染为一级标题 |
| `description` | `string` | —      | 标题下的说明             |
| `class`       | `string` | —      | 追加到根元素的类         |

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 标题区末尾的内容 |
| `actions` | 页面级操作       |

### PageBody {#body}

| 属性    | 类型     | 默认值 | 说明             |
| ------- | -------- | ------ | ---------------- |
| `class` | `string` | —      | 追加到根元素的类 |

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 正文内容 |

### PageAside {#aside-api}

| 属性    | 类型     | 默认值 | 说明                         |
| ------- | -------- | ------ | ---------------------------- |
| `label` | `string` | —      | 侧栏小标题，同时作为可访问名 |
| `class` | `string` | —      | 追加到根元素的类             |

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 侧栏内容 |
