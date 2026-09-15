---
title: DataTable
description: 带类型的数据表格，查询、布局与编辑能力按需启用。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/data-table/DataTable.vue
---

<Demo name="data-table/hero" />

## 使用 {#usage}

```ts
import { DataTable, type DataTableColumn } from '@hina-ui/vue'
```

传入 `rows`、`columns` 与稳定的 `rowKey`。默认只显示表格，其他控件按需开启。样式对齐 [Table](/components/table)，支持密度、深色模式与 RTL。

列、插槽、回调与实例 API 保留原始行类型。数据变化时传入新数组，以便重新计算数据处理结果。

## 示例 {#examples}

### 单元格 {#cells}

`cell-key` 替换指定列的内容，`cell` 作为公共后备。插槽提供带类型的原始 `row`、`column`、`value`、稳定的 `key`、源数组中的 `index`、`depth`，以及选择、展开的方法。`field` 可指定其他字段，`accessor` 优先级更高。`format` 只影响显示。首个示例使用 [Tag](/components/tag)。

`align` 同时作用于表头与单元格。`rowClickable` 支持点击、Enter 和 Space，并触发 `rowClick`；单元格内的交互控件保留自己的行为。`rowContextmenu` 提供原始行和事件，自定义菜单时由调用方执行 `event.preventDefault()`。

### 排序 {#sorting}

列设置 `sortable: true` 后，表头按升序、降序、取消排序循环。`v-model:sorting` 存储 `{ key, desc }[]`，`multi-sort` 允许 Shift 点击追加排序。数字与日期按值比较，字符串按当前语言自然排序，缺失值始终放在末尾。`sort(a, b)` 自定义升序比较。

`header-key` / `header` 提供 `sorting`、`sortIndex` 和 `toggleSort(multi?)`；自定义表头仍保留外围单元格与 `aria-sort`。

<Demo name="data-table/sorting" />

### 全局筛选 {#filtering}

`v-model:filter` 在参与筛选的列中进行不区分大小写的子串匹配。`filterable: false` 将列排除出全局筛选，`filter(row, query)` 自定义该列的匹配方式。隐藏列仍可参与，任一列匹配即可保留该行。

可在 `toolbar` 中放置 [SearchInput](/components/search-input)。防抖、请求与过期响应处理由调用方管理。

<Demo name="data-table/filtering" />

### 独立列筛选 {#column-filters}

`v-model:columnFilters` 存储 `{ key, value }[]`，各列条件取交集，并与全局筛选同时生效。`filterMode` 支持 `contains`、`equals`、`in`（数组）和 `range`（`[min, max]`，任一边界可为空）。数字、布尔值和日期保留原类型，`filterValue(row, value)` 可自定义匹配。

表头插槽提供 `filterValue` 与 `setFilter(value)`。传入 `null`、`undefined`、空字符串或空数组清除该列条件。筛选控件按需添加，示例使用 [Select](/components/select)。

<Demo name="data-table/column-filters" />

### 多选 {#selection}

`selectable` 添加 [Checkbox](/components/checkbox)，也可传入函数禁止选择部分行。`v-model:selected` 存储行键，数字与字符串区分处理。翻页、筛选和替换远程结果保留已选键，删除数据后是否清除对应键由调用方决定。

表头默认控制当前页可选行，`selectAll="filtered"` 则控制当前已加载数据中所有符合筛选条件的行。两者都不会选择尚未加载的远程记录。`rowLabel` 用于提供可读的控件名称。

<Demo name="data-table/selection" />

### 单选 {#single}

`selectionMode="single"` 使用单选控件，新选择替换旧选择。`selected` 仍是键数组，最多保留一个键；表头不显示全选控件。

<Demo name="data-table/single" />

### 分页 {#pagination}

`pagination` 启用 [Pagination](/components/pagination)，`page` 从 1 开始，`pageSize` 默认 10。排序、全局或列筛选、分组及每页数量改变后复位到第一页；`:auto-reset-page="false"` 可保留当前页。已知总数时，数据减少会将越界页码调回有效范围。

默认页脚只显示分页控件。如需总数、每页数量或跳页输入，可在 `footer` 中组合 [Pagination](/components/pagination)。

<Demo name="data-table/pagination" />

### 远程数据 {#remote}

`manual` 同时绕过本地筛选、排序、分组与分页。`rows` 为当前请求结果，`total` 提供远程总数。受控模型可从 URL 或 store 初始化。

