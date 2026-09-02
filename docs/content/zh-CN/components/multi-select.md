---
title: MultiSelect
description: 从列表中选择多项。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/multi-select/MultiSelect.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/multi-select/multi-select.variants.ts
---

<Demo name="multi-select/hero" />

## 用法 {#usage}

```ts
import { MultiSelect } from '@hina-ui/vue'
```

多选框与 `Select` 共用同一套选项数据与列表，`v-model` 绑定选中值的数组。已选项以标签显示在触发器里，每个标签可以单独移除；设置 `clearable` 后末尾出现清除按钮，一次清空全部。选择后列表保持展开，方便连续勾选。

<Demo name="multi-select/basic" />

## 示例 {#examples}

### 分组 {#groups}

分组项带 `label` 与 `options`，可以与普通选项混排。

<Demo name="multi-select/groups" />

### 显示数量 {#max-visible}

触发器高度固定，只显示前 `maxVisible` 个标签，其余折成「+N」。

<Demo name="multi-select/max-visible" />

### 定制内容 {#custom}

`option` 插槽定制列表中每一项的内容。

<Demo name="multi-select/custom" />

### 可清除 {#clearable}

`clearable` 在末尾加一个按钮，点击后清空全部。每个标签自带移除按钮，所以默认不显示它。

<Demo name="multi-select/clearable" />

### 尺寸 {#sizes}

三档尺寸与输入框相同，标签随之缩放。

<Demo name="multi-select/sizes" />

### 形态 {#variants}

`primary` 直接放在页面底色上，带边框与阴影；`secondary` 放在卡片等表面内，只有一层浅色底。

<Demo name="multi-select/variants" />

### 状态 {#states}

`invalid` 标出校验未通过，`disabled` 禁用整个多选框。

<Demo name="multi-select/states" />

## 行为 {#behavior}

- 点选或者按 Enter 勾选一项后列表保持展开，再次点选取消勾选。
- 点击标签上的移除按钮与末尾的清除按钮不会打开列表。
- 清空按钮的出现与消失有过渡。
- 浮层贴着触发器展开，宽度与触发器相同，列表超出高度时在浮层内滚动。
- 打开期间页面锁定滚动，点击外部或者按 Esc 关闭。

## 无障碍 {#a11y}

- 触发器为 `role="combobox"`，列表为 `role="listbox"`，选项为 `role="option"` 并带 `aria-selected`。
- 标签的移除按钮与清除按钮都有本地化名称，可以用 Tab 到达。
- 应当配合 `label` 元素或者 `aria-label` 提供名称。`invalid` 同时设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性          | 类型                       | 默认值      | 说明                              |
| ------------- | -------------------------- | ----------- | --------------------------------- |
| `modelValue`  | `Array<string \| number>`  | `[]`        | 选中的值                          |
| `options`     | `SelectItems`              | —           | 选项，类型与 `Select` 相同        |
| `placeholder` | `string`                   | 语言包      | 无值时显示的文字                  |
| `maxVisible`  | `number`                   | `2`         | 触发器里最多显示的标签数          |
| `clearable`   | `boolean`                  | `false`     | 是否显示清空全部的按钮            |
| `open`        | `boolean`                  | `false`     | 浮层是否打开，支持 `v-model:open` |
| `variant`     | `'primary' \| 'secondary'` | `'primary'` | 形态                              |
| `size`        | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                              |
| `invalid`     | `boolean`                  | `false`     | 是否校验未通过                    |
| `disabled`    | `boolean`                  | `false`     | 是否禁用                          |
| `class`       | `string`                   | —           | 追加至触发器的类名                |

### 插槽 {#slots}

| 插槽     | 参数                       | 说明               |
| -------- | -------------------------- | ------------------ |
| `option` | `{ option: SelectOption }` | 列表中每一项的内容 |

### 事件 {#events}

| 事件                | 参数                             | 说明         |
| ------------------- | -------------------------------- | ------------ |
| `update:modelValue` | `value: Array<string \| number>` | 选中值变化   |
| `update:open`       | `open: boolean`                  | 浮层开合变化 |
| `clear`             | —                                | 全部清空     |
