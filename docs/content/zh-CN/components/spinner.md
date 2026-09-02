---
title: Spinner
description: 表示正在进行中的旋转指示。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/spinner/Spinner.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/spinner/spinner.variants.ts
---

<Demo name="spinner/hero" />

## 用法 {#usage}

```ts
import { Spinner } from '@hina-ui/vue'
```

`Spinner` 表示一段时长未知的等待。它只是指示，不阻挡操作，也不带遮罩。

等待的是一整块内容且已知其形状时，用 `Skeleton` 更好——占位块能让页面在加载完成前就保持稳定的布局；`Spinner` 适合按钮内、局部区域这类不便撑出骨架的位置。

## 示例 {#examples}

### 尺寸 {#sizes}

三档：`sm` 用于按钮与行内文字旁，`md` 是默认值，`lg` 用于独立成块的等待区域。

<Demo name="spinner/sizes" />

### 颜色 {#color}

环取自当前文字色，因此放进按钮或彩色文字中会自动跟随，不需要单独配色。需要指定时用文字色类覆盖。

<Demo name="spinner/color" />

### 说明文字 {#label}

默认的无障碍名随界面语言给出（简体中文为「加载中」）。当页面上同时有多处等待、或需要说清等的是什么时，用 `label` 分别命名。

旁边已经有可见的说明文字时，可以把说明写进 `label` 保持一致。

<Demo name="spinner/label" />

## 行为 {#behavior}

- 匀速旋转一周耗时取自动效变量，与其余循环动画同源。
- 系统开启减弱动态效果时旋转停止，指示仍然可见。
- 尺寸与边框粗细成套变化，不要单独覆盖其中一项。

## 无障碍 {#a11y}

- 带 `role="status"`，屏幕阅读器会在不打断当前朗读的前提下播报状态变化。
- 默认无障碍名取自界面语言，`label` 可覆盖。
- 它只描述「正在进行」，不表达进度。有确切进度时应当用进度条而非旋转指示。

## API {#api}

### Props {#props}

| 属性    | 类型                   | 默认值       | 说明     |
| ------- | ---------------------- | ------------ | -------- |
| `size`  | `'sm' \| 'md' \| 'lg'` | `'md'`       | 尺寸     |
| `label` | `string`               | 取自界面语言 | 无障碍名 |

其余属性透传到根元素上，例如 `class`。
