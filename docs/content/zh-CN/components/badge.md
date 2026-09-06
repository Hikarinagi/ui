---
title: Badge
description: 把未读数或者短标记钉在宿主元素的角上。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/badge/Badge.vue
---

<Demo name="badge/hero" />

## 用法 {#usage}

```ts
import { Badge } from '@hina-ui/vue'
```

宿主元素放在默认插槽中，`content` 是钉在角上的内容。组件只负责定位与呈现，宿主本身不受影响。

<Demo name="badge/basic" />

## 示例 {#examples}

### 最大值 {#max}

`content` 为数字且超过 `max` 时显示为上限加号，默认上限为 99。

<Demo name="badge/max" />

### 色调 {#tones}

默认为 `danger`。未读与待办用 `danger`，一般计数用 `accent` 或者 `neutral`，状态提示按语义选择其余三种。

<Demo name="badge/tones" />

### 尺寸 {#sizes}

两种尺寸的字号相同，区别在于徽标的高度与最小宽度。宿主较大或者内容为文字时使用 `md`。

<Demo name="badge/sizes" />

### 位置 {#placement}

`placement` 指定钉在哪个角，共四个取值，默认为右上角。

<Demo name="badge/placement" />

### 圆形宿主 {#circle}

宿主是圆形时设置 `shape="circle"`，角点向内收拢，徽标贴合圆弧而不是外接矩形的角。

<Demo name="badge/circle" />

### 自定义内容 {#content}

`content` 插槽用于替换徽标的内容，例如放入一个图标。

徽标是否渲染仍然由 `content` 属性决定，因此使用插槽时 `content` 也要设置为非空值。此时应当通过 `label` 提供无障碍名称。

<Demo name="badge/content" />

设置 `bare` 后徽标不绘制底色，也没有内边距，只负责定位与描边，尺寸由插槽内容决定。把 `Indicator` 放入插槽即可在头像角上显示状态点。

<Demo name="indicator/badge" />

### 描边 {#outline}

`outline` 默认开启，徽标外侧带一圈与页面底色相同的描边，使它从宿主的边缘切出。宿主颜色较深时可以关闭。

<Demo name="badge/outline" />

### 出现与消失 {#visibility}

`content` 为 0、空字符串或者未设置时，徽标不渲染。出现与消失都带缩放淡入淡出。

<Demo name="badge/visibility" />

## 无障碍 {#a11y}

- 徽标里的数字缺少上下文，应当通过 `label` 补充完整说法，例如“3 条未读”。该文字只供屏幕阅读器读取，不显示在界面上。
- 组件不改变宿主的语义。宿主是按钮时，它仍然是一个按钮。

## API {#api}

### Props {#props}

| 属性        | 类型                                                                    | 默认值      | 说明                       |
| ----------- | ----------------------------------------------------------------------- | ----------- | -------------------------- |
| `content`   | `string \| number \| null`                                              | —           | 徽标的内容，为空时不渲染   |
| `max`       | `number`                                                                | `99`        | 数字内容的显示上限         |
| `tone`      | `'danger' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'info'` | `'danger'`  | 语义色调                   |
| `size`      | `'sm' \| 'md'`                                                          | `'sm'`      | 尺寸                       |
| `placement` | `'top-end' \| 'top-start' \| 'bottom-end' \| 'bottom-start'`            | `'top-end'` | 钉在哪个角                 |
| `shape`     | `'rect' \| 'circle'`                                                    | `'rect'`    | 宿主的形状                 |
| `outline`   | `boolean`                                                               | `true`      | 是否描出与页面底色相同的边 |
| `bare`      | `boolean`                                                               | `false`     | 是否只定位不画底           |
| `label`     | `string`                                                                | —           | 供屏幕阅读器读取的完整说法 |
| `class`     | `string`                                                                | —           | 追加至外层容器的类名       |

### Slots {#slots}

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 宿主元素       |
| `content` | 替换徽标的内容 |
