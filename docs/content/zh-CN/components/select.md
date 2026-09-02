---
title: Select
description: 从列表中选择一项。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/select/Select.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/select/select.variants.ts
---

<Demo name="select/hero" />

## 用法 {#usage}

```ts
import { Select } from '@hina-ui/vue'
```

下拉选择框由触发器与浮层列表组成。`options` 提供选项，`v-model` 绑定选中的值。每个选项是 `{ value, label }`，可以附带 `description` 与 `disabled`；带 `options` 字段的项是分组。触发器与输入框共用同一副输入面。

<Demo name="select/basic" />

## 示例 {#examples}

### 分组 {#groups}

分组项带 `label` 与 `options`，可以与普通选项混排。

<Demo name="select/groups" />

### 定制内容 {#custom}

`option` 插槽定制列表中每一项的内容，`value` 插槽定制触发器里显示的内容，两者都能拿到当前选项。

<Demo name="select/custom" />

### 尺寸 {#sizes}

三档尺寸与输入框相同。

<Demo name="select/sizes" />

### 形态 {#variants}

`primary` 直接放在页面底色上，带边框与阴影；`secondary` 放在卡片等表面内，只有一层浅色底。

<Demo name="select/variants" />

### 状态 {#states}

`invalid` 标出校验未通过，`disabled` 禁用整个选择框，选项上的 `disabled` 只禁用该项。选项为空时列表显示提示。

<Demo name="select/states" />

## 行为 {#behavior}

- 浮层贴着触发器展开，宽度与触发器相同，列表超出高度时在浮层内滚动。
- 打开期间页面锁定滚动，点击外部或者按 Esc 关闭。
- 支持方向键、Home、End 以及输入首字母快速定位。
- 选中后浮层关闭，焦点回到触发器。

## 无障碍 {#a11y}

- 触发器为 `role="combobox"`，列表为 `role="listbox"`，选项为 `role="option"` 并带 `aria-selected`。
- 应当配合 `label` 元素或者 `aria-label` 提供名称。`invalid` 同时设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性          | 类型                       | 默认值      | 说明                              |
| ------------- | -------------------------- | ----------- | --------------------------------- |
| `modelValue`  | `string \| number \| null` | —           | 选中的值                          |
| `options`     | `SelectItems`              | —           | 选项，见下方类型                  |
| `placeholder` | `string`                   | 语言包      | 无值时显示的文字                  |
| `open`        | `boolean`                  | `false`     | 浮层是否打开，支持 `v-model:open` |
| `variant`     | `'primary' \| 'secondary'` | `'primary'` | 形态                              |
| `size`        | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                              |
| `invalid`     | `boolean`                  | `false`     | 是否校验未通过                    |
| `disabled`    | `boolean`                  | `false`     | 是否禁用                          |
| `class`       | `string`                   | —           | 追加至触发器的类名                |

### 插槽 {#slots}

| 插槽     | 参数                       | 说明               |
| -------- | -------------------------- | ------------------ |
| `value`  | `{ option: SelectOption }` | 触发器里显示的内容 |
| `option` | `{ option: SelectOption }` | 列表中每一项的内容 |

### 事件 {#events}

| 事件                | 参数                      | 说明         |
| ------------------- | ------------------------- | ------------ |
| `update:modelValue` | `value: string \| number` | 选中值变化   |
| `update:open`       | `open: boolean`           | 浮层开合变化 |

### 类型 {#types}

```ts
interface SelectOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

type SelectItems = Array<SelectOption | SelectOptionGroup>
```
