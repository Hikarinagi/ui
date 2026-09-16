---
title: DataTable
description: A typed data table with optional query, layout and editing capabilities.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/data-table/DataTable.vue
---

<Demo name="data-table/hero" />

## Usage {#usage}

```ts
import { DataTable, type DataTableColumn } from '@hina-ui/vue'
```

Pass `rows`, `columns` and a stable `rowKey`. Only the table appears by default; every additional control is optional. Styling follows [Table](/components/table), including density, dark mode and RTL.

Columns, slots, callbacks and the instance API retain the original row type. Supply a new array when data changes so the data pipeline recalculates.

## Examples {#examples}

### Cells {#cells}

`cell-key` replaces one column's content; `cell` is the shared fallback. They receive the original typed `row`, `column`, `value`, stable `key`, source `index`, `depth` and selection/expansion helpers. `field` reads another field and `accessor` takes precedence. `format` affects display only. A dedicated `cell-key` slot takes precedence over the shared `cell` slot.

`align` applies to headers and cells. `rowClickable` emits `rowClick` for click, Enter and Space; actions inside cells keep their own behavior. `rowContextmenu` forwards the original row and event; call `event.preventDefault()` when providing a custom menu.

The name column uses `#cell-name` to combine [Avatar](/components/avatar) with two lines of [Text](/components/text), while `#cell-status` renders [Tag](/components/tag). The shared `#cell` slot checks `column.key` to combine [Progress](/components/progress) with the count. Slots replace cell content; DataTable retains the surrounding cells, alignment and sorting.

<Demo name="data-table/cells" />

### Sorting {#sorting}

Set `sortable: true` per column. Headers cycle ascending → descending → unsorted. `v-model:sorting` stores `{ key, desc }[]`; `multi-sort` allows Shift-click to append sorting. Numbers and dates compare by value, strings use locale-aware natural ordering, and missing values stay last. `sort(a, b)` supplies an ascending comparator.

`header-key` / `header` receive `sorting`, `sortIndex` and `toggleSort(multi?)`; custom headers keep the surrounding cell and `aria-sort`.

<Demo name="data-table/sorting" />

### Global filtering {#filtering}

`v-model:filter` matches a case-insensitive substring across participating columns. `filterable: false` excludes a column from global filtering; `filter(row, query)` customizes its matcher. Hidden columns still participate. A match in any column includes the row.

Use [SearchInput](/components/search-input) in `toolbar`. Debouncing, requests and stale-response handling belong to the caller.

<Demo name="data-table/filtering" />

### Column filters {#column-filters}

`v-model:columnFilters` stores `{ key, value }[]`. Filters combine with AND and also respect global filtering. `filterMode` supports `contains`, `equals`, `in` (an array) and `range` (`[min, max]`, with either bound nullable). Numbers, booleans and dates retain their types. `filterValue(row, value)` provides custom matching.

Each header slot receives `filterValue` and `setFilter(value)`. Passing `null`, `undefined`, an empty string or an empty array removes the filter. Controls are optional; this example uses [Select](/components/select).

<Demo name="data-table/column-filters" />

### Multiple selection {#selection}

`selectable` adds [Checkbox](/components/checkbox) controls; a predicate disables individual rows. `v-model:selected` stores keys, distinguishing numbers from strings. Page changes, filtering and remote-result replacement preserve selected keys. Removing stale keys after deletion is the caller's decision.

The header affects eligible rows on the current page. `selectAll="filtered"` instead affects all filtered rows currently loaded. Neither mode selects unloaded remote records. `rowLabel` gives controls readable names.

<Demo name="data-table/selection" />

### Single selection {#single}

`selectionMode="single"` uses radio controls and replaces the previous selection. `selected` remains a key array containing at most one key; the header has no select-all control.

<Demo name="data-table/single" />

### Pagination {#pagination}

`pagination` enables [Pagination](/components/pagination). `page` starts at 1 and `pageSize` defaults to 10. Sorting, global/column filtering, grouping and page-size changes reset the page; `:auto-reset-page="false"` retains it. Known totals clamp an out-of-range page after data shrinks.

