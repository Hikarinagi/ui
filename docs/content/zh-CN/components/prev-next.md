---
title: PrevNext
description: 页面底部通往相邻两页的一对链接。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/prev-next/PrevNext.vue
---

<Demo name="prev-next/hero" />

## 用法 {#usage}

```ts
import { PrevNext, PrevNextLink } from '@hina-ui/vue'
```

`PrevNext` 是导航地标与两栏容器，`PrevNextLink` 是其中一侧的链接。`direction` 必填，取 `prev` 或 `next`，它决定链接落在哪一栏、箭头朝向，以及默认的提示文字。

默认插槽是目标页面的标题，提示文字（「上一页」「下一页」）由组件按 `direction` 与界面语言给出。

<Demo name="prev-next/basic" />

它用于线性阅读顺序中的前后相邻页，例如文档的上下篇、小说的上下章。分页器与筛选结果的翻页是另一回事，不用这个组件。

## 示例 {#examples}

### 只有一侧 {#single}

首尾两页只有一个方向可去，此时只放一个 `PrevNextLink` 即可。`next` 始终占据右栏，因此单独出现时仍然靠右，与两侧齐全时的位置一致。

<Demo name="prev-next/single" />

### 文案 {#label}

`PrevNextLink` 的 `label` 覆盖提示文字，`PrevNext` 的 `label` 覆盖导航地标的无障碍名。两者都有随界面语言给出的默认值，按内容层级改写即可，例如把「上一页」改为「上一卷」。

<Demo name="prev-next/label" />

### 路由链接 {#router}

`as` 指定渲染为何种元素，默认为 `a`。传入路由组件即可获得客户端跳转，`to` 等属性会透传过去。

<Demo name="prev-next/router" />

## 行为 {#behavior}

- 窄屏单栏排布，`sm` 断点及以上分为两栏。
- `prev` 内容靠左，`next` 内容靠右，箭头分别位于文字的外侧。
- `next` 恒定占据右栏，单独出现时不会滑到左侧。
- 链接带 `rel="prev"` 或 `rel="next"`，供搜索引擎与浏览器识别阅读顺序。
- 点击时从落点扩散一圈涟漪。

## 无障碍 {#a11y}

- 外层是 `nav` 地标，默认无障碍名取自界面语言（简体中文为「翻页」），`label` 可覆盖。
- 箭头带 `aria-hidden`，方向由提示文字表达，不依赖图形。
- 链接的可读名称包含提示文字与目标页标题两部分，屏幕阅读器会连读，因此不需要另加说明。

## API {#api}

### PrevNext {#props}

| 属性    | 类型     | 默认值       | 说明               |
| ------- | -------- | ------------ | ------------------ |
| `label` | `string` | 取自界面语言 | 导航地标的无障碍名 |
| `class` | `string` | —            | 追加到根元素的类   |

| 插槽      | 说明                 |
| --------- | -------------------- |
| `default` | 一个或两个方向的链接 |

### PrevNextLink {#link}

| 属性        | 类型                  | 默认值       | 说明                       |
| ----------- | --------------------- | ------------ | -------------------------- |
| `direction` | `'prev' \| 'next'`    | 必填         | 方向，决定栏位、箭头与文案 |
| `label`     | `string`              | 取自界面语言 | 提示文字                   |
| `as`        | `string \| Component` | `'a'`        | 渲染成的元素或组件         |
| `asChild`   | `boolean`             | `false`      | 由插槽根元素承担渲染       |
| `class`     | `string`              | —            | 追加到根元素的类           |

其余属性透传到实际渲染的元素上，例如 `href` 或路由组件的 `to`。

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 目标页面的标题 |
