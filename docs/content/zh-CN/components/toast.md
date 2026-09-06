---
title: Toast
description: 操作完成后浮出的一条简短反馈。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/toast/Toaster.vue
  - label: Toast
    href: https://reka-ui.com/docs/components/toast
---

<Demo name="toast/hero" />

## 用法 {#usage}

```ts
import { Toaster, toast } from '@hina-ui/vue'
```

在应用的最外层挂载一个 `Toaster`，然后在任何地方调用 `toast()`。调用后返回这条提示的 id，可以用它更新或关闭这条提示。

<Demo name="toast/basic" />

```vue
<template>
  <AppShell>
    <NuxtPage />
    <Toaster />
  </AppShell>
</template>
```

## 示例 {#examples}

### 语义 {#tones}

五个语义各有自己的图标和颜色。`loading` 显示转圈图标，并且一直停留，通常再用同一个 `id` 把它更新为最终结果。

<Demo name="toast/tones" />

### 说明文字 {#description}

`description` 是消息下面的第二行，用来补充细节。

<Demo name="toast/description" />

### 操作按钮 {#action}

`action` 是主按钮，`cancel` 是次按钮，点击其中任何一个都会关闭这条提示。需要用户回应时，把 `duration` 设为 0。

<Demo name="toast/action" />

### 异步任务 {#promise}

`toast.promise` 接收一个 Promise，自行在 `loading`、`success` 和 `error` 三种状态之间切换。`success` 和 `error` 可以写成函数，用结果拼出消息。

<Demo name="toast/promise" />

### 原地更新 {#update}

传入相同的 `id` 时，更新已有提示的语义、文字和计时，而不是新增一条。进度类的反馈就是这样实现的。

<Demo name="toast/update" />

### 自定义渲染 {#custom}

`toast.custom` 用自己的组件渲染提示的正文。`props` 里的内容原样传给它，组件还会收到一个 `toastId`。卡片的底色、边框、阴影和内边距仍然由 `Toaster` 提供。

<Demo name="toast/custom" />

### 停留时长 {#duration}

`duration` 的单位是毫秒，默认为 4000，`loading` 默认为 0。为 0 表示一直停留，直到用户点击关闭按钮，或者调用 `toast.dismiss(id)`。

<Demo name="toast/duration" />

## 行为 {#behavior}

- 指针悬停在提示区域上，或者焦点进入其中时，计时暂停，离开后继续。
- 同时最多显示 5 条提示，更早的会退场。
- 提示按 `id` 索引，用同一个 id 再次调用是更新，而不是新增。
- 向右滑动可以关闭一条提示。

## 无障碍 {#a11y}

- 提示区域是 `role="region"`，默认名称为“通知”，可以用 `label` 覆盖。
- 每条提示通过一个独立的 `role="alert"` 实时区域播报，屏幕阅读器会读出消息和说明文字。
- 最上面那条提示可以用 Tab 聚焦，关闭按钮带有无障碍名称。

## API {#api}

### toast {#toast}

| 方法                          | 说明                           |
| ----------------------------- | ------------------------------ |
| `toast(message, options?)`    | 中性提示，返回这条提示的 id    |
| `toast.success(...)`          | 成功                           |
| `toast.danger(...)`           | 失败                           |
| `toast.warning(...)`          | 警告                           |
| `toast.info(...)`             | 信息                           |
| `toast.loading(...)`          | 进行中，一直停留               |
| `toast.promise(p, messages)`  | 跟随 Promise 的三种状态        |
| `toast.custom(component, {})` | 用自己的组件渲染整条提示       |
| `toast.dismiss(id?)`          | 关闭指定的一条，不传时关闭全部 |

### ToastOptions {#options}

| 属性          | 类型                 | 默认值 | 说明                       |
| ------------- | -------------------- | ------ | -------------------------- |
| `id`          | `number \| string`   | —      | 相同的 id 会更新已有提示   |
| `description` | `string`             | —      | 消息下面的第二行           |
| `duration`    | `number`             | `4000` | 停留毫秒数，0 表示一直停留 |
| `action`      | `{ label, onClick }` | —      | 主按钮                     |
| `cancel`      | `{ label, onClick }` | —      | 次按钮                     |
| `onDismiss`   | `(id) => void`       | —      | 提示被关闭时调用           |
| `onAutoClose` | `(id) => void`       | —      | 计时结束自动关闭时调用     |

### Toaster {#toaster}

| 属性       | 类型              | 默认值 | 说明                                 |
| ---------- | ----------------- | ------ | ------------------------------------ |
| `position` | `ToasterPosition` | —      | 不设置时窄屏在底部居中，宽屏在右上角 |
| `label`    | `string`          | —      | 提示区域的无障碍名称                 |
| `class`    | `string`          | —      | 追加到提示区域上的类名               |

`ToasterPosition` 的取值为 `top-start`、`top-center`、`top-end`、`bottom-start`、`bottom-center` 和 `bottom-end`。