`change` 在同一更新周期稳定后发出一次完整的 `{ page, pageSize, sorting, filter, columnFilters, grouping }`。挂载时不触发，首次请求、取消与过期响应处理由调用方负责。

`loading` 保留现有行，阻止其交互，并使用 [LoadingOverlay](/components/loading-overlay)。加载期间临时清空结果不会收缩页码。

<Demo name="data-table/remote" />

### 未知总数 {#remote-unknown}

远程模式省略 `total` 时显示上一页、下一页控件。`hasNextPage` 显式控制下一页是否可用；省略时根据返回行数是否达到 `pageSize` 判断。

<Demo name="data-table/remote-unknown" />

### 列显隐 {#columns}

`v-model:hiddenColumns` 存储隐藏列的键。显隐变化保留排序和筛选状态，组件默认不生成显隐控件。

<Demo name="data-table/columns" />

### 列宽、固定与顺序 {#column-layout}

列支持 `width`、`minWidth`、`maxWidth` 以及逻辑方向的 `pin: 'start' | 'end'`。`truncate` 将默认文本限制为单行，仅溢出时显示 [Tooltip](/components/tooltip)。自定义单元格内容自行处理截断。

`resizable` 允许拖动表头边界调宽，拖动时显示贯穿表格的指示线。默认 `resizeMode="fit"` 与相邻列交换宽度，保持当前表格总宽不变。普通列从末端边界调整，固定在末端的列从内侧起始边界调整，RTL 下方向镜像。普通末列没有外侧手柄；相邻列禁止调宽或两列之间没有可调整空间时，不显示对应手柄。`resizeMode="expand"` 只调整当前列，其他列宽保持不变；放宽时表格可超出容器并横向滚动，收窄时最多消耗超出的宽度，到达容器宽度后停止，不会继续缩出空白。表格已经铺满时，要继续缩窄一列并将宽度交给相邻列，使用 `fit`。两种模式均遵守列的上下限。

调宽手柄位于所属表头的可见范围内，并与固定区分隔线分开。横向滚动或调宽后，部分被固定列遮挡的表头仍保留可操作的手柄；完全离开可见区的手柄不参与点击和键盘导航。悬停通过 [Tooltip](/components/tooltip) 显示受影响的列名，拖动时显示各列的当前像素宽度。`fit` 的共享手柄同时标明相邻两列，`expand` 只标明当前列。交互调整固定列宽度时，为中间非固定列保留至少 48px 的可视区域。

聚焦边界后，左右方向键每次调整 1px，Shift 调整 10px，Home/End 到达可调整范围的边界。Esc 撤销当前拖动。`v-model:columnWidths` 存储手动指定的像素宽度。`fit` 只记录调整的两列，其他未指定宽度的列继续分配容器剩余空间；`expand` 同时记录其余列的显示宽度，以保证它们不会一起变化。仅按下再松开手柄不会写入宽度，Esc 恢复本次拖动前的设置。清空该模型可恢复自动分配。交互调宽使用数字边界；静态列也支持 CSS 长度。

`reorderColumns` 允许直接拖动叶子表头，列预览与插入线显示松手后的落点。轻点仍执行排序，拖动不会触发排序，Esc 取消重排。聚焦表头后也可使用 Alt + 左右方向键。`v-model:columnOrder` 存储列键，重排限制在同一固定区域内。列的 `resizable: false`、`reorderable: false` 分别禁用调宽与重排。`layout="fixed"`、调宽、截断或虚拟化会约束表格布局。

示例通过 [Select](/components/select) 切换调宽模式。

<Demo name="data-table/column-layout" />

### 多级表头与汇总 {#headers}

嵌套列的 `children` 生成多级表头。父列负责标签与表头插槽，叶子列负责数据、排序与布局。隐藏或重排叶子列会自动更新跨行、跨列范围。

`aggregate` 支持 `sum`、`min`、`max`、`mean`、`count`、`uniqueCount` 或函数。`footer: true` 显示该聚合结果，也可用字符串或 `(rows) => text` 自定义。汇总使用当前已加载且符合筛选的所有行，包含折叠行。`footer-key` 替换单个汇总单元格，`summary` 替换 `<tfoot>` 内部内容，应返回表格行。

<Demo name="data-table/headers" />

### 行展开 {#expansion}

