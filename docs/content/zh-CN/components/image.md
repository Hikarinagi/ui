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
import { Image } from '@hina-ui/vue'
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

组件只接收 `src`，不关心它是完整地址还是对象存储中的键。`provideImageResolver` 注入一个函数，由它把 `src` 变成最终地址；处理参数之类的细节由这个函数自行掌握，不必经过组件。没有注入解析器时，`src` 按原样使用。函数还会收到第二个参数说明用途：页面上的图片为 `'image'`，预览时放大查看的大图为 `'preview'`。

<Demo name="image/resolver" />

### 预览 {#preview}

设置 `preview` 后，图片可以点击放大查看：图片从页面上的原位放大至屏幕中央，关闭时缩回原位。预览支持缩放、拖动、旋转与下载，向下拖动图片也可以关闭。

小图和大图可以是两种规格：解析器按用途给出各自的地址，或者直接把大图地址传给 `preview`。打开时先显示页面上的小图，大图就绪后替换。

<Demo name="image/preview" />

### 分组 {#group}

把多张图片放进 `ImageGroup`，点击任意一张后可以在整组之间切换，顺序与页面上的顺序一致。开启 `loop` 后翻页首尾相接。

<Demo name="image/group" />

## 行为 {#behavior}

- 默认懒加载：交叉观察器观察外框，图片距视口不足 `rootMargin` 时才带上地址开始请求，该值默认为 200 像素。
- 服务端渲染阶段观察器尚未介入，懒加载的图片先不带地址。首屏图片应当关闭 `lazy` 并开启 `eager`。
- 骨架盖在图片之上并铺满外框，`fit` 为 `contain` 时留出的空白同样被覆盖。图片解码完成之后骨架才淡出。
- 懒加载的图片在骨架期间不绘制，因此骨架边缘不会透出图片。
- 关闭 `lazy` 的图片位于骨架上层，浏览器完成绘制即可见，无需等待脚本；其下方的骨架直接移除，不做淡出。
- 浏览器不支持交叉观察器时，组件挂载后立即加载，不会使图片始终无法显示。
- 组件未声明的其余特性会落到 `img` 上，因此 `sizes`、`srcset` 之类照常可用。
- 更换 `src` 会重置回退状态，新图片从自己的地址开始加载，而不是沿用上一张的回退地址。
- 预览打开期间页面不能滚动，焦点留在预览层内；关闭后焦点回到图片。
- 向下拖动时图片随指针下移并缩小，背景逐渐透出页面；松开时拖动距离不足则弹回原处。
- 双指捏合以两指中点为中心缩放，滚轮以指针所指的点为中心缩放，双击以点击处为中心放大到 2.5 倍，再次双击回到原始大小。放大上限为 6 倍，捏合超出上下限时阻力逐渐增大，松开后弹回限值。
- 放大之后才能拖动查看，拖到边缘有阻力，松开后弹回；快速滑动后画面继续滑行并逐渐停下，到达边界时回弹。放大状态下向下拖动只平移画面，不会关闭。
- 切换图片时上一张的缩放、位置与旋转复位；组内图片增删后，预览中的图片随之更新。只有一张图片，或者未开启 `loop` 且已经到达两端时，继续拖动有阻力并回弹。
- 只为当前图片请求大图，切走后放弃请求，不会一次请求整组的大图。
- 关闭后再次打开时，缩放与位置都恢复初始状态。
- 系统开启减弱动态效果后，预览的打开、关闭、缩放、翻页与滑行都不再有过渡，直接切换到结果。

## 无障碍 {#a11y}

- `alt` 直接落到 `img` 上。装饰性图片留空，屏幕阅读器会跳过它。
- 骨架带 `aria-hidden`，加载状态由拥有这张图片的区域负责播报。
- 设置 `preview` 的图片渲染为按钮，`alt` 是它的可访问名称，也是预览层的标题；`alt` 为空时开发环境会输出警告。
- 预览打开期间可用 `←` `→` 键切换图片。缩略图栏中的每个按钮以图片的 `alt` 命名，当前项带 `aria-current`。

## API {#api}

| 属性         | 类型                                                       | 默认值    | 说明                                           |
| ------------ | ---------------------------------------------------------- | --------- | ---------------------------------------------- |
| `src`        | `string`                                                   | —         | 图片地址，会经过解析器                         |
| `alt`        | `string`                                                   | `''`      | 替代文本                                       |
| `fallback`   | `string`                                                   | —         | `src` 失败后改用的地址                         |
| `fit`        | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | 图片如何填满外框                               |
| `ratio`      | `number`                                                   | —         | 宽除以高，提前占位                             |
| `lazy`       | `boolean`                                                  | `true`    | 是否等接近视口再加载                           |
| `rootMargin` | `string`                                                   | `'200px'` | 提前多少距离开始加载                           |
| `skeleton`   | `boolean`                                                  | `true`    | 加载期间是否显示骨架                           |
| `eager`      | `boolean`                                                  | `false`   | 高优先级请求并同步解码                         |
| `preview`    | `boolean \| string`                                        | `false`   | 是否可以点击放大查看，传入字符串时作为大图地址 |
| `draggable`  | `boolean`                                                  | —         | 图片是否可拖拽                                 |
| `class`      | `string`                                                   | —         | 追加至外框的类名                               |
| `imageClass` | `string`                                                   | —         | 追加至 `img` 的类名                            |

| 事件    | 参数                      | 说明               |
| ------- | ------------------------- | ------------------ |
| `load`  | `size: { width, height }` | 图片加载完成       |
| `error` | —                         | 所有地址都已尝试过 |

| 插槽       | 说明               |
| ---------- | ------------------ |
| `skeleton` | 替换内置的加载骨架 |
| `empty`    | 没有 `src` 时渲染  |
| `error`    | 加载失败时渲染     |
