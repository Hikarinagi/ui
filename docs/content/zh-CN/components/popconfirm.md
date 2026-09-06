---
title: Popconfirm
description: 贴着触发器浮出的确认气泡。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/popconfirm/Popconfirm.vue
  - label: Popover
    href: https://reka-ui.com/docs/components/popover
---

<Demo name="popconfirm/hero" />

## 用法 {#usage}

```ts
import { Popconfirm } from '@hina-ui/vue'
```

气泡确认框在触发器旁边问一个问题，适合删除一行、撤销一次操作这类范围小、就地可见的确认；后果重、需要打断当前任务的确认用 [AlertDialog](/components/alert-dialog)。`title` 是问题，`description` 补充后果，底部一对按钮的文字可以用 `cancelText` 与 `confirmText` 替换。默认插槽是触发器。

<Demo name="popconfirm/basic" />

## 示例 {#examples}

### 危险操作 {#danger}

`tone="danger"` 把「确定」换成危险色，用于删除这类不可撤销的操作。

<Demo name="popconfirm/danger" />

### 异步确认 {#async}

`confirm` 事件的处理函数返回 Promise 时，气泡等它结束再收回：期间「确定」显示加载指示，「取消」、Esc 与点击外部都不可用；处理函数抛出错误时气泡保持打开。

<Demo name="popconfirm/async" />

### 位置 {#placement}

`side` 与 `align` 与 Popover 相同，默认在触发器正下方，空间不足时翻转到相反一侧。

<Demo name="popconfirm/placement" />

### 受控 {#controlled}

`open` 支持双向绑定，可以从外部打开或者收回。

<Demo name="popconfirm/controlled" />

## 行为 {#behavior}

- 打开后焦点落在「取消」按钮上，误按回车不会执行操作；收回后焦点回到触发器。
- Esc 与点击外部只是收回气泡，不触发 `cancel` 事件；点「取消」才触发。
- 打开期间页面停止滚动，触发器保持按下时的样式。
- 「确定」的处理函数返回 Promise 时，气泡在其结束前处于忙碌状态，结束后收回；抛出错误则保持打开。

## 无障碍 {#a11y}

- 面板是 `role="dialog"`，名称取自触发器，问题与说明一起关联到 `aria-describedby`。
- 忙碌期间面板带有 `aria-busy`。
- 按钮文字取自当前语言，可以替换。

## API {#api}

### Props {#props}

| 属性          | 类型                                     | 默认值     | 说明                   |
| ------------- | ---------------------------------------- | ---------- | ---------------------- |
| `title`       | `string`                                 | —          | 必填。问题本身         |
| `description` | `string`                                 | —          | 补充说明               |
| `confirmText` | `string`                                 | 当前语言   | 「确定」按钮的文字     |
| `cancelText`  | `string`                                 | 当前语言   | 「取消」按钮的文字     |
| `tone`        | `'accent' \| 'danger'`                   | `'accent'` | 「确定」按钮的色调     |
| `side`        | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 浮出的方向             |
| `align`       | `'start' \| 'center' \| 'end'`           | `'center'` | 与触发器的对齐方式     |
| `sideOffset`  | `number`                                 | `8`        | 与触发器的距离，像素   |
| `open`        | `boolean`                                | —          | 是否打开，支持双向绑定 |
| `class`       | `string`                                 | —          | 追加至面板的类名       |

### 插槽 {#slots}

| 插槽      | 说明                 |
| --------- | -------------------- |
| default   | 触发器               |
| `content` | 说明与按钮之间的内容 |

### 事件 {#events}

| 事件      | 参数 | 说明                                            |
| --------- | ---- | ----------------------------------------------- |
| `confirm` | —    | 点击「确定」；处理函数返回 Promise 时等待其完成 |
| `cancel`  | —    | 点击「取消」                                    |
