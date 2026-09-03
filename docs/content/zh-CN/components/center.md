---
title: Center
description: 把内容在两个方向上居中。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/center/Center.vue
---

<Demo name="center/hero" />

## 用法 {#usage}

```ts
import { Center } from '@hina-ui/vue'
```

Center 是一个横纵都居中的 flex 容器。它不设定高度，纵向居中要看容器自身的高度，因此通常配合 `h-*` 或者 `min-h-*` 使用。

<Demo name="center/basic" />

## 示例 {#examples}

### 行内 {#inline}

`inline` 换成 `inline-flex`，让容器留在文字行里，用于把图标与文字对齐。

<Demo name="center/inline" />

## API {#api}

| 属性     | 类型      | 默认值  | 说明             |
| -------- | --------- | ------- | ---------------- |
| `inline` | `boolean` | `false` | 是否为行内容器   |
| `as`     | `string`  | `'div'` | 渲染的标签       |
| `class`  | `string`  | —       | 追加至容器的类名 |

| 插槽      | 说明   |
| --------- | ------ |
| `default` | 子元素 |
