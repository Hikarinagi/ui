---
title: Toast
description: 操作完成之后浮出的一条简短反馈。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/toast/Toaster.vue
  - label: Callout
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/callout/Callout.vue
---

<Demo name="toast/hero" />

## 用法 {#usage}

```ts
import { Toaster, toast } from '@hikarinagi/ui'
```

`Toaster` 在应用根部放一个，`toast()` 在任何地方调用。它返回这条提示的 id，可以用来更新或者关掉它。

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

五个语义各有图标与颜色。`loading` 带转圈图标，默认不自动关闭，通常配合 `id` 更新为最终结果。

<Demo name="toast/tones" />

### 说明文字 {#description}

`description` 是消息下面的第二行，用来补充细节。

<Demo name="toast/description" />

### 操作按钮 {#action}

`action` 是主操作，`cancel` 是次操作，两者点击之后都会关掉这条提示。需要用户明确回应时把 `duration` 设为 0。

<Demo name="toast/action" />

### 异步任务 {#promise}

`toast.promise` 接收一个 Promise，按 `loading`、`success`、`error` 三段自动切换。`success` 与 `error` 可以写成函数，从结果里取值拼消息。

<Demo name="toast/promise" />

### 原地更新 {#update}

传入相同的 `id` 时不会新增一条，而是更新原来那条的语义、文字与计时。进度类的反馈用它。

<Demo name="toast/update" />

### 自定义渲染 {#custom}

`toast.custom` 用自己的组件渲染整条提示的内容，`props` 里的值原样传给它，组件另外收到一个 `toastId`。卡片的面、边框、阴影与内边距仍然由 `Toaster` 提供。

<Demo name="toast/custom" />

### 停留时长 {#duration}

`duration` 的单位是毫秒，默认 4000，`loading` 默认 0。设为 0 表示不自动关闭，此时由用户点击关闭按钮，或者用 `toast.dismiss(id)` 关掉。

<Demo name="toast/duration" />

## 行为 {#behavior}

- 指针悬停或者焦点进入提示区域时暂停计时，离开后继续。
- 同时最多显示 5 条，更早的会退场。
- 提示按 `id` 去重，重复调用同一个 id 是更新而不是新增。
- 向右滑动可以把一条提示划走。

## 无障碍 {#a11y}

- 提示区域是 `role="region"`，名称默认为“通知”，可以用 `label` 覆盖。
- 每条提示另有一个 `role="alert"` 的实时区域负责播报，屏幕阅读器读出消息与说明文字。
- 最上面那条提示可以用 Tab 聚焦，关闭按钮带无障碍名称。

## API {#api}

### toast {#toast}

| 方法                          | 说明                               |
| ----------------------------- | ---------------------------------- |
| `toast(message, options?)`    | 中性提示，返回这条提示的 id        |
| `toast.success(...)`          | 成功                               |
| `toast.danger(...)`           | 失败                               |
| `toast.warning(...)`          | 警告                               |
| `toast.info(...)`             | 信息                               |
| `toast.loading(...)`          | 进行中，默认不自动关闭             |
| `toast.promise(p, messages)`  | 跟随 Promise 的三段状态            |
| `toast.custom(component, {})` | 用自定义组件渲染整条提示           |
| `toast.dismiss(id?)`          | 关掉指定的一条，不传参数时关掉全部 |

### ToastOptions {#options}

| 属性          | 类型                 | 默认值 | 说明                         |
| ------------- | -------------------- | ------ | ---------------------------- |
| `id`          | `number \| string`   | —      | 相同 id 更新原有的那条       |
| `description` | `string`             | —      | 消息下面的第二行             |
| `duration`    | `number`             | `4000` | 停留毫秒数，0 表示不自动关闭 |
| `action`      | `{ label, onClick }` | —      | 主操作按钮                   |
| `cancel`      | `{ label, onClick }` | —      | 次操作按钮                   |
| `onDismiss`   | `(id) => void`       | —      | 被关掉时触发                 |
| `onAutoClose` | `(id) => void`       | —      | 计时结束自动关闭时触发       |

### Toaster {#toaster}

| 属性       | 类型              | 默认值 | 说明                                 |
| ---------- | ----------------- | ------ | ------------------------------------ |
| `position` | `ToasterPosition` | —      | 不写时窄屏浮在底部居中，宽屏浮在右上 |
| `label`    | `string`          | —      | 提示区域的无障碍名称                 |
| `class`    | `string`          | —      | 追加至提示区域的类名                 |

`ToasterPosition` 的取值是 `top-start`、`top-center`、`top-end`、`bottom-start`、`bottom-center` 与 `bottom-end`。
