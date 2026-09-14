---
title: Drawer
description: 从屏幕边缘滑入的模态面板。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/drawer/Drawer.vue
  - label: Dialog
    href: https://reka-ui.com/docs/components/dialog
---

<Demo name="drawer/hero" />

## 用法 {#usage}

```ts
import { Drawer } from '@hina-ui/vue'
```

`title` 必填，`description` 是标题下面的一行说明。默认插槽是触发器，`content` 插槽是正文，`footer` 插槽是底部的操作按钮。`content`、`footer` 和接管内部布局的 `body` 插槽都会收到 `close` 方法。

<Demo name="drawer/basic" />

抽屉贴着屏幕边缘打开，占满整个高度，四角为直角。遮罩、停止页面滚动和焦点陷阱与 [Dialog](/components/dialog) 相同。

## 示例 {#examples}

### 标题内容 {#title}

与 [Dialog](/components/dialog) 一样，`icon` 插槽在标题前显示装饰图标，`title` 插槽替换标题内容，默认显示 `title` 属性。自定义标题保留 `<h2>` 语义与面板名称关联。

示例在标题中加入 [Tag](/components/tag)。

<Demo name="drawer/title" />

### 隐藏标题栏 {#header}

设置 `:header="false"` 隐藏整个标题栏，包括标题、说明和关闭按钮；正文与页脚保持原有布局。`title` 仍必填，与提供的 `description` 一起保留为辅助技术可读的隐藏内容，此时不渲染 `icon` 和 `title` 插槽。

<Demo name="drawer/header" />

### 关闭按钮 {#closable}

`closable` 默认为 `true`。设为 `false` 只隐藏标题栏中的关闭按钮，按 Esc 和点击遮罩仍可关闭，`locked` 控制这些关闭行为。隐藏标题栏或提供 `body` 时，内置关闭按钮不参与渲染。

<Demo name="drawer/closable" />

### 自定义面板内容 {#body}

`#body="{ close }"` 接管面板内部布局，替换默认标题栏、正文和页脚。组件不再添加内容内边距、区域间距或 [ScrollArea](/components/scroll-area) 包装，滚动与底部安全区留白由插槽内容控制。提供空插槽也不会恢复默认布局。

此时 `header`、`closable` 以及 `icon`、`title`、`content`、`footer` 插槽不参与渲染。`title` 仍必填，标题与提供的说明以视觉隐藏的形式保留；遮罩、焦点约束和 `locked` 继续生效，插槽的 `close()` 可程序化关闭面板。

示例使用 [CloseButton](/components/close-button)、[ScrollArea](/components/scroll-area) 和 [Button](/components/button) 组织贴边标题栏、独立滚动区域与固定底栏。

<Demo name="drawer/body" />

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

### 滚动容器 {#viewport}

通过组件 ref 的 `viewport` 获取正文内置 [ScrollArea](/components/scroll-area) 的实际滚动元素。可以读取 `scrollTop`、调用 `scrollTo()`，或将它交给滚动监听、观察器。

`viewport` 的类型为 `HTMLElement | undefined`。正文滚动区域初始化完成前、没有 `content` 插槽或内容卸载后为 `undefined`；退场期间仍返回当前元素，再次打开时更新为新的元素。需要在可用时执行操作或绑定监听，可监听 `() => modal.value?.viewport`，并在监听清理函数中解除绑定。

使用 `body` 插槽时，内置滚动区域被替换，`viewport` 为 `undefined`；自定义滚动区域由调用方自行引用。

示例中的 [Button](/components/button) 通过 `viewport.scrollTo()` 控制滚动。

<Demo name="drawer/viewport" />

### 受控 {#controlled}

`open` 支持双向绑定。省略默认插槽时不渲染触发器，抽屉只能从外部打开。

<Demo name="drawer/controlled" />

### 锁定 {#locked}

设置 `locked` 后，按 Esc 和点击遮罩都不再关闭抽屉，已显示的关闭按钮变为不可用。此时通过 `open` 关闭仍然有效。

<Demo name="drawer/locked" />

## 行为 {#behavior}

- 多个浮层按打开顺序叠放，后打开的在上方；组件的挂载先后不影响叠放。关闭后保留完整退场动画，再移除浮层。
- 抽屉打开期间页面停止滚动，焦点被限制在面板内部，关闭后回到触发器。
- 按 Esc 或点击遮罩关闭抽屉，`locked` 会同时禁用这两种方式。
- 默认正文区域使用 [ScrollArea](/components/scroll-area)；`body` 的滚动由调用方控制。

## 无障碍 {#a11y}

- 面板是 `role="dialog"`，`title` 和 `description` 分别关联到 `aria-labelledby` 和 `aria-describedby`。
- 标题渲染为 `<h2>`；隐藏标题栏或提供 `body` 时，保留由 `title` 属性生成的视觉隐藏标题。
- 关闭按钮带有无障碍名称，文字取自当前语言。

## API {#api}

### Drawer {#props}

| 属性          | 类型                   | 默认值  | 说明                                       |
| ------------- | ---------------------- | ------- | ------------------------------------------ |
| `title`       | `string`               | —       | 必填。抽屉标题                             |
| `description` | `string`               | —       | 标题下面的说明                             |
| `side`        | `'start' \| 'end'`     | `'end'` | 从哪一侧滑入                               |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | 抽屉的宽度                                 |
| `header`      | `boolean`              | `true`  | 是否显示标题栏，隐藏时保留无障碍名称与说明 |
| `closable`    | `boolean`              | `true`  | 是否显示标题栏中的关闭按钮                 |
| `locked`      | `boolean`              | `false` | 是否禁止用户关闭                           |
| `open`        | `boolean`              | —       | 是否打开，支持双向绑定                     |
| `class`       | `string`               | —       | 追加到面板上的类名                         |

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
