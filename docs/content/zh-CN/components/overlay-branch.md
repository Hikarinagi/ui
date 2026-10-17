---
title: OverlayBranch
description: 与模态浮层共存的外部图层。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/overlay-branch/OverlayBranch.vue
---

<Demo name="overlay-branch/hero" />

## 用法 {#usage}

```ts
import { OverlayBranch } from '@hina-ui/vue'
```

`OverlayBranch` 包住页面上另一层由调用方管理的界面，例如自绘的引导层或悬浮工具条。Dialog、Drawer、Sheet、模态的 Popover 与菜单等浮层打开时，把其中的内容当作浮层内部：

- 点击或聚焦其中的元素不关闭浮层，也不触发 `interactOutside`。
- 不被设为 `aria-hidden`，屏幕阅读器可以读到。
- 不受浮层对页面其余部分的 `pointer-events` 限制。
- 焦点约束允许焦点进入其中。

`as` 指定渲染的标签，默认 `div`；`asChild` 把这些行为交给唯一的子元素，不额外渲染节点。

## 行为 {#behavior}

- 挂载时登记，卸载时注销；浮层打开后才挂载的分支同样生效。
- 浮层把 `body` 设为 `pointer-events: none` 期间，分支根节点保留它原本的 `pointer-events`。根节点为 `pointer-events: none` 的透明全屏层不会挡住浮层，其中需要交互的部分自行设置 `pointer-events: auto`。浮层关闭后恢复分支原有的行内样式。
- 浮层的 Tab 循环不包含分支。焦点从分支移到浮层与分支以外的元素时，回到浮层内。
- 叠放层级由调用方决定。需要盖在浮层之上时，把分支渲染到 `body` 下（Vue 用 `Teleport`，React 用 `createPortal`），并使用比 `--hn-z-overlay` 更高的 `z-index`。分支位于带 `z-index` 或 `transform` 等形成层叠上下文的容器内时，它的 `z-index` 只在该容器内比较，会被浮层遮罩盖住。

## API {#api}

| 属性      | 类型      | 默认值  | 说明                                 |
| --------- | --------- | ------- | ------------------------------------ |
| `as`      | `string`  | `'div'` | 渲染的标签                           |
| `asChild` | `boolean` | `false` | 不渲染自身节点，行为交给唯一的子元素 |

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 外部图层内容 |
