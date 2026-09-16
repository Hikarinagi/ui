---
title: Rating
description: 以星级打分或者展示评分。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/rating/Rating.vue
  - label: Rating
    href: https://reka-ui.com/docs/components/rating
---

<Demo name="rating/hero" />

## 用法 {#usage}

```ts
import { Rating } from '@hina-ui/vue'
```

评分由一排星组成，点击某颗星即选中该分值，悬停时前面的星预览为实心。`v-model` 绑定分值，`max` 指定满分，默认为 `5`。不传 `stars` 时星数与 `max` 相同；传入 `stars` 可独立指定显示的星数。未声明的属性都会传给包裹各星的组元素，请用 `aria-label` 或者 `aria-labelledby` 命名。

<Demo name="rating/basic" />

## 示例 {#examples}

### 半星 {#half}

`step` 设为 `0.5` 时每颗星分成左右两半，可以选出 2.5 这样的分值。

<Demo name="rating/half" />

### 分制与星数 {#scale}

`max` 为满分，`stars` 为显示的星数。设置 `:max="10" :stars="5"` 时，每颗星代表 2 分，值 `7` 显示为 3.5 颗星。

`step` 仍以星为单位：默认 `1` 表示整星，此时每次选择相差 2 分；设为 `0.5` 后每次相差 1 分。`v-model`、`update:modelValue` 和通过 `name` 提交的表单值始终使用实际分值。只读展示按比例填充，不受 `step` 限制。

<Demo name="rating/scale" />

### 只读展示 {#readonly}

`readonly` 把评分渲染为只展示的图形，值可以是任意小数，星按比例填充，适合展示平均分。

<Demo name="rating/readonly" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档。

<Demo name="rating/sizes" />

### 状态 {#states}

`disabled` 禁用整组；`clearable` 默认开启，再次点击已选中的星会清零，关闭后不会。

<Demo name="rating/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `aria-labelledby` 关联到整组星，错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。未打分时值是 `0`。

<Demo name="rating/form" />

## 行为 {#behavior}

- 点击一颗星即选中该分值，再次点击同一颗星清零；悬停时前面的星预览为实心，移开后恢复。
- 焦点落在某颗星上时，左右方向键移动焦点并选中，与单选框组相同。
- 星的颜色变化有过渡。

## 无障碍 {#a11y}

- 可交互时整组是 `role="radiogroup"`，每颗星或者每半颗星是带本地化名称的 `role="radio"`。
- 只读时整组是 `role="img"`，名称是语言包给出的「n 星，满分 m 星」。星数与满分不同时，单选项与只读图形的名称使用实际分值，如「7 分，满分 10 分」。
- 通过 `aria-label` 或者 `aria-labelledby` 为整组命名。

## API {#api}

### Props {#props}

| 属性         | 类型                   | 默认值  | 说明                                                  |
| ------------ | ---------------------- | ------- | ----------------------------------------------------- |
| `modelValue` | `number`               | `0`     | 分值                                                  |
| `max`        | `number`               | `5`     | 满分，须大于 0；未指定 `stars` 时也决定星数           |
| `stars`      | `number`               | `max`   | 显示的星数，须为正整数                                |
| `step`       | `1 \| 0.5`             | `1`     | 以星为单位的步长；实际分值步长为 `max / stars * step` |
| `clearable`  | `boolean`              | `true`  | 再次点击已选中的星是否清零                            |
| `readonly`   | `boolean`              | `false` | 是否只展示                                            |
| `name`       | `string`               | —       | 表单字段名                                            |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`  | 尺寸                                                  |
| `disabled`   | `boolean`              | `false` | 是否禁用                                              |
| `class`      | `string`               | —       | 追加至根元素的类名                                    |

### 事件 {#events}

| 事件                | 参数            | 说明     |
| ------------------- | --------------- | -------- |
| `update:modelValue` | `value: number` | 分值变化 |
