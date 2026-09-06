---
title: NumberInput
description: 输入数值的输入框。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/number-input/NumberInput.vue
  - label: NumberField
    href: https://reka-ui.com/docs/components/number-field
---

<Demo name="number-input/hero" />

## 用法 {#usage}

```ts
import { NumberInput } from '@hina-ui/vue'
```

数值输入框由输入区与一组步进按钮组成，`v-model` 绑定数值。方向键、Page Up 与 Page Down、Home 与 End 以及聚焦时的滚轮都能调整数值。未声明的属性都会传给内部的 `input`。

<Demo name="number-input/basic" />

## 示例 {#examples}

### 范围与步长 {#range}

`min` 与 `max` 限定范围，`step` 决定每次增减的幅度。默认把输入的值对齐到步长，关闭 `stepSnapping` 后只限制在范围内。

<Demo name="number-input/range" />

### 格式 {#format}

`formatOptions` 接受 `Intl.NumberFormat` 的选项，货币、百分比与单位都能显示。`locale` 决定分隔符与符号的写法，未设置时跟随语言包的语言。

<Demo name="number-input/format" />

### 尺寸 {#sizes}

三档尺寸与输入框相同。

<Demo name="number-input/sizes" />

### 形态 {#variants}

`primary` 直接放在页面底色上，带边框与阴影；`secondary` 放在卡片等表面内，只有一层浅色底。

<Demo name="number-input/variants" />

### 状态 {#states}

`invalid` 标出校验未通过，`disabled` 不可编辑，`readonly` 可以聚焦与复制但不能修改。

<Demo name="number-input/states" />

### 不带步进按钮 {#controls}

关闭 `controls` 后只保留输入区，键盘与滚轮仍然有效。

<Demo name="number-input/controls" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签指向输入框，说明与错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。值是数字或者 `null`，范围规则写在数字层。

<Demo name="number-input/form" />

## 行为 {#behavior}

- 失焦或者按 Enter 时解析输入。无法解析时恢复为上一个值，超出范围的值限制到边界。
- 输入时拒绝不能构成数字的字符。
- 步进按钮支持按住连续增减，到达边界的一侧会禁用。
- 悬停、聚焦、错误与禁用的表现与输入框相同。

## 无障碍 {#a11y}

- 根元素为 `role="group"`，输入区为 `role="spinbutton"`，带 `aria-valuenow`、`aria-valuemin` 与 `aria-valuemax`。
- 步进按钮不进入 Tab 序列，键盘用户用方向键调整。按钮名称随语言包本地化。
- 应当配合 `label` 元素或者 `aria-label` 提供名称。`invalid` 同时设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性            | 类型                       | 默认值      | 说明               |
| --------------- | -------------------------- | ----------- | ------------------ |
| `modelValue`    | `number \| null`           | —           | 数值               |
| `defaultValue`  | `number`                   | —           | 非受控时的初始值   |
| `min`           | `number`                   | —           | 最小值             |
| `max`           | `number`                   | —           | 最大值             |
| `step`          | `number`                   | `1`         | 步长               |
| `stepSnapping`  | `boolean`                  | `true`      | 是否把值对齐到步长 |
| `formatOptions` | `Intl.NumberFormatOptions` | —           | 显示格式           |
| `locale`        | `string`                   | —           | 格式化所用的语言   |
| `controls`      | `boolean`                  | `true`      | 是否显示步进按钮   |
| `variant`       | `'primary' \| 'secondary'` | `'primary'` | 形态               |
| `size`          | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸               |
| `invalid`       | `boolean`                  | `false`     | 是否校验未通过     |
| `disabled`      | `boolean`                  | `false`     | 是否禁用           |
| `readonly`      | `boolean`                  | `false`     | 是否只读           |
| `class`         | `string`                   | —           | 追加至根元素的类名 |

| 事件                | 参数                         | 说明     |
| ------------------- | ---------------------------- | -------- |
| `update:modelValue` | `value: number \| undefined` | 数值变化 |
