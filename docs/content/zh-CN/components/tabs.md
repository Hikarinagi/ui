---
title: Tabs
description: 在同一位置切换显示的几组内容。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tabs/Tabs.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tabs/tabs.variants.ts
---

<Demo name="tabs/hero" />

## 用法 {#usage}

```ts
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@hina-ui/vue'
```

组件由四部分构成：`Tabs` 持有当前选中项，`TabsList` 是页签所在的一行，`TabsTrigger` 是单个页签，`TabsContent` 是与之对应的内容。触发器与内容通过 `value` 一一对应。

<Demo name="tabs/basic" />

页签用于在同一位置切换几组并列的内容，各组之间没有先后顺序。若内容需要同时可见，应改用分节的标题；若是一次操作的若干步骤，应使用 `Stepper`。

## 示例 {#examples}

### 形态 {#variants}

`underline` 为默认形态，选中项由一条圆头线标示，适合与正文同宽的内容分组；`soft` 的选中项是一块浮起的滑块，适合工具栏与紧凑的切换。

<Demo name="tabs/variants" />

标示选中项的那条线或滑块会随选中项平移与伸缩，不是瞬间跳转。

### 尺寸 {#sizes}

`size` 改变的是这一行的疏密：`sm` 用于工具栏与密集界面，`md` 为默认，`lg` 用于页面顶部这类需要更多存在感的位置。

字号在三档中保持一致，页签属于界面 chrome，视觉分量由高度、内边距与选中标示给出。

<Demo name="tabs/sizes" />

### 纵向 {#vertical}

将 `orientation` 设为 `vertical`，页签排成一列位于内容左侧，方向键随之改为上下切换。

<Demo name="tabs/vertical" />

### 页签过多时 {#overflow}

页签超出容器宽度时，该行本身可以横向滚动，并且不显示滚动条：滚动位置由两端的边缘阴影提示，鼠标可直接在该行上滚动滚轮，键盘则通过方向键在页签之间循环。

<Demo name="tabs/overflow" />

### 禁用 {#disabled}

在 `TabsTrigger` 上设置 `disabled`，该页签不可选中，方向键也会跳过它。

<Demo name="tabs/disabled" />

## 无障碍 {#a11y}

- 为 `TabsList` 提供 `label`，说明这一组页签切换的是什么。
- 方向键在页签之间移动，`Home` 与 `End` 跳到首尾，选中项随焦点变化。
- 内容区可聚焦，以便键盘用户从页签直接进入内容。

## API {#api}

### Tabs {#props}

| 属性           | 类型                         | 默认值         | 说明                       |
| -------------- | ---------------------------- | -------------- | -------------------------- |
| `modelValue`   | `string`                     | —              | 当前选中项，支持 `v-model` |
| `defaultValue` | `string`                     | —              | 初始选中项                 |
| `variant`      | `'underline' \| 'soft'`      | `'underline'`  | 形态                       |
| `size`         | `'sm' \| 'md' \| 'lg'`       | `'md'`         | 尺寸                       |
| `orientation`  | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向                   |
| `class`        | `string`                     | —              | 追加至根元素的类名         |

### TabsList {#list}

| 属性    | 类型     | 默认值 | 说明             |
| ------- | -------- | ------ | ---------------- |
| `label` | `string` | —      | 这一组页签的名称 |
| `class` | `string` | —      | 追加至该行的类名 |

### TabsTrigger {#trigger}

| 属性       | 类型      | 默认值  | 说明                   |
| ---------- | --------- | ------- | ---------------------- |
| `value`    | `string`  | —       | 与内容对应的标识，必填 |
| `disabled` | `boolean` | `false` | 是否不可选中           |
| `class`    | `string`  | —       | 追加至页签的类名       |

### TabsContent {#content}

| 属性    | 类型     | 默认值 | 说明                   |
| ------- | -------- | ------ | ---------------------- |
| `value` | `string` | —      | 与页签对应的标识，必填 |
| `class` | `string` | —      | 追加至内容区的类名     |
