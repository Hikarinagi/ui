---
title: MeterGroup
description: A segmented bar showing how parts make up a whole.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/meter-group/MeterGroup.vue
---

<Demo name="meter-group/hero" />

## Usage {#usage}

```ts
import { MeterGroup } from '@hina-ui/vue'
```

Each entry in `items` has a `label` and a `value`, and may set a `tone`; `max` is the total, 100 by default. The segments sit side by side on one track in proportion to their values, and the legend below lists each segment's label and value.

<Demo name="meter-group/basic" />

## Examples {#examples}

### Label and total {#label}

`label` sits above the track, with the sum of the segments at the end of the same line.

<Demo name="meter-group/label" />

### Changing values {#change}

When several values change at once, each segment's width transitions smoothly to its new share, and the legend updates with it.

<Demo name="meter-group/change" />

### Tones {#tones}

Segments without a `tone` take the accent, info, success, warning, danger and neutral colours in that order; a tone can also be set per segment.

<Demo name="meter-group/tones" />

### Value format {#format}

`format` receives a segment's value and the total and returns the text to show. The same text is what assistive technology reads as the value.

<Demo name="meter-group/format" />

### Sizes {#sizes}

Three heights, the same as Progress, `md` by default.

<Demo name="meter-group/sizes" />

### Without a legend {#legend}

Set `legend` to `false` to keep only the track.

<Demo name="meter-group/legend" />

## Behavior {#behavior}

- Segment widths transition smoothly when values change, with duration and easing from the motion variables.
- An out-of-range value is clamped: below 0 counts as 0, above `max` counts as `max`.
- When the segments add up to more than `max`, the excess is clipped by the track; each segment's value and width still correspond.

## Accessibility {#a11y}

- Each segment carries `role="meter"`, named by its `label`, with `aria-valuenow`, `aria-valuemin` and `aria-valuemax` following the value and `max`.
- The track carries `role="group"`, named by `label`.
- With `format` the result is also written to each segment's `aria-valuetext`.
- The dots in the legend are hidden from assistive technology; labels and values are plain text.

## API {#api}

### Props {#props}

| Prop     | Type                                     | Default    | Description                       |
| -------- | ---------------------------------------- | ---------- | --------------------------------- |
| `items`  | `MeterItem[]`                            | —          | Required. The segments            |
| `max`    | `number`                                 | `100`      | Total                             |
| `label`  | `string`                                 | —          | Label above the track             |
| `legend` | `boolean`                                | `true`     | Whether to show the legend        |
| `format` | `(value: number, max: number) => string` | percentage | Format of the value text          |
| `size`   | `'sm' \| 'md' \| 'lg'`                   | `'md'`     | Height                            |
| `class`  | `string`                                 | —          | Extra classes on the root element |

Other attributes fall through to the track element carrying `role="group"`.

### Types {#types}

| Field   | Type                                                                    | Description                              |
| ------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| `label` | `string`                                                                | Required. Label of the segment           |
| `value` | `number`                                                                | Required. Value of the segment           |
| `tone`  | `'accent' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | Colour of the segment, assigned in order |
