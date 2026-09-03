---
title: Highlight
description: 在活动条目之间平移的高亮块。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/highlight/Highlight.vue
  - label: Motion
    href: https://motion.dev/docs/vue-layout-animations
---

<Demo name="highlight/hero" />

## 用法 {#usage}

```ts
import { Highlight } from '@hina-ui/vue'
```

`Highlight` 用于标示当前条目，例如分段控制器的滑块、标签页的指示条、页内目录的当前区段。它不进行任何测量：调用方通过 `class` 把它定位在活动条目的范围内，活动条目变化时，它由 Motion 的布局动画从原位置连续平移到新位置，而不是在一处消失、在另一处出现。

组件本身没有外观，背景色、圆角与层级全部由调用方通过 `class` 指定。

### 在条目之间移动 {#shared}

将它渲染在当前活动条目的内部，用 `v-if` 与活动状态绑定，并提供一个 `id`。活动条目变化时，原有实例卸载，新实例在新条目内挂载，相同的 `id` 使 Motion 把它从原位置平移到新位置。`id` 应由 `useId()` 生成，以保证同一页面上的多个实例互不干扰。

页首的示例即为这种用法：每个按钮内部都可以渲染一个 `absolute inset-0` 的高亮块，只有活动的按钮实际渲染它。

### 覆盖一段范围 {#range}

当前位置是连续的一段而不是单个条目时，例如页内目录中同时可见的若干小节，可以把列表排成单列网格，每一项显式占据一行，高亮块同样作为网格项，通过 `grid-row` 覆盖整段。此时它保持挂载，跨行范围变化时由布局动画连续伸缩。

<Demo name="highlight/range" />

## 行为 {#behavior}

- 静止时的位置由 CSS 布局决定，随条目尺寸变化，不需要测量，也不需要监听尺寸变化。
- 移动与伸缩都是连续的位移，缩放过程中圆角与阴影的变形由 Motion 自动修正。
- 系统启用减弱动态效果时，直接呈现在目标位置，不做位移过渡。
- 位移过程中高亮块位于目标条目内部。若各条目各自构成层叠上下文，应给非活动条目更高的层级（例如 `z-[1]`），活动条目使用 `z-0`，使高亮块从其他条目的文字下方经过。
- 服务端渲染输出的就是真实的高亮块，首屏与水合后的状态一致。

## 无障碍 {#a11y}

- 组件带有 `aria-hidden`，仅作装饰，不进入无障碍树。
- 当前位置必须另有语义表达，例如活动条目上的 `aria-current` 或者 `aria-pressed`，不能仅依赖高亮块。

## API {#api}

### Props {#props}

| 属性    | 类型            | 默认值  | 说明                                         |
| ------- | --------------- | ------- | -------------------------------------------- |
| `id`    | `string`        | —       | 共享布局动画的标识，在条目之间移动时必须提供 |
| `as`    | `'div' \| 'li'` | `'div'` | 渲染的元素                                   |
| `class` | `string`        | —       | 追加至根元素的类名                           |
