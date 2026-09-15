---
title: Sidebar
description: 应用左侧的导航栏，可收起为图标条。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/sidebar/Sidebar.vue
---

<Demo name="sidebar/hero" />

## 用法 {#usage}

```ts
import { Sidebar, SidebarGroup, SidebarLabel, SidebarTrigger } from '@hina-ui/vue'
```

`Sidebar` 放进 [AppShell](/components/app-shell) 的 `sidebar` 插槽，条目写在默认插槽里，通常是一串 [NavLink](/components/nav-link)。它自带导航地标与滚动容器，条目再多也只在栏内滚动。

它的形态由 [AppShell](/components/app-shell) 提供，自身不持有状态。脱离 [AppShell](/components/app-shell) 时它始终是展开形态，也无法收起。

<Demo name="sidebar/basic" />

侧栏内的每个 [NavLink](/components/nav-link) 都应当写 `label`：收起为 rail 后文字淡出，`label` 会接手成为悬停提示与无障碍名。

## 示例 {#examples}

### 分组 {#groups}

`SidebarGroup` 把条目归到一个可折叠的标题下。`label` 是组名，`defaultOpen` 决定初始是否展开，默认展开。

<Demo name="sidebar/groups" />

### 品牌图标与字标 {#brand}

`icon` 与 `wordmark` 插槽组成默认页眉。图标位固定为 32 × 32 像素，SVG 和图片按比例显示；字标可以是文字、SVG、[Image](/components/image) 或组合内容。

| 插槽内容            | 展开                   | 收起为 rail            |
| ------------------- | ---------------------- | ---------------------- |
| `icon` + `wordmark` | 图标与字标并排显示     | 图标保持原位，字标淡出 |
| 只有 `icon`         | 显示图标               | 保持原位               |
| 只有 `wordmark`     | 字标从页眉起始位置显示 | 品牌区整体收起         |
| 均未提供            | 不生成品牌区           | 不生成品牌区           |

有图标时，收起后品牌行保留高度；只有字标时，品牌区连同上下内边距一起收起，导航向上填补空位。重新展开或进入移动端抽屉时，品牌区完整显示。字标自动使用与导航文字相同的过渡，不需要再包 [SidebarLabel](#label)。

两个插槽均提供 `{ state }`。传入 `header` 时由它完全接管页眉，`icon` 和 `wordmark` 不再渲染。

<Demo name="sidebar/brand" />

### 页眉与页脚 {#slots}

`header` 完整替换默认品牌页眉，`footer` 位于条目区下方，两者都不随条目滚动。自定义页眉不会被自动视为 logo 隐藏。

页眉与页脚保持展开时的内容宽度，收起过程不会挤压内容或改变换行。把文字与附属操作放进 `SidebarLabel`，它会与 [NavLink](/components/nav-link) 的文字一起淡出，展开时延后淡入；标识和 [Avatar](/components/avatar) 留在外面，位置与尺寸保持不变。

`SidebarLabel` 不改变内容的占位。rail 形态下其内容不可见、不可交互，也不进入朗读和键盘焦点序列。`header` 和 `footer` 仍提供 `{ state }`，供自定义内容读取当前形态。

<Demo name="sidebar/slots" />

## 行为 {#behavior}

- 三种形态的宽度分别是展开 256 像素、rail 56 像素、隐藏 0 像素，切换时宽度连续过渡。
- 收起为 rail 时，`SidebarGroup` 强制展开、组标题原位淡出并显示分隔线，标题占位保持不变，已展开的条目不会随收起动作上下移动。
- 条目区是滚动容器，页眉与页脚固定在两端。
- 完全隐藏时，侧栏整体退出交互与键盘焦点序列。
- 宽度和文字过渡使用 Hina 动画 token；系统开启减弱动态效果时直接切换。
- 搬入移动端 [Drawer](/components/drawer) 时，水平内边距由抽屉提供；页眉、条目区和页脚保留各自的纵向内边距。

## 无障碍 {#a11y}

- 条目区是 `nav` 地标，默认无障碍名取自界面语言（简体中文为「侧边导航」），`label` 可覆盖。
- rail 形态下条目的文字虽然不可见，但 [NavLink](/components/nav-link) 的 `label` 会作为 `aria-label` 保留。
- 隐藏的字标退出朗读与焦点序列。品牌图标使用图片时提供 `alt`，使用 SVG 时提供合适的无障碍名；若图标包含链接，链接本身也应有名称。
- 收起后被隐藏的组标题同时退出键盘序列，不会出现能聚焦却看不见的控件。

## API {#api}

### Sidebar {#props}

| 属性    | 类型     | 默认值       | 说明               |
| ------- | -------- | ------------ | ------------------ |
| `label` | `string` | 取自界面语言 | 导航地标的无障碍名 |
| `class` | `string` | —            | 追加到根元素的类   |

| 插槽       | 插槽参数    | 说明                                  |
| ---------- | ----------- | ------------------------------------- |
| `default`  | —           | 侧栏条目                              |
| `header`   | `{ state }` | 完整替换页眉，优先于品牌插槽          |
| `icon`     | `{ state }` | 固定方形区域内的品牌图标，rail 时保留 |
| `wordmark` | `{ state }` | 品牌字标，rail 时自动淡出             |
| `footer`   | `{ state }` | 条目区下方的内容                      |

### SidebarGroup {#group}

| 属性          | 类型      | 默认值 | 说明             |
| ------------- | --------- | ------ | ---------------- |
| `label`       | `string`  | 必填   | 组名             |
| `defaultOpen` | `boolean` | `true` | 初始是否展开     |
| `class`       | `string`  | —      | 追加到根元素的类 |

| 插槽      | 说明       |
| --------- | ---------- |
| `default` | 组内的条目 |

### SidebarLabel {#label}

控制自定义文字与附属内容在 rail 形态下的显隐；不在侧栏状态提供方内时始终显示。

| 属性    | 类型     | 默认值   | 说明             |
| ------- | -------- | -------- | ---------------- |
| `as`    | `string` | `'span'` | 渲染的元素       |
| `class` | `string` | —        | 追加到根元素的类 |

| 插槽      | 说明                   |
| --------- | ---------------------- |
| `default` | 随侧栏收起而隐藏的内容 |

### SidebarTrigger {#trigger}

切换侧栏形态的按钮，通常放在 [AppShell](/components/app-shell) 的 `header` 插槽里。它没有可配置的行为，脱离 [AppShell](/components/app-shell) 时不渲染。

| 属性    | 类型     | 默认值 | 说明             |
| ------- | -------- | ------ | ---------------- |
| `class` | `string` | —      | 追加到根元素的类 |
