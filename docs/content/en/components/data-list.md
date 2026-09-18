---
title: DataList
description: Structured list and card views with coordinated pagination, loading, and empty states.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/data-list/DataList.vue
---

<Demo name="data-list/hero" />

## Usage {#usage}

DataList provides media, title, description, metadata, and action regions. The same content adapts between horizontal rows and vertical cards, with pagination, placeholders, and empty states managed together. Rows retain list semantics without implicit selection or click behavior. Use [DataTable](/components/data-table) when you need headers and aligned columns.

Pass `items`, a unique stable `itemKey`, and `itemTitle` for a basic list. Title and description fields also accept functions.

```vue
<DataList :items="items" item-key="id" item-title="name" item-description="description" />
```

Add `#media`, `#title`, `#description`, `#meta`, and `#actions` as needed. Each receives `{ item, index, key, layout }` with the full item type. With pagination, `index` includes the page offset. The default slot replaces the entire item while retaining the list container, pagination, and state handling.

Examples use a snapshot of public works from [Hikarinagi](https://www.hikarinagi.org), retrieved on 2026-09-18, including names, developers, release dates, and covers. Detail links lead to the original entries. Pagination, filtering, and remote pagination use 1,000 distinct items; virtual scrolling uses 5,000. Layout examples show a small selection. Covers use [Image](/components/image), actions use [Button](/components/button), and truncated text uses [Tooltip](/components/tooltip).

## Examples {#examples}

### Item structure and layout {#layout}

Enable `layout-toggle` for the built-in layout control, or use `v-model:layout` and the state slot's `setLayout`. Switching layouts preserves item nodes that remain within the rendered range.

List media sits before the text. Actions appear after the text in wide containers and below it in narrow containers. Cards place media above the text and actions at the bottom. Titles and descriptions wrap without a line limit; metadata wraps too. Use [Text](/components/text) in the corresponding slot when truncation is needed.

`mediaRatio` sets the media aspect ratio for both layouts. Without it, lists use a square and cards use 16:10. `gridMin` sets the preferred minimum card width, falling back to one column in narrower containers; `gridGap` controls spacing. This example customizes titles with [Link](/components/link) and actions with [Toggle](/components/toggle).

<Demo name="data-list/layout" />

### Local pagination {#pagination}

Enable `pagination` and pass the full array. DataList slices the current page and renders [Pagination](/components/pagination). Control the page and page size with `v-model:page` and `v-model:page-size`. If removing items leaves the page out of bounds, it returns to the last valid page. Default pagination hides when there is only one page or no data; a custom `#pagination` slot remains visible.

`#footer` shares the bottom row with pagination and wraps when space is limited. Changing pages resets only the list’s own scroll position, preserving ancestor scroll positions.

State slots expose `setPage` and `setPageSize`, respecting loading and page boundaries. Changing page size returns to page one. The example uses [Select](/components/select).

<Demo name="data-list/pagination" />

### Filtering and sorting {#filter}

Compute filtered and sorted `items` outside the component, and reset the page when the query changes. This example combines [SearchInput](/components/search-input) and [Select](/components/select).

<Demo name="data-list/filter" />

### Remote pagination {#remote}

With `manual` and `pagination`, `items` contains the server's current page and is never sliced again. Provide `total` for full pagination. If it is unknown, omit it and provide `hasNextPage`; navigation shows previous, next, and the current page.

This example fetches static JSON page snapshots and works on static hosting. It does not query the live catalog or insert an artificial delay. [Switch](/components/switch) controls whether the total is known. Existing items remain during requests, stale requests are canceled, and failures show an [Empty](/components/empty) state with a retry action.

<Demo name="data-list/remote" />

### Loading and empty states {#states}

Initial loading uses [Skeleton](/components/skeleton) matching the item structure. `placeholderCount` controls the count. Only configured content regions get placeholders. Virtualized lists default to 3 placeholders; ordinary paginated lists default to the page size. When replacing whole items, use `#placeholder="{ index, layout }"` for matching placeholders without fabricating business data.

When items already exist, `loading` preserves them, blocks item interaction and pagination, and displays a delayed [LoadingOverlay](/components/loading-overlay). `#loading` replaces the entire initial loading region and the refresh indicator. Use `#empty` or `emptyText` to customize the empty state.

`minHeight` reserves a minimum body height. Auto-height lists preserve the previous height when items are cleared during loading. `height` fixes the body height and uses [ScrollArea](/components/scroll-area) for overflow.

<Demo name="data-list/states" />

### Custom pagination {#custom-pagination}

`#pagination` receives the same state and actions as the header and footer, allowing additional [Pagination](/components/pagination) options.

```vue
<DataList :items="items" item-key="id" item-title="name" pagination>
  <template #pagination="{ page, pageSize, total, loading, setPage, setPageSize }">
    <Pagination
      :model-value="page"
      :page-size="pageSize"
      :total="total ?? 0"
      :pending="loading"
      :page-size-options="[10, 20, 50]"
      show-info
      @change="value => value.pageSize === pageSize ? setPage(value.page) : setPageSize(value.pageSize)"
    />
  </template>
</DataList>
```

### Virtual scrolling {#virtual}

`virtualize` supports both layouts using the same windowing foundation as [VirtualList](/components/virtual-list). Grids virtualize entire rows using the tallest item in each row. Column count follows the container width. `estimateSize` estimates one list row or a full grid row; `overscan` retains extra rows before and after the visible range. Row heights are measured after rendering.

`height` sets the viewport height and defaults to 320px when virtualized. Percentage heights require a parent with a defined height. With pagination, only the current page is virtualized. Keep persistent item state outside the component, keyed by ID.

This example uses 5,000 distinct real entries, supports both layouts, and reports the visible range. Only the current window and overscan rows are rendered.

<Demo name="data-list/virtual" />

## SSR {#ssr}

Lists, cards, pagination, and initial skeletons render on the server. Virtualized views render a readable initial window, then measure the viewport and rows after mounting. A client-only wrapper is unnecessary.

Use `initialColumns` to estimate a virtual grid's server column count; the default is 1. Server and client initial values must agree. CSS and container width determine the actual columns. Items beyond the initial virtual window render as the user scrolls.

## API {#api}

### Props {#props}

| Prop                            | Type                                                                   | Default              | Description                                                |
| ------------------------------- | ---------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------- |
| `items`                         | `readonly T[]`                                                         | Required             | Full array, or the current page in manual mode             |
| `itemKey`                       | Key field or `(item, index) => string \| number`                       | Required             | Unique, stable key                                         |
| `itemTitle` / `itemDescription` | Text field or `(item, index) => string \| number \| null \| undefined` | —                    | Title and description; corresponding slots take precedence |
| `mediaRatio`                    | `number`                                                               | —                    | Media aspect ratio                                         |
| `layoutToggle`                  | `boolean`                                                              | `false`              | Show the layout control                                    |
| `gridMin`                       | `string`                                                               | `'14rem'`            | Preferred minimum grid column width                        |
| `gridGap`                       | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                       | `'md'`               | Grid spacing                                               |
| `size`                          | `'sm' \| 'md' \| 'lg'`                                                 | `'md'`               | List media size, item spacing, and card padding            |
| `divided`                       | `boolean`                                                              | `true`               | List dividers                                              |
| `pagination`                    | `boolean`                                                              | `false`              | Show pagination                                            |
| `manual`                        | `boolean`                                                              | `false`              | Do not slice the current page                              |
| `total`                         | `number`                                                               | —                    | Remote total; local mode uses array length                 |
| `hasNextPage`                   | `boolean`                                                              | `false`              | Whether another unknown-total page exists                  |
| `loading`                       | `boolean`                                                              | `false`              | Loading state; block content interaction and paging        |
| `placeholderCount`              | `number`                                                               | `3` or page size     | Initial skeleton count                                     |
| `emptyText`                     | `string`                                                               | Locale               | Default empty text                                         |
| `label`                         | `string`                                                               | —                    | Accessible list and scroll region name                     |
| `virtualize`                    | `boolean \| DataListVirtualOptions`                                    | `false`              | Virtualize lists or grids                                  |
| `height`                        | `number \| string`                                                     | Auto; virtual: `320` | Fixed body height                                          |
| `minHeight`                     | `number \| string`                                                     | `160`                | Minimum body height without a fixed height                 |
| `class`                         | `string`                                                               | —                    | Root classes                                               |
| `bodyClass`                     | `string`                                                               | —                    | Body frame, including loading and empty states             |
| `contentClass`                  | `string`                                                               | —                    | Item list container in every layout and rendering mode     |
| `itemClass`                     | `string \| ((item, index) => string \| undefined)`                     | —                    | Individual item classes                                    |

`DataListVirtualOptions` includes `estimateSize` (112px for lists, 280px for grids), `overscan` (3 rows), and `initialColumns` (1). Other attributes, including `dir` and `style`, forward to the root.

### Models {#models}

| Model      | Type               | Default  |
| ---------- | ------------------ | -------- |
| `layout`   | `'list' \| 'grid'` | `'list'` |
| `page`     | `number`           | `1`      |
| `pageSize` | `number`           | `10`     |

### Slots {#slots}

| Slot                                                   | Parameters            | Description                                       |
| ------------------------------------------------------ | --------------------- | ------------------------------------------------- |
| `media` / `title` / `description` / `meta` / `actions` | `DataListItemSlot<T>` | Structured item regions                           |
| `default`                                              | `DataListItemSlot<T>` | Replace the entire item                           |
| `placeholder`                                          | `{ index, layout }`   | One initial skeleton                              |
| `header` / `footer`                                    | `DataListState<T>`    | Above the list / beside pagination in the footer  |
| `pagination`                                           | `DataListState<T>`    | Replace pagination                                |
| `empty`                                                | `DataListState<T>`    | Non-loading empty state                           |
| `loading`                                              | `DataListState<T>`    | Entire initial loading region / refresh indicator |

`DataListState<T>` includes current-page `items`, `page`, `pageSize`, `total`, `pageCount`, `layout`, `loading`, `refreshing`, `hasPreviousPage`, `hasNextPage`, `setPage(page)`, `setPageSize(size)`, and `setLayout(layout)`. Unknown totals leave `total` and `pageCount` undefined.

### Events and instance {#events}

| Name                             | Parameters / type                                                           | Description                                                       |
| -------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `pageChange`                     | `{ page, pageSize }`                                                        | Paging actions or boundary corrections                            |
| `rangeChange`                    | `{ startIndex, endIndex }`                                                  | Visible virtual range, including page offset; -1 when unavailable |
| `viewport`                       | `HTMLElement \| undefined`                                                  | Scroll container when height or virtualization is enabled         |
| `scrollToIndex(index, options?)` | `align?: 'start' \| 'center' \| 'end' \| 'auto'; behavior?: ScrollBehavior` | Scroll to an item within the current page, using its global index |

`scrollToIndex` scrolls only the internal viewport when one exists. Without an internal viewport, this explicit call scrolls ancestors to bring the target item into view.

Direct model changes do not emit `pageChange` again; watch the models for remote requests. Public data types are exported from the package root, including `DataListProps<T>`, `DataListItemSlot<T>`, `DataListState<T>`, `DataListVirtualOptions`, and `DataListExpose`.
