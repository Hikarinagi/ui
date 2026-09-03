---
title: SimpleGrid
description: 按最小列宽自动决定列数的等宽栅格。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/simple-grid/SimpleGrid.vue
---

<Demo name="simple-grid/hero" />

## 用法 {#usage}

```ts
import { SimpleGrid } from '@hina-ui/vue'
```

`min` 是每一列的最小宽度，容器能放下几列就放几列，各列等宽。列数由容器宽度决定，不需要写断点。列数固定的场景用 Grid。

<Demo name="simple-grid/basic" />

## 示例 {#examples}

### 最小列宽 {#min}

`min` 接受任意 CSS 长度，默认 `14rem`。它越大，同样宽度的容器里列数越少。

<Demo name="simple-grid/min" />

### 填满整行 {#fit}

默认按 `auto-fill` 划分轨道：容器能放下几列就划几列，子元素不够时右边留下空轨道。设置 `fit` 换成 `auto-fit`，空轨道塌陷，现有的子元素分掉整行的宽度。

<Demo name="simple-grid/fit" />

### 间距 {#gap}

`gap` 与 Grid 相同：`md` 档列间 12 像素、行间 16 像素，其余档位两轴相同。

## API {#api}

| 属性    | 类型                                             | 默认值    | 说明             |
| ------- | ------------------------------------------------ | --------- | ---------------- |
| `min`   | `string`                                         | `'14rem'` | 每一列的最小宽度 |
| `fit`   | `boolean`                                        | `false`   | 空轨道是否塌陷   |
| `gap`   | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`    | 格子之间的间距   |
| `as`    | `string`                                         | `'div'`   | 渲染的标签       |
| `class` | `string`                                         | —         | 追加至容器的类名 |

| 插槽      | 说明   |
| --------- | ------ |
| `default` | 子元素 |