`expandable` 添加展开控件，也可传入函数限定可展开行。`v-model:expanded` 存储行键。`expansion` 接收行上下文，内容显示在该行下方并跨越全部列。展开内容不额外占用分页名额。

<Demo name="data-table/expansion" />

### 树形数据 {#tree}

`getChildren(row)` 提供子行，行键在整棵树中保持唯一。`expanded` 控制展开状态，缩进跟随层级。分页按根行计数，筛选保留匹配子行的祖先。

默认选择父行会同时选择可选后代，部分子行选中时父行显示半选态。`:select-children="false"` 让各行独立选择，单选模式始终只选择一行。

<Demo name="data-table/tree" />

### 分组与聚合 {#grouping}

`v-model:grouping` 按顺序存储分组列键，`v-model:expandedGroups` 控制生成的分组键，与数据行的 `expanded` 分开保存。多个列键产生嵌套分组，分页按最外层分组计数。

默认分组行显示分组值、数量及列聚合结果。`group` 提供分组的 `key`、`column`、`value`、`rows`、`depth`、`expanded`、`toggleExpanded()` 和 `aggregate(columnKey)`。分组行不可选择或编辑。远程模式由数据源负责分组，可用 `getChildren` 表达返回的层级。

<Demo name="data-table/grouping" />

### 单元格与整行编辑 {#editing}

设置列的 `editable` 与 `editMode="cell" | "row"`。双击单元格，或聚焦后按 Enter 进入编辑；整行模式提供编辑按钮。`editor-key` / `editor` 替换输入控件，接收 `value`、`updateValue`、`pending`、`error`、`commit` 和 `cancel`。保存、取消与错误反馈仍由组件负责。示例用 [Select](/components/select) 替换一列编辑器。

草稿不会直接修改传入数据。`parse` 转换草稿值，`validate` 同步或异步返回错误字符串或 `undefined`。`onSave(edit)` 可返回 Promise；等待期间禁止重复提交。抛错会保留草稿、显示错误并触发 `editError`，不会留下未处理的拒绝。

成功后触发 `edit`，参数为 `{ key, row, column?, values }`，其中 `values` 按列键组织。调用方负责应用修改，包括将 accessor 列映射回原始字段。`onSave` 在 `edit` 之前执行一次，不要在两处重复发送请求。默认输入框支持 Enter 保存与 Escape 取消。

整行编辑的保存错误在行下方显示一次；列 `validate` 返回的错误只显示在对应字段，`error` 插槽参数也只包含该字段的校验错误。编辑器通过 [InputGroup](/components/input-group) 的 `bare` 变体统一尺寸和外观，自定义插槽中的 [Input](/components/input)、[Select](/components/select) 等控件会继承嵌入样式。

<Demo name="data-table/editing" />

### 行重排 {#reorder}

`reorderable` 添加支持鼠标与触摸的拖动手柄，也支持上下方向键。`v-model:rows` 接收重排后的根数组，原数组不会被修改。`rowReorder` 包含 `{ row, target, parent?, from, to, rows }`。子行重排时，由调用方将新的同级数组应用到 `parent`，不改变父子归属。

排序、筛选或分组改变显示顺序时禁用行拖动。可传入函数禁止移动部分行。重排范围是已加载的同级行，持久化由调用方负责。

<Demo name="data-table/reorder" />

### 滚动 {#scroll}

横向溢出限制在 [ScrollArea](/components/scroll-area) 内。`maxHeight` 限制滚动区高度，`stickyHeader` 固定表头。`class` 作用于完整 DataTable，`tableClass` 作用于滚动区。实例暴露 `viewport` 与原生表格 `element`。

<Demo name="data-table/scroll" />

### 撑满与固定汇总 {#fill}

`height` 设置包含工具栏、分页的组件总高度；`fill` 撑满具有确定高度的父容器。表格在剩余空间中滚动，`stickyFooter` 固定汇总单元格。

<Demo name="data-table/fill" />

### 虚拟滚动 {#virtual}

`virtualize` 只渲染可见行与缓冲区，可用 `{ estimateSize, overscan }` 指定初始行高估计和缓冲数量。实际行高与展开内容会自动测量，可组合固定列、选择、展开和分组。提供 `height`、`maxHeight` 或 `fill`，否则滚动区默认上限为 400px。

