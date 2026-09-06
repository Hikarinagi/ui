---
title: AlertDialog
description: 需要用户明确回答的确认对话框。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/alert-dialog/AlertDialog.vue
  - label: AlertDialog
    href: https://reka-ui.com/docs/components/alert-dialog
---

<Demo name="alert-dialog/hero" />

## 用法 {#usage}

```ts
import { AlertDialog } from '@hina-ui/vue'
```

确认对话框只问一个问题：`title` 是问题本身，`description` 补充后果，底部固定一对按钮，文字可以用 `cancelText` 与 `confirmText` 替换。默认插槽是触发器。点击遮罩不会关闭它，按 Esc 或者点「取消」才会；它没有右上角的关闭按钮，回答本身就是关闭的方式。

<Demo name="alert-dialog/basic" />

## 示例 {#examples}

### 危险操作 {#danger}

`tone="danger"` 把「确定」换成危险色，用于删除这类不可撤销的操作。

<Demo name="alert-dialog/danger" />

### 异步确认 {#async}

`confirm` 事件的处理函数返回 Promise 时，对话框等它结束再关闭：期间「确定」显示加载指示，「取消」与 Esc 都不可用；处理函数抛出错误时对话框保持打开，让用户在原地看到结果。

<Demo name="alert-dialog/async" />

### 受控 {#controlled}

`open` 支持双向绑定。省略默认插槽时不渲染触发器，对话框只能从外部打开。

<Demo name="alert-dialog/controlled" />

### 尺寸与位置 {#placement}

`size` 默认 `sm`，宽 384 像素，`md` 为 448 像素；`placement` 与 Dialog 相同，不设置时宽屏居中、窄屏贴底。

<Demo name="alert-dialog/placement" />

## 行为 {#behavior}

- 打开时焦点落在「取消」按钮上，误按回车不会执行操作；关闭后焦点回到触发器。
- 点击遮罩不关闭；Esc 关闭，等同于取消。
- 打开期间页面停止滚动，焦点被限制在面板内。
- 「确定」的处理函数返回 Promise 时，对话框在其结束前处于忙碌状态，结束后关闭；抛出错误则保持打开。

## 无障碍 {#a11y}

- 面板是 `role="alertdialog"`，标题与说明分别关联到 `aria-labelledby` 与 `aria-describedby`。
- 忙碌期间面板带有 `aria-busy`。
- 按钮文字取自当前语言，可以替换。

## API {#api}

### Props {#props}

| 属性          | 类型                   | 默认值     | 说明                   |
| ------------- | ---------------------- | ---------- | ---------------------- |
| `title`       | `string`               | —          | 必填。问题本身         |
| `description` | `string`               | —          | 补充说明               |
| `confirmText` | `string`               | 当前语言   | 「确定」按钮的文字     |
| `cancelText`  | `string`               | 当前语言   | 「取消」按钮的文字     |
| `tone`        | `'accent' \| 'danger'` | `'accent'` | 「确定」按钮的色调     |
| `size`        | `'sm' \| 'md'`         | `'sm'`     | 面板的最大宽度         |
| `placement`   | `'center' \| 'bottom'` | —          | 不设置时随屏幕宽度变化 |
| `open`        | `boolean`              | —          | 是否打开，支持双向绑定 |
| `class`       | `string`               | —          | 追加至面板的类名       |

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
