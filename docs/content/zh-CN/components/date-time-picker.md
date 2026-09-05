---
title: DateTimePicker
description: 输入或者从日历与时间段中选择日期时间。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/date-time-picker/DateTimePicker.vue
  - label: Popover
    href: https://reka-ui.com/docs/components/popover
---

<Demo name="date-time-picker/hero" />

## 用法 {#usage}

```ts
import { DateTimePicker } from '@hina-ui/vue'
```

日期时间选择器把精度到分的 `DateField` 与浮层里的 `Calendar`、`TimeField` 组合在一起：可以直接在各段里输入，也可以点击末尾的按钮打开浮层，在日历里选日期、在时间段里改时间。`v-model` 绑定 `YYYY-MM-DDTHH:mm` 格式的 ISO 8601 字符串，精度到秒时是 `YYYY-MM-DDTHH:mm:ss`，与浏览器原生的日期时间控件相同。未声明的属性都会传给包裹各段的组元素，请用 `aria-label` 或者 `aria-labelledby` 命名。

<Demo name="date-time-picker/basic" />

## 示例 {#examples}

### 范围与不可选的日期 {#range}

`min` 与 `max` 以完整的日期时间约束输入，日历按它们的日期部分禁用日期；`unavailable` 把某些日期标为不可选；`minuteStep` 让浮层里的分段按步长增减。

<Demo name="date-time-picker/range" />

### 可清除 {#clearable}

`clearable` 在各段之后加一个清除按钮，清空后值为 `null`。

<Demo name="date-time-picker/clearable" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，与同档输入框等高，浮层里的日历、时间段与按钮使用同一档尺寸。

<Demo name="date-time-picker/sizes" />

### 状态 {#states}

`invalid` 给输入面加上警示色，`disabled` 禁用整组，`readonly` 只读。`variant="secondary"` 是放在 surface 之内的扁平形态。

<Demo name="date-time-picker/states" />

## 行为 {#behavior}

- 点击末尾的按钮打开浮层，焦点落在当前选中的日期。选一天只更新日期部分，时间部分沿用原值，浮层保持打开；没有值时，时间部分取 `placeholder` 的时间，没有则取零点。
- 浮层里的时间段直接改时间部分。点击「确定」关闭浮层，焦点回到按钮；点击浮层以外的任何地方或者按 Esc 也会关闭，值已经在每一步写回，不需要确认。
- 浮层是模态的：打开期间焦点保持在浮层里，页面停止滚动。在时间段里按 Esc 不会关闭浮层，请点击「确定」或者浮层以外。
- 浮层在输入面下方展开，与输入面的左缘对齐。

## 无障碍 {#a11y}

- 各段、日历与时间段的无障碍语义分别见 `DateField`、`Calendar` 与 `TimeField`，浮层里的时间段带有语言包给出的名称。
- 打开浮层的按钮带有语言包给出的名称与 `aria-expanded`。
- 通过 `aria-label` 或者 `aria-labelledby` 为整组命名。

## API {#api}

### Props {#props}

| 属性            | 类型                              | 默认值      | 说明                                                     |
| --------------- | --------------------------------- | ----------- | -------------------------------------------------------- |
| `modelValue`    | `string \| null`                  | `null`      | `YYYY-MM-DDTHH:mm`，精度到秒时到 `ss`                    |
| `open`          | `boolean`                         | `false`     | 浮层是否打开，`v-model:open`                             |
| `placeholder`   | `string`                          | 今天        | 空值时各段与日历的起点，其时间部分也是选日期后的默认时间 |
| `min`           | `string`                          | —           | 可选范围的下限                                           |
| `max`           | `string`                          | —           | 可选范围的上限                                           |
| `granularity`   | `'minute' \| 'second'`            | `'minute'`  | 精度                                                     |
| `hourCycle`     | `12 \| 24`                        | 随语言      | 小时制                                                   |
| `minuteStep`    | `number`                          | —           | 浮层里分段的步长                                         |
| `unavailable`   | `(date: string) => boolean`       | —           | 判定某一天是否不可选                                     |
| `weekStartsOn`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | 随语言      | 一周从周几开始                                           |
| `weekdayFormat` | `'narrow' \| 'short'`             | `'narrow'`  | 星期名称的格式                                           |
| `fixedWeeks`    | `boolean`                         | `true`      | 日历是否固定显示六周                                     |
| `clearable`     | `boolean`                         | `false`     | 是否显示清除按钮                                         |
| `readonly`      | `boolean`                         | `false`     | 是否只读                                                 |
| `name`          | `string`                          | —           | 表单字段名                                               |
| `variant`       | `'primary' \| 'secondary'`        | `'primary'` | 形态                                                     |
| `size`          | `'sm' \| 'md' \| 'lg'`            | `'md'`      | 尺寸                                                     |
| `disabled`      | `boolean`                         | `false`     | 是否禁用                                                 |
| `invalid`       | `boolean`                         | `false`     | 是否处于校验未通过状态                                   |
| `class`         | `string`                          | —           | 追加至根元素的类名                                       |

### 插槽 {#slots}

| 插槽      | 说明             |
| --------- | ---------------- |
| `leading` | 前置附属格的内容 |

### 事件 {#events}

| 事件                | 参数                    | 说明         |
| ------------------- | ----------------------- | ------------ |
| `update:modelValue` | `value: string \| null` | 值变化       |
| `update:open`       | `open: boolean`         | 浮层开合变化 |
| `clear`             | —                       | 点击清除     |