数据处理仍针对传入的完整行集。虚拟化减少挂载的 DOM，不负责请求数据。`api.scrollToRow(key)` 可滚动到当前显示行集中的任意行，包括渲染窗口之外的行。折叠或其他页内的行需先展开祖先或切换页码。

<Demo name="data-table/virtual" />

### CSV 导出 {#export}

`api.toCsv(options)` 返回 CSV 字符串，`api.exportCsv(options)` 下载文件。`scope` 支持 `page`、`filtered`（默认）、`selected` 和 `all`。远程模式同样只处理已加载记录；仅有已选键而没有行对象的记录无法导出。

导出跟随可见列顺序，排除 `exportable: false` 的列，`columns` 可进一步指定列键。`exportValue` 优先提供导出值，否则 `formatted` 决定是否使用显示格式。字符串会转义并加引号，类似公式的字符串受到保护，默认启用 UTF-8 BOM。可配置 `delimiter`、`bom` 与 `filename`。

<Demo name="data-table/export" />

### 空状态与加载 {#states}

`emptyText` 替换默认提示，`empty` 可放入 [Empty](/components/empty) 等自定义内容。`loading` 插槽替换 [LoadingOverlay](/components/loading-overlay) 的内容，应保留状态播报。

<Demo name="data-table/states" />

## 无障碍 {#behavior}

组件保留原生表格语义、多级表头作用域与虚拟行位置。用 `caption` 或 `label` 提供无障碍名称。排序、选择、调宽、重排和编辑均提供键盘入口，保存或取消后恢复到编辑入口。自定义编辑器与汇总行应保留对应语义。

## API {#api}

### Props {#props}

| Prop             | 类型                                                      | 默认值     | 说明                                 |
| ---------------- | --------------------------------------------------------- | ---------- | ------------------------------------ |
| `rows`           | `T[]`                                                     | `Required` | 传入的行                             |
| `columns`        | `DataTableColumn<T>[]`                                    | `Required` | 列定义                               |
| `rowKey`         | `DataTableKeyField<T> \| ((row: T) => DataTableKey)`      | `Required` | 全局唯一且稳定的行键                 |
| `rowLabel`       | `keyof T \| ((row: T) => string)`                         | `Row key`  | 可访问的行标签                       |
| `selectable`     | `boolean \| ((row: T) => boolean)`                        | `false`    | 是否可选                             |
| `selectionMode`  | `'single' \| 'multiple'`                                  | `multiple` | 选择模式                             |
| `selectAll`      | `'page' \| 'filtered'`                                    | `page`     | 表头选择范围                         |
| `selectChildren` | `boolean`                                                 | `true`     | 级联选择后代                         |
| `expandable`     | `boolean \| ((row: T) => boolean)`                        | `false`    | 详情展开条件                         |
| `getChildren`    | `(row: T) => T[] \| undefined`                            | `—`        | 树形子行                             |
| `pagination`     | `boolean`                                                 | `false`    | 启用分页                             |
| `manual`         | `boolean`                                                 | `false`    | 外部处理查询                         |
| `total`          | `number`                                                  | `—`        | 已知远程总数                         |
| `hasNextPage`    | `boolean`                                                 | `—`        | 未知总数时能否翻到下一页             |
| `autoResetPage`  | `boolean`                                                 | `true`     | 查询条件变化后复位页码               |
| `multiSort`      | `boolean`                                                 | `false`    | Shift 追加排序                       |
| `resizable`      | `boolean`                                                 | `false`    | 列宽手柄                             |
| `resizeMode`     | `'fit' \| 'expand'`                                       | `fit`      | 调整相邻列保持总宽，或仅调整当前列   |
| `reorderColumns` | `boolean`                                                 | `false`    | 拖动表头重排                         |
| `reorderable`    | `boolean \| ((row: T) => boolean)`                        | `false`    | 行重排手柄                           |
| `virtualize`     | `boolean \| { estimateSize?: number; overscan?: number }` | `false`    | 虚拟渲染；估计行高 44，缓冲 6        |
| `editMode`       | `'cell' \| 'row'`                                         | `—`        | 编辑模式                             |
| `onSave`         | `(edit: DataTableEdit<T>) => void \| Promise<void>`       | `—`        | 等待完成的保存回调                   |
| `loading`        | `boolean`                                                 | `false`    | 加载时阻止旧数据交互                 |
| `disabled`       | `boolean`                                                 | `false`    | 禁用内置交互                         |
| `rowClickable`   | `boolean`                                                 | `false`    | 启用行激活                           |
| `rowClass`       | `(row: T) => string \| undefined`                         | `—`        | 行样式                               |
| `variant`        | `'primary' \| 'secondary'`                                | `primary`  | 外观                                 |
| `hover`          | `boolean`                                                 | `true`     | 行悬停反馈                           |
| `stickyHeader`   | `boolean`                                                 | `false`    | 固定表头                             |
| `stickyFooter`   | `boolean`                                                 | `false`    | 固定汇总                             |
| `height`         | `number \| string`                                        | `—`        | 组件总高度                           |
| `maxHeight`      | `number \| string`                                        | `—`        | 滚动区最大高度                       |
| `fill`           | `boolean`                                                 | `false`    | 撑满具有确定高度的父容器             |
| `layout`         | `'auto' \| 'fixed'`                                       | `auto`     | 表格布局；约束列宽的能力会使用 fixed |
| `caption`        | `string`                                                  | `—`        | 可见标题                             |
| `label`          | `string`                                                  | `—`        | 无障碍名称                           |
| `emptyText`      | `string`                                                  | `Locale`   | 空状态文本                           |
| `class`          | `string`                                                  | `—`        | 根样式                               |
| `tableClass`     | `string`                                                  | `—`        | 滚动区样式                           |

