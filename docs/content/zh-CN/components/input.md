---
title: Input
description: 单行文本输入框。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/input/Input.vue
---

<Demo name="input/hero" />

## 用法 {#usage}

```ts
import { Input } from '@hina-ui/vue'
```

输入框渲染为原生 `input`，`v-model` 绑定文本。未声明的属性都会传给 `input`，`type`、`placeholder`、`maxlength`、`autocomplete` 等属性照常可用。

<Demo name="input/basic" />

## 示例 {#examples}

### 附属内容 {#adornments}

`leading` 与 `trailing` 插槽位于输入区两侧，用于放置图标、单位或者快捷键提示。每个插槽占一个与输入框等高的方格，内容居中。

<Demo name="input/adornments" />

### 清除 {#clearable}

`clearable` 在有内容时显示清除按钮，点击后清空并发出 `clear` 事件。

<Demo name="input/clearable" />

### 加载中 {#loading}

`loading` 显示加载指示器。有 `leading` 插槽时顶替其中的图标，否则显示在末尾。

<Demo name="input/loading" />

### 尺寸 {#sizes}

`sm` 用于表格与工具栏，`md` 用于常规表单，`lg` 用于登录页等需要突出的场景。

<Demo name="input/sizes" />

### 形态 {#variants}

`primary` 直接放在页面底色上，带边框与阴影；`secondary` 放在卡片等表面内，只有一层浅色底。

<Demo name="input/variants" />

### 状态 {#states}

`invalid` 标出校验未通过，`disabled` 不可编辑。

<Demo name="input/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `for` 指向输入框，说明与错误信息由字段渲染并关联到它；校验规则、校验时机与提交交给 [Form](/components/form)。

<Demo name="input/form" />

## 行为 {#behavior}

- 悬停时填充加深，聚焦时边缘长出强调色环，校验未通过时边框与环变为危险色。
- 清除按钮只在有内容且未禁用时出现，点击后不会让输入区失焦。
- 点击附属内容会聚焦输入区，起始处的把光标放到开头，末尾的放到末尾。
- 附属内容、清除按钮与加载指示器的出现与消失都有过渡。

## 无障碍 {#a11y}

- 应当配合 `label` 元素或者 `aria-label` 提供名称。
- 插槽中的图标是装饰性的，需要说明含义时给图标加 `aria-label`。
- `invalid` 同时设置 `aria-invalid`，`loading` 同时设置 `aria-busy`。清除按钮的名称随语言包本地化。

## API {#api}

### Props {#props}

| 属性         | 类型                       | 默认值      | 说明               |
| ------------ | -------------------------- | ----------- | ------------------ |
| `modelValue` | `string`                   | —           | 文本               |
| `clearable`  | `boolean`                  | `false`     | 是否显示清除按钮   |
| `loading`    | `boolean`                  | `false`     | 是否显示加载指示器 |
| `variant`    | `'primary' \| 'secondary'` | `'primary'` | 形态               |
| `size`       | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸               |
| `invalid`    | `boolean`                  | `false`     | 是否校验未通过     |
| `disabled`   | `boolean`                  | `false`     | 是否禁用           |
| `class`      | `string`                   | —           | 追加至根元素的类名 |

### 插槽 {#slots}

| 插槽       | 说明                   |
| ---------- | ---------------------- |
| `leading`  | 输入区起始处的附属内容 |
| `trailing` | 输入区末尾的附属内容   |

### 事件 {#events}

| 事件                | 参数            | 说明       |
| ------------------- | --------------- | ---------- |
| `update:modelValue` | `value: string` | 文本变化   |
| `clear`             | —               | 文本被清空 |