The default footer contains only page controls. Compose [Pagination](/components/pagination) in `footer` for optional totals, page-size selection or a jump input.

<Demo name="data-table/pagination" />

### Remote data {#remote}

`manual` bypasses local filtering, sorting, grouping and pagination together. `rows` is the current response; `total` supplies the remote total. Controlled models can initialize from a URL or store.

`change` emits `{ page, pageSize, sorting, filter, columnFilters, grouping }` once after changes in the same update cycle settle. It does not emit on mount. The caller makes the first request and handles cancellation and stale responses.

`loading` preserves existing rows, blocks their interactions and uses [LoadingOverlay](/components/loading-overlay). Temporarily empty results do not clamp the page while loading.

<Demo name="data-table/remote" />

### Unknown totals {#remote-unknown}

Omit `total` in manual mode to show previous/next controls. `hasNextPage` explicitly controls the next button; if omitted, a full response page implies another page may exist.

<Demo name="data-table/remote-unknown" />

### Column visibility {#columns}

`v-model:hiddenColumns` stores hidden column keys. Visibility changes preserve sorting and filters. No visibility controls are generated by default.

<Demo name="data-table/columns" />

### Widths, pinning and ordering {#column-layout}

Columns accept `width`, `minWidth`, `maxWidth` and logical `pin: 'start' | 'end'`. `truncate` keeps default text on one line and shows [Tooltip](/components/tooltip) only when it overflows. Custom cell content owns its own truncation.

`resizable` makes header boundaries draggable, with a guide extending through the table. The default `resizeMode="fit"` exchanges width with the adjacent column and preserves the current total width. Normal columns resize from their end edge; end-pinned columns resize from their inner start edge. RTL mirrors these directions. The last unpinned column has no outer handle. Boundaries are unavailable when the adjacent column is non-resizable or the pair has no room to resize. `resizeMode="expand"` changes only the current column. Growing may overflow the container and enable horizontal scrolling; shrinking consumes that overflow and stops when the table reaches the container width, without introducing an empty area. To narrow a column in an already fitted table and give its space to its neighbor, use `fit`. Both modes respect column bounds.

Resize grips stay within the visible portion of their own header, separate from pinned-region dividers. Partially covered headers retain a usable grip; fully hidden grips are excluded from hit testing and keyboard navigation. Hover shows the affected column names through [Tooltip](/components/tooltip); dragging displays each column’s current pixel width. A shared `fit` handle names both adjacent columns; `expand` names only the current column. Interactive resizing of pinned columns leaves at least 48px visible for center columns.

Focus a boundary to resize with Left/Right by one pixel, Shift by ten, or Home/End to the available limits. Escape cancels the current drag. `v-model:columnWidths` stores manual pixel widths. `fit` records only the two adjusted columns, leaving unspecified columns free to share remaining container space. `expand` also records the other rendered widths so those columns stay unchanged. Pressing and releasing without dragging does not write widths; Escape restores the previous settings. Clear the model to restore automatic allocation. Use numeric bounds for resizing; static columns also accept CSS lengths.

`reorderColumns` makes leaf headers draggable. A column preview and insertion line show the drop position. Clicking still sorts; dragging does not trigger sorting. Escape cancels a drag. Focus a header and use Alt + Left/Right to reorder with the keyboard. `v-model:columnOrder` stores keys. Reordering stays within the same pinned region; `resizable: false` and `reorderable: false` disable the respective operation. `layout="fixed"`, resizing, truncation or virtualization constrain the table layout.

The example uses [Select](/components/select) to switch resize modes and [Button](/components/button) to clear width and order overrides, restoring the initial layout.

<Demo name="data-table/column-layout" />

### Grouped headers and summaries {#headers}

Nested column `children` create multilevel headers. Parent columns supply labels and header slots; leaf columns supply data, sorting and layout. Hidden or reordered leaves update spans automatically.

`aggregate` accepts `sum`, `min`, `max`, `mean`, `count`, `uniqueCount` or a function. `footer: true` displays that aggregate; a string or `(rows) => text` supplies custom output. Summaries use all filtered loaded rows, including collapsed rows. `footer-key` replaces one summary cell; `summary` replaces the contents of `<tfoot>` and should return table rows.

