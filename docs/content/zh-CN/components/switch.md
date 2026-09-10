---
title: Switch
description: 在开与关之间切换。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/switch/Switch.vue
  - label: Switch
    href: https://reka-ui.com/docs/components/switch
---

<Demo name="switch/hero" />

## 用法 {#usage}

```ts
import { Switch } from '@hina-ui/vue'
```

开关表示一个立即生效的设置，与需要提交的复选框不同。`v-model` 绑定布尔值，默认插槽是文字，点文字与点轨道都会切换。未声明的属性都会传给内部的轨道元素。

<Demo name="switch/basic" />

## 示例 {#examples}

### 描述 {#description}

`description` 在文字下方补一行说明，字号比文字小一档。

<Demo name="switch/description" />

### 设置行 {#settings}

使用 `control-placement="end"` 将控件放到文案末端，配合 `block` 撑满容器宽度。说明始终位于标题下方；`start` 和 `end` 会跟随文字方向。

<Demo name="switch/settings" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，轨道高分别为 20、24、28 像素，文字随档位变化。

<Demo name="switch/sizes" />

### 状态 {#states}

`invalid` 给轨道加上警示色边框；`disabled` 禁用整个控件。

<Demo name="switch/states" />

### 仅轨道 {#bare}

没有文字时只渲染轨道，此时必须用 `aria-label` 命名。

<Demo name="switch/bare" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，错误信息由字段渲染并关联到开关；校验规则与提交交给 [Form](/components/form)。开关自带文字，字段不必再写标签；它的值常常决定其他字段是否必填，这类规则写在对象层，再指定错误落在哪个字段。

<Demo name="switch/form" />

## 行为 {#behavior}

- 点击文字或者轨道都会切换，拇指滑到另一侧，轨道同时换色。键盘 Tab 落在轨道上，空格切换。
- 悬停整个控件时轨道落墨，按下时加深。

## 无障碍 {#a11y}

- 轨道是 `role="switch"` 的按钮，带 `aria-checked`。根元素是 `label`，文字即名称。
- 没有文字时通过 `aria-label` 或者 `aria-labelledby` 命名。
- `invalid` 会同时设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性               | 类型                   | 默认值    | 说明                   |
| ------------------ | ---------------------- | --------- | ---------------------- |
| `modelValue`       | `boolean`              | `false`   | 是否开启               |
| `size`             | `'sm' \| 'md' \| 'lg'` | `'md'`    | 尺寸                   |
| `description`      | `string`               | —         | 文字下方的说明         |
| `controlPlacement` | `'start' \| 'end'`     | `'start'` | 控件相对于文案的位置   |
| `block`            | `boolean`              | `false`   | 整行撑满容器宽度       |
| `disabled`         | `boolean`              | `false`   | 是否禁用               |
| `invalid`          | `boolean`              | `false`   | 是否处于校验未通过状态 |
| `class`            | `string`               | —         | 追加至根元素的类名     |

### 插槽 {#slots}

| 插槽      | 参数 | 说明 |
| --------- | ---- | ---- |
| `default` | —    | 文字 |

### 事件 {#events}

| 事件                | 参数             | 说明     |
| ------------------- | ---------------- | -------- |
| `update:modelValue` | `value: boolean` | 值变化时 |
