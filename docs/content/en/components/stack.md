---
title: Stack
description: Lays its children out in a single column.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/stack/Stack.vue
  - label: Inline
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/inline/Inline.vue
---

<Demo name="stack/hero" />

## Usage {#usage}

```ts
import { Stack } from '@hina-ui/vue'
```

Stack is a vertical flex container: its children run down the page, spaced by `gap`.

<Demo name="stack/basic" />

## Examples {#examples}

### Gap {#gap}

`gap` takes steps rather than arbitrary values. The default `md` comes from `--hn-stack-gap`, which is 16 pixels at the regular density and 12 at the compact one; the other five steps are 0, 4, 8, 24 and 32 pixels.

<Demo name="stack/gap" />

### Cross-axis alignment {#align}

`align` decides how the children line up horizontally. Left unset, they stretch to the width of the container, which is what flex does on its own.

<Demo name="stack/align" />

### Main-axis distribution {#justify}

`justify` decides how the children are distributed vertically, which shows only once the container has a height of its own. `between` pushes the first and last to the ends.

<Demo name="stack/justify" />

### Element {#as}

`as` changes the rendered tag; use `ul` or `ol` for a list.

<Demo name="stack/as" />

## API {#api}

| Prop      | Type                                                                | Default | Description                       |
| --------- | ------------------------------------------------------------------- | ------- | --------------------------------- |
| `gap`     | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                    | `'md'`  | Space between the children        |
| `align`   | `'start' \| 'center' \| 'end' \| 'stretch'`                         | —       | Cross-axis alignment              |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | —       | Main-axis distribution            |
| `as`      | `string`                                                            | `'div'` | The rendered tag                  |
| `class`   | `string`                                                            | —       | Classes appended to the container |

| Slot      | Description  |
| --------- | ------------ |
| `default` | The children |
