---
title: AppShell
description: 应用的外层框架，安置侧栏、页眉与主区域。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/app-shell/AppShell.vue
---

<Demo name="app-shell/hero" />

## 用法 {#usage}

```ts
import { AppShell } from '@hina-ui/vue'
```

`AppShell` 占满视口，把界面分成三块：`sidebar` 插槽是左侧栏，`header` 插槽是顶部条，默认插槽是主区域。三块都是可选的。

它同时是侧栏状态的提供方。`Sidebar`、`SidebarGroup`、`SidebarTrigger` 以及侧栏内的 `NavLink` 都从这里取状态，脱离 `AppShell` 时它们退回展开形态，`SidebarTrigger` 不会渲染。

<Demo name="app-shell/basic" />

组件默认高度为一屏。嵌在页面中的局部框架可以用 `class` 覆盖高度，本页示例用的就是这个办法。

## 示例 {#examples}

### 收起方式 {#collapsible}

`collapsible` 决定桌面端收起后的形态：`rail` 只留图标一条，`hidden` 让整条侧栏退场。默认为 `rail`。

侧栏状态可以用 `v-model:sidebar` 双向绑定，取值为 `expanded`、`rail`、`hidden`。需要在别处读出或写入当前形态时绑定它，否则交给组件自己维护即可。

<Demo name="app-shell/collapsible" />

### 主区域滚动 {#scroll}

主区域自带滚动容器，内容再长也只在其内部滚动，页眉与侧栏保持不动。

<Demo name="app-shell/scroll" />

## 行为 {#behavior}

- 视口宽度达到 1024 像素时为桌面布局，侧栏常驻左侧；低于此宽度时侧栏改由抽屉承载，`sidebar` 插槽的内容原样搬进抽屉。
- 桌面端点击 `SidebarTrigger` 在展开与 `collapsible` 指定的形态之间切换；窄屏则打开抽屉。
- 抽屉的开合状态可用 `v-model:mobileOpen` 绑定。
- `autoClose` 为真时路由变化会关闭抽屉，避免跳转后抽屉仍挡在内容前面。默认开启。
- `restoreKey` 写在主区域的滚动容器上，供滚动位置恢复使用。
- 组件内置浮层提供方，侧栏在 rail 形态下的悬停提示不需要另行包裹。

## 无障碍 {#a11y}

- 页眉渲染为 `header`，主区域渲染为 `main`，侧栏的导航地标由 `Sidebar` 自行提供。
- `SidebarTrigger` 带有随界面语言给出的无障碍名（简体中文为「切换侧栏」）。
- 抽屉形态下焦点被限制在抽屉内，关闭后归还给触发按钮，这由 `Drawer` 保证。

## API {#api}

### Props {#props}

| 属性          | 类型                 | 默认值   | 说明                             |
| ------------- | -------------------- | -------- | -------------------------------- |
| `collapsible` | `'rail' \| 'hidden'` | `'rail'` | 桌面端收起后的形态               |
| `autoClose`   | `boolean`            | `true`   | 路由变化时是否关闭移动端抽屉     |
| `restoreKey`  | `string`             | —        | 主区域滚动容器的滚动位置恢复标识 |
| `class`       | `string`             | —        | 追加到根元素的类                 |

### 双向绑定 {#models}

| 名称         | 类型           | 默认值       | 说明               |
| ------------ | -------------- | ------------ | ------------------ |
| `sidebar`    | `SidebarState` | `'expanded'` | 桌面端侧栏形态     |
| `mobileOpen` | `boolean`      | `false`      | 移动端抽屉是否打开 |

### Slots {#slots}

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `sidebar` | 侧栏内容，窄屏时搬入抽屉 |
| `header`  | 顶部条内容               |
| `default` | 主区域内容               |

### Expose {#expose}

| 名称           | 类型                       | 说明                     |
| -------------- | -------------------------- | ------------------------ |
| `mainViewport` | `HTMLElement \| undefined` | 主区域滚动容器的视口元素 |
| `mainArea`     | `ScrollArea \| undefined`  | 主区域的滚动容器组件     |
