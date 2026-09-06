---
title: RingProgress
description: A ring whose arc shows how much of a task is done.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/ring-progress/RingProgress.vue
---

<Demo name="ring-progress/hero" />

## Usage {#usage}

```ts
import { RingProgress } from '@hina-ui/vue'
```

`value` and `max` mean the same as in [Progress](/components/progress); the arc is drawn clockwise from the top in proportion to the two. The centre is empty by default, and `showValue` shows the percentage there.

<Demo name="ring-progress/basic" />

## Examples {#examples}

### Centre content {#center}

The default slot replaces the centre content, for example an icon once done, or use `format` to rewrite the value text.

<Demo name="ring-progress/center" />

### Label {#label}

`label` sits below the ring.

<Demo name="ring-progress/label" />

### Changing the value {#change}

When `value` changes the arc length transitions smoothly, whether it grows or shrinks.

<Demo name="ring-progress/change" />

### Sizes {#sizes}

Three diameters, `md` by default. The ring thickness and the centre text scale with the diameter.

<Demo name="ring-progress/sizes" />

### Tones {#tones}

`tone` sets the arc colour, the accent colour by default.

<Demo name="ring-progress/tones" />

### Indeterminate {#indeterminate}

Leaving out `value` means the total is unknown: a quarter-length arc spins around the ring.

<Demo name="ring-progress/indeterminate" />

## Behavior {#behavior}

- The arc is drawn clockwise from the top with round ends; nothing is drawn when `value` is 0.
- When `value` changes the arc length transitions smoothly, with duration and easing from the motion variables; an out-of-range `value` is clamped.
- The indeterminate spin runs at the same pace as Spinner. When reduced motion is on the spin stops and the arc stays visible.

## Accessibility {#a11y}

- The ring carries `role="progressbar"`, with `aria-valuenow`, `aria-valuemin` and `aria-valuemax` following `value` and `max`; an indeterminate ring has no `aria-valuenow`.
- The accessible name is `label` when given, otherwise the value text, and for an indeterminate ring the locale's "Loading".
- With `format` the result is also written to `aria-valuetext`.
- The drawing itself is hidden from assistive technology; the centre content remains readable.

## API {#api}

### Props {#props}

| Prop        | Type                                                                    | Default    | Description                                   |
| ----------- | ----------------------------------------------------------------------- | ---------- | --------------------------------------------- |
| `value`     | `number \| null`                                                        | `null`     | Current progress; leave out for indeterminate |
| `max`       | `number`                                                                | `100`      | Total                                         |
| `label`     | `string`                                                                | —          | Label below the ring                          |
| `showValue` | `boolean`                                                               | `false`    | Whether to show the value text in the centre  |
| `format`    | `(value: number, max: number) => string`                                | percentage | Format of the value text                      |
| `tone`      | `'accent' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'accent'` | Arc colour                                    |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                  | `'md'`     | Diameter                                      |
| `class`     | `string`                                                                | —          | Extra classes on the root element             |

Other attributes fall through to the ring element carrying `role="progressbar"`.

### Slots {#slots}

| Slot    | Description                                     |
| ------- | ----------------------------------------------- |
| default | Centre content, the `showValue` text by default |
