---
title: ButtonGroup
description: 把一组按钮拼接为一个整体，共用边框与圆角。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/button-group/ButtonGroup.vue
  - label: Button
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/button/Button.vue
---

<Demo name="button-group/hero" />

## 用法 {#usage}

```ts
import { ButtonGroup } from '@hikarinagi/ui'
```

将按钮直接放入组容器即可，拼接由容器负责：首尾保留外侧的圆角，相接的一侧不保留圆角，相邻的边框重叠为一条，而不是并排的两条。

<Demo name="button-group/basic" />

组内的按钮应当使用同一种变体与色调。只有地位相同的操作才适合拼在一起，主次不同的操作应当分开放置。

## 示例 {#examples}

### 变体 {#variants}

变体与色调由组内的每个按钮各自设置，组容器不会代为指定。

<Demo name="button-group/variants" />

### 尺寸 {#sizes}

尺寸同样设置在按钮上。同一组内必须使用相同的尺寸，否则相邻按钮的高度无法对齐。

<Demo name="button-group/sizes" />

### 纵向排列 {#orientation}

设置 `orientation="vertical"` 之后，整组改为纵向拼接，相接的一侧随之转到上下两端，整组的宽度由最宽的一项决定。

<Demo name="button-group/orientation" />

### 撑满宽度 {#block}

设置 `block` 之后整组占满容器的宽度，组内的按钮平分剩余空间。这一形态适用于对话框的底部与移动端界面。

<Demo name="button-group/block" />

### 分隔线 {#divider}

底色相同的按钮拼在一起时，相邻的边界并不明显。设置 `divider` 会在按钮之间加一条细线，长度不占满整条边，颜色取自当前的文字颜色。

<Demo name="button-group/divider" />

### 混排图标按钮 {#mixed}

`Button` 与 `IconButton` 可以拼接在同一组中，常见的做法是在主操作之后加入一个下拉触发器。

<Demo name="button-group/mixed" />

### 不可用 {#disabled}

组容器没有 `disabled` 属性。需要禁用整组时，逐个设置按钮的 `disabled`；也可以只禁用其中的一个。

<Demo name="button-group/disabled" />

## 自定义样式 {#styling}

`class` 会追加到组容器上。需要改写首尾的圆角时，在容器上使用子元素选择器统一设置，不要逐个写在按钮上。

<Demo name="button-group/custom" />

## 行为 {#behavior}

- 组内的按钮不再有按下时的缩放。
- 获得键盘焦点的按钮会提到上层，焦点框不被相邻按钮遮挡。
- 组容器为 `role="group"`，`label` 会作为整组的 `aria-label`。纵向排列时还会带上 `aria-orientation="vertical"`。

## API {#api}

### Props {#props}

| 属性          | 类型                         | 默认值         | 说明                         |
| ------------- | ---------------------------- | -------------- | ---------------------------- |
| `label`       | `string`                     | —              | 整组的无障碍名称             |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 拼接方向                     |
| `block`       | `boolean`                    | `false`        | 是否占满容器宽度并平分空间   |
| `divider`     | `boolean`                    | `false`        | 是否在相邻按钮之间显示分隔线 |
| `class`       | `string`                     | —              | 追加至根元素的类名           |

### Slots {#slots}

| 插槽      | 说明       |
| --------- | ---------- |
| `default` | 组内的按钮 |
