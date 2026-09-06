---
title: CheckboxGroup
description: 一组复选框，共用一个数组值。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/checkbox-group/CheckboxGroup.vue
  - label: Checkbox
    href: https://reka-ui.com/docs/components/checkbox
---

<Demo name="checkbox-group/hero" />

## 用法 {#usage}

```ts
import { CheckboxGroup } from '@hina-ui/vue'
```

复选框组按 `options` 渲染一列 `Checkbox`，`v-model` 绑定已选值的数组，选项的类型与 `Select` 相同。未声明的属性都会传给根元素，应当用 `aria-label` 或者 `aria-labelledby` 给整组命名。

<Demo name="checkbox-group/basic" />

## 示例 {#examples}

### 横排 {#horizontal}

`orientation` 为 `horizontal` 时选项横向排列，放不下时折行。

<Demo name="checkbox-group/horizontal" />

### 描述 {#description}

选项的 `description` 显示在文字下方。

<Demo name="checkbox-group/description" />

### 尺寸 {#sizes}

`size` 下发到每个复选框。

<Demo name="checkbox-group/sizes" />

### 状态 {#states}

选项上的 `disabled` 只禁用该项，组上的 `disabled` 禁用整组；`invalid` 落到每个方框。

<Demo name="checkbox-group/states" />

### 定制内容 {#custom}

`option` 插槽定制每一项的文字。

<Demo name="checkbox-group/custom" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `aria-labelledby` 关联到整组，说明与错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。

<Demo name="checkbox-group/form" />

## 行为 {#behavior}

- 点选把值加入数组，再点移除，数组顺序与点选顺序一致。
- 每个复选框都是独立的 Tab 停靠点，空格切换焦点所在项，方向键不移动焦点，与原生复选框组一致。

## 无障碍 {#a11y}

- 根元素是 `role="group"`，通过 `aria-label` 或者 `aria-labelledby` 命名；每一项沿用 `Checkbox` 的语义。

## API {#api}

### Props {#props}

| 属性          | 类型                         | 默认值       | 说明                       |
| ------------- | ---------------------------- | ------------ | -------------------------- |
| `modelValue`  | `Array<string \| number>`    | `[]`         | 已选值                     |
| `options`     | `SelectOption[]`             | —            | 选项，类型与 `Select` 相同 |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 排列方向                   |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`       | 每个复选框的尺寸           |
| `disabled`    | `boolean`                    | `false`      | 是否禁用整组               |
| `invalid`     | `boolean`                    | `false`      | 是否处于校验未通过状态     |
| `class`       | `string`                     | —            | 追加至根元素的类名         |

### 插槽 {#slots}

| 插槽     | 参数                       | 说明         |
| -------- | -------------------------- | ------------ |
| `option` | `{ option: SelectOption }` | 每一项的文字 |

### 事件 {#events}

| 事件                | 参数                             | 说明       |
| ------------------- | -------------------------------- | ---------- |
| `update:modelValue` | `value: Array<string \| number>` | 已选值变化 |
