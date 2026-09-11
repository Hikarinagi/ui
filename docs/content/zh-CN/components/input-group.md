---
title: InputGroup
description: 把前后缀、按钮与输入框合为一个输入面。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/input-group/InputGroup.vue
---

<Demo name="input-group/hero" />

## 用法 {#usage}

```ts
import { InputGroup, InputGroupAddon } from '@hina-ui/vue'
```

组本身就是一个完整的输入面：边框、阴影与聚焦环都在组上，组内的输入框、附属段与按钮共用这一副外壳。尺寸与形态设置在组上，组内的输入框沿用组的设置。`InputGroupAddon` 用于固定的前缀或者后缀，文字与图标都可以，以分隔线与输入区区分；边框以内的图标与单位用输入框自己的 `leading` 与 `trailing` 插槽。

<Demo name="input-group/basic" />

## 示例 {#examples}

### 贴边按钮 {#button}

按钮直接放入组内，与输入区共用外壳，按下时不缩放。

<Demo name="input-group/button" />

### 尺寸 {#sizes}

尺寸设置在组上，组内的输入框与按钮随之对齐。组内按钮的尺寸仍需与组一致。

<Demo name="input-group/sizes" />

### 形态 {#variants}

`primary` 带边框、背景与阴影；`secondary` 使用浅色背景；`bare` 背景透明，不绘制边框、阴影、悬停底色或容器聚焦环，尺寸与内边距仍由原有设置控制。

`bare` 保留禁用状态与 `aria-invalid`；错误信息可由 [FormField](/components/form-field) 显示。组内分隔线也会隐藏，按钮保留自身的交互反馈。

<Demo name="input-group/variants" />

### 状态 {#states}

`invalid` 与 `disabled` 设置在组上，下发到组内的每个输入框。

<Demo name="input-group/states" />

### 与其他输入框组合 {#fields}

数值、搜索等输入框都能放入组内。

<Demo name="input-group/fields" />

### 在表单中 {#form}

整组放进 [FormField](/components/form-field) 后，标签指向组内的输入框，错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。一个字段里只放一个输入框。

<Demo name="input-group/form" />

## 行为 {#behavior}

- `primary` 与 `secondary` 聚焦组内任一输入区时，整个组显示聚焦环。
- 点击附属段会让相邻的输入区聚焦，前缀把光标放到开头，后缀放到末尾。按钮不受影响。
- 组内按钮键盘聚焦时轮廓向内收，不会被组的边缘裁掉。
- 悬停、错误与禁用的表现与 [Input](/components/input) 相同。

## 无障碍 {#a11y}

- 附属段是纯展示内容，不参与输入框的无障碍名称。需要说明时用 `label` 元素或者 `aria-label` 给输入框命名。

## API {#api}

### InputGroup {#input-group}

| 属性       | 类型                                 | 默认值      | 说明               |
| ---------- | ------------------------------------ | ----------- | ------------------ |
| `variant`  | `'primary' \| 'secondary' \| 'bare'` | `'primary'` | 形态               |
| `size`     | `'sm' \| 'md' \| 'lg'`               | `'md'`      | 尺寸               |
| `invalid`  | `boolean`                            | `false`     | 是否校验未通过     |
| `disabled` | `boolean`                            | `false`     | 是否禁用           |
| `class`    | `string`                             | —           | 追加至根元素的类名 |

### InputGroupAddon {#input-group-addon}

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `class` | `string` | —      | 追加至根元素的类名 |
