---
title: Tooltip
description: 悬停或者聚焦时显示的简短说明。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tooltip/Tooltip.vue
  - label: Popover
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/popover/Popover.vue
---

<Demo name="tooltip/hero" />

## 用法 {#usage}

```ts
import { Tooltip } from '@hikarinagi/ui'
```

默认插槽是触发器，`content` 属性是提示的文字。指针悬停或者键盘聚焦时提示出现，指针移开或者按 Esc 时消失。

<Demo name="tooltip/basic" />

图标按钮自带提示，`label` 同时作为无障碍名称与提示文字，无需再包一层 `Tooltip`。

Tooltip 依赖外层的 `TooltipProvider`，`AppShell` 已经内置。缺少 Provider 时组件只渲染触发器。

## 示例 {#examples}

### 位置 {#placement}

`side` 决定提示显示在哪一侧，`align` 决定与触发器如何对齐。默认在上方居中。空间不足时提示会翻到另一侧。

<Demo name="tooltip/placement" />

### 间距 {#offset}

`sideOffset` 是提示与触发器之间的距离，单位是像素。

<Demo name="tooltip/offset" />

### 提示内容 {#content}

`content` 插槽可以放文字以外的内容，例如快捷键。超过最大宽度的长句会自动折行。

<Demo name="tooltip/content" />

### 延迟 {#delay}

`delayDuration` 是显示提示前的悬停时长。`skipDelayDuration` 是提示消失后的一段时间，在此期间移到下一个触发器不再等待延迟。两者作用于 `TooltipProvider` 包裹的所有 Tooltip。

<Demo name="tooltip/delay" />

### 禁用 {#disabled}

`disabled` 为真时不建立浮层，只渲染触发器。

<Demo name="tooltip/disabled" />

## 行为 {#behavior}

- 提示只在键盘聚焦时出现。鼠标点击留下的焦点，以及浮层关闭后回流的焦点，都不会显示提示。
- 提示不锁定页面滚动，滚动时跟随触发器。

## 无障碍 {#a11y}

- 触发器带 `aria-describedby` 指向提示，屏幕阅读器读完触发器之后读出提示文字。
- 提示不接收焦点，也不进入 Tab 顺序。需要交互的内容请改用 Popover。

## API {#api}

### Tooltip {#props}

| 属性         | 类型                                     | 默认值     | 说明               |
| ------------ | ---------------------------------------- | ---------- | ------------------ |
| `content`    | `string`                                 | —          | 提示的文字         |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    | 提示显示的方向     |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | 与触发器的对齐方式 |
| `sideOffset` | `number`                                 | `8`        | 与触发器的距离     |
| `disabled`   | `boolean`                                | `false`    | 是否禁用提示       |
| `class`      | `string`                                 | —          | 追加至提示的类名   |

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `default` | 触发器                   |
| `content` | 提示内容，覆盖 `content` |

### TooltipProvider {#provider}

| 属性                | 类型     | 默认值 | 说明                               |
| ------------------- | -------- | ------ | ---------------------------------- |
| `delayDuration`     | `number` | `150`  | 显示提示前的悬停时长，单位是毫秒   |
| `skipDelayDuration` | `number` | `300`  | 跳过下一次延迟的时间窗，单位是毫秒 |

| 插槽      | 说明               |
| --------- | ------------------ |
| `default` | 共用该组时长的子树 |
