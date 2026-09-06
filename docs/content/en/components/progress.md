---
title: Progress
description: A bar whose fill shows how much of a task is done.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/progress/Progress.vue
---

<Demo name="progress/hero" />

## Usage {#usage}

```ts
import { Progress } from '@hina-ui/vue'
```

`value` is the current progress and `max` the total, 100 by default. The bar fills in proportion to the two, and the fill length transitions smoothly when `value` changes.

<Demo name="progress/basic" />

## Examples {#examples}

### Label and value {#label}

`label` sits above the bar; `showValue` shows the percentage at the end of the same line.

<Demo name="progress/label" />

### Changing the value {#change}

When `value` changes the fill length transitions smoothly, whether it grows or shrinks, and the value text updates with it.

<Demo name="progress/change" />

### Value format {#format}

`format` receives the current value and the total and returns the text to show. The same text is what assistive technology reads as the value.

<Demo name="progress/format" />

### Sizes {#sizes}

Three heights, `md` by default: `sm` for compact places such as list rows, `lg` for a progress that stands on its own.

<Demo name="progress/sizes" />

### Tones {#tones}

`tone` sets the fill colour, the accent colour by default. Done, warning and failed states can switch to the matching semantic colour.

<Demo name="progress/tones" />

### Indeterminate {#indeterminate}

Leaving out `value` means the total is unknown: a segment of fill sweeps along the track repeatedly.

<Demo name="progress/indeterminate" />

## Behavior {#behavior}

- When `value` changes the fill length transitions smoothly, with duration and easing from the motion variables.
- An out-of-range `value` is clamped: below 0 counts as 0, above `max` counts as `max`.
- The indeterminate sweep takes its duration from the motion variables. When reduced motion is on the sweep stops and the segment rests in the middle of the track.

## Accessibility {#a11y}

- The track carries `role="progressbar"`, with `aria-valuenow`, `aria-valuemin` and `aria-valuemax` following `value` and `max`; an indeterminate bar has no `aria-valuenow`.
- The accessible name is `label` when given, otherwise the value text, and for an indeterminate bar the locale's "Loading".
- With `format` the result is also written to `aria-valuetext`, so assistive technology reads the formatted text rather than the raw number.

## API {#api}

### Props {#props}

| Prop        | Type                                                                    | Default    | Description                                   |
| ----------- | ----------------------------------------------------------------------- | ---------- | --------------------------------------------- |
| `value`     | `number \| null`                                                        | `null`     | Current progress; leave out for indeterminate |
| `max`       | `number`                                                                | `100`      | Total                                         |
| `label`     | `string`                                                                | —          | Label above the bar                           |
| `showValue` | `boolean`                                                               | `false`    | Whether to show the value text                |
| `format`    | `(value: number, max: number) => string`                                | percentage | Format of the value text                      |
| `tone`      | `'accent' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'accent'` | Fill colour                                   |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                  | `'md'`     | Height                                        |
| `class`     | `string`                                                                | —          | Extra classes on the root element             |

Other attributes fall through to the track element carrying `role="progressbar"`.
