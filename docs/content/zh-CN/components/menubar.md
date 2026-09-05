---
title: Menubar
description: 横向排列的一组菜单，像桌面应用的菜单栏。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/menubar/Menubar.vue
  - label: Menubar
    href: https://reka-ui.com/docs/components/menubar
---

<Demo name="menubar/hero" />

## 用法 {#usage}

```ts
import { Menubar, MenubarMenu, MenubarItem } from '@hina-ui/vue'
```

`Menubar` 是一条横向的栏，里面放若干个 `MenubarMenu`，每个菜单的 `label` 是栏上的触发器文字，默认插槽是菜单里的条目。点击触发器展开菜单，展开期间把指针移到另一个触发器上就切换过去；条目、多选项、单选项、分组、标题、分隔线与子菜单都与 [DropdownMenu](/components/dropdown-menu) 同一套，只是名字换成 `Menubar` 开头。

<Demo name="menubar/basic" />

## 示例 {#examples}

### 条目 {#items}

条目的 `icon` 插槽用于前置图标，`trailing` 插槽放快捷键这类尾部内容，删除这类不可撤销的操作设置 `tone="danger"`；`MenubarLabel` 是不可选中的标题，`MenubarSeparator` 画一条分隔线。

<Demo name="menubar/items" />

### 多选项与单选项 {#choices}

`MenubarCheckboxItem` 是可以同时选中多项的开关，切换后菜单保持展开；一组互斥的选项用 `MenubarRadioGroup` 包裹。

<Demo name="menubar/choices" />

### 子菜单 {#submenu}

`MenubarSub` 的 `label` 是子菜单的入口，默认插槽是子菜单里的条目。

<Demo name="menubar/submenu" />

### 受控 {#controlled}

`v-model` 绑定当前展开的菜单的 `value`，没有展开时是空字符串；可以从外部展开某个菜单。

<Demo name="menubar/controlled" />

### 不可用的菜单 {#disabled}

`MenubarMenu` 的 `disabled` 让触发器不可用，条目上的 `disabled` 只让那一条不可选。

<Demo name="menubar/disabled" />

## 行为 {#behavior}

- 点击触发器展开菜单，再次点击收起；展开期间指针移到另一个触发器即切换到那个菜单。
- 左右方向键在触发器之间移动，展开期间左右键切换菜单，上下键在条目间移动，回车或者空格选中，Esc 收起并把焦点还给触发器。
- 菜单打开期间页面照常可以滚动与交互，指针才能在触发器之间移动；选中条目或者点击外部都会收起。

## 无障碍 {#a11y}

- 根是 `role="menubar"`，用 `label` 给它一个名称；触发器是带 `aria-haspopup` 的 `menuitem`，展开的面板是 `role="menu"`。
- 触发器构成一组漫游焦点，Tab 只进出一次，方向键在其中移动。

## API {#api}

### Menubar {#props}

| 属性         | 类型      | 默认值 | 说明                                   |
| ------------ | --------- | ------ | -------------------------------------- |
| `label`      | `string`  | —      | 菜单栏的无障碍名称                     |
| `loop`       | `boolean` | `true` | 方向键到达两端时是否绕回               |
| `modelValue` | `string`  | —      | 当前展开的菜单的 `value`，支持双向绑定 |
| `class`      | `string`  | —      | 追加至根元素的类名                     |

### MenubarMenu {#menu}

| 属性       | 类型      | 默认值  | 说明                          |
| ---------- | --------- | ------- | ----------------------------- |
| `label`    | `string`  | —       | 触发器文字                    |
| `value`    | `string`  | 自动    | 标识这个菜单，供 `v-model` 用 |
| `disabled` | `boolean` | `false` | 触发器是否不可用              |
| `class`    | `string`  | —       | 追加至菜单面板的类名          |

| 插槽    | 说明         |
| ------- | ------------ |
| default | 菜单里的条目 |
| `label` | 触发器内容   |

### 条目与其他子件 {#parts}

`MenubarItem`、`MenubarCheckboxItem`、`MenubarRadioGroup`、`MenubarRadioItem`、`MenubarGroup`、`MenubarLabel`、`MenubarSeparator` 与 `MenubarSub` 的属性、插槽与事件与 DropdownMenu 的同名子件完全一致，见 [DropdownMenu](/components/dropdown-menu#item)。
