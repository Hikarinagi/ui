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

::: vue

`items` 是条目列表。每个条目至少有 `id` 与 `label`，可以带 `description`、`keywords`、`icon`、`kbd` 与 `onSelect`；带有 `label` 与 `items` 的对象是一个分组。默认插槽是触发器。选中条目时先调用该条目的 `onSelect`，再触发 `select` 事件，然后关闭面板。

:::

::: react

`items` 是条目列表。每个条目至少有 `id` 与 `label`，可以带 `description`、`keywords`、`icon`、`kbd` 与 `onSelect`；带有 `label` 与 `items` 的对象是一个分组。`children` 是触发器。选中条目时先调用该条目的 `onSelect`，再调用组件的 `onSelect`，然后关闭面板。

:::

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

### 内联 {#inline}

设置 `inline` 后面板不再包进浮层，直接渲染在文档流里，适合嵌在页面中而不是由快捷键唤起。内联形态不注册全局快捷键，选中条目之后面板停在原地。

<Demo name="command-palette/inline" />

### 搜索建议 {#suggestions}

`closeOnSelect` 默认为 `true`，选中条目后关闭面板；设为 `false` 后选中条目不关闭面板。条目自身的 `closeOnSelect` 优先于组件属性，内联面板始终不关闭。面板保持打开时搜索内容保留，焦点回到输入框。

::: vue

示例在搜索词为空时列出最近搜索与热门搜索。这些条目设置 `closeOnSelect: false`，并在 `onSelect` 中把自身的文字写入 `v-model:search` 绑定的搜索词；也可以在 `select` 事件中写入。有搜索词后列出的结果选中时关闭面板。

:::

::: react

示例在搜索词为空时列出最近搜索与热门搜索。这些条目设置 `closeOnSelect: false`，并在条目的 `onSelect` 中把自身的文字写入 `search` / `onSearchChange` 对应的状态；也可以在组件的 `onSelect` 中写入。有搜索词后列出的结果选中时关闭面板。

:::

<Demo name="command-palette/suggestions" />

### 服务端搜索 {#remote}

`loading` 表示正在等待结果。没有条目时列表区显示加载内容；已有条目时列表下方出现一行状态，条目仍可选中。

::: vue

`#loading` 插槽替换加载内容。`#empty` 插槽替换没有条目且不在加载时的内容，参数是 `{ search }`，`search` 是当前搜索词。两者的默认文字取自界面语言。无结果的提示与搜索服务不可用的提示都放在 `#empty` 中，显示哪一个由调用方的状态决定。

:::

::: react

`loadingContent` 替换加载内容。`renderEmpty` 替换没有条目且不在加载时的内容，参数是 `{ search }`，`search` 是当前搜索词。两者的默认文字取自界面语言。无结果的提示与搜索服务不可用的提示都由 `renderEmpty` 返回，显示哪一个由调用方的状态决定。

:::

示例设置 `ignoreFilter`，用定时器模拟服务端搜索，[Switch](/components/switch) 模拟搜索服务不可用。

<Demo name="command-palette/remote" />

### 自定义条目内容 {#custom-item}

::: vue

`#item` 插槽替换每个条目行内的内容，默认的图标、标签、说明与按键提示不再渲染。行本身仍是列表选项，高亮、键盘导航、`disabled` 与选中不变，设置 `virtualize` 时同样生效。

插槽参数是 `{ item, match }`。`match` 是搜索词在 `item.label` 中命中的范围 `{ start, end }`；搜索词为空、条目只经 `keywords` 或 `description` 命中、或者设置了 `ignoreFilter` 时为 `null`。

条目的 `data` 携带业务数据。组件从 `items` 推断它的类型，`#item` 插槽与 `select` 事件收到的 `item.data` 保留该类型；可用 `CommandItems<Book>` 声明条目列表。示例把作者写进 `keywords`，按作者搜索时 `match` 为 `null`，书名不标出。

:::

::: react

