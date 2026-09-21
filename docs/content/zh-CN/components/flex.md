---
title: Flex
description: 完整控制方向、对齐与分布的 flex 容器。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/flex/Flex.vue
---

<Demo name="flex/hero" />

## 用法 {#usage}

```ts
import { Flex } from '@hina-ui/vue'
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

### 根元素 {#as}

`as` 接受标签名或 Vue 组件，例如 `as="section"`、`:as="RouterLink"` 或 `:as="NuxtLink"`。组件须先导入或通过 `resolveComponent` 解析；对象组件、函数式组件和异步组件均可使用。布局类名、额外属性、事件监听器和默认插槽会传给该组件，不增加包裹层；自定义组件需将属性和类名传到实际根元素。

## API {#api}

| 属性        | 类型                                                                | 默认值  | 说明                  |
| ----------- | ------------------------------------------------------------------- | ------- | --------------------- |
| `direction` | `'row' \| 'col' \| 'row-reverse' \| 'col-reverse'`                  | `'row'` | 主轴方向              |
| `gap`       | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                    | —       | 子元素之间的间距      |
| `align`     | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'`           | —       | 交叉轴对齐方式        |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | —       | 主轴分布方式          |
| `wrap`      | `boolean`                                                           | —       | 放不下时是否换行      |
| `as`        | `string \| Component`                                               | `'div'` | 渲染的标签或 Vue 组件 |
| `class`     | `string`                                                            | —       | 追加至容器的类名      |

| 插槽      | 说明   |
| --------- | ------ |
| `default` | 子元素 |
