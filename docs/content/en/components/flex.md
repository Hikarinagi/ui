---
title: Flex
description: A flex container with full control over direction, alignment and distribution.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/flex/Flex.vue
---

<Demo name="flex/hero" />

## Usage {#usage}

```ts
import { Flex } from '@hina-ui/vue'
```

Flex exposes all four flex properties: `direction`, `align`, `justify` and `wrap`. Stack and Inline are shorter where the direction is fixed; Flex is for switching direction or for full control over alignment.

<Demo name="flex/basic" />

## Examples {#examples}

### Direction {#direction}

`direction` takes four values and defaults to a row.

<Demo name="flex/direction" />

### Gap {#gap}

`gap` takes steps rather than arbitrary values. The `md` step follows the direction: a row takes `--hn-inline-gap` and a column `--hn-stack-gap`, so the spacing needs no adjustment when the direction changes. The other steps are the same either way: 0, 4, 8, 24 and 32 pixels.

<Demo name="flex/gap" />

### Alignment and distribution {#alignment}

`align` works on the cross axis and `justify` on the main one. In a row `align` is vertical and `justify` horizontal; in a column they swap.

<Demo name="flex/alignment" />

### Wrapping {#wrap}

Left unset, `wrap` does not wrap, which is what flex does on its own. Inline wraps by default; Flex makes no such assumption.

<Demo name="flex/wrap" />

### Following breakpoints {#responsive}

When the direction or alignment differs between breakpoints, override it with Tailwind classes such as `sm:flex-row`. The props themselves do not take responsive objects.

<Demo name="flex/responsive" />

## API {#api}

| Prop        | Type                                                                | Default | Description                       |
| ----------- | ------------------------------------------------------------------- | ------- | --------------------------------- |
| `direction` | `'row' \| 'col' \| 'row-reverse' \| 'col-reverse'`                  | `'row'` | Main-axis direction               |
| `gap`       | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                    | —       | Space between the children        |
| `align`     | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'`           | —       | Cross-axis alignment              |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | —       | Main-axis distribution            |
| `wrap`      | `boolean`                                                           | —       | Whether children wrap             |
| `as`        | `string`                                                            | `'div'` | The rendered tag                  |
| `class`     | `string`                                                            | —       | Classes appended to the container |

| Slot      | Description  |
| --------- | ------------ |
| `default` | The children |
