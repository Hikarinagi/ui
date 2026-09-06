---
title: RingProgress
description: 以圆环的弧长表示任务完成的比例。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/ring-progress/RingProgress.vue
---

<Demo name="ring-progress/hero" />

## 用法 {#usage}

```ts
import { RingProgress } from '@hina-ui/vue'
```

`value` 与 `max` 的含义与 [Progress](/components/progress) 相同，弧长按两者的比例从顶部起顺时针绘制。中心默认为空，`showValue` 在中心显示百分比。

<Demo name="ring-progress/basic" />

## 示例 {#examples}

### 中心内容 {#center}

默认插槽替换中心的内容，例如完成后显示一个图标，或者用 `format` 改写数值文字。

<Demo name="ring-progress/center" />

### 标题 {#label}

`label` 显示在圆环下方。

<Demo name="ring-progress/label" />

### 数值变化 {#change}

`value` 变化时弧长平滑过渡，增加与减少都是如此。

<Demo name="ring-progress/change" />

### 尺寸 {#sizes}

三档直径，`md` 是默认值。环的粗细与中心文字随直径一同变化。

<Demo name="ring-progress/sizes" />

### 色调 {#tones}

`tone` 决定弧的颜色，默认是强调色。

<Demo name="ring-progress/tones" />

### 未知进度 {#indeterminate}

不传 `value` 时表示总量未知，四分之一长的弧绕圆环旋转。

<Demo name="ring-progress/indeterminate" />

## 行为 {#behavior}

- 弧从顶部起顺时针绘制，两端为圆头；`value` 为 0 时不绘制。
- `value` 变化时弧长平滑过渡，时长与曲线取自动效变量；越界的 `value` 按端点处理。
- 未知进度的旋转与 Spinner 同一节奏；系统开启减弱动态效果时旋转停止，弧保持可见。

## 无障碍 {#a11y}

- 圆环带 `role="progressbar"`，`aria-valuenow`、`aria-valuemin` 与 `aria-valuemax` 随 `value` 与 `max` 给出；未知进度时不设 `aria-valuenow`。
- 无障碍名优先取 `label`，没有 `label` 时取数值文字，未知进度时取界面语言中的“加载中”。
- 传入 `format` 时其结果同时写入 `aria-valuetext`。
- 图形本身对辅助技术隐藏，中心内容仍可被读取。

## API {#api}

### Props {#props}

| 属性        | 类型                                                                    | 默认值     | 说明                       |
| ----------- | ----------------------------------------------------------------------- | ---------- | -------------------------- |
| `value`     | `number \| null`                                                        | `null`     | 当前进度，不传表示未知进度 |
| `max`       | `number`                                                                | `100`      | 总量                       |
| `label`     | `string`                                                                | —          | 圆环下方的标题             |
| `showValue` | `boolean`                                                               | `false`    | 是否在中心显示数值文字     |
| `format`    | `(value: number, max: number) => string`                                | 百分比     | 数值文字的格式             |
| `tone`      | `'accent' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'accent'` | 弧的颜色                   |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                  | `'md'`     | 直径                       |
| `class`     | `string`                                                                | —          | 追加至根元素的类名         |

其余属性透传到带 `role="progressbar"` 的圆环元素上。

### 插槽 {#slots}

| 插槽    | 说明                                |
| ------- | ----------------------------------- |
| default | 中心内容，默认为 `showValue` 的数值 |
