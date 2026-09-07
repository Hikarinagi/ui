---
title: MeterGroup
description: 以一条分段的横条表示各部分占总量的比例。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/meter-group/MeterGroup.vue
---

<Demo name="meter-group/hero" />

## 用法 {#usage}

```ts
import { MeterGroup } from '@hina-ui/vue'
```

`items` 中每一项有 `label` 与 `value`，可以指定 `tone`；`max` 是总量，默认为 100。各段按各自的比例并排在同一条轨道上，下方的图例列出每段的标签与数值。

<Demo name="meter-group/basic" />

## 示例 {#examples}

### 标题与总量 {#label}

`label` 显示在轨道上方，同一行的末尾显示各段之和。

<Demo name="meter-group/label" />

### 数值变化 {#change}

多段的值同时变化时，各段的宽度各自平滑过渡到新的比例，图例中的数值同步更新。

<Demo name="meter-group/change" />

### 色调 {#tones}

未指定 `tone` 的段按强调色、信息色、成功色、警告色、危险色、中性色的顺序分配，也可以逐段指定。

<Demo name="meter-group/tones" />

### 数值格式 {#format}

`format` 接收每段的值与总量，返回要显示的文字。这段文字同时作为辅助技术朗读的数值。

<Demo name="meter-group/format" />

### 尺寸 {#sizes}

三档高度与 Progress 相同，`md` 是默认值。

<Demo name="meter-group/sizes" />

### 不显示图例 {#legend}

`legend` 设为 `false` 时只保留轨道。

<Demo name="meter-group/legend" />

## 行为 {#behavior}

- 各段的宽度随值平滑过渡，时长与曲线取自动效变量。
- 越界的值按端点处理：小于 0 视为 0，大于 `max` 视为 `max`。
- 各段之和超过 `max` 时，超出的部分被轨道裁掉，每段的数值与宽度仍然对应。

## 无障碍 {#a11y}

- 每段带 `role="meter"`，名称取该段的 `label`，`aria-valuenow`、`aria-valuemin` 与 `aria-valuemax` 随值与 `max` 给出。
- 轨道整体带 `role="group"`，名称取 `label`。
- 传入 `format` 时其结果同时写入每段的 `aria-valuetext`。
- 图例中的圆点对辅助技术隐藏，标签与数值以文字呈现。

## API {#api}

### Props {#props}

| 属性     | 类型                                     | 默认值 | 说明               |
| -------- | ---------------------------------------- | ------ | ------------------ |
| `items`  | `MeterItem[]`                            | —      | 必填。各段         |
| `max`    | `number`                                 | `100`  | 总量               |
| `label`  | `string`                                 | —      | 轨道上方的标题     |
| `legend` | `boolean`                                | `true` | 是否显示图例       |
| `format` | `(value: number, max: number) => string` | 百分比 | 数值文字的格式     |
| `size`   | `'sm' \| 'md' \| 'lg'`                   | `'md'` | 高度               |
| `class`  | `string`                                 | —      | 追加至根元素的类名 |

其余属性透传到带 `role="group"` 的轨道元素上。

### 类型 {#types}

| 字段    | 类型                                                                    | 说明                 |
| ------- | ----------------------------------------------------------------------- | -------------------- |
| `label` | `string`                                                                | 必填。该段的标签     |
| `value` | `number`                                                                | 必填。该段的值       |
| `tone`  | `'accent' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | 该段的颜色，默认按序 |
