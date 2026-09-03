---
title: CopyButton
description: 将一段文本写入剪贴板的按钮，并给出复制成功的反馈。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/copy-button/CopyButton.vue
---

<Demo name="copy-button/hero" />

## 用法 {#usage}

```ts
import { CopyButton } from '@hina-ui/vue'
```

`text` 是必填属性，它的内容会写入剪贴板。复制成功后，图标由复制切换为选中标记，按钮的名称同时变为“已复制”，两秒后自动恢复。

<Demo name="copy-button/basic" />

## 示例 {#examples}

### 尺寸 {#sizes}

默认为 `sm`。复制按钮通常紧跟在一段文本或者一行命令之后，`sm` 与相邻文字的高度最为接近。

<Demo name="copy-button/sizes" />

### 名称与提示 {#label}

默认名称为“复制”。如果页面上有多个复制按钮，应当通过 `label` 说明各自复制的内容，并且打开 `tooltip`，便于在点击之前区分。

复制成功之后名称固定切换为“已复制”，自定义的名称在这段时间内不显示。

<Demo name="copy-button/label" />

### 复位时长 {#timeout}

`timeout` 决定成功状态持续的时间，默认为 2000 毫秒。如果按钮位于较长的表单中或者页面的边缘，可以适当延长，便于使用者注意到反馈。

<Demo name="copy-button/timeout" />

### 复制事件 {#event}

复制成功时组件会触发 `copied` 事件，参数为写入剪贴板的文本。失败时不触发。

<Demo name="copy-button/event" />

## 剪贴板的限制 {#clipboard}

浏览器只在安全上下文中提供剪贴板接口，页面需要通过 HTTPS 或者 `localhost` 访问。在 `file://` 打开的页面以及部分内嵌页面中，写入会被拒绝。

写入失败时按钮不会进入成功状态，图标与名称都保持原样，也不会触发 `copied` 事件。

## 无障碍 {#a11y}

- 按钮的默认名称为“复制”，复制成功后变为“已复制”，屏幕阅读器会读出这一变化。
- 按钮渲染为原生的 `button`，可以通过键盘聚焦，回车键与空格键都能够触发。
- 提示默认关闭，需要时通过 `tooltip` 打开。

## API {#api}

### Props {#props}

| 属性       | 类型                   | 默认值  | 说明                   |
| ---------- | ---------------------- | ------- | ---------------------- |
| `text`     | `string`               | —       | 必填。写入剪贴板的文本 |
| `label`    | `string`               | 复制    | 按钮的无障碍名称       |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'sm'`  | 尺寸                   |
| `timeout`  | `number`               | `2000`  | 成功状态持续的毫秒数   |
| `tooltip`  | `boolean`              | `false` | 是否显示提示           |
| `disabled` | `boolean`              | `false` | 是否不可用             |
| `class`    | `string`               | —       | 追加至按钮的类名       |

### Events {#events}

| 事件     | 参数           | 说明                 |
| -------- | -------------- | -------------------- |
| `copied` | `text: string` | 写入剪贴板成功时触发 |