`renderItem` 替换每个条目行内的内容，默认的图标、标签、说明与按键提示不再渲染。行本身仍是列表选项，高亮、键盘导航、`disabled` 与选中不变，设置 `virtualize` 时同样生效。

渲染函数的参数是 `{ item, match }`。`match` 是搜索词在 `item.label` 中命中的范围 `{ start, end }`；搜索词为空、条目只经 `keywords` 或 `description` 命中、或者设置了 `ignoreFilter` 时为 `null`。

条目的 `data` 携带业务数据。组件从 `items` 推断它的类型，`renderItem` 与 `onSelect` 收到的 `item.data` 保留该类型；可用 `CommandItems<Book>` 声明条目列表。示例把作者写进 `keywords`，按作者搜索时 `match` 为 `null`，书名不标出。

:::

<Demo name="command-palette/custom-item" />

### 自定义输入行 {#custom-input}

::: vue

`#input` 插槽替换整个输入行，包括搜索图标与输入框；默认输入行的高度、内边距与分隔线一并移除。插槽内放且只放一个 `CommandPaletteInput`，它保留过滤、键盘导航、自动聚焦与 `aria-label`，并沿用面板的 `placeholder`。

:::

::: react

`input` 替换整个输入行，包括搜索图标与输入框；默认输入行的高度、内边距与分隔线一并移除。传入的内容中放且只放一个 `CommandPaletteInput`，它保留过滤、键盘导航、自动聚焦与 `aria-label`，并沿用面板的 `placeholder`。

:::

<Demo name="command-palette/custom-input" />

### 虚拟滚动 {#virtual}

`virtualize` 按需渲染可见范围附近的条目，与 [VirtualList](/components/virtual-list) 共用测量与滚动底层。默认关闭；可传 `{ estimateSize, overscan }` 调整预估行高和两侧预渲染数量，行高会按实际内容测量。键盘导航覆盖完整数据，禁用项会跳过。 搜索仍处理完整数据。 命令离开渲染范围后会卸载，持久状态应按命令 id 保存在外部。

<Demo name="command-palette/virtual" />

## 行为 {#behavior}

- 打开后焦点落在输入框，首个条目自动高亮；输入时列表即时过滤，标签中匹配的片段以强调色标出。
- 匹配按标签全等、标签开头、标签包含、关键词、说明的顺序排列；有查询时，含最佳匹配的分组排在前面。超出可见高度的条目在列表内滚动。
- 方向键移动高亮，回车选中高亮项，鼠标悬停也会移动高亮。
- 按 Esc 或点击遮罩关闭面板。选中条目默认也关闭面板；`closeOnSelect` 为 `false` 时面板保持打开，搜索内容保留，焦点回到输入框。关闭时清空搜索内容。
- `loading` 时没有条目则列表区显示加载内容，有条目则列表下方显示一行状态，条目仍可选中。
- 面板打开期间页面停止滚动，焦点限制在面板内，关闭后回到触发器。
- 宽屏上面板停靠在视口上部，窄屏上贴顶并占满宽度。

## 无障碍 {#a11y}

- 面板是对话框，无障碍名取 `label`，默认为界面语言中的“命令面板”。
- 输入框通过 `aria-activedescendant` 指向当前高亮的条目；列表使用 `listbox` 与 `option` 角色，分组带有各自的名称。
- 图标对辅助技术隐藏，按键提示以 `kbd` 元素呈现。
- 加载内容与空内容的容器带有 `role="status"`；`loading` 时列表带有 `aria-busy`。

## API {#api}

### Props {#props}

`T` 是条目 `data` 的类型，从 `items` 推断，默认是 `unknown`。