<Demo name="data-table/headers" />

### Row expansion {#expansion}

`expandable` adds row toggles and can be a predicate. `v-model:expanded` stores row keys. `expansion` receives the row context and renders below it across all columns. Expanding does not consume another pagination slot.

<Demo name="data-table/expansion" />

### Tree data {#tree}

`getChildren(row)` supplies nested rows; keys must be unique throughout the tree. `expanded` controls visibility and depth adds indentation. Pagination counts root rows; filtering retains parents of matching descendants.

Selection includes descendants by default and parents show a mixed state when only some children are selected. `:select-children="false"` makes selection independent. Single selection always selects one row.

<Demo name="data-table/tree" />

### Grouping and aggregation {#grouping}

`v-model:grouping` stores column keys in grouping order. `v-model:expandedGroups` controls generated group keys, independently of data-row `expanded` keys. Multiple columns produce nested groups. Pagination counts outer groups.

Default group rows display the grouping value, count and column aggregates. `group` receives the group `key`, `column`, `value`, `rows`, `depth`, `expanded`, `toggleExpanded()` and `aggregate(columnKey)`. Group rows cannot be selected or edited. In manual mode the data source owns grouping; `getChildren` can represent its hierarchy.

<Demo name="data-table/grouping" />

### Cell and row editing {#editing}

Set column `editable` and `editMode="cell" | "row"`. Double-click or focus a cell and press Enter to edit; row mode supplies an edit button. `editor-key` / `editor` replace the input and receive `value`, `updateValue`, `pending`, `error`, `commit` and `cancel`. Save/cancel controls and error feedback remain component-owned. The example uses [Select](/components/select) for one editor.

Drafts do not mutate input rows. `parse` converts draft values; `validate` returns an error string or `undefined`, synchronously or asynchronously. `onSave(edit)` may return a promise. While pending, duplicate saves are blocked. Rejection keeps the draft open, displays the error and emits `editError`; it does not create an unhandled rejection.

Success emits `edit` with `{ key, row, column?, values }`; `values` is keyed by column key. The caller applies changes, including mapping accessor-backed columns. `onSave` runs once before `edit`; do not send the same request from both. Default inputs support Enter to save and Escape to cancel.

In row mode, save errors appear once below the row. Column validation errors appear at the corresponding field and are exposed through its `error` slot parameter. Editors use the `bare` variant of [InputGroup](/components/input-group); [Input](/components/input), [Select](/components/select), and other compatible controls in custom slots inherit its embedded appearance and size.

<Demo name="data-table/editing" />

### Row reordering {#reorder}

`reorderable` adds drag handles for mouse and touch, with Up/Down keyboard support. `v-model:rows` receives a reordered root array; source arrays are never mutated. `rowReorder` includes `{ row, target, parent?, from, to, rows }`. For nested rows, apply the sibling array to the supplied `parent`; reparenting is not performed.

Dragging is disabled while sorting, filtering or grouping changes the displayed order. A predicate can exclude individual rows. Reordering operates on loaded siblings; persistence belongs to the caller.

<Demo name="data-table/reorder" />

### Scrolling {#scroll}

Horizontal overflow stays inside [ScrollArea](/components/scroll-area). `maxHeight` limits the scroll area and `stickyHeader` pins headers. `class` applies to the entire DataTable; `tableClass` applies to its scroll area. The instance exposes `viewport` and the native table `element`.

<Demo name="data-table/scroll" />

### Fill and sticky summaries {#fill}

`height` sets the total component height, including toolbar and pagination. `fill` fills a parent with a definite height. The table scrolls in the remaining space. `stickyFooter` pins summary cells.

<Demo name="data-table/fill" />

### Virtual scrolling {#virtual}

`virtualize` renders only visible rows plus overscan. `{ estimateSize, overscan }` configures the initial row estimate and buffer; actual row and expansion heights are measured. Combine it with pinned columns, selection, expansion and grouping. Provide `height`, `maxHeight` or `fill`; otherwise the viewport defaults to 400px.

