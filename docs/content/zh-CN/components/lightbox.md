---
title: Lightbox
description: 独立控制打开状态和图片序列的全屏预览。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/lightbox/Lightbox.vue
---

<Demo name="lightbox/hero" />

## 用法 {#usage}

```ts
import { Lightbox, type LightboxItem } from '@hina-ui/vue'
```

通过 `items` 提供图片，用 `v-model:open` 控制打开和关闭，用 `v-model:index` 控制当前图片。组件需要挂载在 Vue 组件树中；事件回调只需更新这些状态。

组件可以独立使用，不要求页面上存在 [Image](/components/image) 节点。示例中的 [Button](/components/button) 只负责打开预览。

## 来源动画 {#source}

通过条目的 `source` 返回来源 `<img>` 节点，打开时从图片位置展开，关闭时回到该图片的当前位置。配合 `fit` 保持来源图片的裁剪方式，外层容器的圆角裁剪也会参与过渡。

示例用 [Button](/components/button) 包裹 [Image](/components/image)，从点击事件中获取来源图片节点。也可以返回页面上已有的原生 `<img>`。

<Demo name="lightbox/source" />

## 矩形来源 {#virtual-source}

`source` 也可以返回视口坐标系中的 `{ x, y, width, height }`，单位为 CSS 像素，无需 `<img>` 节点。已有的矩形数据可直接通过 `source: () => bounds` 传入。

提供有效的 `previewSize` 时，可以直接按该尺寸从矩形展开；否则首次打开会先解码 `src`，取得图片内在尺寸。关闭时重新调用 `source`，使用返回的最新矩形；如果来源已经不可见，返回 `null` 或 `undefined` 即可改为淡出。组件会忽略零尺寸、非有限数值和完全处于视口外的矩形。

下例用 [Button](/components/button) 的背景图片演示，回调返回按钮的 `DOMRect`。

<Demo name="lightbox/virtual-source" />

## 尺寸与缩放 {#zoom}

初次打开时，图片完整适配可用区域，并且不超过自身的原始尺寸。可用区域为关闭按钮、底部工具栏和缩略图预留空间，随窗口尺寸变化重新计算。

双击在初始尺寸与原始尺寸之间切换。宽高比超过 2:1 的全景图优先适配高度，高宽比超过 2:1 的长图优先适配宽度，两者都不超过原始尺寸。工具栏中的“原始尺寸”可以直接显示 100% 大小，“适应窗口”回到初始适配尺寸。

滚轮、捏合及放大按钮最多放到原图尺寸的 2 倍。达到上下限时，对应的工具栏按钮禁用；小图已经按原始尺寸显示时，双击不会继续放大，仍可通过放大按钮或手势查看。

下例通过 [Image](/components/image) 和 [ImageGroup](/components/image#group) 展示不同原始尺寸的图片。

<Demo name="lightbox/zoom" />

## 预览原始尺寸 {#preview-size}

在条目上设置 `previewSize: { width, height }`，即可提前提供最终预览图片的原始像素尺寸。有独立 `preview` 地址时对应大图，否则对应 `src`。宽高必须同时是有限正数，未提供或无效时自动读取图片尺寸。

有效的显式尺寸决定初始适配和缩放上限，加载结果不会覆盖它。高清图到达时只替换画质，矩形来源的开场动画也无需等待解码。尺寸数据不改变 `source` 的位置与大小。

下例用 [Button](/components/button) 包裹 [Image](/components/image) 作为矩形来源，并为条目提供预览原始尺寸。[Image](/components/image#preview-size) 本身也支持同名属性。

<Demo name="lightbox/preview-size" />

## 行为 {#behavior}

- `src` 和 `preview` 按原样使用，支持普通图片地址和有效的 blob URL。
- `source` 可选。提供可见的来源图片时，从其位置和裁剪形状展开，关闭时缩回；没有来源时，以淡入和轻微缩放打开。
- `preview` 可以提供另一张大图地址。未提供有效 `previewSize` 时，解码完成后以大图尺寸更新初始适配和缩放上限；尺寸调整带过渡，并等待正在进行的开场动画结束。加载失败时继续使用 `src`。
- 支持缩放、平移、旋转、下载以及多图切换，交互与 [Image 的预览](/components/image#preview) 一致。
- blob URL 的创建与释放由调用方负责，预览使用期间应保持有效。
- 组件提供受控界面；命令式调用可以通过应用中的共享状态和一个已挂载的预览组件连接。

## 无障碍 {#a11y}

- 当前条目的 `alt` 用作图片替代文本和预览层的可访问名称。
- 打开期间焦点留在预览层内，页面滚动锁定。
- `Escape` 关闭预览，`←`、`→` 切换图片。

## API {#api}

| 属性            | 类型             | 默认值  | 说明                    |
| --------------- | ---------------- | ------- | ----------------------- |
| `items`         | `LightboxItem[]` | 必填    | 图片序列                |
| `v-model:open`  | `boolean`        | `false` | 是否打开                |
| `v-model:index` | `number`         | `0`     | 当前图片索引，从 0 开始 |
| `loop`          | `boolean`        | `false` | 多图切换是否首尾相接    |
| `class`         | `string`         | —       | 追加至预览层的类名      |

### LightboxItem {#item}

| 字段          | 类型                                        | 说明                                         |
| ------------- | ------------------------------------------- | -------------------------------------------- |
| `id`          | `string`                                    | 稳定且唯一的条目标识，不同图片使用不同标识   |
| `src`         | `string`                                    | 图片地址                                     |
| `alt`         | `string`                                    | 图片说明和预览层名称                         |
| `preview`     | `string`                                    | 可选的大图地址                               |
| `previewSize` | `{ width: number; height: number }`         | 最终预览图片的原始像素尺寸，宽高须为有限正数 |
| `fit`         | `ImageVariants['fit']`                      | 来源图片的填充方式，用于计算展开动画         |
| `source`      | `() => LightboxSource \| null \| undefined` | 可选的来源图片或矩形获取函数                 |

### LightboxSource {#source-type}

从包根导出的类型，支持以下两种来源。

```ts
type LightboxSource = HTMLImageElement | { x: number; y: number; width: number; height: number }
```
