---
title: MultiCombobox
description: 输入搜索并选择多项。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/multi-combobox/MultiCombobox.vue
  - label: Combobox
    href: https://reka-ui.com/docs/components/combobox
---

<Demo name="multi-combobox/hero" />

## 用法 {#usage}

```ts
import { MultiCombobox } from '@hina-ui/vue'
```

多选组合框是 `Combobox` 的多值形态：在同一个输入面里输入文字缩小范围，从列表中选择多项，已选项以标签排在输入区前面，放不下时换行。`v-model` 绑定选中值的数组，`options` 的类型与 `Select` 相同。未声明的属性都会传给内部的文本输入，请用 `aria-label` 或者 `aria-labelledby` 命名。

<Demo name="multi-combobox/basic" />

它与 `MultiSelect` 的区别在于能否输入：多选选择器只能从固定的选项里挑选，浮层打开期间锁定页面滚动；多选组合框通过输入文字缩小范围，浮层不锁定页面滚动，输入区始终可以输入。与 `TagsInput` 的区别在于值的来源：标签输入框接受任意文字，这里的值必须来自选项。

## 示例 {#examples}

### 远程搜索 {#remote}

下面的示例请求一个真实的搜索接口：`ignoreFilter` 关闭本地筛选，`v-model:search` 把输入的文字交给调用方，调用方用 VueUse 的 `refDebounced` 防抖 300 毫秒，再用 `useFetch` 在搜索词变化时重新请求并取消上一次请求，取回结果后写入 `options`，`loading` 为真时展开箭头换成加载指示器。组件会记住出现过的每个选项的名称，结果列表随搜索词变化时，已选标签仍然显示名称；编辑已有数据时，只需在初始的 `options` 里包含当前已选的项。请求的防抖与取消由调用方负责。

<Demo name="multi-combobox/remote" />

### 定制内容 {#custom}

`option` 插槽定制列表中每一项的内容，例如加上封面与编号。

<Demo name="multi-combobox/custom" />

### 可清除 {#clearable}

`clearable` 在末尾加一个清除按钮，点击后清空全部并把焦点交回输入区。每个标签都有移除按钮，所以默认不显示清除按钮。

<Demo name="multi-combobox/clearable" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，没有已选项时的高度与同档输入框相等。

<Demo name="multi-combobox/sizes" />

### 状态 {#states}

`invalid` 给输入面加上警示色，`disabled` 禁用整组。`variant="secondary"` 是放在 surface 之内的扁平形态。

<Demo name="multi-combobox/states" />

## 行为 {#behavior}

- 输入即打开列表并筛选；上下方向键移动高亮，Enter 勾选或者取消勾选，列表保持展开，搜索词与筛选结果保留，方便在同一批结果里连续勾选；清空输入即回到完整列表。
- 点击输入面的空白处或者标签正文即聚焦输入区并打开列表，与点击输入区相同。
- 输入区为空时按退格移除最后一个标签。
- Esc 或者点击外部关闭列表。浮层不锁定页面滚动。
- 已选项在列表中保持勾选状态，再次选择即取消。

## 无障碍 {#a11y}

- 文本输入是 `role="combobox"`，列表为 `role="listbox"`，选项为 `role="option"` 并带 `aria-selected`。
- 通过 `aria-label` 或者 `aria-labelledby` 为文本输入命名；标签的移除按钮、清除按钮与展开按钮都有本地化名称。
- `invalid` 会同时在文本输入上设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性           | 类型                       | 默认值      | 说明                                 |
| -------------- | -------------------------- | ----------- | ------------------------------------ |
| `modelValue`   | `Array<string \| number>`  | `[]`        | 选中的值                             |
| `options`      | `SelectItems`              | —           | 选项，类型与 `Select` 相同           |
| `placeholder`  | `string`                   | 语言包      | 无已选项时输入区的占位文字           |
| `search`       | `string`                   | `''`        | 输入区的文字，支持 `v-model:search`  |
| `ignoreFilter` | `boolean`                  | `false`     | 是否关闭本地筛选，交给调用方远程搜索 |
| `loading`      | `boolean`                  | `false`     | 是否把展开箭头换成加载指示器         |
| `clearable`    | `boolean`                  | `false`     | 是否显示清空全部的按钮               |
| `name`         | `string`                   | —           | 表单字段名                           |
| `open`         | `boolean`                  | `false`     | 浮层是否打开，支持 `v-model:open`    |
| `variant`      | `'primary' \| 'secondary'` | `'primary'` | 形态                                 |
| `size`         | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                                 |
| `disabled`     | `boolean`                  | `false`     | 是否禁用                             |
| `invalid`      | `boolean`                  | `false`     | 是否处于校验未通过状态               |
| `class`        | `string`                   | —           | 追加至根元素的类名                   |

### 插槽 {#slots}

| 插槽     | 参数                       | 说明               |
| -------- | -------------------------- | ------------------ |
| `option` | `{ option: SelectOption }` | 列表中每一项的内容 |

### 事件 {#events}

| 事件                | 参数                             | 说明         |
| ------------------- | -------------------------------- | ------------ |
| `update:modelValue` | `value: Array<string \| number>` | 选中值变化   |
| `update:search`     | `value: string`                  | 输入文字变化 |
| `update:open`       | `open: boolean`                  | 浮层开合变化 |
| `clear`             | —                                | 全部清空     |
