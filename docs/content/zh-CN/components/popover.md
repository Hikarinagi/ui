---
title: Popover
description: 点击触发器浮出的一小块内容。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/popover/Popover.vue
  - label: DropdownMenu
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/dropdown-menu/DropdownMenu.vue
---

<Demo name="popover/hero" />

## 用法 {#usage}

```ts
import { Popover } from '@hikarinagi/ui'
```

默认插槽是触发器，`content` 插槽是浮出的内容。点击触发器展开，再次点击触发器或者点击面板以外的区域收起。面板里的内容可以自由排布，也可以接收焦点。

<Demo name="popover/basic" />

## 示例 {#examples}

### 位置 {#placement}

`side` 决定朝哪个方向浮出，`align` 决定与触发器如何对齐。默认在下方居中。空间不足时面板会自动翻到另一侧。

<Demo name="popover/placement" />

### 间距 {#offset}

`sideOffset` 是面板与触发器之间的距离，单位是像素。

<Demo name="popover/offset" />

### 受控 {#controlled}

`open` 支持双向绑定，可以从外部展开或者收起，面板内的按钮也可以把它关掉。

<Demo name="popover/controlled" />

### 自定义内边距 {#padded}

面板默认带内边距。内容需要贴边时设置 `padded="false"`，再由内容自己安排留白。

<Demo name="popover/padded" />

### 触发器 {#trigger}

触发器不限于按钮，任何能接收焦点的元素都可以。图标按钮作为触发器时关掉它的提示气泡，避免两层浮层叠在一起。

<Demo name="popover/trigger" />

## 行为 {#behavior}

- 面板展开期间页面锁定滚动。
- 触发器在面板展开期间保持按下的墨色。
- 面板展开后焦点移入面板，Esc 收起并把焦点还给触发器。
- 点击面板以外的区域收起面板，该次点击不会落到下面的元素上。

## 无障碍 {#a11y}

- 触发器带 `aria-haspopup="dialog"` 与 `aria-expanded`，面板是 `role="dialog"`。
- 面板里的标题、说明与表单控件按普通页面内容处理，屏幕阅读器逐条播报。
- 面板收起后焦点回到触发器，键盘操作不会落空。

## API {#api}

### Popover {#props}

| 属性         | 类型                                     | 默认值     | 说明                   |
| ------------ | ---------------------------------------- | ---------- | ---------------------- |
| `open`       | `boolean`                                | —          | 是否展开，支持双向绑定 |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 浮出方向               |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | 与触发器的对齐方式     |
| `sideOffset` | `number`                                 | `8`        | 与触发器的距离         |
| `padded`     | `boolean`                                | `true`     | 面板是否带内边距       |
| `class`      | `string`                                 | —          | 追加至面板的类名       |

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 触发器       |
| `content` | 面板中的内容 |
