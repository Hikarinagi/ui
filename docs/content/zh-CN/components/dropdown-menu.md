---
title: DropdownMenu
description: 点击触发器展开的一组操作。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/dropdown-menu/DropdownMenu.vue
  - label: Popover
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/popover/Popover.vue
---

<Demo name="dropdown-menu/hero" />

## 用法 {#usage}

```ts
import { DropdownMenu, DropdownMenuItem } from '@hina-ui/vue'
```

默认插槽是触发器，`content` 插槽是菜单里的条目。点击触发器展开，选中条目后自动收起。

<Demo name="dropdown-menu/basic" />

## 示例 {#examples}

### 条目 {#items}

条目的 `icon` 插槽用于前置图标，`trailing` 插槽用于尾部内容。删除这类不可撤销的操作设置 `tone="danger"`。

<Demo name="dropdown-menu/items" />

### 标题与分隔线 {#label}

`DropdownMenuLabel` 是不可选中的分组标题，`DropdownMenuSeparator` 画一条分隔线。

<Demo name="dropdown-menu/label" />

### 快捷键 {#shortcut}

条目对应的快捷键放在 `trailing` 插槽中，用 `Kbd` 呈现。这里只是标注，按键的注册仍由页面负责。

<Demo name="dropdown-menu/shortcut" />

### 分组 {#group}

`DropdownMenuGroup` 把相关的条目归为一组。组内带 `DropdownMenuLabel` 时，屏幕阅读器把这个标题作为整组的名称播报。

<Demo name="dropdown-menu/group" />

### 多选项 {#checkbox}

`DropdownMenuCheckboxItem` 用于可以同时选中多项的开关，`checked` 支持双向绑定。选中后条目左侧出现选中标记，菜单保持展开。

<Demo name="dropdown-menu/checkbox" />

### 单选项 {#radio}

一组互斥的选项用 `DropdownMenuRadioGroup` 包裹，当前项自动带选中标记。

<Demo name="dropdown-menu/radio" />

### 子菜单 {#submenu}

`DropdownMenuSub` 在条目右侧展开一层子菜单，父条目带有指向右侧的箭头。指针悬停或按向右方向键时展开，按向左方向键收起。

<Demo name="dropdown-menu/submenu" />

### 位置 {#placement}

`side` 指定菜单朝哪个方向展开，`align` 指定它与触发器的对齐方式。默认在正下方。

<Demo name="dropdown-menu/placement" />

### 受控 {#controlled}

`open` 支持双向绑定，可以从外部展开或收起菜单。

<Demo name="dropdown-menu/controlled" />

### 不可用的条目 {#disabled}

设置 `disabled` 的条目不可点击，用键盘在条目间移动时也会跳过它。

<Demo name="dropdown-menu/disabled" />

## 行为 {#behavior}

- 菜单展开期间页面停止滚动。
- 触发器在菜单展开期间保持按下时的样式。
- 方向键在条目间移动，到首尾时循环；输入文字跳到匹配的条目；回车选中当前条目；Esc 收起菜单并把焦点交还给触发器。子菜单用向右方向键展开，向左方向键收起。
- 选中普通条目或单选项后菜单收起，选中多选项后菜单保持展开。
- 点击菜单以外的区域时菜单收起，这次点击不会传到下层的元素上。

## 无障碍 {#a11y}

- 触发器带 `aria-haspopup="menu"`，菜单是 `role="menu"`，条目是 `role="menuitem"`。
- 通过 `label` 为菜单本身提供名称，屏幕阅读器在进入菜单时播报它。
- 单选项渲染为 `menuitemradio`，多选项渲染为 `menuitemcheckbox`，两者都带 `aria-checked`。
- 子菜单的父条目带 `aria-haspopup="menu"` 与 `aria-expanded`。

## API {#api}

### DropdownMenu {#props}

| 属性         | 类型                                     | 默认值     | 说明                   |
| ------------ | ---------------------------------------- | ---------- | ---------------------- |
| `open`       | `boolean`                                | —          | 是否展开，支持双向绑定 |
| `label`      | `string`                                 | —          | 菜单的无障碍名称       |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 展开方向               |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | 与触发器的对齐方式     |
| `sideOffset` | `number`                                 | `8`        | 与触发器的距离         |
| `class`      | `string`                                 | —          | 追加至菜单面板的类名   |

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 触发器       |
| `content` | 菜单中的条目 |

### DropdownMenuItem {#item}

| 属性        | 类型                    | 默认值      | 说明                 |
| ----------- | ----------------------- | ----------- | -------------------- |
| `tone`      | `'neutral' \| 'danger'` | `'neutral'` | 语义色调             |
| `disabled`  | `boolean`               | `false`     | 是否不可用           |
| `textValue` | `string`                | —           | 供输入跳转匹配的文本 |
| `class`     | `string`                | —           | 追加至条目的类名     |

| 事件     | 参数           | 说明             |
| -------- | -------------- | ---------------- |
| `select` | `event: Event` | 选中该条目时触发 |

| 插槽       | 说明     |
| ---------- | -------- |
| `default`  | 条目文字 |
| `icon`     | 前置图标 |
| `trailing` | 尾部内容 |

### DropdownMenuCheckboxItem {#checkbox-item}

| 属性        | 类型      | 默认值  | 说明                   |
| ----------- | --------- | ------- | ---------------------- |
| `checked`   | `boolean` | `false` | 是否选中，支持双向绑定 |
| `disabled`  | `boolean` | `false` | 是否不可用             |
| `textValue` | `string`  | —       | 供输入跳转匹配的文本   |
| `class`     | `string`  | —       | 追加至条目的类名       |

| 插槽       | 说明     |
| ---------- | -------- |
| `default`  | 条目文字 |
| `trailing` | 尾部内容 |

### DropdownMenuGroup {#group-api}

只接受 `class`，默认插槽是同一组的条目。

### DropdownMenuSub {#sub}

| 属性        | 类型      | 默认值  | 说明                         |
| ----------- | --------- | ------- | ---------------------------- |
| `open`      | `boolean` | —       | 子菜单是否展开，支持双向绑定 |
| `label`     | `string`  | —       | 父条目的文字                 |
| `disabled`  | `boolean` | `false` | 是否不可用                   |
| `textValue` | `string`  | —       | 供输入跳转匹配的文本         |
| `class`     | `string`  | —       | 追加至子菜单面板的类名       |

| 插槽      | 说明                       |
| --------- | -------------------------- |
| `default` | 子菜单中的条目             |
| `label`   | 父条目的文字，覆盖 `label` |
| `icon`    | 父条目的前置图标           |

### DropdownMenuRadioGroup {#radio-group}

| 属性         | 类型     | 默认值 | 说明                       |
| ------------ | -------- | ------ | -------------------------- |
| `modelValue` | `string` | —      | 当前选中的值，支持双向绑定 |

### DropdownMenuRadioItem {#radio-item}

| 属性        | 类型      | 默认值  | 说明                 |
| ----------- | --------- | ------- | -------------------- |
| `value`     | `string`  | —       | 必填。该项的值       |
| `disabled`  | `boolean` | `false` | 是否不可用           |
| `textValue` | `string`  | —       | 供输入跳转匹配的文本 |
| `class`     | `string`  | —       | 追加至条目的类名     |

### DropdownMenuLabel 与 DropdownMenuSeparator {#label-separator}

两者都只接受 `class`。`DropdownMenuLabel` 的默认插槽是标题文字，`DropdownMenuSeparator` 没有内容。
