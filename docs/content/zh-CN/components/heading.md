---
title: Heading
description: 标题，语义层级与视觉字号相互独立。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/heading/Heading.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/heading/heading.variants.ts
---

<Demo name="heading/hero" />

## 用法 {#usage}

```ts
import { Heading } from '@hikarinagi/ui'
```

`level` 决定渲染成 `h1` 到 `h6` 中的哪一个，默认为 2。字号默认跟随层级，因此通常只需要设置 `level`。

<Demo name="heading/basic" />

## 示例 {#examples}

### 层级 {#levels}

六个层级对应六档字号，从 30 像素递减到 14 像素。`xl` 及以上的字号会收紧字距。

<Demo name="heading/levels" />

### 语义与视觉分开 {#size}

`size` 单独指定字号，不改变标签。页面的标题结构由内容决定，视觉大小由版面决定，两者不必一致。

<Demo name="heading/size" />

### 字重 {#weight}

默认为 `semibold`。整段版面需要更轻的标题时可以改为 `medium` 或者 `normal`。

<Demo name="heading/weight" />

### 截断 {#truncate}

设置 `truncate` 后，超出容器宽度的标题在末尾显示省略号，标题不换行。

<Demo name="heading/truncate" />

### 正文中的标题 {#prose}

`Prose` 会为其中的原生 `h1` 到 `h6` 套用同一套字号。渲染 Markdown 或者富文本时不需要替换标签。

<Demo name="heading/prose" />

## 无障碍 {#a11y}

- 一个页面只应有一个 `h1`，其余标题按内容层级依次递进，不要为了字号跳级。需要更大或者更小的字时改 `size`。
- 屏幕阅读器可以按标题跳转浏览，层级正确才能形成可用的大纲。

## API {#api}

### Props {#props}

| 属性       | 类型                                                      | 默认值       | 说明                     |
| ---------- | --------------------------------------------------------- | ------------ | ------------------------ |
| `level`    | `1 \| 2 \| 3 \| 4 \| 5 \| 6`                              | `2`          | 渲染的标题标签           |
| `size`     | `'xs' \| 'sm' \| 'base' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | 跟随 `level` | 字号                     |
| `weight`   | `'normal' \| 'medium' \| 'semibold'`                      | `'semibold'` | 字重                     |
| `truncate` | `boolean`                                                 | `false`      | 是否单行截断并显示省略号 |
| `class`    | `string`                                                  | —            | 追加至根元素的类名       |

### Slots {#slots}

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 标题文字 |
