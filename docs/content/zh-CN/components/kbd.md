---
title: Kbd
description: 键盘按键，用于说明快捷键。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/kbd/Kbd.vue
---

<Demo name="kbd/hero" />

## 用法 {#usage}

```ts
import { Kbd } from '@hina-ui/vue'
```

组件渲染为原生的 `kbd`，使用等宽字体，底边比其余三边更粗，呈现键帽的轮廓。一个组件对应一个按键。

<Demo name="kbd/basic" />

## 示例 {#examples}

### 组合键 {#combination}

多个按键各用一个组件，之间的连接符号由调用方决定。同时按下的按键之间写加号，先后按下的用文字说明。

<Demo name="kbd/combination" />

### 跟随上下文缩放 {#inline}

字号是相对值，取所在文字的 81.25%。用在小字号的段落中时会一同缩小。

<Demo name="kbd/inline" />

### 正文中的按键 {#prose}

`Prose` 会为其中的原生 `kbd` 标签应用同一套样式。渲染 Markdown 或者富文本时不需要替换标签。

<Demo name="kbd/prose" />

## 无障碍 {#a11y}

- 组件渲染为原生的 `kbd`，屏幕阅读器会按用户输入朗读。
- 按键名称写全称更易读，例如写“Enter”而不是箭头符号。

## API {#api}

### Props {#props}

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `class` | `string` | —      | 追加至根元素的类名 |

### Slots {#slots}

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 按键名称 |
