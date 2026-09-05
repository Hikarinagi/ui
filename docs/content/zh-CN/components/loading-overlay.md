---
title: LoadingOverlay
description: 盖在一块区域上的加载指示，稍作等待再显示。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/loading-overlay/LoadingOverlay.vue
---

<Demo name="loading-overlay/hero" />

## 用法 {#usage}

```ts
import { LoadingOverlay } from '@hina-ui/vue'
```

加载遮罩铺满最近的定位容器，把内容压淡并放上加载指示；把它放进带 `relative` 的容器里，用 `visible` 控制显隐。它一出现就挡住下面的交互，但要过一小段时间才真正显示出来，很快结束的请求不会闪一下。

<Demo name="loading-overlay/basic" />

## 示例 {#examples}

### 文字 {#text}

`text` 在加载指示下方显示一行说明，同时作为指示的无障碍名称。

<Demo name="loading-overlay/text" />

### 延时与最短停留 {#delay}

`delay` 是 `visible` 变为真之后等多久再淡入，默认 300 毫秒，这段时间内撤掉它什么都不会出现；设为 `0` 立即显示，适合用户主动触发、明知要等的操作。`minVisible` 是显示之后至少停留多久，默认 300 毫秒，避免刚出现就消失的闪动；设为 `0` 则请求一结束就淡出。

<Demo name="loading-overlay/delay" />

### 自定义内容 {#custom}

默认插槽替换薄面里的加载指示与文字，可以放品牌形象、进度说明等自己的内容；薄面、延时与挡住交互的行为不变。自定义内容里应当有 `role="status"` 或者等价的文字，辅助技术才知道这里在等待。

<Demo name="loading-overlay/custom" />

### 覆盖整个视口 {#fixed}

`fixed` 让遮罩覆盖整个视口，用于整页级别的等待。

<Demo name="loading-overlay/fixed" />

## 行为 {#behavior}

- `visible` 变为真时立即挡住区域内的交互，等待 `delay` 后淡入；变为假时淡出并移除，显示未满 `minVisible` 则补足后再淡出。
- 延时内撤掉不会闪现。
- 遮罩不停止页面滚动，也不接管焦点；需要打断整页任务时用 [Dialog](/components/dialog) 的锁定。

## 无障碍 {#a11y}

- 加载指示是 `role="status"`，名称取自 `text`，没有时取语言包的「加载中」。
- 显示的文字对辅助技术隐藏，避免与指示的名称重复播报。

## API {#api}

### Props {#props}

| 属性         | 类型                   | 默认值  | 说明                             |
| ------------ | ---------------------- | ------- | -------------------------------- |
| `visible`    | `boolean`              | `false` | 是否显示                         |
| `text`       | `string`               | —       | 指示下方的说明                   |
| `fixed`      | `boolean`              | `false` | 是否覆盖整个视口                 |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`  | 加载指示的尺寸                   |
| `delay`      | `number`               | `300`   | 显示前等待的毫秒数，`0` 立即显示 |
| `minVisible` | `number`               | `300`   | 显示后至少停留的毫秒数           |
| `class`      | `string`               | —       | 追加至遮罩的类名                 |

### 插槽 {#slots}

| 插槽    | 说明                                  |
| ------- | ------------------------------------- |
| default | 薄面里的内容，默认是加载指示与 `text` |
