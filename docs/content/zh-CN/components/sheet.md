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

`title` 必填，`description` 是标题下面的一行说明。默认插槽是触发器，`content` 插槽是正文，`footer` 插槽是底部操作按钮，`content`、`footer` 和接管内部布局的 `body` 插槽都会收到 `close` 方法。按住顶部把手或标题区域向下拖动，距离足够或快速下滑时关闭，否则弹回。有把手时默认不显示关闭按钮。

<Demo name="sheet/basic" />

## 示例 {#examples}

### 标题内容 {#title}

与 [Dialog](/components/dialog) 一样，`icon` 插槽在标题前显示装饰图标，`title` 插槽替换标题内容，默认显示 `title` 属性。自定义标题保留 `<h2>` 语义与面板名称关联。

示例在标题中加入 [Tag](/components/tag)。

<Demo name="sheet/title" />

### 关闭按钮 {#closable}

`closable` 默认为 `true`。设为 `false` 只隐藏标题栏中的关闭按钮，按 Esc 和点击遮罩仍可关闭，`locked` 控制这些关闭行为。隐藏标题栏或提供 `body` 时，内置关闭按钮不参与渲染。 Sheet 保持有把手时不显示关闭按钮的默认行为；`:handle="false"` 且标题栏可见时，才由 `closable` 控制按钮是否显示，标题区域仍可拖动。

<Demo name="sheet/closable" />

### 自定义面板内容 {#body}

`#body="{ close }"` 接管面板内部布局，替换默认标题栏、正文和页脚。组件不再添加内容内边距、区域间距或 [ScrollArea](/components/scroll-area) 包装，滚动与底部安全区留白由插槽内容控制。提供空插槽也不会恢复默认布局。

此时 `header`、`closable` 以及 `icon`、`title`、`content`、`footer` 插槽不参与渲染。`title` 仍必填，标题与提供的说明以视觉隐藏的形式保留；遮罩、焦点约束和 `locked` 继续生效，插槽的 `close()` 可程序化关闭面板。

`handle` 仍独立控制把手：默认保留在自定义内容上方，只有把手区域可以拖动。设置 `:handle="false"` 后不渲染顶部拖动区域，也不保留它的留白；自定义正文不会成为拖动区域。

示例使用 [CloseButton](/components/close-button)、[ScrollArea](/components/scroll-area) 和 [Button](/components/button) 组织贴边标题栏、独立滚动区域与固定底栏。

<Demo name="sheet/body" />

### 长内容 {#scroll}

超出可用高度的正文在 `content` 插槽内部滚动，标题与页脚保持不动；面板最高占到视口减去顶部留白。

<Demo name="sheet/scroll" />

### 滚动容器 {#viewport}

通过组件 ref 的 `viewport` 获取正文内置 [ScrollArea](/components/scroll-area) 的实际滚动元素。可以读取 `scrollTop`、调用 `scrollTo()`，或将它交给滚动监听、观察器。

`viewport` 的类型为 `HTMLElement | undefined`。正文滚动区域初始化完成前、没有 `content` 插槽或内容卸载后为 `undefined`；退场期间仍返回当前元素，再次打开时更新为新的元素。需要在可用时执行操作或绑定监听，可监听 `() => modal.value?.viewport`，并在监听清理函数中解除绑定。

使用 `body` 插槽时，内置滚动区域被替换，`viewport` 为 `undefined`；自定义滚动区域由调用方自行引用。

示例中的 [Button](/components/button) 通过 `viewport.scrollTo()` 控制滚动。

<Demo name="sheet/viewport" />

### 受控 {#controlled}

`open` 支持双向绑定。省略默认插槽时不渲染触发器，面板只能从外部打开。

<Demo name="sheet/controlled" />

### 锁定 {#locked}

设置 `locked` 后，拖动、Esc 与点击遮罩都不再关闭面板，把手变淡表示暂时不可用；通过 `open` 关闭仍然有效。

<Demo name="sheet/locked" />

### 去掉把手 {#handle}

`handle` 设为 `false` 不显示顶部的把手；标题栏可见时，右上角改为显示关闭按钮，标题区域仍然可以拖动；`closable=false` 可隐藏关闭按钮。

<Demo name="sheet/handle" />

### 隐藏标题栏 {#header}

与 [Dialog](/components/dialog) 一样，设置 `:header="false"` 隐藏标题栏，包括标题、说明和栏内的关闭按钮。`title` 仍然必填，与 `description` 一起保留为辅助技术可读的隐藏内容；此时不渲染 `icon` 和 `title` 插槽。

`handle` 独立控制把手。隐藏标题栏后，保留的把手仍可拖动关闭；同时设置 `:handle="false"` 时不渲染顶部拖动区域，正文从正常内边距开始。此时可通过 Esc、遮罩，或插槽的 `close` 方法关闭，`locked` 的规则不变。

示例通过页脚的 [Button](/components/button) 调用 `close`。

<Demo name="sheet/header" />

## 行为 {#behavior}

- 多个浮层按打开顺序叠放，后打开的在上方；组件的挂载先后不影响叠放。关闭后保留完整退场动画，再移除浮层。
- 面板从底边滑入，宽屏上居中并限制最大宽度，窄屏上占满宽度；默认布局底部留出设备的安全区，`body` 模式由自定义内容控制。
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
| `closable`    | `boolean` | `true`  | 是否显示标题栏中的关闭按钮                   |
| `locked`      | `boolean` | `false` | 是否禁止用户关闭                             |
| `open`        | `boolean` | —       | 是否打开，支持双向绑定                       |
| `class`       | `string`  | —       | 追加至面板的类名                             |

### 插槽 {#slots}

| 插槽      | 参数        | 说明                                       |
| --------- | ----------- | ------------------------------------------ |
| `default` | —           | 触发器，省略时不渲染                       |
| `icon`    | —           | 标题前的装饰图标                           |
| `title`   | —           | 标题内容，默认显示 title 属性              |
| `body`    | `{ close }` | 自定义面板内部，替换默认标题栏、正文和页脚 |
| `content` | `{ close }` | 正文，过高时在内部滚动                     |
| `footer`  | `{ close }` | 底部操作按钮                               |

### 实例 {#expose}

| 属性       | 类型                       | 说明                                                                                            |
| ---------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| `viewport` | `HTMLElement \| undefined` | 正文内置 [ScrollArea](/components/scroll-area) 的实际滚动元素，初始化完成后可用，内容卸载后清空 |
