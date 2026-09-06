---
title: Progress
description: 以横条的填充长度表示任务完成的比例。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/progress/Progress.vue
---

<Demo name="progress/hero" />

## 用法 {#usage}

```ts
import { Progress } from '@hina-ui/vue'
```

`value` 是当前进度，`max` 是总量，默认为 100。进度条按两者的比例填充，`value` 变化时填充长度平滑过渡。

<Demo name="progress/basic" />

## 示例 {#examples}

### 标题与数值 {#label}

`label` 显示在进度条上方，`showValue` 在同一行的末尾显示百分比。

<Demo name="progress/label" />

### 数值变化 {#change}

`value` 变化时填充长度平滑过渡，增加与减少都是如此，数值文字随之更新。

<Demo name="progress/change" />

### 数值格式 {#format}

`format` 接收当前值与总量，返回要显示的文字。这段文字同时作为辅助技术朗读的数值。

<Demo name="progress/format" />

### 尺寸 {#sizes}

三档高度，`md` 是默认值；`sm` 用于列表行内等紧凑位置，`lg` 用于独立成块的进度。

<Demo name="progress/sizes" />

### 色调 {#tones}

`tone` 决定填充的颜色，默认是强调色。完成、警告、失败等状态可以换用对应的语义色。

<Demo name="progress/tones" />

### 未知进度 {#indeterminate}

不传 `value` 时表示总量未知，一段填充沿轨道反复扫过。

<Demo name="progress/indeterminate" />

## 行为 {#behavior}

- `value` 变化时填充长度平滑过渡，时长与曲线取自动效变量。
- 越界的 `value` 按端点处理：小于 0 视为 0，大于 `max` 视为 `max`。
- 未知进度的扫动时长取自动效变量；系统开启减弱动态效果时扫动停止，填充段停在轨道中央。

## 无障碍 {#a11y}

- 轨道带 `role="progressbar"`，`aria-valuenow`、`aria-valuemin` 与 `aria-valuemax` 随 `value` 与 `max` 给出；未知进度时不设 `aria-valuenow`。
- 无障碍名优先取 `label`，没有 `label` 时取数值文字，未知进度时取界面语言中的“加载中”。
- 传入 `format` 时其结果同时写入 `aria-valuetext`，辅助技术朗读的是格式化后的文字而不是原始数字。

## API {#api}

### Props {#props}

| 属性        | 类型                                                                    | 默认值     | 说明                       |
| ----------- | ----------------------------------------------------------------------- | ---------- | -------------------------- |
| `value`     | `number \| null`                                                        | `null`     | 当前进度，不传表示未知进度 |
| `max`       | `number`                                                                | `100`      | 总量                       |
| `label`     | `string`                                                                | —          | 进度条上方的标题           |
| `showValue` | `boolean`                                                               | `false`    | 是否显示数值文字           |
| `format`    | `(value: number, max: number) => string`                                | 百分比     | 数值文字的格式             |
| `tone`      | `'accent' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'accent'` | 填充的颜色                 |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                  | `'md'`     | 高度                       |
| `class`     | `string`                                                                | —          | 追加至根元素的类名         |

其余属性透传到带 `role="progressbar"` 的轨道元素上。
