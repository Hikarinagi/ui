---
title: PinInput
description: 逐格输入验证码或者 PIN 码。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/pin-input/PinInput.vue
---

<Demo name="pin-input/hero" />

## 用法 {#usage}

```ts
import { PinInput } from '@hina-ui/vue'
```

验证码输入框把一段固定长度的字符拆成若干格，每格只容纳一个字符。`v-model` 绑定的是完整的字符串，`length` 决定格数，默认六格。整组只有一个输入框，格子显示它的值：输入一个字符后当前格前进一格，退格删除，粘贴整段内容时按位分配。`aria-label`、`aria-labelledby`、`aria-describedby` 与 `id` 落在输入框上，其余未声明的属性传给根元素；请用 `aria-label` 或者 `aria-labelledby` 为输入框命名。

<Demo name="pin-input/basic" />

## 示例 {#examples}

### 数字与一次性验证码 {#number}

`type="number"` 只接受数字，并在移动设备上唤起数字键盘。`otp` 把输入框的自动填充设为一次性验证码，浏览器与系统可以把收到的短信验证码直接填入。

<Demo name="pin-input/number" />

### 遮蔽 {#mask}

`mask` 用圆点显示已输入的字符，输入框变为密码类型，适合 PIN 码。

<Demo name="pin-input/mask" />

### 占位符 {#placeholder}

`placeholder` 显示在空格子里，当前格显示光标时隐去。

<Demo name="pin-input/placeholder" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，每一格是边长与同档输入框高度相等的正方形。

<Demo name="pin-input/sizes" />

### 状态 {#states}

`invalid` 给每一格加上警示色边框，`disabled` 禁用整组。`variant="secondary"` 是放在 surface 之内的扁平形态。

<Demo name="pin-input/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签关联到输入框，点击标签聚焦，说明与错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。

<Demo name="pin-input/form" />

## 行为 {#behavior}

- 点击格子把当前位置移到那一格；点击未填的格子落到第一个空位，双击选中全部。
- 输入一个字符后前进一格；当前格已有字符时覆盖它，填满后停在最后一格。
- 退格删除当前格的字符，后面的字符前移；在空位上退格删除前一个字符。
- 粘贴、自动填充与输入法上屏的整段文字从当前格开始覆盖，超出格数的部分丢弃；长度达到格数时替换全部内容。
- 空白字符会被去掉，全角字母与数字折成半角；`type="number"` 只保留数字。
- 输入法组字过程中的字符实时显示在格子里并写入值，上屏后以上屏的文字为准。
- 左右方向键、Home、End 移动当前格，按住 Shift 扩选。键盘聚焦时未填满落在第一个空位，已填满则选中全部。
- 值变化后长度达到格数时触发 `complete`，参数是完整的字符串。

## 无障碍 {#a11y}

- 整组是一个文本输入框，通过 `aria-label`、`aria-labelledby` 或者 FormField 的标签命名；格子对辅助技术隐藏。
- `invalid` 在输入框上设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性          | 类型                       | 默认值      | 说明                           |
| ------------- | -------------------------- | ----------- | ------------------------------ |
| `modelValue`  | `string`                   | `''`        | 完整的值                       |
| `length`      | `number`                   | `6`         | 格数                           |
| `type`        | `'text' \| 'number'`       | `'text'`    | 接受的字符类型                 |
| `mask`        | `boolean`                  | `false`     | 是否以圆点显示并使用密码输入   |
| `otp`         | `boolean`                  | `false`     | 是否接收一次性验证码的自动填充 |
| `placeholder` | `string`                   | `''`        | 空格子里显示的占位符           |
| `name`        | `string`                   | —           | 表单字段名，提交时携带完整的值 |
| `variant`     | `'primary' \| 'secondary'` | `'primary'` | 形态                           |
| `size`        | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                           |
| `disabled`    | `boolean`                  | `false`     | 是否禁用                       |
| `invalid`     | `boolean`                  | `false`     | 是否处于校验未通过状态         |
| `required`    | `boolean`                  | `false`     | 表单提交时是否必填             |
| `dir`         | `'ltr' \| 'rtl'`           | —           | 排列方向，默认跟随上层配置     |
| `class`       | `string`                   | —           | 追加至根元素的类名             |

### 事件 {#events}

| 事件                | 参数            | 说明           |
| ------------------- | --------------- | -------------- |
| `update:modelValue` | `value: string` | 值变化时       |
| `complete`          | `value: string` | 值变化后填满时 |
