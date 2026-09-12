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

## 行为 {#behavior}

- `src` 和 `preview` 按原样使用，支持普通图片地址和有效的 blob URL。
- `source` 可选。提供可见的来源图片时，从其位置和裁剪形状展开，关闭时缩回；没有来源时，以淡入和轻微缩放打开。
- `preview` 可以提供另一张大图地址，加载完成后替换 `src` 展示的图片。
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

| 字段      | 类型                                          | 说明                                       |
| --------- | --------------------------------------------- | ------------------------------------------ |
| `id`      | `string`                                      | 稳定且唯一的条目标识，不同图片使用不同标识 |
| `src`     | `string`                                      | 图片地址                                   |
| `alt`     | `string`                                      | 图片说明和预览层名称                       |
| `preview` | `string`                                      | 可选的大图地址                             |
| `fit`     | `ImageVariants['fit']`                        | 来源图片的填充方式，用于计算展开动画       |
| `source`  | `() => HTMLImageElement \| null \| undefined` | 可选的来源图片获取函数                     |
