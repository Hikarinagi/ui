---
title: Slider
description: 在数值范围内拖动取值。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/slider/Slider.vue
  - label: Slider
    href: https://reka-ui.com/docs/components/slider
---

<Demo name="slider/hero" />

## 用法 {#usage}

```ts
import { Slider } from '@hina-ui/vue'
```

滑块在 `min` 与 `max` 之间取一个数，`v-model` 绑定当前值。拖动过程中值持续更新，松手时另发一次 `commit`。未声明的属性都会传给拇指元素，应当用 `aria-label` 或者 `aria-labelledby` 命名。宽度归布局，滑块本身撑满容器。

<Demo name="slider/basic" />

## 示例 {#examples}

### 范围与步长 {#step}

`min`、`max` 与 `step` 决定取值范围与粒度，键盘方向键也按 `step` 移动。

<Demo name="slider/step" />

### 刻度 {#marks}

`marks` 在轨道上放刻度点，带 `label` 的刻度在下方显示文字。

<Demo name="slider/marks" />

### 取值标签 {#label}

取值标签是一个 `Tooltip`，以拇指为触发器，随拇指移动，接近视口边缘时会翻转到另一侧。默认在悬停、聚焦与拖动时显示当前值；`label` 为 `always` 时始终显示，为 `none` 时不显示。`format` 定制显示的文字，默认按当前语言格式化数字。与 `IconButton` 的提示相同，它依赖应用中的 `TooltipProvider`，缺少时不显示。

<Demo name="slider/label" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，轨道高 20、24、28 像素，拇指 12、16、20 像素，与 `Switch` 相同。

<Demo name="slider/sizes" />

### 状态 {#states}

`disabled` 禁用整个滑块。

<Demo name="slider/states" />

### 松手时提交 {#commit}

`commit` 只在一次拖动或者一次按键结束时触发，适合触发请求之类代价较高的操作。

<Demo name="slider/commit" />

## 行为 {#behavior}

- 点击轨道任意位置，拇指跳到该处并开始拖动；拖动时拇指与填充跟手，不带过渡；点击与键盘引起的跳动带过渡。
- 键盘 Tab 落在拇指上，左右方向键按 `step` 移动，PageUp / PageDown 大步移动，Home / End 跳到两端。
- 悬停整条滑块时拇指落墨、取值标签淡入；按住拖动时加深。

## 无障碍 {#a11y}

- 拇指是 `role="slider"`，带 `aria-valuenow`、`aria-valuemin`、`aria-valuemax` 与 `aria-orientation`。
- 通过 `aria-label` 或者 `aria-labelledby` 给拇指命名；刻度对屏幕阅读器隐藏，屏幕阅读器读取的是 `aria-valuenow`；取值标签显示时作为拇指的 `aria-describedby`。

## API {#api}

### Props {#props}

| 属性         | 类型                                       | 默认值   | 说明                             |
| ------------ | ------------------------------------------ | -------- | -------------------------------- |
| `modelValue` | `number`                                   | —        | 当前值，未绑定时落在 `min`       |
| `min`        | `number`                                   | `0`      | 最小值                           |
| `max`        | `number`                                   | `100`    | 最大值                           |
| `step`       | `number`                                   | `1`      | 步长                             |
| `marks`      | `Array<{ value: number; label?: string }>` | —        | 刻度                             |
| `label`      | `'auto' \| 'always' \| 'none'`             | `'auto'` | 取值标签的显示方式               |
| `format`     | `(value: number) => string`                | —        | 取值标签的文字，默认按语言格式化 |
| `size`       | `'sm' \| 'md' \| 'lg'`                     | `'md'`   | 尺寸                             |
| `disabled`   | `boolean`                                  | `false`  | 是否禁用                         |
| `class`      | `string`                                   | —        | 追加至根元素的类名               |

### 事件 {#events}

| 事件                | 参数            | 说明                     |
| ------------------- | --------------- | ------------------------ |
| `update:modelValue` | `value: number` | 值变化时，拖动中持续触发 |
| `commit`            | `value: number` | 一次拖动或者按键结束时   |
