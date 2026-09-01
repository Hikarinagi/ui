---
title: Inline
description: 把子元素横向排成一行，放不下时换行。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/inline/Inline.vue
  - label: Stack
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/stack/Stack.vue
---

<Demo name="inline/hero" />

## 用法 {#usage}

```ts
import { Inline } from '@hikarinagi/ui'
```

Inline 是一个横向的 flex 容器，子元素纵向居中对齐，放不下时换行。

<Demo name="inline/basic" />

## 示例 {#examples}

### 间距 {#gap}

`gap` 只接受档位，不接受任意数值。`md` 是默认档，取自 `--hn-inline-gap`，常规密度下是 12 像素，紧凑密度下是 8 像素；其余五档分别是 0、4、8、24 与 32 像素。

<Demo name="inline/gap" />

### 纵向对齐 {#align}

`align` 决定子元素在纵向上的对齐方式，默认居中。文字大小不一时用 `baseline`，让基线对齐而不是块居中。

<Demo name="inline/align" />

### 横向分布 {#justify}

`justify` 决定子元素在横向上的分布。`between` 把首尾顶到两端，是标题行左标题右按钮的写法。

<Demo name="inline/justify" />

### 换行 {#wrap}

`wrap` 默认为真。设为假时子元素挤在一行，配合外层的溢出处理使用。

<Demo name="inline/wrap" />

### 语义标签 {#as}

`as` 换掉渲染出来的标签，导航场景用 `nav`。

<Demo name="inline/as" />

## API {#api}

| 属性      | 类型                                                                | 默认值     | 说明             |
| --------- | ------------------------------------------------------------------- | ---------- | ---------------- |
| `gap`     | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                    | `'md'`     | 子元素之间的间距 |
| `align`   | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'`           | `'center'` | 纵向对齐方式     |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | —          | 横向分布方式     |
| `wrap`    | `boolean`                                                           | `true`     | 放不下时是否换行 |
| `as`      | `string`                                                            | `'div'`    | 渲染出来的标签   |
| `class`   | `string`                                                            | —          | 追加至容器的类名 |

| 插槽      | 说明   |
| --------- | ------ |
| `default` | 子元素 |
