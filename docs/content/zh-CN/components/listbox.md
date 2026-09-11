---
title: Listbox
description: 常驻的可选列表。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/listbox/Listbox.vue
  - label: Listbox
    href: https://reka-ui.com/docs/components/listbox
---

<Demo name="listbox/hero" />

## 用法 {#usage}

```ts
import { Listbox } from '@hina-ui/vue'
```

列表框把可选项常驻在页面上，与 `Select` 共用同一套选项数据。`v-model` 绑定选中的值，设置 `multiple` 后绑定数组。列表超过 `maxHeight` 时在框内滚动。未声明的属性都会传给内部的列表元素。

<Demo name="listbox/basic" />

## 示例 {#examples}

### 多选 {#multiple}

设置 `multiple` 后可以同时选中多项，再次点选取消。

<Demo name="listbox/multiple" />

### 分组 {#groups}

分组项带 `label` 与 `options`，可以与普通选项混排。

<Demo name="listbox/groups" />

### 定制内容 {#custom}

`option` 插槽定制每一项的内容。

<Demo name="listbox/custom" />

### 滚动 {#scroll}

`maxHeight` 限制列表高度，默认 `20rem`，超出后在框内滚动。

<Demo name="listbox/scroll" />

### 形态 {#variants}

`primary` 直接放在页面底色上，带边框与阴影；`secondary` 放在卡片等表面内，只有一层浅色底。

`bare` 去除根容器的背景、边框、阴影和圆角，适合由外层 Card、Sheet 或 Popover 提供表面的场景。选项样式与滚动行为仍然保留。

<Demo name="listbox/variants" />

### 内边距 {#padding}

`padded` 默认为 `true`，设为 `false` 可去掉内部列表外围的 4px 留白，与 `variant` 独立。选项和分组标题自身的内边距不变。`class` 仍用于根容器。

<Demo name="listbox/padding" />

### 状态 {#states}

`disabled` 禁用整个列表，选项上的 `disabled` 只禁用该项。

<Demo name="listbox/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `aria-labelledby` 关联到列表，错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。

<Demo name="listbox/form" />

## 行为 {#behavior}

- 点选切换选中。键盘 Tab 进入列表后，方向键移动高亮，Enter 或者空格选中，禁用项会被跳过。
- 列表超出高度时在框内滚动，键盘高亮跟随滚动。

## 无障碍 {#a11y}

- 列表为 `role="listbox"`，多选时带 `aria-multiselectable`；选项为 `role="option"` 并带 `aria-selected`；分组为 `role="group"` 并关联其标签。
- 应当通过 `aria-label` 或者 `aria-labelledby` 给列表命名。

## API {#api}

### Props {#props}

| 属性         | 类型                                                  | 默认值      | 说明                       |
| ------------ | ----------------------------------------------------- | ----------- | -------------------------- |
| `modelValue` | `string \| number \| null \| Array<string \| number>` | —           | 选中的值，多选时为数组     |
| `options`    | `SelectItems`                                         | —           | 选项，类型与 `Select` 相同 |
| `multiple`   | `boolean`                                             | `false`     | 是否多选                   |
| `maxHeight`  | `string`                                              | `'20rem'`   | 列表的最大高度             |
| `padded`     | `boolean`                                             | `true`      | 是否保留内部列表外围留白   |
| `variant`    | `'primary' \| 'secondary' \| 'bare'`                  | `'primary'` | 形态                       |
| `disabled`   | `boolean`                                             | `false`     | 是否禁用                   |
| `class`      | `string`                                              | —           | 追加至根元素的类名         |

### 插槽 {#slots}

| 插槽     | 参数                       | 说明         |
| -------- | -------------------------- | ------------ |
| `option` | `{ option: SelectOption }` | 每一项的内容 |

### 事件 {#events}

| 事件                | 参数                                                 | 说明       |
| ------------------- | ---------------------------------------------------- | ---------- |
| `update:modelValue` | `value: string \| number \| Array<string \| number>` | 选中值变化 |
