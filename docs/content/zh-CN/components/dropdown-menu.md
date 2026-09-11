---
title: DropdownMenu
description: 点击触发器展开的一组操作。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/dropdown-menu/DropdownMenu.vue
  - label: DropdownMenu
    href: https://reka-ui.com/docs/components/dropdown-menu
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

`DropdownMenuCheckboxItem` 用于可以同时选中多项的开关，`checked` 支持双向绑定。选中后条目末尾出现选中标记，菜单保持展开。

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

### 外部锚点 {#anchor}

`anchor` 接受 `HTMLElement | null`，可省略默认插槽并使用 `v-model:open` 控制开关。锚点未就绪时菜单不显示；打开期间可以更换锚点，关闭时清空锚点会保留退场位置。

同时提供默认插槽与 `anchor` 时，插槽负责触发，`anchor` 负责定位。外部元素的点击与键盘行为、`aria-haspopup="menu"` 和 `aria-expanded` 由调用方设置，菜单内部的键盘导航保持不变。外部定位规则与 [Popover](/components/popover#anchor) 一致。

<Demo name="dropdown-menu/anchor" />

### 模态与焦点 {#modal}

`modal` 默认为 `true`，展开期间锁滚并限制外部交互；设置 `:modal="false"` 后，页面可继续滚动和交互，点击外部仍会关闭菜单。

没有默认触发器时，关闭后恢复打开前的焦点，锚点仅负责定位；调用方已经将焦点移到菜单外时，不会恢复旧焦点。`closeAutoFocus` 可以取消焦点恢复，`interactOutside` 和 `escapeKeyDown` 可以取消对应的关闭行为。调用 `event.preventDefault()` 即可取消。

通过 `label` 或 `aria-label` 为菜单提供名称，`aria-describedby` 和 `data-*` 属性会传给菜单面板。

### 不可用的条目 {#disabled}

设置 `disabled` 的条目不可点击，用键盘在条目间移动时也会跳过它。

<Demo name="dropdown-menu/disabled" />

## 行为 {#behavior}

- 默认模态下，菜单展开期间页面停止滚动。
- 触发器在菜单展开期间保持按下时的样式。
- 方向键在条目间移动，到首尾时循环；输入文字跳到匹配的条目；回车选中当前条目；Esc 收起菜单并把焦点交还给触发器。子菜单用向右方向键展开，向左方向键收起。
- 选中普通条目或单选项后菜单收起，选中多选项后菜单保持展开。
- 默认模态下，点击菜单以外的区域时菜单收起，这次点击不会传到下层的元素上。

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
| `anchor`     | `HTMLElement \| null`                    | —          | 外部定位元素           |
| `modal`      | `boolean`                                | `true`     | 是否限制外部交互并锁滚 |
| `dir`        | `'ltr' \| 'rtl'`                         | 跟随配置   | 菜单方向               |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 展开方向               |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | 与触发器的对齐方式     |
| `sideOffset` | `number`                                 | `8`        | 与触发器的距离         |
| `class`      | `string`                                 | —          | 追加至菜单面板的类名   |

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 可选触发器   |
| `content` | 菜单中的条目 |

| 事件                 | 参数                                           | 说明                                 |
| -------------------- | ---------------------------------------------- | ------------------------------------ |
| `closeAutoFocus`     | `Event`                                        | 关闭时恢复焦点前触发，可取消         |
| `escapeKeyDown`      | `KeyboardEvent`                                | 按 Esc 时触发，可取消关闭            |
| `pointerDownOutside` | `PointerDownOutsideEvent`                      | 外部按下时触发，可取消关闭           |
| `focusOutside`       | `FocusOutsideEvent`                            | 焦点移到外部时触发，可取消关闭       |
| `interactOutside`    | `PointerDownOutsideEvent \| FocusOutsideEvent` | 外部按下或焦点移出时触发，可取消关闭 |

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
