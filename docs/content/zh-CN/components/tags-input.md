---
title: TagsInput
description: 输入并以标签形式保存多个值。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tags-input/TagsInput.vue
  - label: TagsInput
    href: https://reka-ui.com/docs/components/tags-input
---

<Demo name="tags-input/hero" />

## 用法 {#usage}

```ts
import { TagsInput } from '@hina-ui/vue'
```

标签输入框在一个输入面里保存多个值，每个值显示为一枚可移除的标签。`v-model` 绑定字符串数组。在输入区键入文字后按 Enter，或者键入分隔符，就把文字加成标签；标签多到一行放不下时输入面向下增高。未声明的属性都会传给内部的文本输入，请用 `aria-label` 或者 `aria-labelledby` 命名。

<Demo name="tags-input/basic" />

它与 `MultiSelect` 的区别在于值的来源：多选选择器从给定的选项中挑选，标签输入框接受任意文字。

## 示例 {#examples}

### 数量上限与重复 {#max}

`max` 限制标签数量，`duplicate` 决定是否允许重复。被拒绝的输入会触发 `invalid` 事件，参数是那段文字。

<Demo name="tags-input/max" />

### 分隔符与粘贴 {#delimiter}

`delimiter` 默认为逗号，可以换成其他字符或者正则表达式。`addOnPaste` 默认开启，粘贴的文字按分隔符拆成多个标签；`addOnBlur` 让输入区失焦时也把剩余文字加成标签。

<Demo name="tags-input/delimiter" />

### 可清空 {#clearable}

`clearable` 在末尾显示清除按钮，一次移除全部标签，并触发 `clear` 事件。

<Demo name="tags-input/clearable" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，没有标签时的高度与同档输入框相等。

<Demo name="tags-input/sizes" />

### 状态 {#states}

`invalid` 给输入面加上警示色，`disabled` 禁用整组，标签不可移除。`variant="secondary"` 是放在 surface 之内的扁平形态。

<Demo name="tags-input/states" />

## 行为 {#behavior}

- Enter 或者分隔符把当前文字加成标签并清空输入区。
- 输入区为空时按退格移除末尾的标签。
- 点击标签或者输入面的空白处即聚焦输入区。
- 每枚标签末尾有移除按钮，点击即移除。
- 超过 `max` 或者重复的值不会加入，触发 `invalid`。

## 无障碍 {#a11y}

- 文本输入通过 `aria-label` 或者 `aria-labelledby` 命名，未声明的属性都会传给它。
- 每枚标签的移除按钮带有语言包给出的名称。
- `invalid` 会同时在文本输入上设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性          | 类型                       | 默认值      | 说明                         |
| ------------- | -------------------------- | ----------- | ---------------------------- |
| `modelValue`  | `string[]`                 | `[]`        | 标签列表                     |
| `placeholder` | `string`                   | —           | 输入区的占位文字             |
| `max`         | `number`                   | `0`         | 标签数量上限，`0` 表示不限   |
| `duplicate`   | `boolean`                  | `false`     | 是否允许重复的标签           |
| `delimiter`   | `string \| RegExp`         | `','`       | 分隔符                       |
| `addOnPaste`  | `boolean`                  | `true`      | 粘贴时是否按分隔符加成标签   |
| `addOnBlur`   | `boolean`                  | `false`     | 失焦时是否把剩余文字加成标签 |
| `clearable`   | `boolean`                  | `false`     | 是否显示清除按钮             |
| `name`        | `string`                   | —           | 表单字段名                   |
| `variant`     | `'primary' \| 'secondary'` | `'primary'` | 形态                         |
| `size`        | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                         |
| `disabled`    | `boolean`                  | `false`     | 是否禁用                     |
| `invalid`     | `boolean`                  | `false`     | 是否处于校验未通过状态       |
| `class`       | `string`                   | —           | 追加至根元素的类名           |

### 事件 {#events}

| 事件                | 参数              | 说明               |
| ------------------- | ----------------- | ------------------ |
| `update:modelValue` | `value: string[]` | 标签列表变化时     |
| `invalid`           | `value: string`   | 输入被拒绝时       |
| `clear`             | —                 | 点击清除按钮清空后 |
