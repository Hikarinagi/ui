---
title: CodeBlock
description: 成段的代码，带语法着色、语言角标与复制按钮。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/code-block/CodeBlock.vue
  - label: Code
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/code/Code.vue
---

<Demo name="code-block/hero" />

## 用法 {#usage}

```ts
import { CodeBlock } from '@hikarinagi/ui'
```

`code` 是必填属性，内容原样呈现。`lang` 指定语言，组件据此着色，并在右上角显示语言角标。

<Demo name="code-block/basic" />

## 示例 {#examples}

### 角标文字 {#label}

角标默认显示 `lang`。设置 `label` 可以改为文件名或其他说明，着色仍然依据 `lang`。

<Demo name="code-block/label" />

### 不着色 {#plain}

不指定 `lang` 时不着色，也不显示角标，代码按原样呈现。命令行输出与纯文本适合这样使用。

<Demo name="code-block/plain" />

### 复制按钮 {#copyable}

右上角默认带复制按钮。设置 `copyable` 为 `false` 可以移除它。

<Demo name="code-block/copyable" />

### 超长的行 {#overflow}

代码不换行。超出宽度时在代码块内横向滚动，页面本身不会被撑宽。滚动区可以聚焦，聚焦后能用方向键滚动。

<Demo name="code-block/overflow" />

### 预先着色 {#prerendered}

`html` 属性接受已经着色好的 HTML。传入之后组件不再运行着色，直接呈现该内容，`code` 仍用于复制。

在服务端或者构建时完成着色，可以让浏览器不必下载着色器。

<Demo name="code-block/prerendered" />

## 无障碍 {#a11y}

- 滚动区可以聚焦，聚焦后用方向键滚动，焦点框出现在代码块外沿。
- 滚动区的无障碍名称取自角标，未设置角标时为通用名称。
- 复制按钮的名称为“复制代码”，复制成功后变为“已复制”。

## API {#api}

### Props {#props}

| 属性       | 类型      | 默认值 | 说明                              |
| ---------- | --------- | ------ | --------------------------------- |
| `code`     | `string`  | —      | 必填。代码文本，同时用于复制      |
| `lang`     | `string`  | —      | 语言，决定着色与角标              |
| `label`    | `string`  | —      | 角标文字，覆盖 `lang`             |
| `html`     | `string`  | —      | 预先着色好的 HTML，传入后不再着色 |
| `copyable` | `boolean` | `true` | 是否显示复制按钮                  |
| `class`    | `string`  | —      | 追加至根元素的类名                |
