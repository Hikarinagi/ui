---
title: Tooltip
description: 悬停或聚焦时显示的简短说明。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/tooltip/Tooltip.vue
  - label: Tooltip
    href: https://reka-ui.com/docs/components/tooltip
---

<Demo name="tooltip/hero" />

## 用法 {#usage}

```ts
import { Tooltip } from '@hina-ui/vue'
```

默认插槽是触发器，`content` 属性是提示的文字。指针悬停或键盘聚焦时显示，指针移开或按 Esc 时隐藏。

<Demo name="tooltip/basic" />

图标按钮自带提示：`label` 既是无障碍名称，也是提示文字，不需要再包一层 Tooltip。

Tooltip 需要外层有 `TooltipProvider`，`AppShell` 已经包含了一个。没有 Provider 时，组件只渲染触发器。

## 示例 {#examples}

### 位置 {#placement}

`side` 指定提示出现在哪一侧，`align` 指定它与触发器的对齐方式。默认在正上方，空间不足时翻转到相反一侧。

<Demo name="tooltip/placement" />

### 间距 {#offset}

`sideOffset` 是提示与触发器之间的距离，单位为像素。

<Demo name="tooltip/offset" />

### 提示内容 {#content}

`content` 插槽不限于文字，例如可以放快捷键。超过最大宽度的文字会自动换行。

<Demo name="tooltip/content" />

### 延迟 {#delay}

`delayDuration` 是显示提示前的悬停时长。`skipDelayDuration` 是一个时间窗：提示关闭后的这段时间内移到下一个触发器，会跳过延迟直接显示。两者对 `TooltipProvider` 内的所有 Tooltip 生效。

<Demo name="tooltip/delay" />

### 受控 {#controlled}

传入 `open` 后，显示与隐藏由调用方决定，悬停与键盘焦点不再起作用；受控时提示的定位改为逐帧更新，可以跟随移动中的触发器，`Slider` 的取值标签即采用这种方式。

<Demo name="tooltip/controlled" />

### 禁用 {#disabled}

设置 `disabled` 后不创建浮层，只渲染触发器。

<Demo name="tooltip/disabled" />

## 行为 {#behavior}

- 只有来自键盘的焦点会显示提示；鼠标点击留下的焦点、浮层关闭后归还的焦点都不会。
- 提示不会锁定页面滚动，页面滚动时它跟随触发器。

## 无障碍 {#a11y}

- 触发器的 `aria-describedby` 指向提示，屏幕阅读器读完触发器后会读出提示。
- 提示不获得焦点，也不在 Tab 顺序中。需要交互的内容应放在 Popover 里。

## API {#api}

### Tooltip {#props}

| 属性         | 类型                                     | 默认值     | 说明                                         |
| ------------ | ---------------------------------------- | ---------- | -------------------------------------------- |
| `content`    | `string`                                 | —          | 提示的文字                                   |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    | 出现在哪一侧                                 |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | 与触发器的对齐方式                           |
| `sideOffset` | `number`                                 | `8`        | 与触发器的距离                               |
| `open`       | `boolean`                                | —          | 受控的显示状态，未传入时由悬停与键盘焦点决定 |
| `disabled`   | `boolean`                                | `false`    | 是否禁用提示                                 |
| `class`      | `string`                                 | —          | 追加到提示上的类名                           |

| 插槽      | 说明                       |
| --------- | -------------------------- |
| `default` | 触发器                     |
| `content` | 提示的内容，优先于同名属性 |

### TooltipProvider {#provider}

| 属性                | 类型     | 默认值 | 说明                             |
| ------------------- | -------- | ------ | -------------------------------- |
| `delayDuration`     | `number` | `150`  | 显示提示前的悬停时长，单位为毫秒 |
| `skipDelayDuration` | `number` | `300`  | 跳过延迟的时间窗，单位为毫秒     |

| 插槽      | 说明                 |
| --------- | -------------------- |
| `default` | 共用这两个时长的子树 |
