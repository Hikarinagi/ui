---
title: Anchor
description: 页内目录，随滚动标出当前所在的小节。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/anchor/Anchor.vue
---

<Demo name="anchor/hero" />

## 用法 {#usage}

```ts
import { Anchor } from '@hina-ui/vue'
```

`Anchor` 由 `items` 驱动，每一项的 `id` 对应页面中一个元素的 `id`，`label` 是目录上显示的文字。

它只渲染目录，不渲染内容。每个 `id` 必须能在文档中找到对应元素，否则该项既不会被跟踪，点击也不会有反应。

<Demo name="anchor/basic" />

它跟踪的是元素在视口中的可见性，因此内容位于页面主滚动区或 `ScrollArea` 之中，均可正常跟踪。

## 示例 {#examples}

### 层级 {#nested}

`children` 提供第二层条目，缩进一级显示。目录只支持两层——`children` 里再写 `children` 不会渲染。页内目录超过两层时，应当考虑拆分页面，而不是继续加深层级。

<Demo name="anchor/nested" />

### 目录名称 {#label}

`Anchor` 渲染为 `nav` 地标，带有随界面语言给出的无障碍名（简体中文为「本页目录」）。一个页面里有多个导航地标时，用 `label` 分别命名。

<Demo name="anchor/label" />

## 行为 {#behavior}

- 屏幕上同时出现多个小节时，它们一并标出，左侧的高亮条延展覆盖这一整段，而不是从中选取其一。
- 高亮条的伸缩是连续位移，不是跳变。
- 视口底部约 15% 的范围不计入可见，小节须真正进入阅读区域才会被标为当前位置。
- 点击条目平滑滚动至对应位置，并替换地址栏中的锚点，但不新增历史记录。
- 系统开启减弱动态效果时改为瞬时定位，不执行平滑滚动。

## 无障碍 {#a11y}

- 外层是 `nav` 地标，内部是链接列表。
- 当前项带 `aria-current="location"`。这里用 `location` 而非 `page`：读者仍在同一个页面上，变化的是页内位置。
- 条目是真链接，`href` 指向对应的锚点，可以复制、可以在新标签页打开。
- 高亮条是纯装饰，位置信息由 `aria-current` 与文字加重共同承担，不依赖颜色。

## API {#api}

### Props {#props}

| 属性    | 类型           | 默认值       | 说明               |
| ------- | -------------- | ------------ | ------------------ |
| `items` | `AnchorItem[]` | 必填         | 目录条目           |
| `label` | `string`       | 取自界面语言 | 导航地标的无障碍名 |
| `class` | `string`       | —            | 追加到根元素的类   |

### AnchorItem {#item}

| 字段       | 类型           | 说明                             |
| ---------- | -------------- | -------------------------------- |
| `id`       | `string`       | 目标元素的 `id`，不含 `#`        |
| `label`    | `string`       | 目录上显示的文字                 |
| `children` | `AnchorItem[]` | 第二层条目，其 `children` 被忽略 |
