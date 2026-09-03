---
title: Inline
description: Lays its children out in a row, wrapping when they run out of room.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/inline/Inline.vue
---

<Demo name="inline/hero" />

## Usage {#usage}

```ts
import { Inline } from '@hina-ui/vue'
```

Inline is a horizontal flex container: its children sit centred on the cross axis and wrap when they run out of room.

<Demo name="inline/basic" />

## Examples {#examples}

### Gap {#gap}

`gap` takes steps rather than arbitrary values. The default `md` comes from `--hn-inline-gap`, which is 12 pixels at the regular density and 8 at the compact one; the other five steps are 0, 4, 8, 24 and 32 pixels.

<Demo name="inline/gap" />

### Cross-axis alignment {#align}

`align` decides how the children line up vertically; the default is centred. Use `baseline` when the text sizes differ, so the baselines line up instead of the boxes.

<Demo name="inline/align" />

### Main-axis distribution {#justify}

`justify` decides how the children are distributed horizontally. `between` pushes the first and last to the ends, which is how a heading row with a trailing button is written.

<Demo name="inline/justify" />

### Wrapping {#wrap}

`wrap` defaults to true. Set it to false to keep everything on one line, together with overflow handling on the container around it.

<Demo name="inline/wrap" />

### Element {#as}

`as` changes the rendered tag; use `nav` for navigation.

<Demo name="inline/as" />

## API {#api}

| Prop      | Type                                                                | Default    | Description                       |
| --------- | ------------------------------------------------------------------- | ---------- | --------------------------------- |
| `gap`     | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                    | `'md'`     | Space between the children        |
| `align`   | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'`           | `'center'` | Cross-axis alignment              |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | —          | Main-axis distribution            |
| `wrap`    | `boolean`                                                           | `true`     | Whether children wrap             |
| `as`      | `string`                                                            | `'div'`    | The rendered tag                  |
| `class`   | `string`                                                            | —          | Classes appended to the container |

| Slot      | Description  |
| --------- | ------------ |
| `default` | The children |
