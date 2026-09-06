---
title: CommandPalette
description: 以快捷键唤起的搜索面板，输入后从命令与页面中选择。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/command-palette/CommandPalette.vue
  - label: Listbox
    href: https://reka-ui.com/docs/components/listbox
---

<Demo name="command-palette/hero" />

## 用法 {#usage}

```ts
import { CommandPalette } from '@hina-ui/vue'
```

`items` 是条目列表。每个条目至少有 `id` 与 `label`，可以带 `description`、`keywords`、`icon`、`kbd` 与 `onSelect`；带有 `label` 与 `items` 的对象是一个分组。默认插槽是触发器。选中条目时先调用该条目的 `onSelect`，再触发 `select` 事件，然后关闭面板。

<Demo name="command-palette/basic" />

## 示例 {#examples}

### 分组与说明 {#groups}

分组各有标题，条目的 `description` 显示在标签下方。没有查询时分组按给定顺序排列，有查询时含最佳匹配的分组靠前，没有匹配条目的分组不显示。

<Demo name="command-palette/groups" />

### 图标与按键提示 {#hints}

`icon` 显示在标签前，`kbd` 是显示在行末的按键提示，只用于提示，面板不会替你绑定这些按键。

<Demo name="command-palette/hints" />

### 全局快捷键 {#hotkey}

`hotkey` 接受 `mod+k` 这样的组合，`mod` 对应 Mac 的 ⌘ 与其他平台的 Ctrl，还可以加上 `shift` 与 `alt`。面板打开时再按一次会关闭。

<Demo name="command-palette/hotkey" />

### 受控 {#controlled}

`open` 支持双向绑定。省略默认插槽时不渲染触发器，面板只能从外部打开。

<Demo name="command-palette/controlled" />

### 自定义过滤 {#filter}

`search` 支持双向绑定。设置 `ignoreFilter` 后面板不再自行过滤，条目列表完全由调用方决定，例如向服务端搜索。

<Demo name="command-palette/filter" />

## 行为 {#behavior}

- 打开后焦点落在输入框，首个条目自动高亮；输入时列表即时过滤，标签中匹配的片段以强调色标出。
- 匹配按标签全等、标签开头、标签包含、关键词、说明的顺序排列；有查询时，含最佳匹配的分组排在前面。超出可见高度的条目在列表内滚动。
- 方向键移动高亮，回车选中高亮项，鼠标悬停也会移动高亮。
- 按 Esc、点击遮罩或选中条目都会关闭面板，关闭时清空搜索内容。
- 面板打开期间页面停止滚动，焦点限制在面板内，关闭后回到触发器。
- 宽屏上面板停靠在视口上部，窄屏上贴顶并占满宽度。

## 无障碍 {#a11y}

- 面板是对话框，无障碍名取 `label`，默认为界面语言中的“命令面板”。
- 输入框通过 `aria-activedescendant` 指向当前高亮的条目；列表使用 `listbox` 与 `option` 角色，分组带有各自的名称。
- 图标对辅助技术隐藏，按键提示以 `kbd` 元素呈现。

## API {#api}

### Props {#props}

| 属性           | 类型           | 默认值       | 说明                             |
| -------------- | -------------- | ------------ | -------------------------------- |
| `items`        | `CommandItems` | —            | 必填。条目与分组                 |
| `placeholder`  | `string`       | 取自界面语言 | 输入框的占位文字                 |
| `label`        | `string`       | 取自界面语言 | 面板的无障碍名                   |
| `hotkey`       | `string`       | —            | 全局快捷键，例如 `mod+k`         |
| `ignoreFilter` | `boolean`      | `false`      | 不自行过滤，条目列表由调用方决定 |
| `class`        | `string`       | —            | 追加至面板的类名                 |

### 双向绑定 {#models}

| 名称     | 类型      | 说明             |
| -------- | --------- | ---------------- |
| `open`   | `boolean` | 面板是否打开     |
| `search` | `string`  | 输入框中的搜索词 |

### 事件 {#events}

| 事件     | 参数                  | 说明           |
| -------- | --------------------- | -------------- |
| `select` | `(item: CommandItem)` | 选中条目时触发 |

### 插槽 {#slots}

| 插槽    | 说明   |
| ------- | ------ |
| default | 触发器 |

### 类型 {#types}

| 字段          | 类型         | 说明                       |
| ------------- | ------------ | -------------------------- |
| `id`          | `string`     | 必填。条目的唯一标识       |
| `label`       | `string`     | 必填。标签                 |
| `description` | `string`     | 标签下方的说明，也参与匹配 |
| `keywords`    | `string[]`   | 参与匹配但不显示的关键词   |
| `icon`        | `Component`  | 标签前的图标               |
| `kbd`         | `string[]`   | 行末的按键提示             |
| `disabled`    | `boolean`    | 不可选中                   |
| `onSelect`    | `() => void` | 选中时调用                 |

分组是 `{ label: string; items: CommandItem[] }`，`CommandItems` 是条目与分组的数组。