### 列定义 {#column}

| 属性                          | 类型                                                                              | 说明                      |
| ----------------------------- | --------------------------------------------------------------------------------- | ------------------------- |
| `key`                         | `string`                                                                          | 唯一列键                  |
| `label`                       | `string`                                                                          | 表头标签                  |
| `children`                    | `DataTableColumn<T>[]`                                                            | 嵌套表头                  |
| `field`                       | `keyof T`                                                                         | 数据字段，默认使用 key    |
| `accessor`                    | `(row: T) => unknown`                                                             | 自定义取值                |
| `sortable`                    | `boolean`                                                                         | 启用排序                  |
| `sort`                        | `(a: T, b: T) => number`                                                          | 升序比较器                |
| `filterable`                  | `boolean`                                                                         | 参与全局筛选，默认 true   |
| `filter`                      | `(row: T, query: string) => boolean`                                              | 全局筛选匹配器            |
| `filterMode`                  | `'contains' \| 'equals' \| 'in' \| 'range'`                                       | 列匹配模式，默认 contains |
| `filterValue`                 | `(row: T, value: unknown) => boolean`                                             | 自定义列匹配器            |
| `format`                      | `(value: unknown, row: T) => string \| number`                                    | 显示格式                  |
| `align`                       | `'start' \| 'center' \| 'end'`                                                    | 逻辑方向对齐              |
| `width / minWidth / maxWidth` | `number \| string`                                                                | 列宽及上下限              |
| `pin`                         | `'start' \| 'end'`                                                                | 固定区域                  |
| `truncate`                    | `boolean`                                                                         | 单行截断与溢出提示        |
| `resizable / reorderable`     | `boolean`                                                                         | false 禁用相应手柄        |
| `aggregate`                   | `DataTableAggregate \| ((rows: T[]) => unknown)`                                  | 分组与汇总聚合            |
| `footer`                      | `boolean \| string \| ((rows: T[]) => string \| number)`                          | 汇总内容                  |
| `editable`                    | `boolean \| ((row: T) => boolean)`                                                | 可编辑条件                |
| `parse`                       | `(value: unknown, row: T) => unknown`                                             | 转换草稿值                |
| `validate`                    | `(value: unknown, row: T) => string \| undefined \| Promise<string \| undefined>` | 返回校验错误              |
| `exportable`                  | `boolean`                                                                         | false 排除出 CSV          |
| `exportValue`                 | `(row: T) => unknown`                                                             | 覆盖导出值                |
| `headerClass`                 | `string`                                                                          | 表头样式                  |
| `cellClass`                   | `string \| ((row: T) => string \| undefined)`                                     | 单元格样式                |

### 模型 {#models}

