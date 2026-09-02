---
title: Drawer
description: 从屏幕边缘滑入的模态面板。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/drawer/Drawer.vue
  - label: Dialog
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/dialog/Dialog.vue
---

<Demo name="drawer/hero" />

## 用法 {#usage}

```ts
import { Drawer } from '@hina-ui/vue'
```

`title` 必填，`description` 是标题下面的一行说明。默认插槽是触发器，`content` 插槽是正文，`footer` 插槽是底部的操作按钮。两个插槽都会收到 `close` 方法。

<Demo name="drawer/basic" />

抽屉贴着屏幕边缘打开，占满整个高度，四角为直角。遮罩、停止页面滚动和焦点陷阱与 Dialog 相同。

## 示例 {#examples}

### 方向 {#side}

`side` 取 `start` 或 `end`，指文字方向上的起始边和结束边。中文和英文环境下分别是左边缘和右边缘，从右向左书写的语言中自动对调。

<Demo name="drawer/side" />

### 尺寸 {#sizes}

`size` 设置抽屉的宽度，三档分别为 288、360 和 480 像素。窄屏上宽度不会超过视口宽度减去 48 像素。

<Demo name="drawer/sizes" />

### 导航 {#navigation}

抽屉中放一组 `NavLink` 就是窄屏下的导航菜单。`AppShell` 已经内置了这种形态：屏幕变窄时侧栏自动收进抽屉，不需要自己拼装。

<Demo name="drawer/navigation" />

### 长内容 {#scroll}

超出可用高度的内容在 `content` 插槽内部滚动，标题和页脚保持不动。

<Demo name="drawer/scroll" />

### 受控 {#controlled}

`open` 支持双向绑定。省略默认插槽时不渲染触发器，抽屉只能从外部打开。

<Demo name="drawer/controlled" />

### 锁定 {#locked}

设置 `locked` 后，按 Esc 和点击遮罩都不再关闭抽屉，关闭按钮变为不可用，但仍然显示。此时通过 `open` 关闭仍然有效。

<Demo name="drawer/locked" />

## 行为 {#behavior}

- 抽屉打开期间页面停止滚动，焦点被限制在面板内部，关闭后回到触发器。
- 按 Esc 或点击遮罩关闭抽屉，`locked` 会同时禁用这两种方式。
- 正文区域是 ScrollArea，滚动条与项目中其他滚动区域一致。

## 无障碍 {#a11y}

- 面板是 `role="dialog"`，`title` 和 `description` 分别关联到 `aria-labelledby` 和 `aria-describedby`。
- 标题渲染为 `<h2>`，位于页面标题层级之下。
- 关闭按钮带有无障碍名称，文字取自当前语言。

## API {#api}

### Drawer {#props}

| 属性          | 类型                   | 默认值  | 说明                   |
| ------------- | ---------------------- | ------- | ---------------------- |
| `title`       | `string`               | —       | 必填。抽屉标题         |
| `description` | `string`               | —       | 标题下面的说明         |
| `side`        | `'start' \| 'end'`     | `'end'` | 从哪一侧滑入           |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | 抽屉的宽度             |
| `locked`      | `boolean`              | `false` | 是否禁止用户关闭       |
| `open`        | `boolean`              | —       | 是否打开，支持双向绑定 |
| `class`       | `string`               | —       | 追加到面板上的类名     |

| 插槽      | 参数        | 说明                   |
| --------- | ----------- | ---------------------- |
| `default` | —           | 触发器，省略时不渲染   |
| `content` | `{ close }` | 正文，过高时在内部滚动 |
| `footer`  | `{ close }` | 底部的操作按钮         |
