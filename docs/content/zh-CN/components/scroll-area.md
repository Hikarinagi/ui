---
title: ScrollArea
description: 使用浮层滚动条的滚动区域。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/scroll-area/ScrollArea.vue
  - label: OverlayScrollbars
    href: https://kingsora.github.io/OverlayScrollbars/
---

<Demo name="scroll-area/hero" />

## 用法 {#usage}

```ts
import { ScrollArea } from '@hina-ui/vue'
```

给区域一个高度，超出的部分即可滚动。滚动条浮在内容之上，不占用内容的宽度，并且在各个平台上外观一致。

<Demo name="scroll-area/basic" />

组件库中所有需要内部滚动的地方都经由这个组件：下拉列表、菜单、Dialog 和 Drawer 的正文、AppShell 的主区域。其他组件不各自引入滚动库，因此滚动行为不会出现分歧。

## 示例 {#examples}

### 方向 {#direction}

`direction` 取 `vertical`、`horizontal` 或 `both`。横向区域中滚轮会横向滚动，因为鼠标没有对应的横向手势，而浮层滚动条大多数时候是隐藏的。

<Demo name="scroll-area/horizontal" />

### 边缘阴影 {#shadow}

某一侧还有未显示的内容时，该侧出现阴影，滚动到尽头后消失。边界本身已经足够清楚时，把 `shadow` 设为假。

<Demo name="scroll-area/shadow" />

### 滚动条的显示时机 {#autohide}

`autoHide` 决定滚动条何时淡出：`never` 始终显示，`scroll` 滚动时显示，`leave` 在指针离开前一直显示，`move` 在区域内移动指针时显示。

<Demo name="scroll-area/autohide" />

### 键盘访问 {#focusable}

区域内可以滚动但没有可聚焦元素时，键盘无法到达它。设置 `focusable` 后区域进入 Tab 顺序，渲染为 `role="region"`，并用 `label` 提供名称。

<Demo name="scroll-area/focusable" />

## 行为 {#behavior}

- 滚动条覆盖在内容之上，内容开始溢出时布局宽度不变。
- 组件接管之前即可滚动：结构从首次绘制起就能原生滚动，OverlayScrollbars 在浏览器空闲时接管。
- 内容因动画改变尺寸时滚动条自行更新，不需要额外接入观察器。

## 无障碍 {#a11y}

- 不设置 `focusable` 时，区域是普通容器：键盘可以到达其中的可聚焦元素，浏览器随之滚动。
- 设置 `focusable` 后，区域以 `role="region"` 进入 Tab 顺序，名称取自 `label`，方向键可以滚动它。

## API {#api}

| 属性            | 类型                                       | 默认值       | 说明                           |
| --------------- | ------------------------------------------ | ------------ | ------------------------------ |
| `direction`     | `'vertical' \| 'horizontal' \| 'both'`     | `'vertical'` | 滚动的方向                     |
| `autoHide`      | `'never' \| 'scroll' \| 'leave' \| 'move'` | `'leave'`    | 滚动条何时淡出                 |
| `scrollbar`     | `boolean`                                  | `true`       | 是否显示滚动条                 |
| `wheelRedirect` | `boolean`                                  | `true`       | 横向区域中滚轮是否横向滚动     |
| `shadow`        | `boolean`                                  | `true`       | 是否显示边缘阴影               |
| `focusable`     | `boolean`                                  | `false`      | 是否让区域进入 Tab 顺序        |
| `label`         | `string`                                   | —            | 无障碍名称，`focusable` 时使用 |
| `class`         | `string`                                   | —            | 追加至外层元素的类名           |

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 滚动区域的内容 |
