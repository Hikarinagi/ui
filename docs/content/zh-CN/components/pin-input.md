---
title: PinInput
description: 逐格输入验证码或者 PIN 码。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/pin-input/PinInput.vue
  - label: PinInput
    href: https://reka-ui.com/docs/components/pin-input
---

<Demo name="pin-input/hero" />

## 用法 {#usage}

```ts
import { PinInput } from '@hina-ui/vue'
```

验证码输入框把一段固定长度的字符拆成若干格，每格只容纳一个字符。`v-model` 绑定的是完整的字符串，`length` 决定格数，默认六格。输入一个字符后焦点自动进入下一格，退格回到上一格，粘贴整段内容时按位分配。未声明的属性都会传给根元素，请用 `aria-label` 或者 `aria-labelledby` 为整组命名。

<Demo name="pin-input/basic" />

## 示例 {#examples}

### 数字与一次性验证码 {#number}

`type="number"` 只接受数字。`otp` 把输入框的自动填充设为一次性验证码，浏览器与系统可以把收到的短信验证码直接填入。

<Demo name="pin-input/number" />

### 遮蔽 {#mask}

`mask` 把每一格变成密码输入，适合 PIN 码。

<Demo name="pin-input/mask" />

### 占位符 {#placeholder}

`placeholder` 显示在空格子里，聚焦时隐去。

<Demo name="pin-input/placeholder" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，每一格是边长与同档输入框高度相等的正方形。

<Demo name="pin-input/sizes" />

### 状态 {#states}

`invalid` 给每一格加上警示色边框，`disabled` 禁用整组。`variant="secondary"` 是放在 surface 之内的扁平形态。

<Demo name="pin-input/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `aria-labelledby` 关联到整组格子，说明与错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。

<Demo name="pin-input/form" />

## 行为 {#behavior}

- 每格只容纳一个字符，输入后焦点前进；在空格子里退格会回到上一格并清除它。
- 粘贴时从当前格开始按位分配，超出格数的部分丢弃。
- 所有格子填满时触发 `complete`，参数是完整的字符串。
- 左右方向键在格子之间移动焦点。

## 无障碍 {#a11y}

- 根元素是 `role="group"`，通过 `aria-label` 或者 `aria-labelledby` 命名。
- 每一格自带「第 n 位，共 N 位」的名称，取自语言包。
- `invalid` 会同时在每一格设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性          | 类型                       | 默认值      | 说明                           |
| ------------- | -------------------------- | ----------- | ------------------------------ |
| `modelValue`  | `string`                   | `''`        | 完整的值                       |
| `length`      | `number`                   | `6`         | 格数                           |
| `type`        | `'text' \| 'number'`       | `'text'`    | 接受的字符类型                 |
| `mask`        | `boolean`                  | `false`     | 是否以密码方式显示             |
| `otp`         | `boolean`                  | `false`     | 是否接收一次性验证码的自动填充 |
| `placeholder` | `string`                   | `''`        | 空格子里显示的占位符           |
| `name`        | `string`                   | —           | 表单字段名，提交时携带完整的值 |
| `variant`     | `'primary' \| 'secondary'` | `'primary'` | 形态                           |
| `size`        | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                           |
| `disabled`    | `boolean`                  | `false`     | 是否禁用                       |
| `invalid`     | `boolean`                  | `false`     | 是否处于校验未通过状态         |
| `class`       | `string`                   | —           | 追加至根元素的类名             |

### 事件 {#events}

| 事件                | 参数            | 说明           |
| ------------------- | --------------- | -------------- |
| `update:modelValue` | `value: string` | 值变化时       |
| `complete`          | `value: string` | 所有格子填满时 |
