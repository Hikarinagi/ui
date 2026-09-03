---
title: Toggle
description: 可按下与松开的双态按钮。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/toggle/Toggle.vue
  - label: Toggle
    href: https://reka-ui.com/docs/components/toggle
---

<Demo name="toggle/hero" />

## 用法 {#usage}

```ts
import { Toggle } from '@hina-ui/vue'
```

切换按钮是一个可以保持按下状态的按钮，用于加粗、收藏、筛选这类随时可以打开或者关闭的操作。`v-model` 绑定是否按下，默认插槽是文字，`#icon` 放前置图标。外观取自 `Button` 的 `ghost` 与 `outline` 两种形态，按下后字色与墨转为品牌色。未声明的属性都会传给按钮元素。

<Demo name="toggle/basic" />

它与 `Switch` 的区别在于场合：开关表示一项设置，总是带文字说明，独立成行；切换按钮是一个动作，常常只有图标，成排出现在工具栏里。与 `Chip` 的可选中形态相比，Chip 是行内的条目，胶囊形且尺寸更小。

## 示例 {#examples}

### 图标型 {#icon}

传入 `label` 即为图标型：按钮变为正方形，`label` 是它的无障碍名称，在 `TooltipProvider` 内还会作为文字提示。`#pressed-icon` 给出按下时的图标，两个图标之间交叉淡变。

<Demo name="toggle/icon" />

### 工具栏 {#toolbar}

成排的图标型切换按钮各自持有一个布尔值，互不影响。需要恰好一项被选中时应使用 `SegmentedControl`。

<Demo name="toggle/toolbar" />

### 形态 {#variants}

`ghost` 为默认，`outline` 带发丝线边框，适合单独放在内容里。

<Demo name="toggle/variants" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，与 `Button` 逐档相同。

<Demo name="toggle/sizes" />

### 状态 {#states}

`disabled` 禁用按钮，禁用时保留按下状态。

<Demo name="toggle/states" />

## 行为 {#behavior}

- 点击、空格或者 Enter 在按下与松开之间切换。
- 按下态由品牌色的墨与字色表达，悬停与按压的墨叠加在其上。
- 有 `#pressed-icon` 时两个图标交叉淡变，不硬切。

## 无障碍 {#a11y}

- 根元素是带 `aria-pressed` 的按钮，读屏软件读作「切换按钮，已按下」。
- 图标型必须提供 `label`；文字型以文字命名。

## API {#api}

### Props {#props}

| 属性         | 类型                                     | 默认值    | 说明                         |
| ------------ | ---------------------------------------- | --------- | ---------------------------- |
| `modelValue` | `boolean`                                | `false`   | 是否按下                     |
| `label`      | `string`                                 | —         | 图标型的名称，传入即为图标型 |
| `tooltip`    | `boolean`                                | `true`    | 图标型是否显示文字提示       |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`   | 文字提示的位置               |
| `variant`    | `'ghost' \| 'outline'`                   | `'ghost'` | 形态                         |
| `size`       | `'sm' \| 'md' \| 'lg'`                   | `'md'`    | 尺寸                         |
| `pill`       | `boolean`                                | `false`   | 是否为胶囊形                 |
| `disabled`   | `boolean`                                | `false`   | 是否禁用                     |
| `ripple`     | `boolean`                                | `true`    | 是否显示按压波纹             |
| `class`      | `string`                                 | —         | 追加至按钮元素的类名         |

### 插槽 {#slots}

| 插槽           | 参数                   | 说明             |
| -------------- | ---------------------- | ---------------- |
| `default`      | —                      | 文字             |
| `icon`         | `{ pressed: boolean }` | 前置图标         |
| `pressed-icon` | —                      | 按下时的前置图标 |

### 事件 {#events}

| 事件                | 参数             | 说明         |
| ------------------- | ---------------- | ------------ |
| `update:modelValue` | `value: boolean` | 按下状态变化 |
