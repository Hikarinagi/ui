---
title: RadioGroup
description: 从多项中选择一项的单选框组。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/radio-group/RadioGroup.vue
  - label: RadioGroup
    href: https://reka-ui.com/docs/components/radio-group
---

<Demo name="radio-group/hero" />

## 用法 {#usage}

```ts
import { RadioGroup } from '@hina-ui/vue'
```

单选框组按 `options` 渲染一列单选框，`v-model` 绑定选中的值，选项的类型与 `Select` 相同。未声明的属性都会传给根元素，应当用 `aria-label` 或者 `aria-labelledby` 给整组命名。单选框只以组的形式提供，没有单独的 `Radio`。

<Demo name="radio-group/basic" />

## 示例 {#examples}

### 横排 {#horizontal}

`orientation` 为 `horizontal` 时选项横向排列，放不下时折行。

<Demo name="radio-group/horizontal" />

### 描述 {#description}

选项的 `description` 显示在文字下方。

<Demo name="radio-group/description" />

### 尺寸 {#sizes}

`size` 下发到每个单选框，圆与文字随档位变化。

<Demo name="radio-group/sizes" />

### 状态 {#states}

选项上的 `disabled` 只禁用该项，组上的 `disabled` 禁用整组；`invalid` 落到每个圆。

<Demo name="radio-group/states" />

### 定制内容 {#custom}

`option` 插槽定制每一项的文字。

<Demo name="radio-group/custom" />

## 行为 {#behavior}

- 点击文字或者圆即选中该项，已选中的项不能再点成未选中。
- 整组只占一个 Tab 停靠点，落在已选项上；方向键在项之间移动焦点并同时选中，禁用项会被跳过，到底后回到另一端。与原生单选框一致。

## 无障碍 {#a11y}

- 根元素是 `role="radiogroup"`，通过 `aria-label` 或者 `aria-labelledby` 命名；每一项是 `role="radio"` 的按钮，带 `aria-checked`，外层 `label` 的文字即名称。
- `invalid` 会给每个单选框设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性          | 类型                         | 默认值       | 说明                       |
| ------------- | ---------------------------- | ------------ | -------------------------- |
| `modelValue`  | `string \| number \| null`   | —            | 选中的值                   |
| `options`     | `SelectOption[]`             | —            | 选项，类型与 `Select` 相同 |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 排列方向                   |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`       | 每个单选框的尺寸           |
| `disabled`    | `boolean`                    | `false`      | 是否禁用整组               |
| `invalid`     | `boolean`                    | `false`      | 是否处于校验未通过状态     |
| `class`       | `string`                     | —            | 追加至根元素的类名         |

### 插槽 {#slots}

| 插槽     | 参数                       | 说明         |
| -------- | -------------------------- | ------------ |
| `option` | `{ option: SelectOption }` | 每一项的文字 |

### 事件 {#events}

| 事件                | 参数                      | 说明       |
| ------------------- | ------------------------- | ---------- |
| `update:modelValue` | `value: string \| number` | 选中值变化 |
