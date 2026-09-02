---
title: Sidebar
description: 应用左侧的导航栏，可收起为图标条。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/sidebar/Sidebar.vue
---

<Demo name="sidebar/hero" />

## 用法 {#usage}

```ts
import { Sidebar, SidebarGroup, SidebarTrigger } from '@hina-ui/vue'
```

`Sidebar` 放进 `AppShell` 的 `sidebar` 插槽，条目写在默认插槽里，通常是一串 `NavLink`。它自带导航地标与滚动容器，条目再多也只在栏内滚动。

它的形态由 `AppShell` 提供，自身不持有状态。脱离 `AppShell` 时它始终是展开形态，也无法收起。

<Demo name="sidebar/basic" />

侧栏内的每个 `NavLink` 都应当写 `label`：收起为 rail 后文字淡出，`label` 会接手成为悬停提示与无障碍名。

## 示例 {#examples}

### 分组 {#groups}

`SidebarGroup` 把条目归到一个可折叠的标题下。`label` 是组名，`defaultOpen` 决定初始是否展开，默认展开。

<Demo name="sidebar/groups" />

### 页眉与页脚 {#slots}

`header` 与 `footer` 插槽分别位于条目区的上方与下方，两者都不随条目滚动。

收起为 rail 后侧栏只剩 56 像素，这两处的内容会被裁切。放在这里的内容应当在两种宽度下都成立，例如方形的标识、单个图标或小尺寸头像。两个插槽都会收到当前形态，供确有需要的调用方自行判断。

<Demo name="sidebar/slots" />

## 行为 {#behavior}

- 三种形态的宽度分别是展开 256 像素、rail 56 像素、隐藏 0 像素，切换时宽度连续过渡。
- 收起为 rail 时，`SidebarGroup` 强制展开、组标题让位给一条分隔线，并退出键盘序列，因为此时组名已无处显示。
- 条目区是滚动容器，页眉与页脚固定在两端。
- 系统开启减弱动态效果时宽度直接切换，不做过渡。
- 搬入移动端抽屉时不再自行加内边距，改由抽屉统一控制。

## 无障碍 {#a11y}

- 条目区是 `nav` 地标，默认无障碍名取自界面语言（简体中文为「侧边导航」），`label` 可覆盖。
- rail 形态下条目的文字虽然不可见，但 `NavLink` 的 `label` 会作为 `aria-label` 保留。
- 收起后被隐藏的组标题同时退出键盘序列，不会出现能聚焦却看不见的控件。

## API {#api}

### Sidebar {#props}

| 属性    | 类型     | 默认值       | 说明               |
| ------- | -------- | ------------ | ------------------ |
| `label` | `string` | 取自界面语言 | 导航地标的无障碍名 |
| `class` | `string` | —            | 追加到根元素的类   |

| 插槽      | 插槽参数    | 说明             |
| --------- | ----------- | ---------------- |
| `default` | —           | 侧栏条目         |
| `header`  | `{ state }` | 条目区上方的内容 |
| `footer`  | `{ state }` | 条目区下方的内容 |

### SidebarGroup {#group}

| 属性          | 类型      | 默认值 | 说明             |
| ------------- | --------- | ------ | ---------------- |
| `label`       | `string`  | 必填   | 组名             |
| `defaultOpen` | `boolean` | `true` | 初始是否展开     |
| `class`       | `string`  | —      | 追加到根元素的类 |

| 插槽      | 说明       |
| --------- | ---------- |
| `default` | 组内的条目 |

### SidebarTrigger {#trigger}

切换侧栏形态的按钮，通常放在 `AppShell` 的 `header` 插槽里。它没有可配置的行为，脱离 `AppShell` 时不渲染。

| 属性    | 类型     | 默认值 | 说明             |
| ------- | -------- | ------ | ---------------- |
| `class` | `string` | —      | 追加到根元素的类 |
