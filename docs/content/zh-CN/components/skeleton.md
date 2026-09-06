---
title: Skeleton
description: 内容加载期间保持其形状的占位块。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/skeleton/Skeleton.vue
---

<Demo name="skeleton/hero" />

## 用法 {#usage}

```ts
import { Skeleton } from '@hina-ui/vue'
```

用它包住真实内容，再传入 `loading`。`loading` 为真时内容隐藏但仍然参与布局，因此占位块的尺寸与内容将来的尺寸完全一致；`loading` 变为假之后包裹元素消失，只剩内容本身。

<Demo name="skeleton/wrapping" />

不放内容时，Skeleton 就是一个普通的块，尺寸由类名给出。

<Demo name="skeleton/basic" />

## 示例 {#examples}

### 形状 {#shapes}

形状完全由类名决定：图片用圆角矩形，头像用 `rounded-full`，一行文字用一条短块。

<Demo name="skeleton/shapes" />

## 行为 {#behavior}

- 底色在两档背景色之间明暗往复，两端减速，一个来回 2.2 秒。
- 系统开启减弱动态效果时呼吸停止，占位块保持静止。
- `loading` 为假时组件只渲染插槽内容，不留下任何包裹元素。

## 无障碍 {#a11y}

- 占位块带 `aria-hidden` 和 `inert`，屏幕阅读器会跳过它，其中的内容也无法获得焦点。
- 加载状态在拥有它的区域上播报，不必在每个占位块上重复。

## API {#api}

| 属性      | 类型      | 默认值   | 说明               |
| --------- | --------- | -------- | ------------------ |
| `loading` | `boolean` | `true`   | 是否显示占位块     |
| `as`      | `string`  | `'span'` | 渲染的标签         |
| `class`   | `string`  | —        | 追加至占位块的类名 |

| 插槽      | 说明                         |
| --------- | ---------------------------- |
| `default` | 真实内容，占位块的尺寸取自它 |
