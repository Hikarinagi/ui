---
title: Dialog
description: 打断当前任务的模态对话框。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/dialog/Dialog.vue
  - label: Drawer
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/drawer/Drawer.vue
---

<Demo name="dialog/hero" />

## 用法 {#usage}

```ts
import { Dialog } from '@hikarinagi/ui'
```

`title` 必填，`description` 是标题下的一行说明。默认插槽是触发器，`content` 插槽是正文，`footer` 插槽是底部的操作按钮。两个插槽都能拿到 `close` 方法。

<Demo name="dialog/basic" />

关闭按钮、遮罩、锁定滚动、焦点陷阱都由组件负责，不需要自己拼。

## 示例 {#examples}

### 尺寸 {#sizes}

`size` 控制面板的最大宽度，三档分别是 384、448 与 576 像素。

<Demo name="dialog/sizes" />

### 位置 {#placement}

不写 `placement` 时，宽屏居中显示，窄屏贴底并撑满宽度。`center` 与 `bottom` 分别锁定其中一种形态。

<Demo name="dialog/placement" />

### 长内容 {#scroll}

正文超过可用高度时在 `content` 插槽内部滚动，标题与页脚保持不动。面板的高度不会超出视口。

<Demo name="dialog/scroll" />

### 受控 {#controlled}

`open` 支持双向绑定。省略默认插槽时不渲染触发器，对话框只能从外部打开。

<Demo name="dialog/controlled" />

### 锁定 {#locked}

`locked` 为真时 Esc 与点击遮罩都不再关闭对话框，关闭按钮变为不可用但仍然显示。提交过程中用它防止用户中途关闭。此时仍然可以通过 `open` 从代码里关闭。

<Demo name="dialog/locked" />

## 行为 {#behavior}

- 对话框打开期间页面锁定滚动，焦点被限制在面板内部，关闭后回到触发器。
- Esc 或者点击遮罩关闭对话框，`locked` 为真时两者都失效。
- 正文区域是 ScrollArea，滚动条样式与项目其他滚动区一致。

## 无障碍 {#a11y}

- 面板是 `role="dialog"`，`title` 与 `description` 分别关联到 `aria-labelledby` 与 `aria-describedby`。
- 标题渲染为 `<h2>`，在页面标题层级之下。
- 关闭按钮带无障碍名称，文字取自当前语言。

## API {#api}

### Dialog {#props}

| 属性          | 类型                   | 默认值  | 说明                   |
| ------------- | ---------------------- | ------- | ---------------------- |
| `title`       | `string`               | —       | 必填。对话框标题       |
| `description` | `string`               | —       | 标题下的说明           |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | 面板的最大宽度         |
| `placement`   | `'center' \| 'bottom'` | —       | 不写时随屏幕宽度变化   |
| `locked`      | `boolean`              | `false` | 是否禁止用户关闭       |
| `open`        | `boolean`              | —       | 是否打开，支持双向绑定 |
| `class`       | `string`               | —       | 追加至面板的类名       |

| 插槽      | 参数        | 说明                   |
| --------- | ----------- | ---------------------- |
| `default` | —           | 触发器，省略时不渲染   |
| `content` | `{ close }` | 正文，超高时在内部滚动 |
| `footer`  | `{ close }` | 底部的操作按钮         |
