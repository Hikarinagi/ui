---
title: SimpleGrid
description: An even grid whose column count follows a minimum column width.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/simple-grid/SimpleGrid.vue
---

<Demo name="simple-grid/hero" />

## Usage {#usage}

```ts
import { SimpleGrid } from '@hina-ui/vue'
```

`min` is the smallest a column may be; the container fits as many equal columns as it can. The count follows the width of the container, so no breakpoints are needed. Use Grid where the count is fixed.

<Demo name="simple-grid/basic" />

## Examples {#examples}

### Minimum column width {#min}

`min` takes any CSS length and defaults to `14rem`. The larger it is, the fewer columns fit in the same container.

<Demo name="simple-grid/min" />

### Filling the row {#fit}

Tracks are laid out with `auto-fill` by default: the container divides into as many columns as it can hold, and empty tracks remain on the right when there are too few children. Setting `fit` switches to `auto-fit`, where empty tracks collapse and the children present share the whole row.

<Demo name="simple-grid/fit" />

### Gap {#gap}

`gap` behaves as it does in Grid: the `md` step is 12 pixels between columns and 16 between rows, and every other step is the same on both axes.

## API {#api}

| Prop    | Type                                             | Default   | Description                       |
| ------- | ------------------------------------------------ | --------- | --------------------------------- |
| `min`   | `string`                                         | `'14rem'` | Smallest width of a column        |
| `fit`   | `boolean`                                        | `false`   | Whether empty tracks collapse     |
| `gap`   | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`    | Space between cells               |
| `as`    | `string`                                         | `'div'`   | The rendered tag                  |
| `class` | `string`                                         | —         | Classes appended to the container |

| Slot      | Description  |
| --------- | ------------ |
| `default` | The children |
