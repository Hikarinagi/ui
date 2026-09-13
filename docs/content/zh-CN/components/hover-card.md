---
title: HoverCard
description: 悬停在链接上时浮出的预览卡片。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/hover-card/HoverCard.vue
  - label: HoverCard
    href: https://reka-ui.com/docs/components/hover-card
---

<Demo name="hover-card/hero" />

## 用法 {#usage}

```ts
import { HoverCard } from '@hina-ui/vue'
```

悬停卡片给一个链接配上预览：指针在触发器上停留一段时间后浮出卡片，移开后收回；用键盘聚焦触发器时也按 `openDelay` 延时浮出。默认插槽是触发器，通常是一个链接；`content` 插槽是卡片内容。它只是看一眼的东西，不停止页面滚动，也不接管焦点。

<Demo name="hover-card/basic" />

## 示例 {#examples}

### 位置 {#placement}

`side` 指定卡片朝哪个方向浮出，`align` 指定它与触发器的对齐方式，与 [Popover](/components/popover) 相同，默认在正下方。

<Demo name="hover-card/placement" />

### 延时 {#delay}

`openDelay` 是指针停留多久后浮出，`closeDelay` 是移开多久后收回，单位毫秒。指针从触发器移进卡片时不会收回。

<Demo name="hover-card/delay" />

### 受控 {#controlled}

`open` 支持双向绑定。卡片仍然会因指针移开、点击外部或者按 Esc 而收回，并把 `false` 写回，外部的控件只负责打开。

<Demo name="hover-card/controlled" />

### 外部锚点 {#anchor}

默认插槽留空时，`anchor` 接收外部元素，用 `v-model:open` 控制打开。切换 `anchor` 与卡片内容即可让多个触发点共用一个卡片。提供默认插槽时，仍使用插槽中的触发器。

外部锚点不会自动打开卡片。直接设置 `open = true` 会立即打开，不经过 `openDelay`；移开后仍按 `closeDelay` 收回，移入卡片保持打开，键盘焦点离开锚点后收回。锚点清空、从文档移除，或其外层发生滚动时，卡片关闭。

示例使用 [Button](/components/button) 绑定指针和键盘焦点事件。

退场期间仍跟随页面上有效的锚点；锚点清空或移除后，使用最后的位置完成退场。

<Demo name="hover-card/anchor" />

## 行为 {#behavior}

- 指针停留 `openDelay` 后浮出，移开 `closeDelay` 后收回；移进卡片内保持打开。
- 键盘聚焦插槽中的触发器时按 `openDelay` 浮出，焦点离开后按 `closeDelay` 收回。
- 关闭延迟内移回卡片会取消关闭；退场动画开始后，卡片内容不再响应交互，移入原区域不会重新打开。
- 点击卡片外部或者按 Esc 也会收回。
- 卡片不停止页面滚动，页面其他部分照常可以交互。
- 触屏设备上不会因触摸浮出。

## 无障碍 {#a11y}

- 卡片只是补充信息，其中的内容不应该是到达某处的唯一途径。
- 触发器应当是可以聚焦的元素，键盘用户才能看到卡片。

## API {#api}

### Props {#props}

| 属性         | 类型                                     | 默认值     | 说明                             |
| ------------ | ---------------------------------------- | ---------- | -------------------------------- |
| `anchor`     | `HTMLElement \| null`                    | —          | 外部定位元素，默认插槽为空时使用 |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 浮出的方向                       |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | 与触发器的对齐方式               |
| `sideOffset` | `number`                                 | `8`        | 与触发器的距离，像素             |
| `openDelay`  | `number`                                 | `300`      | 停留多久后浮出，毫秒             |
| `closeDelay` | `number`                                 | `150`      | 移开多久后收回，毫秒             |
| `padded`     | `boolean`                                | `true`     | 卡片是否带内边距                 |
| `open`       | `boolean`                                | —          | 是否打开，支持双向绑定           |
| `class`      | `string`                                 | —          | 追加至卡片的类名                 |

### 插槽 {#slots}

| 插槽      | 说明                            |
| --------- | ------------------------------- |
| default   | 可选触发器；留空时使用 `anchor` |
| `content` | 卡片内容                        |
