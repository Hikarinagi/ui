---
title: DateRangeField
description: 分段输入开始与结束日期。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/date-range-field/DateRangeField.vue
  - label: DateRangeField
    href: https://reka-ui.com/docs/components/date-range-field
---

<Demo name="date-range-field/hero" />

## 用法 {#usage}

```ts
import { DateRangeField } from '@hina-ui/vue'
```

日期范围输入框在一个输入面里放开始与结束两组日期段，中间以「至」分隔。每段只接受数字，输入完一段后自动进入下一段，填完开始日期后直接进入结束日期。`v-model` 绑定 `{ start, end }` 对象，两个字段都是 ISO 8601 字符串，格式与 `DateField` 相同；只填了一侧时另一侧为 `null`，两侧都为空时整个值为 `null`。未声明的属性都会传给包裹各段的组元素，请用 `aria-label` 或者 `aria-labelledby` 命名。

<Demo name="date-range-field/basic" />

## 示例 {#examples}

### 日期与时间 {#datetime}

`granularity` 决定精度，两侧同时生效：默认 `day` 只有日期，`hour` 增加小时，`minute` 增加小时与分钟，`second` 再增加秒。`hourCycle` 指定 12 小时制或者 24 小时制，默认随语言决定。

<Demo name="date-range-field/datetime" />

### 范围 {#range}

`min` 与 `max` 限定两侧可选的范围。任一侧超出范围，或者结束日期早于开始日期时，输入框显示为校验未通过，但值仍然会更新。`placeholder` 指定没有值时各段从哪个日期开始增减，默认是今天。

<Demo name="date-range-field/range" />

### 可清除 {#clearable}

`clearable` 在末尾加一个清除按钮，一次清空两侧，清空后值为 `null`，焦点回到第一段。

<Demo name="date-range-field/clearable" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，与同档输入框等高。

<Demo name="date-range-field/sizes" />

### 状态 {#states}

`invalid` 给输入面加上警示色，`disabled` 禁用整组，`readonly` 只读，仍然可以聚焦与选中。`variant="secondary"` 是放在 surface 之内的扁平形态。

<Demo name="date-range-field/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `aria-labelledby` 关联到整个区间输入，错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。区间的值是一个对象，只填了一端时另一端是 `null`，校验完整性写在对象层，错误才会落到这个字段上。

<Demo name="date-range-field/form" />

## 行为 {#behavior}

- 点击任意一段即可输入；点击输入面的空白处时，焦点落到第一个空段，开始日期填满时落到结束日期的第一段。
- 每段只接受数字，输入完一段后自动进入下一段，开始日期的最后一段填完后进入结束日期；左右方向键在段之间移动，上下方向键增减，退格清空当前段。
- 一侧的所有段都填满时才会更新该侧的值；清空任意一段后，该侧变为 `null`。
- 结束早于开始，或者任一侧超出 `min` 与 `max` 时，值仍然会更新，同时标为校验未通过。

## 无障碍 {#a11y}

- 各段是 `role="spinbutton"`，名称带「开始日期」或者「结束日期」前缀，分隔文字与分隔符对辅助技术隐藏。
- 通过 `aria-label` 或者 `aria-labelledby` 为整组命名。
- `invalid`、结束早于开始与超出范围都会在组元素上设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性          | 类型                                      | 默认值      | 说明                                       |
| ------------- | ----------------------------------------- | ----------- | ------------------------------------------ |
| `modelValue`  | `DateRangeValue \| null`                  | `null`      | `{ start, end }`，两侧都是 ISO 8601 字符串 |
| `placeholder` | `string`                                  | 今天        | 空值时各段的起点，ISO 8601 字符串          |
| `min`         | `string`                                  | —           | 可选范围的下限                             |
| `max`         | `string`                                  | —           | 可选范围的上限                             |
| `granularity` | `'day' \| 'hour' \| 'minute' \| 'second'` | `'day'`     | 精度                                       |
| `hourCycle`   | `12 \| 24`                                | 随语言      | 小时制                                     |
| `clearable`   | `boolean`                                 | `false`     | 是否显示清除按钮                           |
| `readonly`    | `boolean`                                 | `false`     | 是否只读                                   |
| `name`        | `string`                                  | —           | 表单字段名                                 |
| `variant`     | `'primary' \| 'secondary'`                | `'primary'` | 形态                                       |
| `size`        | `'sm' \| 'md' \| 'lg'`                    | `'md'`      | 尺寸                                       |
| `disabled`    | `boolean`                                 | `false`     | 是否禁用                                   |
| `invalid`     | `boolean`                                 | `false`     | 是否处于校验未通过状态                     |
| `class`       | `string`                                  | —           | 追加至根元素的类名                         |

`DateRangeValue` 是 `{ start: string | null; end: string | null }`，可以从包入口导入。

### 插槽 {#slots}

| 插槽       | 说明             |
| ---------- | ---------------- |
| `leading`  | 前置附属格的内容 |
| `trailing` | 后置附属格的内容 |

### 事件 {#events}

| 事件                | 参数                            | 说明     |
| ------------------- | ------------------------------- | -------- |
| `update:modelValue` | `value: DateRangeValue \| null` | 值变化   |
| `clear`             | —                               | 点击清除 |
