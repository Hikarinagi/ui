---
title: CloseButton
description: 用于关闭对话框、抽屉与提示的按钮。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/close-button/CloseButton.vue
---

<Demo name="close-button/hero" />

## 用法 {#usage}

```ts
import { CloseButton } from '@hina-ui/vue'
```

组件已经内置了图标与无障碍名称，因此不需要传入任何属性。默认名称为“关闭”，监听 `click` 事件即可。

<Demo name="close-button/basic" />

## 示例 {#examples}

### 尺寸 {#sizes}

默认为 `sm`。关闭按钮通常位于标题行或者卡片的右上角，`sm` 与相邻文字的高度最为接近。如果界面以触摸操作为主，可以适当放大按钮。`xs` 用于行内的小控件内部，例如 `Chip` 的移除按钮。

<Demo name="close-button/sizes" />

### 提示 {#tooltip}

默认不显示提示。把名称改写为更具体的动作后可以打开它，并通过 `side` 指定出现的方向。

<Demo name="close-button/tooltip" />

### 不可用 {#disabled}

设置 `disabled` 之后，按钮无法点击，也无法通过键盘聚焦。表单提交期间通常需要禁止关闭。

<Demo name="close-button/disabled" />

## 外观 {#appearance}

组件不开放变体、色调与形状，它们固定为 `ghost` 变体、`neutral` 色调与圆形，图标固定为 X。

如果需要其他外观或者其他图标，请直接使用 `IconButton`。

## 对话框与提示 {#overlays}

`Dialog`、`Drawer` 与 `Toast` 已经在标题行的右侧放置了关闭按钮，不需要重复添加。当 `Dialog` 与 `Drawer` 设置了 `locked` 时，内置的关闭按钮会同时被禁用。

<Demo name="close-button/in-dialog" />

## 无障碍 {#a11y}

- 按钮的默认名称为“关闭”，可以通过 `label` 改写为更具体的动作，例如“关闭预览”。
- 按钮渲染为原生的 `button`，可以通过键盘聚焦，回车键与空格键都能够触发。
- 屏幕阅读器只朗读按钮的名称，不会朗读图标。

## API {#api}

### Props {#props}

| 属性       | 类型                           | 默认值  | 说明                               |
| ---------- | ------------------------------ | ------- | ---------------------------------- |
| `label`    | `string`                       | 关闭    | 按钮的无障碍名称，同时作为提示文字 |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm'`  | 尺寸                               |
| `tooltip`  | `boolean`                      | `false` | 是否显示提示                       |
| `disabled` | `boolean`                      | `false` | 是否不可用                         |
| `class`    | `string`                       | —       | 追加至按钮的类名                   |

其余属性都会传递给 `IconButton`，例如通过 `side` 指定提示的方向。
