---
title: DateField
description: 分段输入日期与时间。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/date-field/DateField.vue
  - label: DateField
    href: https://reka-ui.com/docs/components/date-field
---

<Demo name="date-field/hero" />

## 用法 {#usage}

```ts
import { DateField } from '@hina-ui/vue'
```

日期输入框把日期拆成年、月、日三段，每段只接受数字，输入完一段后自动进入下一段，上下方向键逐段增减。`v-model` 绑定 ISO 8601 字符串：只有日期时是 `YYYY-MM-DD`，带时间时是 `YYYY-MM-DDTHH:mm`，与浏览器原生日期控件的格式相同，可以直接提交或者写入接口。段的顺序、分隔符与占位文字随当前语言变化，中文是「年 / 月 / 日」。未声明的属性都会传给包裹各段的组元素，请用 `aria-label` 或者 `aria-labelledby` 命名。

<Demo name="date-field/basic" />

## 示例 {#examples}

### 日期与时间 {#datetime}

`granularity` 决定精度：默认 `day` 只有日期，`hour` 增加小时，`minute` 增加小时与分钟，`second` 再增加秒。`hourCycle` 指定 12 小时制或者 24 小时制，默认随语言决定。

<Demo name="date-field/datetime" />

### 范围 {#range}

`min` 与 `max` 限定可选范围，值超出范围时输入框显示为校验未通过，但值仍然会更新。`placeholder` 指定没有值时各段从哪个日期开始增减，默认是今天。

<Demo name="date-field/range" />

### 可清除 {#clearable}

`clearable` 在末尾加一个清除按钮，清空后值为 `null`，焦点回到第一段。

<Demo name="date-field/clearable" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，与同档输入框等高。

<Demo name="date-field/sizes" />

### 状态 {#states}

`invalid` 给输入面加上警示色，`disabled` 禁用整组，`readonly` 只读，仍然可以聚焦与选中。`variant="secondary"` 是放在 surface 之内的扁平形态。

<Demo name="date-field/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `aria-labelledby` 关联到整个日期输入，说明与错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。值是 ISO 字符串，可以直接按字符串比较。

<Demo name="date-field/form" />

## 行为 {#behavior}

- 点击任意一段即可输入；点击输入面的空白处时，焦点落到第一个空段。
- 每段只接受数字，输入完一段后自动进入下一段；左右方向键在段之间移动，上下方向键增减，退格清空当前段。
- 所有段都填满时才会更新值；清空任意一段后，值变为 `null`。
- 超出 `min` 或者 `max` 的值仍然会更新，同时标为校验未通过。

## 无障碍 {#a11y}

- 各段是 `role="spinbutton"`，带本地化名称与当前值，分隔符对辅助技术隐藏。
- 通过 `aria-label` 或者 `aria-labelledby` 为整组命名。
- `invalid` 与超出范围都会在组元素上设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性          | 类型                                      | 默认值      | 说明                                  |
| ------------- | ----------------------------------------- | ----------- | ------------------------------------- |
| `modelValue`  | `string \| null`                          | `null`      | ISO 8601 字符串，精度随 `granularity` |
| `placeholder` | `string`                                  | 今天        | 空值时各段的起点，ISO 8601 字符串     |
| `min`         | `string`                                  | —           | 可选范围的下限                        |
| `max`         | `string`                                  | —           | 可选范围的上限                        |
| `granularity` | `'day' \| 'hour' \| 'minute' \| 'second'` | `'day'`     | 精度                                  |
| `hourCycle`   | `12 \| 24`                                | 随语言      | 小时制                                |
| `clearable`   | `boolean`                                 | `false`     | 是否显示清除按钮                      |
| `readonly`    | `boolean`                                 | `false`     | 是否只读                              |
| `name`        | `string`                                  | —           | 表单字段名                            |
| `variant`     | `'primary' \| 'secondary'`                | `'primary'` | 形态                                  |
| `size`        | `'sm' \| 'md' \| 'lg'`                    | `'md'`      | 尺寸                                  |
| `disabled`    | `boolean`                                 | `false`     | 是否禁用                              |
| `invalid`     | `boolean`                                 | `false`     | 是否处于校验未通过状态                |
| `class`       | `string`                                  | —           | 追加至根元素的类名                    |

### 插槽 {#slots}

| 插槽       | 说明             |
| ---------- | ---------------- |
| `leading`  | 前置附属格的内容 |
| `trailing` | 后置附属格的内容 |

### 事件 {#events}

| 事件                | 参数                    | 说明     |
| ------------------- | ----------------------- | -------- |
| `update:modelValue` | `value: string \| null` | 值变化   |
| `clear`             | —                       | 点击清除 |
