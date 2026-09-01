---
title: Image
description: 懒加载、撑住位置并在失败时回退的图片。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/image/Image.vue
  - label: Skeleton
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/skeleton/Skeleton.vue
---

<Demo name="image/hero" />

## 用法 {#usage}

```ts
import { Image } from '@hikarinagi/ui'
```

图片在接近视口时才开始加载，加载期间由骨架占位，图片就绪后骨架淡出。用类名给出尺寸，或者用 `ratio` 提前占好高度。

<Demo name="image/basic" />

## 示例 {#examples}

### 宽高比 {#ratio}

`ratio` 是宽除以高。图片还不存在时框就已经是这个形状，因此图片到位不会顶动页面。

<Demo name="image/ratio" />

### 填充方式 {#fit}

`fit` 决定图片如何填满外框，默认为 `cover`。

<Demo name="image/fit" />

### 首屏图片 {#eager}

`lazy` 默认开启，图片要等观察器放行才开始请求，服务端渲染阶段也不会带上地址。首屏图片应当关闭 `lazy` 并开启 `eager`：地址随首屏 HTML 一同送达，请求以 `fetchpriority="high"` 发出，解码方式也改为同步。

<Demo name="image/eager" />

### 空态与失败 {#states}

没有 `src` 时渲染 `empty` 插槽。图片加载失败且没有可用的回退地址时，渲染 `error` 插槽。

<Demo name="image/states" />

### 回退 {#fallback}

`src` 加载失败后改用 `fallback`。回退地址同样失败时交给 `error` 插槽，并触发 `error` 事件。

<Demo name="image/fallback" />

### 解析地址 {#resolver}

组件只接收 `src`，不关心它是完整地址还是对象存储中的键。`provideImageResolver` 注入一个函数，由它把 `src` 变成最终地址；处理参数之类的细节由这个函数自行掌握，不必经过组件。没有注入解析器时，`src` 按原样使用。

<Demo name="image/resolver" />

## 行为 {#behavior}

- 默认懒加载：交叉观察器观察外框，图片距视口不足 `rootMargin` 时才带上地址开始请求，该值默认为 200 像素。
- 服务端渲染阶段观察器尚未介入，懒加载的图片先不带地址。首屏图片应当关闭 `lazy` 并开启 `eager`。
- 骨架盖在图片之上并铺满外框，`fit` 为 `contain` 时留出的空白同样被覆盖。图片解码完成之后骨架才淡出。
- 懒加载的图片在骨架期间不绘制，因此骨架边缘不会透出图片。
- 关闭 `lazy` 的图片位于骨架上层，浏览器完成绘制即可见，无需等待脚本；其下方的骨架直接移除，不做淡出。
- 浏览器不支持交叉观察器时，组件挂载后立即加载，不会使图片始终无法显示。
- 组件未声明的其余特性会落到 `img` 上，因此 `sizes`、`srcset` 之类照常可用。
- 更换 `src` 会重置回退状态，新图片从自己的地址开始加载，而不是沿用上一张的回退地址。

## 无障碍 {#a11y}

- `alt` 直接落到 `img` 上。装饰性图片留空，屏幕阅读器会跳过它。
- 骨架带 `aria-hidden`，加载状态由拥有这张图片的区域负责播报。

## API {#api}

| 属性         | 类型                                                       | 默认值    | 说明                   |
| ------------ | ---------------------------------------------------------- | --------- | ---------------------- |
| `src`        | `string`                                                   | —         | 图片地址，会经过解析器 |
| `alt`        | `string`                                                   | `''`      | 替代文本               |
| `fallback`   | `string`                                                   | —         | `src` 失败后改用的地址 |
| `fit`        | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | 图片如何填满外框       |
| `ratio`      | `number`                                                   | —         | 宽除以高，提前占位     |
| `lazy`       | `boolean`                                                  | `true`    | 是否等接近视口再加载   |
| `rootMargin` | `string`                                                   | `'200px'` | 提前多少距离开始加载   |
| `skeleton`   | `boolean`                                                  | `true`    | 加载期间是否显示骨架   |
| `eager`      | `boolean`                                                  | `false`   | 高优先级请求并同步解码 |
| `draggable`  | `boolean`                                                  | —         | 图片是否可拖拽         |
| `class`      | `string`                                                   | —         | 追加至外框的类名       |
| `imageClass` | `string`                                                   | —         | 追加至 `img` 的类名    |

| 事件    | 参数                      | 说明               |
| ------- | ------------------------- | ------------------ |
| `load`  | `size: { width, height }` | 图片加载完成       |
| `error` | —                         | 所有地址都已尝试过 |

| 插槽       | 说明               |
| ---------- | ------------------ |
| `skeleton` | 替换内置的加载骨架 |
| `empty`    | 没有 `src` 时渲染  |
| `error`    | 加载失败时渲染     |
