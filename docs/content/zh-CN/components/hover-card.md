---
title: HoverCard
description: 悬停在链接上时浮出的预览卡片。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/hover-card/HoverCard.vue
  - label: HoverCard
    href: https://reka-ui.com/docs/components/hover-card
---

<Demo name="hover-card/hero" />

## 用法 {#usage}

```ts
import { HoverCard } from '@hina-ui/vue'
```

悬停卡片给一个链接配上预览：指针在触发器上停留一段时间后浮出卡片，移开后收回；用键盘聚焦触发器时立即浮出。默认插槽是触发器，通常是一个链接；`content` 插槽是卡片内容。它只是看一眼的东西，不停止页面滚动，也不接管焦点。

<Demo name="hover-card/basic" />

## 示例 {#examples}

### 位置 {#placement}

`side` 指定卡片朝哪个方向浮出，`align` 指定它与触发器的对齐方式，与 Popover 相同，默认在正下方。

<Demo name="hover-card/placement" />

### 延时 {#delay}

`openDelay` 是指针停留多久后浮出，`closeDelay` 是移开多久后收回，单位毫秒。指针从触发器移进卡片时不会收回。

<Demo name="hover-card/delay" />

### 受控 {#controlled}

`open` 支持双向绑定。卡片仍然会因指针移开、点击外部或者按 Esc 而收回，并把 `false` 写回，外部的控件只负责打开。

<Demo name="hover-card/controlled" />

## 行为 {#behavior}

- 指针停留 `openDelay` 后浮出，移开 `closeDelay` 后收回；移进卡片内保持打开。
- 键盘聚焦触发器时立即浮出，焦点离开时收回。
- 点击卡片外部或者按 Esc 也会收回。
- 卡片不停止页面滚动，页面其他部分照常可以交互。
- 触屏设备上不会因触摸浮出。

## 无障碍 {#a11y}

- 卡片只是补充信息，其中的内容不应该是到达某处的唯一途径。
- 触发器应当是可以聚焦的元素，键盘用户才能看到卡片。

## API {#api}

### Props {#props}

| 属性         | 类型                                     | 默认值     | 说明                   |
| ------------ | ---------------------------------------- | ---------- | ---------------------- |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 浮出的方向             |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | 与触发器的对齐方式     |
| `sideOffset` | `number`                                 | `8`        | 与触发器的距离，像素   |
| `openDelay`  | `number`                                 | `300`      | 停留多久后浮出，毫秒   |
| `closeDelay` | `number`                                 | `150`      | 移开多久后收回，毫秒   |
| `padded`     | `boolean`                                | `true`     | 卡片是否带内边距       |
| `open`       | `boolean`                                | —          | 是否打开，支持双向绑定 |
| `class`      | `string`                                 | —          | 追加至卡片的类名       |

### 插槽 {#slots}

| 插槽      | 说明     |
| --------- | -------- |
| default   | 触发器   |
| `content` | 卡片内容 |
