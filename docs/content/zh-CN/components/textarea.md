---
title: Textarea
description: 多行文本输入框。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/textarea/Textarea.vue
---

<Demo name="textarea/hero" />

## 用法 {#usage}

```ts
import { Textarea } from '@hina-ui/vue'
```

多行文本输入框渲染为原生 `textarea`，`v-model` 绑定文本。默认高度为三行，右下角可以纵向拉伸。未声明的属性都会传给 `textarea`，`placeholder`、`maxlength`、`name` 等属性照常可用。

<Demo name="textarea/basic" />

## 示例 {#examples}

### 自动高度 {#autosize}

设置 `autosize` 后高度随内容增减，拉伸把手隐藏。传入对象可以限定行数范围，超过 `maxRows` 后内部滚动。

<Demo name="textarea/autosize" />

### 尺寸 {#sizes}

三档尺寸与输入框相同，只有一行内容时高度与同档输入框一致。

<Demo name="textarea/sizes" />

### 形态 {#variants}

`primary` 带边框、背景与阴影；`secondary` 使用浅色背景；`bare` 背景透明，不绘制边框、阴影、悬停底色或容器聚焦环，尺寸与内边距仍由原有设置控制。

`bare` 保留禁用状态与 `aria-invalid`；错误信息可由 [FormField](/components/form-field) 显示。

<Demo name="textarea/variants" />

### 状态 {#states}

`invalid` 标出校验未通过，`disabled` 不可编辑。

<Demo name="textarea/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `for` 指向文本域，说明与错误信息由字段渲染并关联到它；校验规则与提交交给 [Form](/components/form)。

<Demo name="textarea/form" />

## 行为 {#behavior}

- 悬停、聚焦、错误与禁用的表现与 [Input](/components/input) 相同。
- 自动高度在输入与 `v-model` 变化时重新计算，行数下限默认取 `rows`。
- 内容超出可见行数时在框内滚动，滚动条与 [ScrollArea](/components/scroll-area) 相同。
- 点击框内文字之外的空白也会聚焦。

## 无障碍 {#a11y}

- 渲染为原生 `textarea`，键盘与屏幕阅读器行为由浏览器提供。
- 应当配合 `label` 元素或者 `aria-label` 提供名称。
- `invalid` 同时设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性       | 类型                                                | 默认值       | 说明                             |
| ---------- | --------------------------------------------------- | ------------ | -------------------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'bare'`                | `'primary'`  | 形态                             |
| `size`     | `'sm' \| 'md' \| 'lg'`                              | `'md'`       | 尺寸                             |
| `rows`     | `number`                                            | `3`          | 行数                             |
| `autosize` | `boolean \| { minRows?: number; maxRows?: number }` | `false`      | 是否随内容调整高度               |
| `resize`   | `'none' \| 'vertical'`                              | `'vertical'` | 是否可以拉伸，自动高度时不可拉伸 |
| `invalid`  | `boolean`                                           | `false`      | 是否校验未通过                   |
| `disabled` | `boolean`                                           | `false`      | 是否禁用                         |
| `class`    | `string`                                            | —            | 追加至根元素的类名               |

| 事件                | 参数            | 说明     |
| ------------------- | --------------- | -------- |
| `update:modelValue` | `value: string` | 文本变化 |
