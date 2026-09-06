---
title: Breadcrumb
description: 标示当前页面在层级中的位置。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/breadcrumb/Breadcrumb.vue
---

<Demo name="breadcrumb/hero" />

## 用法 {#usage}

```ts
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/vue'
```

`Breadcrumb` 是导航地标，`BreadcrumbItem` 是层级中的一项，`BreadcrumbSeparator` 是项与项之间的分隔符。项与分隔符按顺序交替排列，最后一项用 `current` 标出当前页面。

`current` 项不是链接，它渲染为文字并带上 `aria-current="page"`。当前页面链接至自身并无意义，且会使屏幕阅读器读出一个指向原处的链接。

<Demo name="breadcrumb/basic" />

面包屑记录的是层级位置，不是浏览历史。层级自站点根部逐级列至当前页，与读者由何处进入无关。

## 示例 {#examples}

### 分隔符 {#separator}

分隔符默认是向右的箭头。默认插槽可以换成任意内容，斜线与间隔号都是常见选择。同一条面包屑里的分隔符应当保持一致。

<Demo name="breadcrumb/separator" />

### 路由链接 {#router}

`as` 指定该项渲染为何种元素，默认为 `a`。在 Nuxt 或 Vue Router 中传入路由组件即可获得客户端跳转，其余属性（`to`、`href` 等）会透传到该元素上。

需要完全接管渲染时用 `as-child`，此时项的样式类会合并到插槽根元素上。

<Demo name="breadcrumb/router" />

### 图标 {#icon}

项的内容可以是任意节点。首项常用图标代替「首页」二字，此时图标要标为 `aria-hidden`，并用 `VisuallyHidden` 补一个只给屏幕阅读器的名称——否则这一项对辅助技术就是一个没有名字的链接。

<Demo name="breadcrumb/icon" />

### 导航名称 {#label}

`Breadcrumb` 渲染为 `nav` 地标，带有随界面语言给出的无障碍名。一个页面里出现多个导航地标时，用 `label` 分别命名，屏幕阅读器的地标列表才能区分它们。

<Demo name="breadcrumb/label" />

## 无障碍 {#a11y}

- 外层是 `nav` 地标，内部是有序列表，屏幕阅读器会读出项数与序号。
- 分隔符带 `aria-hidden`，不会被读出，也不占列表序号之外的语义。
- 当前项带 `aria-current="page"` 且不可点击。
- 默认地标名取自界面语言（简体中文为「面包屑」），`label` 可覆盖。
- 用图标代替文字时，必须另行提供可读的名称。

## API {#api}

### Breadcrumb {#props}

| 属性    | 类型     | 默认值       | 说明               |
| ------- | -------- | ------------ | ------------------ |
| `label` | `string` | 取自界面语言 | 导航地标的无障碍名 |
| `class` | `string` | —            | 追加到根元素的类   |

| 插槽      | 说明                 |
| --------- | -------------------- |
| `default` | 交替排列的项与分隔符 |

### BreadcrumbItem {#item}

| 属性      | 类型                  | 默认值  | 说明                                       |
| --------- | --------------------- | ------- | ------------------------------------------ |
| `current` | `boolean`             | `false` | 是否为当前页面，为真时渲染为不可点击的文字 |
| `as`      | `string \| Component` | `'a'`   | 渲染成的元素或组件                         |
| `asChild` | `boolean`             | `false` | 由插槽根元素承担渲染                       |
| `class`   | `string`              | —       | 追加到根元素的类                           |

其余属性透传到实际渲染的元素上，例如 `href` 或路由组件的 `to`。

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 项的内容 |

### BreadcrumbSeparator {#separator-api}

| 属性    | 类型     | 默认值 | 说明             |
| ------- | -------- | ------ | ---------------- |
| `class` | `string` | —      | 追加到根元素的类 |

| 插槽      | 说明                         |
| --------- | ---------------------------- |
| `default` | 分隔符内容，缺省为向右的箭头 |
