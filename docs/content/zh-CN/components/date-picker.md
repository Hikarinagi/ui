---
title: DatePicker
description: 输入或者从日历中选择日期。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/date-picker/DatePicker.vue
  - label: Popover
    href: https://reka-ui.com/docs/components/popover
---

<Demo name="date-picker/hero" />

## 用法 {#usage}

```ts
import { DatePicker } from '@hina-ui/vue'
```

日期选择器把 `DateField` 的分段输入面与 `Calendar` 组合在一起：可以直接在各段里输入，也可以点击末尾的按钮打开日历选择。`v-model` 绑定 `YYYY-MM-DD` 格式的 ISO 8601 字符串，与两者一致。未声明的属性都会传给包裹各段的组元素，请用 `aria-label` 或者 `aria-labelledby` 命名。

<Demo name="date-picker/basic" />

## 示例 {#examples}

### 范围与不可选的日期 {#range}

`min` 与 `max` 同时约束输入与日历，`unavailable` 把某些日期标为不可选。

<Demo name="date-picker/range" />

### 可清除 {#clearable}

`clearable` 在各段之后加一个清除按钮，清空后值为 `null`。

<Demo name="date-picker/clearable" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，与同档输入框等高，浮层里的日历使用同一档尺寸。

<Demo name="date-picker/sizes" />

### 状态 {#states}

`invalid` 给输入面加上警示色，`disabled` 禁用整组，`readonly` 只读。`variant="secondary"` 是放在 surface 之内的扁平形态。

<Demo name="date-picker/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签关联到输入区，说明与错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。

<Demo name="date-picker/form" />

## 行为 {#behavior}

- 点击末尾的按钮打开日历，焦点落在当前选中的日期；选中日期后更新值并关闭日历，焦点回到按钮。
- 日历是模态浮层：打开期间焦点保持在日历里，页面停止滚动，点击日历以外的任何地方都会关闭它，包括输入面本身。
- Esc 关闭日历，焦点回到按钮。在日历的月份与年份视图里，Esc 先逐级返回。
- 日历在输入面下方展开，与输入面的左缘对齐。

## 无障碍 {#a11y}

- 各段与日历的无障碍语义分别见 `DateField` 与 `Calendar`。
- 打开日历的按钮带有语言包给出的名称与 `aria-expanded`。
- 通过 `aria-label` 或者 `aria-labelledby` 为整组命名。

## API {#api}

### Props {#props}

| 属性            | 类型                              | 默认值      | 说明                         |
| --------------- | --------------------------------- | ----------- | ---------------------------- |
| `modelValue`    | `string \| null`                  | `null`      | 选中的日期，`YYYY-MM-DD`     |
| `open`          | `boolean`                         | `false`     | 日历是否打开，`v-model:open` |
| `placeholder`   | `string`                          | 今天        | 空值时各段与日历的起点       |
| `min`           | `string`                          | —           | 可选范围的下限               |
| `max`           | `string`                          | —           | 可选范围的上限               |
| `unavailable`   | `(date: string) => boolean`       | —           | 判定某一天是否不可选         |
| `weekStartsOn`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | 随语言      | 一周从周几开始               |
| `weekdayFormat` | `'narrow' \| 'short'`             | `'narrow'`  | 星期名称的格式               |
| `fixedWeeks`    | `boolean`                         | `true`      | 日历是否固定显示六周         |
| `clearable`     | `boolean`                         | `false`     | 是否显示清除按钮             |
| `readonly`      | `boolean`                         | `false`     | 是否只读                     |
| `name`          | `string`                          | —           | 表单字段名                   |
| `variant`       | `'primary' \| 'secondary'`        | `'primary'` | 形态                         |
| `size`          | `'sm' \| 'md' \| 'lg'`            | `'md'`      | 尺寸                         |
| `disabled`      | `boolean`                         | `false`     | 是否禁用                     |
| `invalid`       | `boolean`                         | `false`     | 是否处于校验未通过状态       |
| `class`         | `string`                          | —           | 追加至根元素的类名           |

### 插槽 {#slots}

| 插槽      | 说明             |
| --------- | ---------------- |
| `leading` | 前置附属格的内容 |

### 事件 {#events}

| 事件                | 参数                    | 说明         |
| ------------------- | ----------------------- | ------------ |
| `update:modelValue` | `value: string \| null` | 值变化       |
| `update:open`       | `open: boolean`         | 日历开合变化 |
| `clear`             | —                       | 点击清除     |
