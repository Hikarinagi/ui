---
title: Space
description: 在 flex 容器中占位的空白元素。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/space/Space.vue
  - label: Inline
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/inline/Inline.vue
---

<Demo name="space/hero" />

## 用法 {#usage}

```ts
import { Space } from '@hina-ui/vue'
```

Space 是一个空的占位元素，只在 flex 容器中有意义。它默认占据剩余空间，把两侧的内容推开。子元素之间统一的间距由容器的 `gap` 控制，Space 用于某一处需要单独撑开或单独留白的情况。

<Demo name="space/flex" />

## 示例 {#examples}

### 定长 {#sizes}

给 `size` 之后不再弹性，占据固定尺寸，五档分别是 4、8、16、24 与 32 像素。

<Demo name="space/sizes" />

## 无障碍 {#a11y}

Space 带 `aria-hidden`，屏幕阅读器会跳过它。

## API {#api}

| 属性    | 类型                                             | 默认值   | 说明                    |
| ------- | ------------------------------------------------ | -------- | ----------------------- |
| `size`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'flex'` | `'flex'` | 定长档位，`flex` 为弹性 |
| `class` | `string`                                         | —        | 追加至元素的类名        |
