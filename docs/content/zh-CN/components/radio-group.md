---
title: RadioGroup
description: 从多项中选择一项的单选框组。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/radio-group/RadioGroup.vue
  - label: RadioGroup
    href: https://reka-ui.com/docs/components/radio-group
---

<Demo name="radio-group/hero" />

## 用法 {#usage}

```ts
import { RadioGroup } from '@hina-ui/vue'
```

单选框组按 `options` 渲染一列单选框，`v-model` 绑定选中的值，选项的类型见 [Select](/components/select#types)。未声明的属性都会传给根元素，应当用 `aria-label` 或者 `aria-labelledby` 给整组命名。单选框只以组的形式提供，没有单独的 `Radio`。

<Demo name="radio-group/basic" />

## 示例 {#examples}

### 横排 {#horizontal}

`orientation` 为 `horizontal` 时选项横向排列，放不下时折行。

<Demo name="radio-group/horizontal" />

### 描述 {#description}

选项的 `description` 显示在文字下方。

<Demo name="radio-group/description" />

### 设置行 {#settings}

使用 `control-placement="end"` 将控件放到文案末端，配合 `block` 撑满容器宽度。说明始终位于标题下方；`start` 和 `end` 会跟随文字方向。启用 `block` 后，纵向选项各自撑满一行，横向选项等分行宽。`orientation` 仍表示多个选项的排列方向。

RTL 布局请向组传入 `dir="rtl"`，或通过 Reka 的方向提供器配置。

<Demo name="radio-group/settings" />

### 尺寸 {#sizes}

`size` 下发到每个单选框，圆与文字随档位变化。

<Demo name="radio-group/sizes" />

### 状态 {#states}

选项上的 `disabled` 只禁用该项，组上的 `disabled` 禁用整组；`invalid` 落到每个圆。

<Demo name="radio-group/states" />

### 定制内容 {#custom}

`option` 插槽定制每一项的文字。

组件从 `options` 推断完整选项类型，插槽中的 `option` 保留额外字段及其类型；`v-model` 仍绑定 `value`。类型定义见 [Select](/components/select#types)。

<Demo name="radio-group/custom" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `aria-labelledby` 关联到整组，错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。

<Demo name="radio-group/form" />

## 行为 {#behavior}

- 点击文字或者圆即选中该项，已选中的项不能再点成未选中。
- 整组只占一个 Tab 停靠点，落在已选项上；方向键在项之间移动焦点并同时选中，禁用项会被跳过，到底后回到另一端。与原生单选框一致。

## 无障碍 {#a11y}

- 根元素是 `role="radiogroup"`，通过 `aria-label` 或者 `aria-labelledby` 命名；每一项是 `role="radio"` 的按钮，带 `aria-checked`，外层 `label` 的文字即名称。
- `invalid` 会给每个单选框设置 `aria-invalid`。

## API {#api}

### Props {#props}

`T extends SelectOption` 从 `options` 推断，默认是 `SelectOption`。

| 属性               | 类型                         | 默认值       | 说明                                            |
| ------------------ | ---------------------------- | ------------ | ----------------------------------------------- |
| `modelValue`       | `string \| number \| null`   | —            | 选中的值                                        |
| `options`          | `T[]`                        | —            | 选项，类型见 [Select](/components/select#types) |
| `orientation`      | `'vertical' \| 'horizontal'` | `'vertical'` | 排列方向                                        |
| `size`             | `'sm' \| 'md' \| 'lg'`       | `'md'`       | 每个单选框的尺寸                                |
| `controlPlacement` | `'start' \| 'end'`           | `'start'`    | 控件相对于文案的位置                            |
| `block`            | `boolean`                    | `false`      | 整组撑满，横向选项等分宽度                      |
| `disabled`         | `boolean`                    | `false`      | 是否禁用整组                                    |
| `invalid`          | `boolean`                    | `false`      | 是否处于校验未通过状态                          |
| `class`            | `string`                     | —            | 追加至根元素的类名                              |

### 插槽 {#slots}

| 插槽     | 参数            | 说明         |
| -------- | --------------- | ------------ |
| `option` | `{ option: T }` | 每一项的文字 |

### 事件 {#events}

| 事件                | 参数                      | 说明       |
| ------------------- | ------------------------- | ---------- |
| `update:modelValue` | `value: string \| number` | 选中值变化 |
