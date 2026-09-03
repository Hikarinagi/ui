---
title: Divider
description: 分隔两段内容的细线。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/divider/Divider.vue
  - label: Separator
    href: https://reka-ui.com/docs/components/separator
---

<Demo name="divider/hero" />

## 用法 {#usage}

```ts
import { Divider } from '@hina-ui/vue'
```

Divider 渲染一条一像素的线，颜色取自 `--hn-line`。默认为横向，占满容器的宽度。

<Demo name="divider/basic" />

## 示例 {#examples}

### 带文字 {#label}

默认插槽中有文字时，文字两侧各有一条线。这种形态只在横向时有效。

<Demo name="divider/label" />

### 竖线 {#vertical}

设置 `orientation="vertical"` 后渲染为竖线。它的高度由 flex 容器的交叉轴决定，因此容器需要有确定的高度。

<Demo name="divider/vertical" />

### 装饰性 {#decorative}

默认渲染为 `role="separator"`，屏幕阅读器会播报这处分隔。仅用于装饰的线设置 `decorative`，它不会进入无障碍树。

<Demo name="divider/decorative" />

## API {#api}

| 属性          | 类型                         | 默认值         | 说明             |
| ------------- | ---------------------------- | -------------- | ---------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向             |
| `decorative`  | `boolean`                    | `false`        | 是否仅作装饰     |
| `class`       | `string`                     | —              | 追加到线上的类名 |

| 插槽      | 说明                       |
| --------- | -------------------------- |
| `default` | 线中间的文字，仅横向时有效 |
