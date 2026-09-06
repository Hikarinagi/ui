---
title: RangeCalendar
description: 按月展示与选择日期区间。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/range-calendar/RangeCalendar.vue
  - label: RangeCalendar
    href: https://reka-ui.com/docs/components/range-calendar
---

<Demo name="range-calendar/hero" />

## 用法 {#usage}

```ts
import { RangeCalendar } from '@hina-ui/vue'
```

范围日历与 `Calendar` 共用同一副网格、标题与月份、年份视图，区别在于选的是一段区间：点击一个日期作为开始，再点击另一个日期作为结束。开始与结束显示为实心格，中间的日期连成一条浅色带。`v-model` 绑定 `{ start, end }` 对象，两个字段都是 `YYYY-MM-DD` 格式的 ISO 8601 字符串，与 `DateRangeField` 相同；没有值时为 `null`。

<Demo name="range-calendar/basic" />

## 示例 {#examples}

### 范围 {#range}

`min` 与 `max` 限定可选范围，范围之外的日期禁用。`maximumDays` 限制区间最多包含的天数：选定开始日期后，超出天数的日期禁用，区间完成后恢复。

<Demo name="range-calendar/range" />

### 不可选的日期 {#unavailable}

`unavailable` 接收 `YYYY-MM-DD` 字符串并返回该日期是否不可选，不可选的日期显示删除线。区间不能跨过不可选的日期。

<Demo name="range-calendar/unavailable" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，与 `Calendar` 的同档尺寸相同。

<Demo name="range-calendar/sizes" />

### 状态 {#states}

`readonly` 只读，仍然可以用键盘浏览；`disabled` 禁用整个日历。

<Demo name="range-calendar/states" />

## 行为 {#behavior}

- 第一次点击确定开始日期，此时值是 `{ start, end: null }`；第二次点击确定结束日期。区间确定后再点击任意日期，会以它为开始重新选择。
- 选定开始日期后，悬停或者用方向键移动到其他日期时，中间的日期先显示预览带。
- 结束日期早于开始日期时，两者自动对调。
- 键盘操作、月份与年份视图、翻页与 `placeholder` 都与 `Calendar` 相同。

## 无障碍 {#a11y}

- 根元素带有语言包给出的名称与当前月份，网格是 `role="grid"`，区间内的每一格都带 `aria-selected`。
- 整个网格只占一个 Tab 停靠点，焦点在日期之间用方向键移动；聚焦环只在键盘操作时出现。

## API {#api}

### Props {#props}

| 属性            | 类型                              | 默认值     | 说明                                   |
| --------------- | --------------------------------- | ---------- | -------------------------------------- |
| `modelValue`    | `DateRangeValue \| null`          | `null`     | 选中的区间，两端都是 `YYYY-MM-DD`      |
| `placeholder`   | `string`                          | 当月       | 显示的月份，支持 `v-model:placeholder` |
| `min`           | `string`                          | —          | 可选范围的下限                         |
| `max`           | `string`                          | —          | 可选范围的上限                         |
| `maximumDays`   | `number`                          | —          | 区间最多包含的天数                     |
| `unavailable`   | `(date: string) => boolean`       | —          | 判定某一天是否不可选                   |
| `weekStartsOn`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | 随语言     | 一周从周几开始                         |
| `weekdayFormat` | `'narrow' \| 'short'`             | `'narrow'` | 星期名称的格式                         |
| `fixedWeeks`    | `boolean`                         | `true`     | 是否固定显示六周                       |
| `size`          | `'sm' \| 'md' \| 'lg'`            | `'md'`     | 尺寸                                   |
| `autofocus`     | `boolean`                         | `false`    | 挂载时是否聚焦开始日期                 |
| `readonly`      | `boolean`                         | `false`    | 是否只读                               |
| `disabled`      | `boolean`                         | `false`    | 是否禁用                               |
| `class`         | `string`                          | —          | 追加至根元素的类名                     |

`DateRangeValue` 是 `{ start: string | null; end: string | null }`，可以从包入口导入。

### 事件 {#events}

| 事件                 | 参数                            | 说明                                 |
| -------------------- | ------------------------------- | ------------------------------------ |
| `update:modelValue`  | `value: DateRangeValue \| null` | 区间变化                             |
| `update:placeholder` | `value: string`                 | 显示的月份变化，参数是该视图内的日期 |
