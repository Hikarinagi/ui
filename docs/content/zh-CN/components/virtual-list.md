---
title: VirtualList
description: 只渲染可见范围附近的条目，支持动态尺寸与程序化滚动。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/virtual-list/VirtualList.vue
---

<Demo name="virtual-list/hero" />

## 用法 {#usage}

```ts
import { VirtualList, type VirtualListExpose } from '@hina-ui/vue'
```

`items` 提供数据，`getKey` 返回每项唯一、稳定的字符串或数字标识，默认插槽接收 `{ item, index }`，保留 `item` 的完整类型。更新或重排数据时不要用数组位置作为 key。

组件内置 [ScrollArea](/components/scroll-area)，默认高度为 `320px`。`height` 可传像素数或 CSS 长度；设为 `100%` 时父容器需要有确定高度。外观和条目内容由调用方定义，组件本身不增加边框、选中态或点击行为。首个示例包含一万项，并在尾部组合了 [Tag](/components/tag)。

示例使用 [Text](/components/text) 设置文字样式，通过 [Stack](/components/stack) 与 [Inline](/components/inline) 排列内容。

## 示例 {#examples}

### 固定尺寸 {#fixed}

设置 `:dynamic="false"` 后，`estimateSize` 是条目的实际高度，不再测量 DOM。它也可以是 `(item, index) => number`，用于已知的不同尺寸。尺寸包含条目自身的 padding 和 border，不包含 `gap`；内容需要放得进声明的尺寸。

<Demo name="virtual-list/fixed" />

### 动态尺寸 {#dynamic}

默认 `dynamic` 开启，条目随内容自然撑开。`estimateSize` 是尚未测量条目的预估高度，尽量取接近真实内容的值。内容展开、图片加载或容器变窄后，会重新计算实际高度和后续条目的位置。滚动条总长度也会随测量修正。

间隔使用 `gap`，首尾留白使用 `paddingStart` 和 `paddingEnd`，单位均为像素。避免用条目外部 margin 表示这些间隔，因为 margin 不计入条目测量。示例用 [Collapsible](/components/collapsible) 展开附加内容，列表跟随开合动画更新高度。开合状态按条目 key 保存在外部，滚出可见范围再返回时仍然保留。

<Demo name="virtual-list/dynamic" />

### 滚动与可见范围 {#scroll}

通过组件引用调用 `scrollToIndex(index, { align, behavior })` 或 `scrollToOffset(offset, { behavior })`。索引从 `0` 开始，`align` 支持 `start`、`center`、`end` 和 `auto`；默认 `auto` 只在目标超出视口时滚动。越界索引会限制到首尾项。

`behavior="smooth"` 开启平滑滚动，系统要求减弱动态效果时使用即时滚动。动态尺寸的远距离跳转会随着目标附近的实际测量继续校正；已知尺寸时使用固定模式可获得精确位置。

`rangeChange` 返回实际可见的首尾索引，不包含预渲染和保留焦点的额外条目。可据此按需追加数据；请求状态和是否还有数据由调用方控制。示例使用 [NumberInput](/components/number-input) 指定目标。

<Demo name="virtual-list/scroll" />

### 横向与 RTL {#horizontal}

`orientation="horizontal"` 时，`estimateSize` 表示宽度，`height` 控制容器高度。动态模式下在插槽内给内容定义自然宽度；固定模式直接使用声明宽度。`dir` 可显式设置，也会继承方向。RTL 下条目从右向左排列，滚动方法仍使用正数逻辑偏移。

<Demo name="virtual-list/horizontal" />

### 加载与空态 {#states}

`loading` 使用 [LoadingOverlay](/components/loading-overlay) 在列表中央显示加载提示，保留已有条目和滚动位置，不改变滚动视口的尺寸。没有条目时也居中显示，加载时不显示空态。`#loading` 替换加载层的内容，`#empty` 替换空态，空态也可以用 `emptyText` 修改默认文案。

示例组合 [Switch](/components/switch) 和 [Empty](/components/empty)。组件不请求数据，也不清空已有数据。

<Demo name="virtual-list/states" />

## SSR 与测量 {#ssr}

服务端根据 `estimateSize`、`initialRect` 和 `initialOffset` 渲染首批条目，并预留整个列表的滚动长度。默认初始视口为 `320px` 宽和 `height` 指定的数值高度；`height` 为 CSS 字符串时，预估高度为 `320px`。需要更准确的首屏范围时显式传入 `initialRect`，服务端和客户端保持一致。

`viewport` 在 [ScrollArea](/components/scroll-area) 完成初始化后才可用。在此之前调用滚动方法会暂存最后一次请求，初始化完成后执行。`initialOffset` 仅用于初始位置；后续移动使用滚动方法。

动态测量会缓存稳定 key 对应的尺寸。如果批量修改了尚未渲染条目的内容，可调用 `measure()` 清空尺寸缓存并重新测量当前条目。

