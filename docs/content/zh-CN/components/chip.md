---
title: Chip
description: 可选中或者可移除的条目。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/chip/Chip.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/chip/chip.variants.ts
---

<Demo name="chip/hero" />

## 用法 {#usage}

```ts
import { Chip } from '@hina-ui/vue'
```

条目有两种用法：`selectable` 使条目可以选中，`removable` 为条目添加移除按钮，两者只能取其一。不需要交互的短标注使用 `Tag`。

<Demo name="chip/basic" />

## 示例 {#examples}

### 可选中 {#selectable}

设置 `selectable` 后条目渲染为按钮，`v-model:selected` 绑定选中状态。选中的条目使用强调色，并在文字前显示勾选图标。

<Demo name="chip/selectable" />

### 可移除 {#removable}

设置 `removable` 后条目末尾显示移除按钮，点击时触发 `remove` 事件，条目本身不可点击。

<Demo name="chip/removable" />

### 变体与色调 {#variants}

`soft` 带浅色底，`outline` 只有边框，默认为 `soft`。色调有 `neutral` 与 `accent` 两种，默认为 `neutral`。

<Demo name="chip/variants" />

### 尺寸 {#sizes}

`md` 与小号按钮同高，`sm` 用于输入框内与密集的列表。

<Demo name="chip/sizes" />

### 带图标 {#icons}

图标放入 `icon` 插槽。可选中的条目选中后，图标的位置改为显示勾选图标。

<Demo name="chip/icons" />

### 禁用 {#disabled}

`disabled` 的条目不响应点击，移除按钮也一并禁用。

<Demo name="chip/disabled" />

### 作为链接 {#link}

`as` 设为 `a` 并给出 `href`，条目成为链接，带悬停与按下反馈，用于跳转到标签页之类的入口。

<Demo name="chip/link" />

## 行为 {#behavior}

- 可选中的条目是原生按钮，点击、回车键与空格键都可以切换选中状态。
- 选中后文字前显示勾选图标；带 `icon` 插槽时，图标改为显示勾选图标。
- 移除按钮聚焦时，回车键、空格键、退格键与删除键都会触发 `remove`；点击移除按钮不会触发条目的点击。
- `selectable` 与 `removable` 同时设置时，开发环境输出警告并忽略 `removable`。
- 禁用的条目不响应点击，也不进入键盘焦点序列。

## 无障碍 {#a11y}

- 可选中的条目带 `aria-pressed`，屏幕阅读器将其作为切换按钮朗读。
- 移除按钮的名称是“移除”，来自 locale 的 `chip.remove`。
- 可移除的条目本身不可聚焦，键盘焦点直接落在移除按钮上。

## API {#api}

### Props {#props}

| 属性         | 类型                    | 默认值      | 说明                                               |
| ------------ | ----------------------- | ----------- | -------------------------------------------------- |
| `selectable` | `boolean`               | `false`     | 是否可以选中                                       |
| `selected`   | `boolean`               | `false`     | 选中状态，支持 `v-model:selected`                  |
| `removable`  | `boolean`               | `false`     | 是否显示移除按钮                                   |
| `variant`    | `'soft' \| 'outline'`   | `'soft'`    | 视觉样式                                           |
| `tone`       | `'neutral' \| 'accent'` | `'neutral'` | 色调                                               |
| `size`       | `'sm' \| 'md'`          | `'md'`      | 尺寸                                               |
| `disabled`   | `boolean`               | `false`     | 是否禁用                                           |
| `ripple`     | `boolean`               | `true`      | 按下时是否显示波纹                                 |
| `as`         | `string`                | —           | 渲染的标签，可选中时默认为 `button`，否则为 `span` |
| `class`      | `string`                | —           | 追加至根元素的类名                                 |

### Events {#events}

| 事件              | 参数                | 说明           |
| ----------------- | ------------------- | -------------- |
| `update:selected` | `selected: boolean` | 选中状态变化   |
| `remove`          | —                   | 点击了移除按钮 |

### Slots {#slots}

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 条目的文字   |
| `icon`    | 文字前的图标 |
