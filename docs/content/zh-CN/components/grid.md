---
title: Grid
description: 按固定列数排布子元素的栅格容器。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/grid/Grid.vue
---

<Demo name="grid/hero" />

## 用法 {#usage}

```ts
import { Grid } from '@hina-ui/vue'
```

`cols` 是列数，取 1 到 12。子元素按顺序填入格子，超出一行的自动换到下一行。

<Demo name="grid/basic" />

## 示例 {#examples}

### 列数 {#cols}

<Demo name="grid/cols" />

### 间距 {#gap}

`gap` 只接受档位。`md` 是默认档，两个方向取值不同：列间是 `--hn-inline-gap`，行间是 `--hn-stack-gap`，常规密度下分别是 12 与 16 像素。其余档位两轴相同，分别是 0、4、8、24 与 32 像素。

<Demo name="grid/gap" />

### 跨列 {#span}

子元素占据多列时，在子元素上写 Tailwind 的 `col-span-*`。Grid 不提供列组件。

<Demo name="grid/span" />

### 随断点变化 {#responsive}

列数在不同断点下不同时，用 Tailwind 的断点类覆盖，例如 `sm:grid-cols-4`。`cols` 属性本身不接受响应式对象。

<Demo name="grid/responsive" />

## API {#api}

| 属性    | 类型                                             | 默认值  | 说明             |
| ------- | ------------------------------------------------ | ------- | ---------------- |
| `cols`  | `1` 到 `12`                                      | `1`     | 列数             |
| `gap`   | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | 格子之间的间距   |
| `as`    | `string`                                         | `'div'` | 渲染的标签       |
| `class` | `string`                                         | —       | 追加至容器的类名 |

| 插槽      | 说明   |
| --------- | ------ |
| `default` | 子元素 |