## 无障碍 {#a11y}

- 滚动区域可聚焦，通过 `label` 命名，保留浏览器原生键盘滚动。
- 内容使用 `list` / `listitem` 语义，`aria-posinset` 和 `aria-setsize` 标注条目在完整列表中的位置；不增加选择或菜单语义。
- 滚动时包含输入焦点的条目会保持挂载，直到焦点移出；该项被数据删除时仍会卸载。
- 虚拟化条目离开范围后会卸载。需要保留的输入值或展开状态应按 key 存在组件外部。
- 页面搜索和辅助技术只能访问当前挂载的内容。如果必须一次访问全部条目，使用普通 [List](/components/list) 或分页呈现。

## API {#api}

### Props {#props}

| 属性            | 类型                                                          | 默认值       | 说明                             |
| --------------- | ------------------------------------------------------------- | ------------ | -------------------------------- |
| `items`         | `readonly T[]`                                                | 必填         | 完整数据数组                     |
| `getKey`        | `(item: T, index: number) => string \| number`                | 必填         | 唯一、稳定的标识                 |
| `estimateSize`  | `number \| ((item: T, index: number) => number)`              | `48`         | 正数像素尺寸；动态模式下为预估值 |
| `dynamic`       | `boolean`                                                     | `true`       | 自动测量条目尺寸                 |
| `height`        | `number \| string`                                            | `320`        | 像素数或 CSS 高度                |
| `orientation`   | `'vertical' \| 'horizontal'`                                  | `'vertical'` | 虚拟滚动方向                     |
| `dir`           | `'ltr' \| 'rtl'`                                              | 继承         | 内容方向                         |
| `overscan`      | `number`                                                      | `5`          | 在可见范围两侧各预渲染的条目数   |
| `gap`           | `number`                                                      | `0`          | 条目间距，像素                   |
| `paddingStart`  | `number`                                                      | `0`          | 滚动轴起始留白，像素             |
| `paddingEnd`    | `number`                                                      | `0`          | 滚动轴末尾留白，像素             |
| `initialRect`   | `{ width: number; height: number }`                           | 见上文       | SSR 初始视口尺寸                 |
| `initialOffset` | `number`                                                      | `0`          | 初始逻辑滚动偏移，像素           |
| `loading`       | `boolean`                                                     | `false`      | 加载提示及 `aria-busy`           |
| `emptyText`     | `string`                                                      | locale       | 默认空态文字                     |
| `label`         | `string`                                                      | locale       | 滚动区域的无障碍名称             |
| `shadow`        | `boolean`                                                     | `true`       | ScrollArea 边缘阴影              |
| `class`         | `string`                                                      | —            | 根元素类                         |
| `itemClass`     | `string \| ((item: T, index: number) => string \| undefined)` | —            | 条目容器类                       |

其他原生属性透传到根元素。用 `itemClass` 调整条目外观，不要覆盖其定位属性；动态模式的纵向 padding 会正常计入测量。

### Slots {#slots}

| 插槽      | 参数                         | 说明                   |
| --------- | ---------------------------- | ---------------------- |
| `default` | `{ item: T, index: number }` | 条目内容               |
| `empty`   | —                            | 无条目且未加载时的内容 |
| `loading` | —                            | 加载中的内容           |

### Events {#events}

| 事件          | 参数                                       | 说明                                          |
| ------------- | ------------------------------------------ | --------------------------------------------- |
| `rangeChange` | `{ startIndex: number; endIndex: number }` | 初始及可见范围变化时触发；无可见项时均为 `-1` |

### Expose {#expose}

| 名称             | 类型                                                            | 说明               |
| ---------------- | --------------------------------------------------------------- | ------------------ |
| `viewport`       | `HTMLElement \| undefined`                                      | 实际滚动元素       |
| `scrollToIndex`  | `(index, options?: VirtualListScrollOptions) => void`           | 滚动到指定索引     |
| `scrollToOffset` | `(offset, options?: { behavior?: 'auto' \| 'smooth' }) => void` | 滚动到逻辑偏移     |
| `measure`        | `() => void`                                                    | 重置缓存并重新测量 |

同时导出 `VirtualListProps<T>`、`VirtualListSlotProps<T>`、`VirtualListKey`、`VirtualListRange`、`VirtualListScrollOptions` 和 `VirtualListExpose` 类型。

## 组件集成 {#integration}

[Select](/components/select#virtual), [MultiSelect](/components/multi-select#virtual), [Combobox](/components/combobox#virtual), [MultiCombobox](/components/multi-combobox#virtual), [Listbox](/components/listbox#virtual), [CommandPalette](/components/command-palette#virtual), [Tree](/components/tree#virtual), [TreeSelect](/components/tree-select#virtual), [DataTable](/components/data-table#virtual) 已提供可选的 `virtualize`，共用虚拟滚动底层，同时保留各自的选择、搜索和键盘行为。无需在这些组件外再嵌套 VirtualList。