The complete data pipeline still operates on supplied rows. Virtualization reduces mounted DOM; it does not fetch data. `api.scrollToRow(key)` scrolls to a displayed row, including one outside the current rendered window. Expand ancestors or change the page first for hidden rows.

<Demo name="data-table/virtual" />

### CSV export {#export}

`api.toCsv(options)` returns CSV; `api.exportCsv(options)` downloads it. `scope` accepts `page`, `filtered` (default), `selected` or `all`. Only loaded records are available, including in remote mode. Selected keys without a loaded row cannot be exported.

Export follows visible column order and excludes `exportable: false` columns. `columns` narrows the column keys. `exportValue` overrides the raw value; `formatted` otherwise opts into display formatting. Strings are quoted and escaped, formula-like strings are protected, and UTF-8 BOM is enabled by default. `delimiter`, `bom` and `filename` are configurable.

<Demo name="data-table/export" />

### Empty and loading states {#states}

`emptyText` replaces the default message; `empty` accepts custom content such as [Empty](/components/empty). The `loading` slot customizes [LoadingOverlay](/components/loading-overlay) content and should retain a status announcement.

<Demo name="data-table/states" />

## Accessibility {#behavior}

The component retains native table semantics, multilevel header scopes and row positions under virtualization. Use `caption` or `label` for its accessible name. Sorting, selection, resizing, reordering and editing have keyboard entry points. Focus returns to the editing trigger after save/cancel. Custom editors and custom summary rows should retain the corresponding semantics.

## API {#api}

### Props {#props}

| Prop             | Type                                                      | Default    | Description                                                                |
| ---------------- | --------------------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| `rows`           | `T[]`                                                     | `Required` | Supplied rows                                                              |
| `columns`        | `DataTableColumn<T>[]`                                    | `Required` | Column definitions                                                         |
| `rowKey`         | `DataTableKeyField<T> \| ((row: T) => DataTableKey)`      | `Required` | Globally unique stable key                                                 |
| `rowLabel`       | `keyof T \| ((row: T) => string)`                         | `Row key`  | Accessible row label                                                       |
| `selectable`     | `boolean \| ((row: T) => boolean)`                        | `false`    | Selection eligibility                                                      |
| `selectionMode`  | `'single' \| 'multiple'`                                  | `multiple` | Selection mode                                                             |
| `selectAll`      | `'page' \| 'filtered'`                                    | `page`     | Header selection scope                                                     |
| `selectChildren` | `boolean`                                                 | `true`     | Cascade selection to descendants                                           |
| `expandable`     | `boolean \| ((row: T) => boolean)`                        | `false`    | Detail expansion eligibility                                               |
| `getChildren`    | `(row: T) => T[] \| undefined`                            | `—`        | Tree children                                                              |
| `pagination`     | `boolean`                                                 | `false`    | Enable page controls                                                       |
| `manual`         | `boolean`                                                 | `false`    | External query processing                                                  |
| `total`          | `number`                                                  | `—`        | Known remote total                                                         |
| `hasNextPage`    | `boolean`                                                 | `—`        | Next-page availability without total                                       |
| `autoResetPage`  | `boolean`                                                 | `true`     | Reset page after query changes                                             |
| `multiSort`      | `boolean`                                                 | `false`    | Append sorting with Shift                                                  |
| `resizable`      | `boolean`                                                 | `false`    | Column resize handles                                                      |
| `resizeMode`     | `'fit' \| 'expand'`                                       | `fit`      | Exchange width with the adjacent column, or resize only the current column |
| `reorderColumns` | `boolean`                                                 | `false`    | Drag headers to reorder                                                    |
| `reorderable`    | `boolean \| ((row: T) => boolean)`                        | `false`    | Row drag handles                                                           |
| `virtualize`     | `boolean \| { estimateSize?: number; overscan?: number }` | `false`    | Windowed rendering; estimate 44, overscan 6                                |
| `editMode`       | `'cell' \| 'row'`                                         | `—`        | Editing mode                                                               |
| `onSave`         | `(edit: DataTableEdit<T>) => void \| Promise<void>`       | `—`        | Awaited save callback                                                      |
| `loading`        | `boolean`                                                 | `false`    | Block stale rows while loading                                             |
| `disabled`       | `boolean`                                                 | `false`    | Disable built-in interactions                                              |
| `rowClickable`   | `boolean`                                                 | `false`    | Enable row activation                                                      |
| `rowClass`       | `(row: T) => string \| undefined`                         | `—`        | Per-row classes                                                            |
| `variant`        | `'primary' \| 'secondary'`                                | `primary`  | Appearance                                                                 |
| `hover`          | `boolean`                                                 | `true`     | Row hover feedback                                                         |
| `stickyHeader`   | `boolean`                                                 | `false`    | Pin headers                                                                |
| `stickyFooter`   | `boolean`                                                 | `false`    | Pin summary cells                                                          |
| `height`         | `number \| string`                                        | `—`        | Total component height                                                     |
| `maxHeight`      | `number \| string`                                        | `—`        | Scroll-area maximum height                                                 |
| `fill`           | `boolean`                                                 | `false`    | Fill a definite-height parent                                              |
| `layout`         | `'auto' \| 'fixed'`                                       | `auto`     | Table layout; constrained features use fixed                               |
| `caption`        | `string`                                                  | `—`        | Visible caption                                                            |
| `label`          | `string`                                                  | `—`        | Accessible table name                                                      |
| `emptyText`      | `string`                                                  | `Locale`   | Empty message                                                              |
| `class`          | `string`                                                  | `—`        | Root classes                                                               |
| `tableClass`     | `string`                                                  | `—`        | Scroll-area classes                                                        |

