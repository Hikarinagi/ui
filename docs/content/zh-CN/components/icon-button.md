---
title: IconButton
description: 只包含图标的按钮，必须提供名称，并以名称作为悬停提示。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/icon-button/IconButton.vue
---

<Demo name="icon-button/hero" />

## 用法 {#usage}

```ts
import { IconButton } from '@hina-ui/vue'
```

`label` 是必填属性，它既作为无障碍名称，也作为悬停提示的文字。默认插槽用于放置图标。

<Demo name="icon-button/basic" />

工具栏、表格行尾、卡片右上角等空间有限的位置适合使用它，带有文字的操作仍然使用 `Button`。

## 示例 {#examples}

### 变体与色调 {#variants}

变体与色调与 `Button` 完全相同，但是默认值不同。`IconButton` 默认为 `ghost` 与 `neutral`，因为它通常出现在密集的界面中，不应当过于突出。

<Demo name="icon-button/variants" />

### 尺寸 {#sizes}

共三种尺寸。按钮为正方形，边长等于同一档 `Button` 的高度。

<Demo name="icon-button/sizes" />

### 状态 {#states}

设置 `loading` 后显示加载指示器并阻止点击，设置 `disabled` 后禁用按钮。加载过程中按钮的尺寸保持不变。

<Demo name="icon-button/states" />

### 提示 {#tooltip}

`side` 决定提示出现的方向，默认为上方。将 `tooltip` 设置为 `false`，可以只保留无障碍名称，不显示提示。

<Demo name="icon-button/side" />

提示依赖应用最外层的 `TooltipProvider`。如果没有挂载它，按钮依然可以正常工作，只是不显示提示，`aria-label` 不受影响。

## 无障碍 {#a11y}

- `label` 是必填属性，它会作为按钮的 `aria-label`，屏幕阅读器据此朗读。
- 图标对屏幕阅读器不可见，因此不要省略 `label`，只依靠图标表达含义。
- 加载中的按钮带有 `aria-busy`，屏幕阅读器会播报忙碌状态。

## API {#api}

### Props {#props}

| 属性       | 类型                                                  | 默认值      | 说明                               |
| ---------- | ----------------------------------------------------- | ----------- | ---------------------------------- |
| `label`    | `string`                                              | —           | 必填。无障碍名称，同时作为提示文字 |
| `tooltip`  | `boolean`                                             | `true`      | 是否显示悬停提示                   |
| `side`     | `'top' \| 'right' \| 'bottom' \| 'left'`              | `'top'`     | 提示出现的方向                     |
| `as`       | `string \| Component`                                 | `'button'`  | 渲染的元素或组件                   |
| `asChild`  | `boolean`                                             | `false`     | 不渲染自身，合并至唯一的子元素     |
| `variant`  | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'` | `'ghost'`   | 视觉样式                           |
| `tone`     | `'accent' \| 'neutral' \| 'danger'`                   | `'neutral'` | 语义色调                           |
| `size`     | `'sm' \| 'md' \| 'lg'`                                | `'md'`      | 尺寸                               |
| `type`     | `'button' \| 'submit' \| 'reset'`                     | `'button'`  | 原生 button 类型                   |
| `pill`     | `boolean`                                             | `false`     | 是否呈圆形                         |
| `loading`  | `boolean`                                             | `false`     | 是否处于加载状态                   |
| `disabled` | `boolean`                                             | `false`     | 是否禁用                           |
| `class`    | `string`                                              | —           | 追加至根元素的类名                 |

### Slots {#slots}

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `default` | 图标，加载时被指示器替换 |
