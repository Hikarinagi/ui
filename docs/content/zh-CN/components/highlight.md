---
title: Highlight
description: 跟随目标元素移动的高亮块。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/highlight/Highlight.vue
---

<Demo name="highlight/hero" />

## 用法 {#usage}

```ts
import { Highlight } from '@hina-ui/vue'
```

`Highlight` 是一块绝对定位的方块，它测量 `target` 指向的元素并移动到那里。目标切换时它连续位移，而不是在两处分别出现和消失。

它自己不画任何样式，外观全部由 `class` 决定——底色、圆角、层级都要写在调用方。宿主容器需要建立定位上下文。

它用于「同一块高亮在若干项之间移动」的场景：分段控件的选中背景、页内目录的当前位置。这类效果如果给每一项各做一个背景，切换时就是一处消失、另一处出现；用同一块移动过去，视线才跟得住。

## 示例 {#examples}

### 覆盖一段范围 {#range}

同时给 `target` 与 `until` 时，高亮块覆盖两者之间的整段，包含首尾。用于当前位置不是单点而是一片区域的情况，例如屏幕上同时出现多个小节。

只给 `target` 时等同于两者相同，只覆盖它自己。

<Demo name="highlight/range" />

### 轴向 {#axis}

`axis` 决定跟随哪些方向：`x` 只跟随水平位置与宽度，`y` 只跟随垂直位置与高度，`both` 两者都跟。默认 `both`。

限定单轴时，另一轴的位置与尺寸由 `class` 固定，例如横向分段控件用 `axis="x"` 配 `inset-y-1`，纵向目录用 `axis="y"` 配 `inset-x-1`。

## 行为 {#behavior}

- 目标或范围变化时移动，尺寸变化经由元素观察器实时跟随。
- 目标为空时整块不渲染，不留占位。
- 系统开启减弱动态效果时直接就位，不做位移过渡。
- 位置按目标相对定位父元素的偏移计算，因此目标与高亮块必须在同一个定位上下文内。

## 无障碍 {#a11y}

- 组件带 `aria-hidden`，是纯装饰，不进入无障碍树。
- 当前位置必须另有语义表达，例如选中项的 `aria-current` 或 `aria-pressed`，不能只靠这块高亮。

## API {#api}

### Props {#props}

| 属性     | 类型                   | 默认值   | 说明                       |
| -------- | ---------------------- | -------- | -------------------------- |
| `target` | `HTMLElement \| null`  | `null`   | 跟随的目标元素             |
| `until`  | `HTMLElement \| null`  | `null`   | 范围终点，省略时只覆盖目标 |
| `axis`   | `'x' \| 'y' \| 'both'` | `'both'` | 跟随的轴向                 |
| `class`  | `string`               | —        | 追加到根元素的类           |
