---
title: Result
description: 一次操作完成后的结果页，成功、失败、警告或提示。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/result/Result.vue
---

<Demo name="result/hero" />

## 用法 {#usage}

```ts
import { Result } from '@hina-ui/vue'
```

`status` 决定图标与配色，`title` 说明结果，`description` 补充影响或下一步。排布与 [Empty](/components/empty) 相同：图标、文字与操作从上到下居中，组件占满所在容器的宽度。

<Demo name="result/basic" />

## 示例 {#examples}

### 状态 {#status}

四种状态：`success`、`error`、`warning` 与 `info`，默认为 `info`。

<Demo name="result/status" />

### 操作 {#actions}

`actions` 插槽放置后续操作，通常是一个主要按钮，或者再加一个次要按钮。

<Demo name="result/actions" />

### 补充内容 {#extra}

默认插槽的内容显示在文字下方，用来放订单号、错误详情这类补充信息。

<Demo name="result/extra" />

### 自定义图标 {#icon}

`icon` 插槽替换状态图标，可以是另一枚图标，也可以是一张插图。

<Demo name="result/icon" />

### 尺寸 {#sizes}

三档尺寸同时改变图标、文字与内边距，`lg` 用于整页的结果。

<Demo name="result/sizes" />

## 无障碍 {#a11y}

- 图标只是装饰，对辅助技术隐藏；状态由标题与说明的文字表达。
- 根元素带 `data-status`，取值与 `status` 相同。

## API {#api}

### Props {#props}

| 属性          | 类型                                          | 默认值   | 说明               |
| ------------- | --------------------------------------------- | -------- | ------------------ |
| `status`      | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | 结果的状态         |
| `title`       | `string`                                      | —        | 标题               |
| `description` | `string`                                      | —        | 标题下方的说明     |
| `size`        | `'sm' \| 'md' \| 'lg'`                        | `'md'`   | 尺寸               |
| `class`       | `string`                                      | —        | 追加至根元素的类名 |

### 插槽 {#slots}

| 插槽      | 说明                     |
| --------- | ------------------------ |
| default   | 文字下方的补充内容       |
| `icon`    | 替换状态图标的图标或插图 |
| `actions` | 最下方的操作             |
