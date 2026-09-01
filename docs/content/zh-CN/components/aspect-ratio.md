---
title: AspectRatio
description: 把内容固定在给定的宽高比内。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/aspect-ratio/AspectRatio.vue
  - label: Card
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/card/Card.vue
---

<Demo name="aspect-ratio/hero" />

## 用法 {#usage}

```ts
import { AspectRatio } from '@hikarinagi/ui'
```

`ratio` 是宽除以高，默认为 `16 / 9`。容器的高度由宽度和这个比值算出，因此不同尺寸的图片放入后外框一致。

<Demo name="aspect-ratio/basic" />

## 示例 {#examples}

### 常见比例 {#ratios}

写成除法表达式比写小数更好认，例如 `:ratio="3 / 4"`。

<Demo name="aspect-ratio/ratios" />

### 嵌入内容 {#embed}

内部的元素占满整个框。图片和视频已经预设为 `object-fit: cover`，会填满框并裁去多余部分；`iframe` 等元素自身占满即可。

<Demo name="aspect-ratio/embed" />

## API {#api}

| 属性    | 类型     | 默认值   | 说明                 |
| ------- | -------- | -------- | -------------------- |
| `ratio` | `number` | `16 / 9` | 宽高比，宽除以高     |
| `class` | `string` | —        | 追加至外层容器的类名 |

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 框内内容 |
