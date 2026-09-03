---
title: Grid
description: A grid container laying its children out in a fixed number of columns.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/grid/Grid.vue
---

<Demo name="grid/hero" />

## Usage {#usage}

```ts
import { Grid } from '@hina-ui/vue'
```

`cols` is the number of columns, from 1 to 12. Children fill the cells in order and move to the next row once one is full.

<Demo name="grid/basic" />

## Examples {#examples}

### Columns {#cols}

<Demo name="grid/cols" />

### Gap {#gap}

`gap` takes steps rather than arbitrary values. The default `md` differs by axis: `--hn-inline-gap` between columns and `--hn-stack-gap` between rows, which is 12 and 16 pixels at the regular density. The other steps are the same on both axes: 0, 4, 8, 24 and 32 pixels.

<Demo name="grid/gap" />

### Spanning columns {#span}

To have a child cover several columns, put Tailwind's `col-span-*` on the child. Grid has no column component of its own.

<Demo name="grid/span" />

### Following breakpoints {#responsive}

When the column count differs between breakpoints, override it with Tailwind classes such as `sm:grid-cols-4`. The `cols` prop itself does not take responsive objects.

<Demo name="grid/responsive" />

## API {#api}

| Prop    | Type                                             | Default | Description                       |
| ------- | ------------------------------------------------ | ------- | --------------------------------- |
| `cols`  | `1` to `12`                                      | `1`     | Number of columns                 |
| `gap`   | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | Space between cells               |
| `as`    | `string`                                         | `'div'` | The rendered tag                  |
| `class` | `string`                                         | —       | Classes appended to the container |

| Slot      | Description  |
| --------- | ------------ |
| `default` | The children |