### Columns {#column}

| Property                      | Type                                                                              | Description                                   |
| ----------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------- |
| `key`                         | `string`                                                                          | Unique column identifier                      |
| `label`                       | `string`                                                                          | Header label                                  |
| `children`                    | `DataTableColumn<T>[]`                                                            | Nested headers                                |
| `field`                       | `keyof T`                                                                         | Source field; defaults to key                 |
| `accessor`                    | `(row: T) => unknown`                                                             | Custom source value                           |
| `sortable`                    | `boolean`                                                                         | Enable sort control                           |
| `sort`                        | `(a: T, b: T) => number`                                                          | Ascending comparator                          |
| `filterable`                  | `boolean`                                                                         | Participate in global filtering; default true |
| `filter`                      | `(row: T, query: string) => boolean`                                              | Global matcher                                |
| `filterMode`                  | `'contains' \| 'equals' \| 'in' \| 'range'`                                       | Column matcher; default contains              |
| `filterValue`                 | `(row: T, value: unknown) => boolean`                                             | Custom column matcher                         |
| `format`                      | `(value: unknown, row: T) => string \| number`                                    | Display formatting                            |
| `align`                       | `'start' \| 'center' \| 'end'`                                                    | Logical cell alignment                        |
| `width / minWidth / maxWidth` | `number \| string`                                                                | Column dimensions                             |
| `pin`                         | `'start' \| 'end'`                                                                | Pinned region                                 |
| `truncate`                    | `boolean`                                                                         | Single line with overflow tooltip             |
| `resizable / reorderable`     | `boolean`                                                                         | Disable a handle with false                   |
| `aggregate`                   | `DataTableAggregate \| ((rows: T[]) => unknown)`                                  | Group and footer aggregation                  |
| `footer`                      | `boolean \| string \| ((rows: T[]) => string \| number)`                          | Summary output                                |
| `editable`                    | `boolean \| ((row: T) => boolean)`                                                | Editing eligibility                           |
| `parse`                       | `(value: unknown, row: T) => unknown`                                             | Convert draft value                           |
| `validate`                    | `(value: unknown, row: T) => string \| undefined \| Promise<string \| undefined>` | Return validation error                       |
| `exportable`                  | `boolean`                                                                         | Exclude from CSV with false                   |
| `exportValue`                 | `(row: T) => unknown`                                                             | Export value override                         |
| `headerClass`                 | `string`                                                                          | Header classes                                |
| `cellClass`                   | `string \| ((row: T) => string \| undefined)`                                     | Cell classes                                  |

### Models {#models}

