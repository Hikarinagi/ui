---
title: Container
description: 把页面内容限制在可读宽度内并居中。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/container/Container.vue
---

<Demo name="container/hero" />

## 用法 {#usage}

```ts
import { Container } from '@hina-ui/vue'
```

Container 限制内容的最大宽度并在父元素中居中，两侧带内边距：窄屏 16 像素，`sm` 断点以上 24 像素。

<Demo name="container/basic" />

## 示例 {#examples}

### 尺寸 {#sizes}

四档最大宽度分别是 768、1024、1152 与 1280 像素。正文类页面用 `sm`，列表与仪表盘用 `lg` 或者 `xl`。

<Demo name="container/sizes" />

## API {#api}

| 属性    | 类型                           | 默认值  | 说明             |
| ------- | ------------------------------ | ------- | ---------------- |
| `size`  | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | 内容的最大宽度   |
| `as`    | `string`                       | `'div'` | 渲染的标签       |
| `class` | `string`                       | —       | 追加至容器的类名 |

| 插槽      | 说明   |
| --------- | ------ |
| `default` | 子元素 |
