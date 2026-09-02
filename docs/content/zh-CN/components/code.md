---
title: Code
description: 正文中的行内代码，用于标识变量名、属性与命令。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/code/Code.vue
  - label: CodeBlock
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/code-block/CodeBlock.vue
---

<Demo name="code/hero" />

## 用法 {#usage}

```ts
import { Code } from '@hina-ui/vue'
```

组件渲染为原生的 `code`，使用等宽字体，带浅色底与圆角。它用于在句子中标识一小段代码，例如变量名、属性名、文件名或者一条命令。

<Demo name="code/basic" />

## 示例 {#examples}

### 跟随上下文缩放 {#inline}

字号是相对值，取所在文字的 87.5%。用在小字号的段落中时会一同缩小，不会在句子中突出。

<Demo name="code/inline" />

### 正文中的行内代码 {#prose}

`Prose` 会为其中的原生 `code` 标签应用同一套样式。渲染 Markdown 或者富文本时不需要替换标签。

<Demo name="code/prose" />

### 成段的代码 {#block}

超过一行的代码使用 `CodeBlock`，它带有语法着色、语言角标与复制按钮。

<Demo name="code/block" />

## 无障碍 {#a11y}

- 组件渲染为原生的 `code`，屏幕阅读器会按代码朗读。
- 底色只作区分，不表达状态，因此没有色调。

## API {#api}

### Props {#props}

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `class` | `string` | —      | 追加至根元素的类名 |

### Slots {#slots}

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 代码文本 |
