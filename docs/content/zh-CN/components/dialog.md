---
title: Dialog
description: 打断当前任务的模态对话框。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/dialog/Dialog.vue
  - label: Dialog
    href: https://reka-ui.com/docs/components/dialog
---

<Demo name="dialog/hero" />

## 用法 {#usage}

```ts
import { Dialog } from '@hina-ui/vue'
```

`title` 必填，`description` 是标题下面的一行说明。默认插槽是触发器，`content` 插槽是正文，`footer` 插槽是底部的操作按钮。`content`、`footer` 和接管整个内部布局的 `body` 插槽都会收到 `close` 方法。

<Demo name="dialog/basic" />

关闭按钮、遮罩、停止页面滚动和焦点陷阱都由组件提供。

## 示例 {#examples}

### 标题内容 {#title}

`icon` 插槽在标题前显示装饰图标，`title` 插槽替换标题内容，默认显示 `title` 属性。自定义标题保留 `<h2>` 语义与弹窗名称关联。

<Demo name="dialog/title" />

### 隐藏头部 {#header}

`header` 默认为 `true`。设为 `false` 后不显示整个头部及其中的关闭按钮，正文与页脚保留原有布局。`title` 仍必填，标题与提供的说明会以视觉隐藏的形式保留，供辅助技术读取；此时不渲染 `icon` 和 `title` 插槽。

<Demo name="dialog/header" />

### 关闭按钮 {#closable}

`closable` 默认为 `true`。设为 `false` 只隐藏关闭按钮，按 Esc 和点击遮罩仍可关闭；`locked` 控制这两种关闭行为。`:header="false"` 时始终不显示头部内的关闭按钮。

<Demo name="dialog/closable" />

### 自定义面板内容 {#body}

`#body="{ close }"` 接管整个面板内部，替换默认头部、正文和页脚。组件不再添加内部留白、区域间距或 [ScrollArea](/components/scroll-area) 包装；内边距与滚动由插槽内容控制。提供空插槽也不会恢复默认布局。

此时 `header`、`closable` 以及 `icon`、`title`、`content`、`footer` 插槽不参与渲染。`title` 仍必填，标题与提供的说明以视觉隐藏的形式保留。尺寸、位置、遮罩、焦点约束和 `locked` 继续生效，插槽中的 `close()` 可程序化关闭弹窗。

<Demo name="dialog/body" />

### 尺寸 {#sizes}

`size` 设置面板的最大宽度，默认 `md`。五档宽度如下，实际宽度受视口限制。

| size  | 最大宽度 |
| ----- | -------- |
| `sm`  | 24rem    |
| `md`  | 28rem    |
| `lg`  | 36rem    |
| `xl`  | 42rem    |
| `2xl` | 56rem    |

<Demo name="dialog/sizes" />

### 自定义宽度 {#width}

`class` 作用于面板，可用 `max-w-[40rem]` 或 `max-w-[52rem]` 覆盖预设最大宽度。默认定位在窄屏上仍占满可用宽度，并保留两侧留白。

<Demo name="dialog/width" />

### 位置 {#placement}

不设置 `placement` 时，宽屏上对话框居中，窄屏上贴底并占满宽度。`center` 和 `bottom` 各自锁定其中一种形态。

<Demo name="dialog/placement" />

### 长内容 {#scroll}

默认布局中，超出可用高度的内容在 `content` 插槽内部滚动，标题和页脚保持不动。面板本身不会超出视口。

<Demo name="dialog/scroll" />

### 受控 {#controlled}

`open` 支持双向绑定。省略默认插槽时不渲染触发器，对话框只能从外部打开。

<Demo name="dialog/controlled" />

### 锁定 {#locked}

设置 `locked` 后，按 Esc 和点击遮罩都不再关闭对话框，已显示的关闭按钮变为不可用。此时通过 `open` 关闭仍然有效。

<Demo name="dialog/locked" />

## 行为 {#behavior}

- 对话框打开期间页面停止滚动，焦点被限制在面板内部，关闭后回到触发器。
- 按 Esc 或点击遮罩关闭对话框，`locked` 会同时禁用这两种方式。
- 默认正文区域使用 [ScrollArea](/components/scroll-area)。

## 无障碍 {#a11y}

- 面板是 `role="dialog"`，`title` 和 `description` 分别关联到 `aria-labelledby` 和 `aria-describedby`。
- 标题渲染为 `<h2>`；隐藏头部或提供 `body` 时，保留由 `title` 属性生成的视觉隐藏标题。
- 关闭按钮带有无障碍名称，文字取自当前语言。

## API {#api}

### Dialog {#props}

| 属性          | 类型                                    | 默认值  | 说明                         |
| ------------- | --------------------------------------- | ------- | ---------------------------- |
| `title`       | `string`                                | —       | 必填。对话框标题             |
| `description` | `string`                                | —       | 标题下面的说明               |
| `size`        | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'`  | 面板的最大宽度               |
| `placement`   | `'center' \| 'bottom'`                  | —       | 不设置时随屏幕宽度变化       |
| `header`      | `boolean`                               | `true`  | 是否显示头部及其中的关闭按钮 |
| `closable`    | `boolean`                               | `true`  | 是否显示头部内的关闭按钮     |
| `locked`      | `boolean`                               | `false` | 是否禁止用户关闭             |
| `open`        | `boolean`                               | —       | 是否打开，支持双向绑定       |
| `class`       | `string`                                | —       | 追加到面板上的类名           |

| 插槽      | 参数        | 说明                                   |
| --------- | ----------- | -------------------------------------- |
| `default` | —           | 触发器，省略时不渲染                   |
| `icon`    | —           | 标题前的装饰图标                       |
| `title`   | —           | 标题内容，默认显示 title 属性          |
| `body`    | `{ close }` | 整个面板内部，替换默认头部、正文和页脚 |
| `content` | `{ close }` | 正文，过高时在内部滚动                 |
| `footer`  | `{ close }` | 底部的操作按钮                         |
