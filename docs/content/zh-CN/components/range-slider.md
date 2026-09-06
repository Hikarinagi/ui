---
title: RangeSlider
description: 在数值范围内拖出一段区间。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/range-slider/RangeSlider.vue
  - label: Slider
    href: https://reka-ui.com/docs/components/slider
---

<Demo name="range-slider/hero" />

## 用法 {#usage}

```ts
import { RangeSlider } from '@hina-ui/vue'
```

范围滑块有两个拇指，`v-model` 绑定 `[起点, 终点]` 的二元数组，填充覆盖两个拇指之间的一段。轨道、拇指、取值标签与 `Slider` 相同。未声明的属性都会传给根元素，应当用 `aria-label` 或者 `aria-labelledby` 给整组命名；两个拇指各自带有「最小值」「最大值」的名称。

<Demo name="range-slider/basic" />

## 示例 {#examples}

### 刻度 {#marks}

`marks` 与 `Slider` 相同，`step` 决定拇指的落点。

<Demo name="range-slider/marks" />

### 最小间隔 {#min-steps}

`minSteps` 规定两个拇指之间至少相隔的步数，拖动或者按键都不能越过。

<Demo name="range-slider/min-steps" />

### 取值标签 {#label}

每个拇指各有一个取值标签，`label` 与 `format` 的用法与 `Slider` 相同。

<Demo name="range-slider/label" />

### 尺寸 {#sizes}

<Demo name="range-slider/sizes" />

### 状态 {#states}

<Demo name="range-slider/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签通过 `aria-labelledby` 关联到整个滑块组，说明与错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。值是二元数组，区间宽度这类规则写在数组层。

<Demo name="range-slider/form" />

## 行为 {#behavior}

- 点击轨道时，离点击处更近的拇指跳过去；拖动只移动被按住的拇指，两个拇指不会交叉。
- 键盘 Tab 依次落在两个拇指上，方向键只移动持有焦点的那个。
- 拖动过程中值持续更新，松手时另发一次 `commit`。

## 无障碍 {#a11y}

- 根元素是 `role="group"`，通过 `aria-label` 或者 `aria-labelledby` 命名；两个拇指是 `role="slider"`，名称取自语言包的「最小值」与「最大值」，并带 `aria-valuenow`、`aria-valuemin`、`aria-valuemax`。

## API {#api}

### Props {#props}

| 属性         | 类型                                       | 默认值       | 说明                       |
| ------------ | ------------------------------------------ | ------------ | -------------------------- |
| `modelValue` | `[number, number]`                         | `[min, max]` | 起点与终点                 |
| `min`        | `number`                                   | `0`          | 最小值                     |
| `max`        | `number`                                   | `100`        | 最大值                     |
| `step`       | `number`                                   | `1`          | 步长                       |
| `minSteps`   | `number`                                   | `0`          | 两个拇指之间至少相隔的步数 |
| `marks`      | `Array<{ value: number; label?: string }>` | —            | 刻度                       |
| `label`      | `'auto' \| 'always' \| 'none'`             | `'auto'`     | 取值标签的显示方式         |
| `format`     | `(value: number) => string`                | —            | 取值标签的文字             |
| `size`       | `'sm' \| 'md' \| 'lg'`                     | `'md'`       | 尺寸                       |
| `disabled`   | `boolean`                                  | `false`      | 是否禁用                   |
| `class`      | `string`                                   | —            | 追加至根元素的类名         |

### 事件 {#events}

| 事件                | 参数                      | 说明                     |
| ------------------- | ------------------------- | ------------------------ |
| `update:modelValue` | `value: [number, number]` | 值变化时，拖动中持续触发 |
| `commit`            | `value: [number, number]` | 一次拖动或者按键结束时   |