| 属性            | 类型                | 默认值       | 说明                                            |
| --------------- | ------------------- | ------------ | ----------------------------------------------- |
| `items`         | `CommandItems<T>`   | —            | 必填。条目与分组                                |
| `virtualize`    | `VirtualizeOptions` | `false`      | 虚拟滚动；预估行高按内容，overscan 6            |
| `placeholder`   | `string`            | 取自界面语言 | 输入框的占位文字                                |
| `label`         | `string`            | 取自界面语言 | 面板的无障碍名                                  |
| `hotkey`        | `string`            | —            | 全局快捷键，例如 `mod+k`                        |
| `ignoreFilter`  | `boolean`           | `false`      | 不自行过滤，条目列表由调用方决定                |
| `loading`       | `boolean`           | `false`      | 显示加载内容，列表带有 `aria-busy`              |
| `closeOnSelect` | `boolean`           | `true`       | 选中条目后关闭面板；条目的 `closeOnSelect` 优先 |
| `inline`        | `boolean`           | `false`      | 渲染为内联面板，不使用浮层                      |
| `class`         | `string`            | —            | 追加至面板的类名                                |

### 双向绑定 {#models}

| 名称     | 类型      | 说明             |
| -------- | --------- | ---------------- |
| `open`   | `boolean` | 面板是否打开     |
| `search` | `string`  | 输入框中的搜索词 |

### 事件 {#events}

| 事件     | 参数                     | 说明           |
| -------- | ------------------------ | -------------- |
| `select` | `(item: CommandItem<T>)` | 选中条目时触发 |

### 插槽 {#slots}

| 插槽      | 参数                                                        | 说明                                                 |
| --------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| default   | —                                                           | 触发器                                               |
| `item`    | `{ item: CommandItem<T>, match: CommandItemMatch \| null }` | 条目行内的内容，替换默认的图标、标签、说明与按键提示 |
| `input`   | —                                                           | 输入行，替换搜索图标与输入框                         |
| `loading` | —                                                           | 加载内容，默认文字取自界面语言                       |
| `empty`   | `{ search: string }`                                        | 没有条目且不在加载时的内容，默认文字取自界面语言     |

### CommandPaletteInput {#command-palette-input}

替换输入行时使用的输入框。只能在 CommandPalette 内使用，在外部使用时抛出错误。

| 属性          | 类型     | 默认值               | 说明                                 |
| ------------- | -------- | -------------------- | ------------------------------------ |
| `placeholder` | `string` | 面板的 `placeholder` | 占位文字，优先于面板的 `placeholder` |
| `class`       | `string` | —                    | 追加至输入框的类名                   |

其他属性透传到原生 `input`。

### 类型 {#types}

| 字段            | 类型         | 说明                                             |
| --------------- | ------------ | ------------------------------------------------ |
| `id`            | `string`     | 必填。条目的唯一标识                             |
| `label`         | `string`     | 必填。标签                                       |
| `description`   | `string`     | 标签下方的说明，也参与匹配                       |
| `keywords`      | `string[]`   | 参与匹配但不显示的关键词                         |
| `icon`          | `Component`  | 标签前的图标                                     |
| `kbd`           | `string[]`   | 行末的按键提示                                   |
| `disabled`      | `boolean`    | 不可选中                                         |
| `closeOnSelect` | `boolean`    | 选中后是否关闭面板，优先于组件的 `closeOnSelect` |
| `data`          | `T`          | 随条目携带的数据，不参与匹配                     |
| `onSelect`      | `() => void` | 选中时调用                                       |

分组是 `{ label: string; items: CommandItem<T>[] }`，`CommandItems<T>` 是条目与分组的数组。

::: vue

同时导出 `CommandItem<T>`、`CommandGroup<T>`、`CommandItems<T>`、`CommandItemMatch`、`CommandItemSlotProps<T>` 和 `CommandEmptySlotProps` 类型。

:::

::: react

同时导出 `CommandItem<T>`、`CommandGroup<T>`、`CommandItems<T>`、`CommandItemMatch`、`CommandItemRenderProps<T>` 和 `CommandEmptyRenderProps` 类型。

:::

```ts
interface CommandItemMatch {
  start: number
  end: number
}
```

```ts
type VirtualizeOptions = boolean | { estimateSize?: number; overscan?: number }
```
