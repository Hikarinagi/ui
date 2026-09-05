---
title: FormField
description: 为控件配上标签、说明与错误信息。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/form-field/FormField.vue
---

<Demo name="form-field/hero" />

## 用法 {#usage}

```ts
import { FormField } from '@hina-ui/vue'
```

表单字段把一个控件与它的标签、说明和错误信息组成一行。放在 [Form](/components/form) 里时，通过 `name` 取得该字段的错误；单独使用时，通过 `error` 直接传入错误文字。库里的控件放进字段后会自动关联：标签指向控件，说明与错误信息通过 `aria-describedby` 关联到控件，出现错误时控件进入无效状态，字段的 `disabled` 也会传给控件。

<Demo name="form-field/basic" />

## 示例 {#examples}

### 说明文字 {#description}

`description` 在控件下方显示一段说明，也可以用同名插槽放入更丰富的内容。

<Demo name="form-field/description" />

### 必填标记 {#required}

`required` 在标签后显示必填标记，并给辅助技术提供对应的文字。标记只是提示，是否必填由校验规则决定。

<Demo name="form-field/required" />

### 单独使用 {#standalone}

不在表单里时，`error` 直接决定显示的错误文字，适合自行管理校验的场合。

<Demo name="form-field/error" />

### 各类控件 {#controls}

单个控件通过标签的 `for` 关联；单选组、复选框组、滑块、评分与日期输入这类成组的控件则通过 `aria-labelledby` 关联到标签。

<Demo name="form-field/controls" />

## 行为 {#behavior}

- 一个字段只放一个控件；控件自带的 `id` 与 `aria-describedby` 优先于字段生成的值。
- 错误信息出现时把下方的内容推开，消失时收回，高度与间距连续变化。
- 字段失去焦点时通知所在的表单，供 `blur` 校验时机使用。

## 无障碍 {#a11y}

- 标签通过 `for` 指向控件；成组的控件通过 `aria-labelledby` 关联到标签。
- 必填标记对辅助技术隐藏，另有隐藏文字说明该字段必填。
- 错误信息带有 `aria-live="polite"`，出现时会被读出。

## API {#api}

### Props {#props}

| 属性          | 类型      | 默认值  | 说明                       |
| ------------- | --------- | ------- | -------------------------- |
| `name`        | `string`  | —       | 字段名，用于从表单取得错误 |
| `label`       | `string`  | —       | 标签文字                   |
| `description` | `string`  | —       | 说明文字                   |
| `error`       | `string`  | —       | 直接指定的错误文字         |
| `required`    | `boolean` | `false` | 是否显示必填标记           |
| `disabled`    | `boolean` | `false` | 是否禁用控件               |
| `class`       | `string`  | —       | 追加至根元素的类名         |

### 插槽 {#slots}

| 插槽          | 说明     |
| ------------- | -------- |
| default       | 控件     |
| `label`       | 标签内容 |
| `description` | 说明内容 |
