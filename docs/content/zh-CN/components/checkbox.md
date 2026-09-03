---
title: Checkbox
description: 勾选一项，或者从多项中勾选若干。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/checkbox/Checkbox.vue
  - label: Checkbox
    href: https://reka-ui.com/docs/components/checkbox
---

<Demo name="checkbox/hero" />

## 用法 {#usage}

```ts
import { Checkbox } from '@hina-ui/vue'
```

复选框把方框与它的文字合成一个可点击的整体。`v-model` 绑定布尔值，值为 `'indeterminate'` 时显示半选。默认插槽是文字，点文字与点方框都会切换。未声明的属性都会传给内部的方框元素。

<Demo name="checkbox/basic" />

## 示例 {#examples}

### 描述 {#description}

`description` 在文字下方补一行说明，字号比文字小一档。

<Demo name="checkbox/description" />

### 半选 {#indeterminate}

值为 `'indeterminate'` 时显示横线。常见的用法是「全选」：子项部分选中时父项半选，点击父项后全部选中。

<Demo name="checkbox/indeterminate" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，方框分别为 14、16、18 像素，文字随档位变化。

<Demo name="checkbox/sizes" />

### 状态 {#states}

`invalid` 把方框的边框改为警示色；`disabled` 禁用整个控件。

<Demo name="checkbox/states" />

### 仅方框 {#bare}

没有文字时只渲染方框，此时必须用 `aria-label` 命名。表格的行选择就是这种情形。

<Demo name="checkbox/bare" />

## 行为 {#behavior}

- 点击文字或者方框都会切换。键盘 Tab 落在方框上，空格切换，Enter 不切换，与原生复选框一致。
- 半选状态点击一次变为选中。
- 悬停整个控件时方框落墨，按下时加深；勾以缩放淡入进场，取消时淡出。

## 无障碍 {#a11y}

- 方框是 `role="checkbox"` 的按钮，带 `aria-checked`，半选为 `mixed`。根元素是 `label`，文字即名称。
- 没有文字时通过 `aria-label` 或者 `aria-labelledby` 命名。
- `invalid` 会同时设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性          | 类型                         | 默认值  | 说明                               |
| ------------- | ---------------------------- | ------- | ---------------------------------- |
| `modelValue`  | `boolean \| 'indeterminate'` | `false` | 是否选中，`'indeterminate'` 为半选 |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`  | 尺寸                               |
| `description` | `string`                     | —       | 文字下方的说明                     |
| `disabled`    | `boolean`                    | `false` | 是否禁用                           |
| `invalid`     | `boolean`                    | `false` | 是否处于校验未通过状态             |
| `class`       | `string`                     | —       | 追加至根元素的类名                 |

### 插槽 {#slots}

| 插槽      | 参数 | 说明 |
| --------- | ---- | ---- |
| `default` | —    | 文字 |

### 事件 {#events}

| 事件                | 参数             | 说明     |
| ------------------- | ---------------- | -------- |
| `update:modelValue` | `value: boolean` | 值变化时 |
