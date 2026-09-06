---
title: Form
description: 汇集字段的值、按规则校验并提交。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/form/Form.vue
---

<Demo name="form/hero" />

## 用法 {#usage}

```ts
import { Form, FormField } from '@hina-ui/vue'
```

表单把一组字段的值、校验规则与提交动作放在一处。`values` 传入一个响应式对象，各控件照常用 `v-model` 绑定到它的属性；`rules` 传入校验规则，提交时先校验，全部通过才调用 `submit` 事件的处理函数。每个字段用 [FormField](/components/form-field) 包住，标签、说明与错误信息由它渲染，控件会自动与字段关联。

<Demo name="form/basic" />

## 示例 {#examples}

### 校验规则 {#rules}

`rules` 接受两种写法。一种是实现了 Standard Schema 规范的对象，Valibot、Zod、ArkType 等库生成的 schema 都可以直接传入，问题的路径按 `.` 拼接成字段名；另一种是一个函数，接收当前的值，返回以字段名为键、错误文字为值的对象，没有错误时返回空对象，也可以返回 Promise。

<Demo name="form/validator" />

### 校验时机 {#timing}

默认在提交时校验；提交未通过后，每次值变化都会重新校验，错误随修改即时消失。`validateOn` 设为 `blur` 时，字段在失去焦点后开始校验；设为 `change` 时，值一变化就校验。

<Demo name="form/timing" />

### 服务端返回的错误 {#server}

提交之后服务端也可能拒绝某些字段。通过模板引用调用 `setErrors`，传入字段名到错误文字的映射，错误显示在对应的字段下；该字段的值被修改后，这条错误自动清除。没有对应字段的错误可以从默认插槽的 `error` 取得，自行展示。

<Demo name="form/server" />

### 提交中与禁用 {#state}

`submit` 的处理函数返回 Promise 时，表单在其结束前处于提交中状态，所有字段禁用，插槽参数 `submitting` 可用于按钮的加载指示。`disabled` 禁用整个表单。

<Demo name="form/state" />

## 行为 {#behavior}

- 提交时先校验；未通过则显示错误，把焦点移到第一个无效的控件，不调用提交处理函数。
- 校验通过后调用处理函数；返回 Promise 时等待其完成，期间表单处于提交中。
- 提交未通过之后，或者校验时机为 `change` 时，值的变化触发重新校验；校验时机为 `blur` 时，只有失去过焦点的字段显示错误。
- `setErrors` 设置的错误优先显示，字段的值改变后清除。
- 路径为空的问题不属于任何字段，作为表单整体的错误通过插槽参数 `error` 暴露。

## 无障碍 {#a11y}

- 根元素是原生表单，关闭了浏览器自带的校验提示；回车提交与提交按钮的行为保持默认。
- 提交中时根元素带有 `aria-busy`。
- 错误信息由 FormField 渲染，并通过 `aria-describedby` 与 `aria-invalid` 关联到控件。

## API {#api}

### Props {#props}

| 属性         | 类型                             | 默认值     | 说明                                       |
| ------------ | -------------------------------- | ---------- | ------------------------------------------ |
| `values`     | `Record<string, unknown>`        | —          | 字段值所在的响应式对象                     |
| `rules`      | `FormRules`                      | —          | 校验规则，Standard Schema 对象或者校验函数 |
| `validateOn` | `'submit' \| 'blur' \| 'change'` | `'submit'` | 校验时机                                   |
| `disabled`   | `boolean`                        | `false`    | 是否禁用整个表单                           |
| `class`      | `string`                         | —          | 追加至根元素的类名                         |

### 插槽 {#slots}

| 插槽    | 参数                                                    | 说明     |
| ------- | ------------------------------------------------------- | -------- |
| default | `errors`、`error`、`invalid`、`submitting`、`submitted` | 表单内容 |

### 事件 {#events}

| 事件     | 参数                              | 说明                                                  |
| -------- | --------------------------------- | ----------------------------------------------------- |
| `submit` | `values: Record<string, unknown>` | 校验通过后触发；处理函数返回 Promise 时表单进入提交中 |

### 方法 {#methods}

| 方法                | 说明                         |
| ------------------- | ---------------------------- |
| `submit()`          | 触发一次提交                 |
| `validate()`        | 校验并返回是否通过           |
| `setErrors(errors)` | 设置外部错误，键为字段名     |
| `reset()`           | 清空错误、失焦记录与提交状态 |

`FormRules`、`FormErrors`、`FormValidator` 与 `StandardSchema` 类型可以从包入口导入。
