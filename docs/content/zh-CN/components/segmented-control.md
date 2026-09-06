---
title: SegmentedControl
description: 在几个并列的选项中切换其一。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/segmented-control/SegmentedControl.vue
  - label: ToggleGroup
    href: https://reka-ui.com/docs/components/toggle-group
---

<Demo name="segmented-control/hero" />

## 用法 {#usage}

```ts
import { SegmentedControl } from '@hina-ui/vue'
```

分段控制器把几个并列的选项排成一行，任何时刻恰有一项被选中，选中项由一块滑块标示。`options` 的类型与 `Select` 相同，`v-model` 绑定选中项的值；未绑定值时默认选中第一个可用项。未声明的属性都会传给根元素，请用 `aria-label` 或者 `aria-labelledby` 为整组命名。

<Demo name="segmented-control/basic" />

它与 `RadioGroup` 表达同一种选择，区别在于场合：选项不多于五个、文字简短、切换立即生效时用分段控制器；选项需要说明文字，或者选择需要提交时用单选框组。与 `Tabs` 的区别是它改变的是一个值，不是切换显示的内容。

## 示例 {#examples}

### 自定义内容 {#custom}

`#option` 插槽替换每一项的内容。只放图标时，项的名称仍取 `label`，读屏软件照常读出。

<Demo name="segmented-control/custom" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，整体高度与同档的输入框相等，可以与输入框、按钮排在同一行。

<Demo name="segmented-control/sizes" />

### 撑满 {#block}

`block` 让控件占满父元素的宽度，各项等宽。

<Demo name="segmented-control/block" />

### 竖排 {#vertical}

`orientation="vertical"` 把各项竖向排列，滑块随之上下移动。

<Demo name="segmented-control/vertical" />

### 状态 {#states}

`disabled` 禁用整组；单项的 `disabled` 只禁用那一项，键盘导航会跳过它。

<Demo name="segmented-control/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `aria-labelledby` 关联到整组；校验规则与提交交给 [Form](/components/form)。分段控制器总有一个值，它常常决定其他字段是否必填，这类规则写在对象层，再指定错误落在哪个字段。

<Demo name="segmented-control/form" />

## 行为 {#behavior}

- 点击某项即选中，滑块平移到该项；再点已选项不会取消选择。
- 键盘 Tab 落在已选项上，方向键在各项之间移动焦点，空格或者 Enter 选中当前项，到达两端后回绕。
- 悬停与按下的墨落在项上，已选项的墨落在滑块上。

## 无障碍 {#a11y}

- 根元素是 `role="group"`，每一项是带 `aria-pressed` 的按钮。
- 整组通过 `aria-label` 或者 `aria-labelledby` 命名；使用 `#option` 插槽时，每一项以 `label` 命名。

## API {#api}

### Props {#props}

| 属性          | 类型                         | 默认值           | 说明                       |
| ------------- | ---------------------------- | ---------------- | -------------------------- |
| `modelValue`  | `string \| number`           | 第一个可用项的值 | 选中项的值                 |
| `options`     | `SelectOption[]`             | —                | 选项，类型与 `Select` 相同 |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`           | 尺寸                       |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'`   | 排列方向                   |
| `block`       | `boolean`                    | `false`          | 是否占满父元素宽度         |
| `disabled`    | `boolean`                    | `false`          | 是否禁用整组               |
| `class`       | `string`                     | —                | 追加至根元素的类名         |

### 插槽 {#slots}

| 插槽     | 参数                       | 说明         |
| -------- | -------------------------- | ------------ |
| `option` | `{ option: SelectOption }` | 每一项的内容 |

### 事件 {#events}

| 事件                | 参数                      | 说明       |
| ------------------- | ------------------------- | ---------- |
| `update:modelValue` | `value: string \| number` | 选中项变化 |
