---
title: Sheet
description: 从屏幕底部升起、可以拖动关闭的面板。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/sheet/Sheet.vue
  - label: Dialog
    href: https://reka-ui.com/docs/components/dialog
---

<Demo name="sheet/hero" />

## 用法 {#usage}

```ts
import { Sheet } from '@hina-ui/vue'
```

底部面板从屏幕底边升起，贴着底边、顶部两角圆角，适合手机上的分享、筛选与快捷操作。`title` 必填，`description` 是标题下面的一行说明；默认插槽是触发器，`content` 插槽是正文，`footer` 插槽是底部的操作按钮，两个插槽都会收到 `close` 方法。按住顶部的把手或者标题区域向下拖动，拖过一段距离或者快速下滑就关闭，拖得不够则弹回。有把手时不显示右上角的关闭按钮，把手就是关闭的提示。

<Demo name="sheet/basic" />

## 示例 {#examples}

### 长内容 {#scroll}

超出可用高度的正文在 `content` 插槽内部滚动，标题与页脚保持不动；面板最高占到视口减去顶部留白。

<Demo name="sheet/scroll" />

### 滚动容器 {#viewport}

通过组件 ref 的 `viewport` 获取正文内置 [ScrollArea](/components/scroll-area) 的实际滚动元素。可以读取 `scrollTop`、调用 `scrollTo()`，或将它交给滚动监听、观察器。

`viewport` 的类型为 `HTMLElement | undefined`。正文滚动区域初始化完成前、没有 `content` 插槽或内容卸载后为 `undefined`；退场期间仍返回当前元素，再次打开时更新为新的元素。需要在可用时执行操作或绑定监听，可监听 `() => modal.value?.viewport`，并在监听清理函数中解除绑定。

示例中的 [Button](/components/button) 通过 `viewport.scrollTo()` 控制滚动。

<Demo name="sheet/viewport" />

### 受控 {#controlled}

`open` 支持双向绑定。省略默认插槽时不渲染触发器，面板只能从外部打开。

<Demo name="sheet/controlled" />

### 锁定 {#locked}

设置 `locked` 后，拖动、Esc 与点击遮罩都不再关闭面板，把手变淡表示暂时不可用；通过 `open` 关闭仍然有效。

<Demo name="sheet/locked" />

### 去掉把手 {#handle}

`handle` 设为 `false` 不显示顶部的把手；标题栏可见时，右上角改为显示关闭按钮，标题区域仍然可以拖动。

<Demo name="sheet/handle" />

### 隐藏标题栏 {#header}

与 [Dialog](/components/dialog) 一样，设置 `:header="false"` 隐藏标题栏，包括标题、说明和栏内的关闭按钮。`title` 仍然必填，与 `description` 一起保留为辅助技术可读的隐藏内容。

`handle` 独立控制把手。隐藏标题栏后，保留的把手仍可拖动关闭；同时设置 `:handle="false"` 时不渲染顶部拖动区域，正文从正常内边距开始。此时可通过 Esc、遮罩，或插槽的 `close` 方法关闭，`locked` 的规则不变。

示例通过页脚的 [Button](/components/button) 调用 `close`。

<Demo name="sheet/header" />

## 行为 {#behavior}

- 面板从底边滑入，宽屏上居中并限制最大宽度，窄屏上占满宽度；底部留出设备的安全区。
- 拖动只从把手与标题区域开始，正文区域留给滚动；松手时位移超过面板高度的三成，或者下滑速度足够快，面板从松手的位置继续滑出关闭，否则弹回原位。
- 打开期间页面停止滚动，焦点被限制在面板内，关闭后回到触发器。
- 按 Esc 或者点击遮罩关闭，`locked` 会同时禁用这两种方式与拖动。

## 无障碍 {#a11y}

- 面板是 `role="dialog"`，`title` 与 `description` 分别关联到 `aria-labelledby` 与 `aria-describedby`。
- 把手只是视觉提示，对辅助技术隐藏；标题栏可见且没有把手时，关闭按钮带有语言包给出的名称。
- 拖动是触屏与鼠标的快捷方式，键盘用户通过 Esc 关闭，页脚里的按钮也可以调用 `close`。

## API {#api}

### Props {#props}

| 属性          | 类型      | 默认值  | 说明                                         |
| ------------- | --------- | ------- | -------------------------------------------- |
| `title`       | `string`  | —       | 必填。面板标题                               |
| `description` | `string`  | —       | 标题下面的说明                               |
| `header`      | `boolean` | `true`  | 是否显示标题栏，隐藏时仍保留无障碍名称与说明 |
| `handle`      | `boolean` | `true`  | 是否显示把手；关闭按钮仅在标题栏可见时显示   |
| `locked`      | `boolean` | `false` | 是否禁止用户关闭                             |
| `open`        | `boolean` | —       | 是否打开，支持双向绑定                       |
| `class`       | `string`  | —       | 追加至面板的类名                             |

### 插槽 {#slots}

| 插槽      | 参数    | 说明         |
| --------- | ------- | ------------ |
| default   | —       | 触发器       |
| `content` | `close` | 正文         |
| `footer`  | `close` | 底部操作按钮 |

### 实例 {#expose}

| 属性       | 类型                       | 说明                                                                                            |
| ---------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| `viewport` | `HTMLElement \| undefined` | 正文内置 [ScrollArea](/components/scroll-area) 的实际滚动元素，初始化完成后可用，内容卸载后清空 |