| 绑定                     | 类型                     | 默认值 |
| ------------------------ | ------------------------ | ------ |
| `v-model:page`           | `number`                 | `1`    |
| `v-model:pageSize`       | `number`                 | `10`   |
| `v-model:sorting`        | `DataTableSort[]`        | `[]`   |
| `v-model:filter`         | `string`                 | `''`   |
| `v-model:columnFilters`  | `DataTableFilter[]`      | `[]`   |
| `v-model:grouping`       | `string[]`               | `[]`   |
| `v-model:selected`       | `DataTableKey[]`         | `[]`   |
| `v-model:expanded`       | `DataTableKey[]`         | `[]`   |
| `v-model:expandedGroups` | `string[]`               | `[]`   |
| `v-model:hiddenColumns`  | `string[]`               | `[]`   |
| `v-model:columnOrder`    | `string[]`               | `[]`   |
| `v-model:columnWidths`   | `Record<string, number>` | `{}`   |

根行重排可使用 `v-model:rows`，其他情况下照常传入 `rows`。

### 插槽 {#slots}

| 插槽                  | Props                       | 说明             |
| --------------------- | --------------------------- | ---------------- |
| `cell-key / cell`     | `DataTableCellContext<T>`   | 数据单元格       |
| `header-key / header` | `DataTableHeaderContext<T>` | 表头内容         |
| `editor-key / editor` | `DataTableEditorContext<T>` | 编辑控件         |
| `expansion`           | `DataTableRowContext<T>`    | 展开详情         |
| `group`               | `DataTableGroupContext<T>`  | 分组行           |
| `footer-key`          | `{ column, rows: T[] }`     | 汇总单元格       |
| `summary`             | `DataTableState<T>`         | tfoot 内容       |
| `toolbar / footer`    | `DataTableState<T>`         | 工具栏与分页页脚 |
| `empty / loading`     | `—`                         | 状态内容         |

`DataTableState<T>` 包含查询参数、`total`、当前显示的原始 `rows`、`selected`、`expanded`、`visibleColumns` 与 `api`。

### 事件 {#events}

| 事件             | 参数                                           | 说明           |
| ---------------- | ---------------------------------------------- | -------------- |
| `change`         | `DataTableQuery`                               | 查询变化       |
| `rowClick`       | `(row: T, event: MouseEvent \| KeyboardEvent)` | 行激活         |
| `rowContextmenu` | `(row: T, event: MouseEvent)`                  | 右键菜单事件   |
| `update:rows`    | `T[]`                                          | 重排后的根数组 |
| `rowReorder`     | `DataTableReorder<T>`                          | 根或同级行重排 |
| `edit`           | `DataTableEdit<T>`                             | 编辑成功       |
| `editError`      | `(error: unknown, edit: DataTableEdit<T>)`     | 保存或校验异常 |

### 实例 {#instance}

实例暴露 `element: HTMLTableElement | undefined`、`viewport: HTMLElement | undefined`、`state: DataTableState<T>` 与 `api: DataTableApi<T>`，工具栏与页脚插槽也提供同一份 API。

| 方法                              | 返回值          | 说明                                                 |
| --------------------------------- | --------------- | ---------------------------------------------------- |
| `getRows(scope?)`                 | `T[]`           | page / filtered / selected / all，只含已加载数据     |
| `toggleSelected(key, value?)`     | `void`          | 选择已加载行                                         |
| `toggleExpanded(key, value?)`     | `void`          | 控制行展开                                           |
| `setFilter(column, value)`        | `void`          | 设置列筛选                                           |
| `setColumnHidden(column, hidden)` | `void`          | 改变列显隐                                           |
| `setColumnWidth(column, width)`   | `void`          | 直接设置指定列的像素宽度并遵守上下限，不与相邻列交换 |
| `moveColumn(column, target)`      | `void`          | 在同一固定区域内移动列                               |
| `moveRow(key, target)`            | `void`          | 重排可移动同级行                                     |
| `startEdit(key, column?)`         | `void`          | 开始单元格或行编辑                                   |
| `cancelEdit()`                    | `void`          | 取消草稿                                             |
| `commitEdit()`                    | `Promise<void>` | 校验并保存                                           |
| `scrollToRow(key)`                | `void`          | 滚动到显示行集中的行                                 |
| `toCsv(options?)`                 | `string`        | 返回 CSV                                             |
| `exportCsv(options?)`             | `void`          | 下载 CSV                                             |

```ts
interface DataTableExportOptions {
  scope?: 'page' | 'filtered' | 'selected' | 'all'
  columns?: string[]
  formatted?: boolean
  delimiter?: ',' | ';' | '\t'
  bom?: boolean
  filename?: string
}
```
