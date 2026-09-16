---
title: Timeline
description: 以相连的节点按顺序呈现事件。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/timeline/Timeline.vue
---

<Demo name="timeline/hero" />

## 用法 {#usage}

```ts
import { Timeline, type TimelineItem } from '@hina-ui/vue'
```

`items` 定义节点顺序，每项可包含 `title`、`description` 和 `time`。连线随内容高度延伸，最后一项没有尾线。条目会更新或重排时，提供稳定的 `id`。

<Demo name="timeline/basic" />

## 示例 {#examples}

### 节点颜色 {#tones}

`tone` 设置默认节点颜色，单项的 `tone` 可覆盖它。颜色不表示隐含的完成或选中状态，状态信息需要同时用文字表达。

<Demo name="timeline/tones" />

### 对齐方式 {#alignment}

`align="start"` 将节点轴放在起始侧，内容排在轴后；`end` 将轴放在结束侧，内容排在轴前；`alternate` 将轴居中，内容交替排在两侧。纵向交替排布时，两侧等宽。

<Demo name="timeline/alignment" />

### 对侧时间 {#opposite}

`time-position="opposite"` 将时间移到轴的另一侧，纵向两侧等宽。`#opposite` 可替换对侧区域；设置该插槽会预留对侧空间。

`time` 是直接显示的文字，`dateTime` 为其补充机器可读的值。提供 `dateTime` 时默认时间渲染为 `time` 元素；需要本地化格式时，可通过 `#time` 放入 [Time](/components/time)。

<Demo name="timeline/opposite" />

### 横向 {#horizontal}

`orientation="horizontal"` 将节点水平排列。`start` 的正文位于轴下，`end` 位于轴上，`alternate` 上下交替。不同长度的内容仍共用同一条水平轴。

横向条目等分可用宽度；条目较多时，可以设置最小宽度并放入 [ScrollArea](/components/scroll-area)。组件不会自动改变方向或裁切内容。

<Demo name="timeline/horizontal" />

### 尺寸 {#sizes}

`size` 调整文字与节点间距。间距跟随密度变量，默认是 `md`。

<Demo name="timeline/sizes" />

### 自定义节点与内容 {#custom}

`#marker` 替换节点，可组合 [Avatar](/components/avatar)、[Spinner](/components/spinner) 或图标。`#content` 替换整个正文区域，包括默认时间、标题和描述；需要只改某一部分时，用 `#time`、`#title` 或 `#description`。

所有插槽接收 `{ item, index }`，`item` 保留自定义字段的类型，`index` 是当前显示顺序中的位置。示例使用 [Card](/components/card) 和 [Tag](/components/tag) 组合正文，并在等待中的条目上显示加载指示。

<Demo name="timeline/custom" />

### 反向顺序 {#reverse}

`reverse` 反转实际渲染顺序，不修改传入的数组。连线终点、插槽索引和交替位置都按显示顺序计算。

<Demo name="timeline/reverse" />

### RTL {#rtl}

方向继承外层的 `dir`，也可直接传入 `dir="rtl"`。纵向起始侧与结束侧、横向节点顺序都会跟随方向。

<Demo name="timeline/rtl" />

## 无障碍 {#a11y}

- 根元素是有序列表，条目按 DOM 顺序阅读；可通过 `aria-label` 命名。
- 节点和连线是装饰，对辅助技术隐藏。节点插槽应只放非交互内容；链接、按钮放在正文或对侧插槽中，保持正常键盘操作。
- 不增加焦点停靠点，也不自动赋予选中、完成或当前步骤语义。
- 默认不包含动画；自定义加载指示遵循其自身的减弱动态效果设置。

## API {#api}

### Props {#props}

| 属性           | 类型                              | 默认值       | 说明                                       |
| -------------- | --------------------------------- | ------------ | ------------------------------------------ |
| `items`        | `T[]`                             | 必填         | 按顺序排列的条目，`T extends TimelineItem` |
| `orientation`  | `'vertical' \| 'horizontal'`      | `'vertical'` | 排布方向                                   |
| `align`        | `'start' \| 'end' \| 'alternate'` | `'start'`    | 节点轴与内容的相对位置                     |
| `size`         | `'sm' \| 'md' \| 'lg'`            | `'md'`       | 文字与节点间距                             |
| `tone`         | `TimelineTone`                    | `'accent'`   | 默认节点颜色                               |
| `timePosition` | `'content' \| 'opposite'`         | `'content'`  | 默认时间的位置                             |
| `reverse`      | `boolean`                         | `false`      | 反转显示顺序                               |
| `class`        | `string`                          | —            | 根元素的类                                 |

原生属性（如 `dir`、`aria-label`、`style`）透传到根元素。

### TimelineItem {#item}

| 字段          | 类型               | 说明                                              |
| ------------- | ------------------ | ------------------------------------------------- |
| `id`          | `string \| number` | 稳定的条目标识；省略时使用显示索引                |
| `title`       | `string`           | 标题                                              |
| `description` | `string`           | 描述                                              |
| `time`        | `string`           | 直接显示的时间文字                                |
| `dateTime`    | `string`           | `time` 元素的 `datetime` 属性，不参与格式化或排序 |
| `tone`        | `TimelineTone`     | 覆盖该项的节点颜色                                |

`TimelineTone`：`'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'`。所有条目字段均可选，插槽可以完全接管呈现。

### Slots {#slots}

| 插槽          | 参数                         | 说明                             |
| ------------- | ---------------------------- | -------------------------------- |
| `marker`      | `{ item: T, index: number }` | 节点装饰，默认空心圆点           |
| `content`     | `{ item: T, index: number }` | 整个正文区域                     |
| `title`       | `{ item: T, index: number }` | 标题                             |
| `description` | `{ item: T, index: number }` | 描述                             |
| `time`        | `{ item: T, index: number }` | 时间，位置由 `timePosition` 决定 |
| `opposite`    | `{ item: T, index: number }` | 对侧区域，优先于对侧时间         |

同时导出 `TimelineItem`、`TimelineSlotProps<T>`、`TimelineTone`、`TimelineSize`、`TimelineOrientation` 和 `TimelineAlign` 类型。
