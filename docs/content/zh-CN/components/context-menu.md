---
title: ContextMenu
description: 右键或者长按某个区域时在指针处展开的菜单。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/context-menu/ContextMenu.vue
  - label: ContextMenu
    href: https://reka-ui.com/docs/components/context-menu
---

<Demo name="context-menu/hero" />

## 用法 {#usage}

```ts
import { ContextMenu, ContextMenuItem } from '@hina-ui/vue'
```

默认插槽是响应右键的区域，`content` 插槽是菜单里的条目。在区域内点击右键，或者在触屏上长按，菜单在指针的位置展开，选中条目后自动收起。条目、多选项、单选项、分组、标题、分隔线与子菜单都与 [DropdownMenu](/components/dropdown-menu) 同一套，只是名字换成 `ContextMenu` 开头。

<Demo name="context-menu/basic" />

## 示例 {#examples}

### 条目 {#items}

条目的 `icon` 插槽用于前置图标，`trailing` 插槽用于尾部内容，删除这类不可撤销的操作设置 `tone="danger"`；`ContextMenuLabel` 是不可选中的标题，`ContextMenuSeparator` 画一条分隔线。

<Demo name="context-menu/items" />

### 多选项 {#checkbox}

`ContextMenuCheckboxItem` 用于可以同时选中多项的开关，`checked` 支持双向绑定，切换后菜单保持展开。

<Demo name="context-menu/checkbox" />

### 单选项 {#radio}

一组互斥的选项用 `ContextMenuRadioGroup` 包裹，当前项自动带选中标记。

<Demo name="context-menu/radio" />

### 子菜单 {#submenu}

`ContextMenuSub` 的 `label` 是子菜单的入口，默认插槽是子菜单里的条目；指针悬停或者按右方向键展开。

<Demo name="context-menu/submenu" />

### 不可用 {#disabled}

`disabled` 让整块区域不再响应右键，浏览器自己的菜单照常出现；条目上的 `disabled` 只让那一条不可选。

<Demo name="context-menu/disabled" />

## 行为 {#behavior}

- 菜单在指针的位置展开，靠近视口边缘时向内翻转。
- 菜单打开期间页面停止滚动；点击菜单外部、按 Esc 或者选中条目都会收起。
- 方向键在条目间移动，回车或者空格选中，输入字母跳到匹配的条目。
- 触屏上长按区域打开菜单。

## 无障碍 {#a11y}

- 菜单是 `role="menu"`，用 `label` 给它一个名称；条目分别是 `menuitem`、`menuitemcheckbox` 与 `menuitemradio`。
- 右键菜单里的操作应当在页面上另有可达的入口，键盘与辅助技术的用户未必能触发它。

## API {#api}

### ContextMenu {#props}

| 属性       | 类型      | 默认值  | 说明                   |
| ---------- | --------- | ------- | ---------------------- |
| `label`    | `string`  | —       | 菜单的无障碍名称       |
| `disabled` | `boolean` | `false` | 区域是否不再响应右键   |
| `open`     | `boolean` | —       | 是否打开，支持双向绑定 |
| `class`    | `string`  | —       | 追加至菜单面板的类名   |

| 插槽      | 说明           |
| --------- | -------------- |
| default   | 响应右键的区域 |
| `content` | 菜单里的条目   |

### 条目与其他子件 {#parts}

`ContextMenuItem`、`ContextMenuCheckboxItem`、`ContextMenuRadioGroup`、`ContextMenuRadioItem`、`ContextMenuGroup`、`ContextMenuLabel`、`ContextMenuSeparator` 与 `ContextMenuSub` 的属性、插槽与事件与 DropdownMenu 的同名子件完全一致，见 [DropdownMenu](/components/dropdown-menu#item)。
