---
title: Table
description: Static data organised into rows and columns.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/table/Table.vue
  - label: Variants
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/table/table.variants.ts
---

<Demo name="table/hero" />

## Usage {#usage}

```ts
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'
```

A table is built from six components that mirror the structure of an HTML table: `Table` is the root, `TableHeader` and `TableBody` are the header and data sections, `TableRow` is a row, `TableHead` is a header cell and `TableCell` is a data cell. Every component except `Table`, `TableHead` and `TableCell` takes only `class`.

`Table` brings its own horizontal scroll container, so a wide table scrolls within the container instead of stretching the surrounding layout.

<Demo name="table/basic" />

The component only presents data. Sorting, filtering, pagination and row selection are not included — they require an agreed interface with the data source and belong to the data-grid component that comes later.

## Examples {#examples}

### Variants {#variants}

`primary` is a panel with its own background, border and shadow, suited to a table that stands on its own. `secondary` drops the border and shadow and keeps only the header background, suited to a table already inside a card or panel that needs no second container. The default is `primary`.

<Demo name="table/variants" />

### Alignment {#align}

`align` sets how cell content is aligned: `start`, `center` or `end`, defaulting to `start`. Numeric columns usually read better aligned to the end, and a header should be aligned the same way as the column below it.

Tabular figures are enabled, so digits in the same column share one width and never sit ragged.

<Demo name="table/align" />

### Caption {#caption}

`caption` renders a line of text above the table and serves as the table's accessible name. It stays visible at the start edge while the table scrolls horizontally.

<Demo name="table/caption" />

### Row hover {#hover}

Data rows raise a faint state layer on hover, which helps the eye stay on one row across a wide table. Set `hover` to `false` when the table lists fixed information and its rows are not interactive.

<Demo name="table/hover" />

### Row headers {#row-header}

When the first cell of a row names the row rather than holding data, use `TableHead` with `scope="row"` instead of `TableCell`. Screen readers then treat that cell as the heading for the whole row and announce it before the cells that follow.

<Demo name="table/row-header" />

### Sticky header {#sticky-header}

`sticky-header` pins the header row to the top of the container while the body scrolls. It needs a height limit to work, otherwise the table never scrolls vertically. With it on, the scroll container handles both axes.

<Demo name="table/sticky-header" />

### Sticky column {#sticky-column}

With many columns, add `sticky` to the `TableHead` and `TableCell` of the first column: it stays pinned to the start edge while the remaining columns slide underneath. A sticky column carries its own solid background and a dividing border, so nothing shows through it.

Both the header cell and the data cells of that column need `sticky` — setting it on only one of them makes the column drift out of line while scrolling.

<Demo name="table/sticky-column" />

### Density {#density}

Row height comes from the density tokens, so setting `data-density="compact"` on a container tightens the whole table without touching the table itself. Use it on information-dense list pages.

<Demo name="table/density" />

## Accessibility {#a11y}

- The structure uses native table elements, so screen readers can navigate by row and column and announce the current position.
- `scope` on `TableHead` defaults to `col`, declaring the cell as the header of its column; a row header must set it to `row` explicitly.
- `caption` is the table's accessible name. When a heading already precedes the table, repeat it here so assistive technology does not meet an unnamed table.
- Neither alignment nor row hover changes reading order.

## API {#api}

### Table {#props}

| Prop           | Type                       | Default     | Description                              |
| -------------- | -------------------------- | ----------- | ---------------------------------------- |
| `variant`      | `'primary' \| 'secondary'` | `'primary'` | Visual style                             |
| `hover`        | `boolean`                  | `true`      | Whether data rows raise a state layer    |
| `stickyHeader` | `boolean`                  | `false`     | Whether the header pins to the top edge  |
| `caption`      | `string`                   | —           | Table caption, also its accessible name  |
| `class`        | `string`                   | —           | Classes appended to the scroll container |

| Slot      | Description                                          |
| --------- | ---------------------------------------------------- |
| `default` | Table content, usually `TableHeader` and `TableBody` |

### TableHead {#head}

| Prop     | Type                           | Default   | Description                              |
| -------- | ------------------------------ | --------- | ---------------------------------------- |
| `scope`  | `'col' \| 'row'`               | `'col'`   | Whether the cell heads a column or a row |
| `align`  | `'start' \| 'center' \| 'end'` | `'start'` | Content alignment                        |
| `sticky` | `boolean`                      | `false`   | Whether it pins to the start edge        |
| `class`  | `string`                       | —         | Classes appended to the root             |

### TableCell {#cell}

| Prop     | Type                           | Default   | Description                       |
| -------- | ------------------------------ | --------- | --------------------------------- |
| `align`  | `'start' \| 'center' \| 'end'` | `'start'` | Content alignment                 |
| `sticky` | `boolean`                      | `false`   | Whether it pins to the start edge |
| `class`  | `string`                       | —         | Classes appended to the root      |

### TableHeader, TableBody and TableRow {#structure}

These render `thead`, `tbody` and `tr` respectively. Each takes only `class` and receives its content through the default slot.
