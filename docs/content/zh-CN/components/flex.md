---
title: Flex
description: 完整控制方向、对齐与分布的 flex 容器。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/flex/Flex.vue
  - label: Stack
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/stack/Stack.vue
---

<Demo name="flex/hero" />

## 用法 {#usage}

```ts
import { Flex } from '@hikarinagi/ui'
```

Flex 开放了 flex 布局的四个属性：`direction`、`align`、`justify` 和 `wrap`。方向固定时用 Stack 或 Inline 更简洁，需要切换方向或完整控制对齐时用 Flex。

<Demo name="flex/basic" />

## 示例 {#examples}

### 方向 {#direction}

`direction` 有四个取值，默认横排。

<Demo name="flex/direction" />

### 间距 {#gap}

`gap` 只接受档位。`md` 档随方向取值：横排取 `--hn-inline-gap`，纵排取 `--hn-stack-gap`，因此方向变化时无需调整间距。其余档位在两个方向上一致，分别是 0、4、8、24 和 32 像素。

<Demo name="flex/gap" />

### 对齐与分布 {#alignment}

`align` 控制交叉轴，`justify` 控制主轴。横排时 `align` 作用于纵向、`justify` 作用于横向，纵排时两者对调。

<Demo name="flex/alignment" />

### 换行 {#wrap}

不设置 `wrap` 时不换行，这是 flex 自身的行为。Inline 默认换行，Flex 则不默认换行。

<Demo name="flex/wrap" />

### 随断点变化 {#responsive}

方向与对齐在不同断点下不同时，用 Tailwind 的断点类覆盖，例如 `sm:flex-row`。属性本身不接受响应式对象。

<Demo name="flex/responsive" />

## API {#api}

| 属性        | 类型                                                                | 默认值  | 说明             |
| ----------- | ------------------------------------------------------------------- | ------- | ---------------- |
| `direction` | `'row' \| 'col' \| 'row-reverse' \| 'col-reverse'`                  | `'row'` | 主轴方向         |
| `gap`       | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                    | —       | 子元素之间的间距 |
| `align`     | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'`           | —       | 交叉轴对齐方式   |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | —       | 主轴分布方式     |
| `wrap`      | `boolean`                                                           | —       | 放不下时是否换行 |
| `as`        | `string`                                                            | `'div'` | 渲染的标签       |
| `class`     | `string`                                                            | —       | 追加至容器的类名 |

| 插槽      | 说明   |
| --------- | ------ |
| `default` | 子元素 |
