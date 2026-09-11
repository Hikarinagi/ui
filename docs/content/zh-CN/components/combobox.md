---
title: Combobox
description: 边输入边筛选的选择框。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/combobox/Combobox.vue
  - label: Combobox
    href: https://reka-ui.com/docs/components/combobox
---

<Demo name="combobox/hero" />

## 用法 {#usage}

```ts
import { Combobox } from '@hina-ui/vue'
```

组合框由输入框与浮层列表组成，与 `Select` 共用同一套选项数据。`v-model` 绑定选中的值，输入文字即按选项文字筛选列表，末尾的按钮展开或者收起列表。输入区与输入框共用同一副输入面，未声明的属性都会传给内部的 `input`。

<Demo name="combobox/basic" />

组件从 `options` 推断完整选项类型，插槽中的 `option` 保留额外字段及其类型；`v-model` 仍绑定 `value`。类型定义见 [Select](/components/select#types)。

## 示例 {#examples}

### 分组 {#groups}

分组项带 `label` 与 `options`，筛选时空的分组会一并隐藏。

<Demo name="combobox/groups" />

### 远程数据 {#remote}

设置 `ignoreFilter` 后组件不再自行筛选，`v-model:search` 拿到当前输入，由调用方决定 `options`。适用于向服务端搜索。

<Demo name="combobox/remote" />

### 可清除 {#clearable}

`clearable` 在有值时显示清除按钮，点击后清空值与输入文字。

<Demo name="combobox/clearable" />

### 尺寸 {#sizes}

三档尺寸与输入框相同。

<Demo name="combobox/sizes" />

### 形态 {#variants}

`primary` 直接放在页面底色上，带边框与阴影；`secondary` 放在卡片等表面内，只有一层浅色底。

<Demo name="combobox/variants" />

### 状态 {#states}

`invalid` 标出校验未通过，`disabled` 禁用整个组合框，选项上的 `disabled` 只禁用该项。

<Demo name="combobox/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签指向输入区，说明与错误信息由字段渲染并关联到控件；校验规则与提交交给 [Form](/components/form)。

<Demo name="combobox/form" />

## 行为 {#behavior}

- 点击输入区或者按下方向键打开列表，输入文字时按选项文字筛选，无匹配时显示提示。
- 选中后列表关闭，输入框显示选项文字；失焦时未选中的输入文字恢复为已选项，把文字删干净则清除选中值。
- 浮层贴着输入区展开，宽度与输入区相同，列表超出高度时在浮层内滚动。
- 展开按钮与清除按钮不会让输入区失焦。

## 无障碍 {#a11y}

- 输入区为 `role="combobox"` 并带 `aria-autocomplete="list"`，列表为 `role="listbox"`，选项为 `role="option"` 并带 `aria-selected`。
- 展开按钮不进入 Tab 序列，名称随语言包本地化。
- 应当配合 `label` 元素或者 `aria-label` 提供名称。`invalid` 同时设置 `aria-invalid`。

## API {#api}

### Props {#props}

`T extends SelectOption` 从 `options` 推断，默认是 `SelectOption`。

| 属性           | 类型                       | 默认值      | 说明                                            |
| -------------- | -------------------------- | ----------- | ----------------------------------------------- |
| `modelValue`   | `string \| number \| null` | —           | 选中的值                                        |
| `options`      | `SelectItems<T>`           | —           | 选项，类型见 [Select](/components/select#types) |
| `search`       | `string`                   | `''`        | 当前输入的文字，支持 `v-model:search`           |
| `placeholder`  | `string`                   | 语言包      | 无值时显示的文字                                |
| `ignoreFilter` | `boolean`                  | `false`     | 是否交由调用方筛选                              |
| `clearable`    | `boolean`                  | `false`     | 是否显示清除按钮                                |
| `open`         | `boolean`                  | `false`     | 浮层是否打开，支持 `v-model:open`               |
| `variant`      | `'primary' \| 'secondary'` | `'primary'` | 形态                                            |
| `size`         | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                                            |
| `invalid`      | `boolean`                  | `false`     | 是否校验未通过                                  |
| `disabled`     | `boolean`                  | `false`     | 是否禁用                                        |
| `class`        | `string`                   | —           | 追加至根元素的类名                              |

### 插槽 {#slots}

| 插槽     | 参数            | 说明               |
| -------- | --------------- | ------------------ |
| `option` | `{ option: T }` | 列表中每一项的内容 |

### 事件 {#events}

| 事件                | 参数                      | 说明         |
| ------------------- | ------------------------- | ------------ |
| `update:modelValue` | `value: string \| number` | 选中值变化   |
| `update:search`     | `search: string`          | 输入文字变化 |
| `update:open`       | `open: boolean`           | 浮层开合变化 |
| `clear`             | —                         | 被清空       |