| Binding                  | Type                     | Default |
| ------------------------ | ------------------------ | ------- |
| `v-model:page`           | `number`                 | `1`     |
| `v-model:pageSize`       | `number`                 | `10`    |
| `v-model:sorting`        | `DataTableSort[]`        | `[]`    |
| `v-model:filter`         | `string`                 | `''`    |
| `v-model:columnFilters`  | `DataTableFilter[]`      | `[]`    |
| `v-model:grouping`       | `string[]`               | `[]`    |
| `v-model:selected`       | `DataTableKey[]`         | `[]`    |
| `v-model:expanded`       | `DataTableKey[]`         | `[]`    |
| `v-model:expandedGroups` | `string[]`               | `[]`    |
| `v-model:hiddenColumns`  | `string[]`               | `[]`    |
| `v-model:columnOrder`    | `string[]`               | `[]`    |
| `v-model:columnWidths`   | `Record<string, number>` | `{}`    |

`v-model:rows` is optional for root-row reordering; otherwise pass `rows` normally.

### Slots {#slots}

| Slot                  | Props                       | Description                   |
| --------------------- | --------------------------- | ----------------------------- |
| `cell-key / cell`     | `DataTableCellContext<T>`   | Data cells                    |
| `header-key / header` | `DataTableHeaderContext<T>` | Header content                |
| `editor-key / editor` | `DataTableEditorContext<T>` | Editing control               |
| `expansion`           | `DataTableRowContext<T>`    | Expanded detail               |
| `group`               | `DataTableGroupContext<T>`  | Group row                     |
| `footer-key`          | `{ column, rows: T[] }`     | Summary cell                  |
| `summary`             | `DataTableState<T>`         | Contents of tfoot             |
| `toolbar / footer`    | `DataTableState<T>`         | Toolbar and pagination footer |
| `empty / loading`     | `—`                         | Status content                |

`DataTableState<T>` contains the query, `total`, displayed original `rows`, `selected`, `expanded`, `visibleColumns` and `api`.

### Events {#events}

| Event            | Arguments                                      | Description                  |
| ---------------- | ---------------------------------------------- | ---------------------------- |
| `change`         | `DataTableQuery`                               | Query update                 |
| `rowClick`       | `(row: T, event: MouseEvent \| KeyboardEvent)` | Row activation               |
| `rowContextmenu` | `(row: T, event: MouseEvent)`                  | Context menu event           |
| `update:rows`    | `T[]`                                          | Reordered root array         |
| `rowReorder`     | `DataTableReorder<T>`                          | Root or sibling reorder      |
| `edit`           | `DataTableEdit<T>`                             | Successful edit              |
| `editError`      | `(error: unknown, edit: DataTableEdit<T>)`     | Save or validation exception |

### Instance {#instance}

The instance exposes `element: HTMLTableElement | undefined`, `viewport: HTMLElement | undefined`, `state: DataTableState<T>` and `api: DataTableApi<T>`. The same API is available in toolbar/footer slot props.

| Method                            | Returns         | Description                                        |
| --------------------------------- | --------------- | -------------------------------------------------- |
| `getRows(scope?)`                 | `T[]`           | page / filtered / selected / all; loaded data only |
| `toggleSelected(key, value?)`     | `void`          | Select a loaded row                                |
| `toggleExpanded(key, value?)`     | `void`          | Toggle row expansion                               |
| `setFilter(column, value)`        | `void`          | Set a column filter                                |
| `setColumnHidden(column, hidden)` | `void`          | Change visibility                                  |
| `setColumnWidth(column, width)`   | `void`          | Set a pixel width within bounds                    |
| `moveColumn(column, target)`      | `void`          | Move within a pinned region                        |
| `moveRow(key, target)`            | `void`          | Reorder eligible siblings                          |
| `startEdit(key, column?)`         | `void`          | Start cell or row editing                          |
| `cancelEdit()`                    | `void`          | Discard the draft                                  |
| `commitEdit()`                    | `Promise<void>` | Validate and save                                  |
| `scrollToRow(key)`                | `void`          | Scroll to a row in the displayed set               |
| `toCsv(options?)`                 | `string`        | Return CSV                                         |
| `exportCsv(options?)`             | `void`          | Download CSV                                       |

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
