---
title: Table
description: 按行列组织的静态数据表。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/table/Table.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/table/table.variants.ts
---

<Demo name="table/hero" />

## 用法 {#usage}

```ts
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'
```

表格由六个组件组成，与 HTML 表格的结构一一对应：`Table` 是根，`TableHeader` 与 `TableBody` 是表头区和数据区，`TableRow` 是行，`TableHead` 是表头单元格，`TableCell` 是数据单元格。除 `Table`、`TableHead` 和 `TableCell` 之外的组件只接受 `class`。

`Table` 自带横向滚动容器，表格宽度超出时在容器内滚动，不会撑破所在布局。

<Demo name="table/basic" />

本组件只负责呈现，不含排序、筛选、分页与行选择。这些能力需要与数据源约定接口，属于后续的数据表格组件。

## 示例 {#examples}

### 形态 {#variants}

`primary` 是带底色、边框与投影的面板，适合独立成块的表格；`secondary` 去掉边框与投影，只保留表头底色，适合已经位于卡片或面板内、不需要再嵌一层容器的场景。默认为 `primary`。

<Demo name="table/variants" />

### 对齐 {#align}

`align` 控制单元格内容的对齐方向，可选 `start`、`center` 和 `end`，默认为 `start`。数值列通常右对齐，便于按位比较；表头与数据列的对齐方向应当一致。

表格已启用等宽数字，同列数字的字符宽度相同，不会因字形差异而参差。

<Demo name="table/align" />

### 表格标题 {#caption}

`caption` 在表格上方显示一行说明文字，同时作为表格的可访问名被辅助技术读出。横向滚动时它保持在起始边可见。

<Demo name="table/caption" />

### 行悬停 {#hover}

数据行默认在悬停时浮现一层浅色状态层，用于在宽表中跟住视线。若表格用于陈列固定信息、行本身不可交互，可将 `hover` 设为 `false` 关闭。

<Demo name="table/hover" />

### 行表头 {#row-header}

当每一行的首列是该行的名称而非数据时，用 `TableHead` 并设 `scope="row"` 代替 `TableCell`。屏幕阅读器据此把该单元格作为整行的标题读出，读到后续单元格时会先播报它。

<Demo name="table/row-header" />

### 吸顶表头 {#sticky-header}

`sticky-header` 让表头在纵向滚动时固定在容器顶缘。它需要配合高度限制使用，否则表格不会产生纵向滚动。开启后滚动容器同时接管纵横两个方向。

<Demo name="table/sticky-header" />

### 吸附首列 {#sticky-column}

列数较多时，在首列的 `TableHead` 与 `TableCell` 上加 `sticky`，横向滚动时该列固定在起始边，其余列从它下方滑过。固定列自带实底与右侧分界线，滚动时不会与后面的内容重叠。

同一列的表头与数据单元格都要加 `sticky`，只加一处会导致该列在滚动时错位。

<Demo name="table/sticky-column" />

### 密度 {#density}

行高取自密度变量，在容器上设置 `data-density="compact"` 即可整体压缩，表格本身不需要改动。用于信息密集的列表页。

<Demo name="table/density" />

## 无障碍 {#a11y}

- 结构使用原生表格元素，屏幕阅读器可按行列关系导航，并播报所在的行列位置。
- `TableHead` 的 `scope` 默认为 `col`，声明该单元格是所在列的表头；行表头需显式设为 `row`。
- `caption` 是表格的可访问名。表格前后若已有标题文字，可用它复述，避免辅助技术只读到一个无名表格。
- 对齐方式与行悬停都不改变朗读顺序。

## API {#api}

### Table {#props}

| 属性           | 类型                       | 默认值      | 说明                           |
| -------------- | -------------------------- | ----------- | ------------------------------ |
| `variant`      | `'primary' \| 'secondary'` | `'primary'` | 形态                           |
| `hover`        | `boolean`                  | `true`      | 数据行是否在悬停时浮现状态层   |
| `stickyHeader` | `boolean`                  | `false`     | 表头是否在纵向滚动时固定于顶缘 |
| `caption`      | `string`                   | —           | 表格标题，同时作为可访问名     |
| `class`        | `string`                   | —           | 追加到滚动容器上的类           |

| 插槽      | 说明                                          |
| --------- | --------------------------------------------- |
| `default` | 表格内容，通常是 `TableHeader` 与 `TableBody` |

### TableHead {#head}

| 属性     | 类型                           | 默认值    | 说明                         |
| -------- | ------------------------------ | --------- | ---------------------------- |
| `scope`  | `'col' \| 'row'`               | `'col'`   | 该表头单元格描述的是列还是行 |
| `align`  | `'start' \| 'center' \| 'end'` | `'start'` | 内容对齐方向                 |
| `sticky` | `boolean`                      | `false`   | 横向滚动时是否固定在起始边   |
| `class`  | `string`                       | —         | 追加到根元素的类             |

### TableCell {#cell}

| 属性     | 类型                           | 默认值    | 说明                       |
| -------- | ------------------------------ | --------- | -------------------------- |
| `align`  | `'start' \| 'center' \| 'end'` | `'start'` | 内容对齐方向               |
| `sticky` | `boolean`                      | `false`   | 横向滚动时是否固定在起始边 |
| `class`  | `string`                       | —         | 追加到根元素的类           |

### TableHeader、TableBody 与 TableRow {#structure}

三者分别渲染 `thead`、`tbody` 和 `tr`，只接受 `class`，内容通过默认插槽传入。
