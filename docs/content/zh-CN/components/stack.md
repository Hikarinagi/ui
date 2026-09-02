---
title: Stack
description: 把子元素纵向排成一列。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/stack/Stack.vue
  - label: Inline
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/inline/Inline.vue
---

<Demo name="stack/hero" />

## 用法 {#usage}

```ts
import { Stack } from '@hina-ui/vue'
```

Stack 是一个纵向的 flex 容器，子元素依次向下排列，间距由 `gap` 决定。

<Demo name="stack/basic" />

## 示例 {#examples}

### 间距 {#gap}

`gap` 只接受档位，不接受任意数值。`md` 是默认档，取自 `--hn-stack-gap`，常规密度下是 16 像素，紧凑密度下是 12 像素；其余五档分别是 0、4、8、24 和 32 像素。

<Demo name="stack/gap" />

### 横向对齐 {#align}

`align` 决定子元素在横向上的对齐方式。不设置时子元素占满容器宽度，这是 flex 自身的行为。

<Demo name="stack/align" />

### 纵向分布 {#justify}

`justify` 决定子元素在纵向上的分布，只有容器高度确定时才有效果。`between` 让首尾两项分别靠向两端，中间留空。

<Demo name="stack/justify" />

### 语义标签 {#as}

`as` 指定渲染的标签，列表用 `ul` 或 `ol`。

<Demo name="stack/as" />

## API {#api}

| 属性      | 类型                                                                | 默认值  | 说明               |
| --------- | ------------------------------------------------------------------- | ------- | ------------------ |
| `gap`     | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                    | `'md'`  | 子元素之间的间距   |
| `align`   | `'start' \| 'center' \| 'end' \| 'stretch'`                         | —       | 横向对齐方式       |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | —       | 纵向分布方式       |
| `as`      | `string`                                                            | `'div'` | 渲染的标签         |
| `class`   | `string`                                                            | —       | 追加到容器上的类名 |

| 插槽      | 说明   |
| --------- | ------ |
| `default` | 子元素 |
