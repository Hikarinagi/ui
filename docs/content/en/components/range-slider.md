---
title: RangeSlider
description: Picks a range within bounds with two thumbs.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/range-slider/RangeSlider.vue
  - label: Slider
    href: https://reka-ui.com/docs/components/slider
---

<Demo name="range-slider/hero" />

## Usage {#usage}

```ts
import { RangeSlider } from '@hina-ui/vue'
```

The range slider has two thumbs; `v-model` binds a `[start, end]` pair and the fill covers the span between them. Track, thumbs and value labels are the same as `Slider`. Attributes it does not declare land on the root, so name the group with `aria-label` or `aria-labelledby`; the thumbs carry "Minimum" and "Maximum" names of their own.

<Demo name="range-slider/basic" />

## Examples {#examples}

### Marks {#marks}

`marks` works as in `Slider`; `step` decides where the thumbs land.

<Demo name="range-slider/marks" />

### Minimum gap {#min-steps}

`minSteps` keeps the thumbs at least that many steps apart, whether dragging or pressing keys.

<Demo name="range-slider/min-steps" />

### Value labels {#label}

Each thumb has its own value label; `label` and `format` work as in `Slider`.

<Demo name="range-slider/label" />

### Sizes {#sizes}

<Demo name="range-slider/sizes" />

### States {#states}

<Demo name="range-slider/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the slider group through `aria-labelledby`, and the description and error message are rendered by the field; validation rules and submission belong to the [Form](/components/form). The value is a pair, so a rule about the width of the range goes on the pair.

<Demo name="range-slider/form" />

## Behaviour {#behavior}

- Clicking the track moves the nearer thumb there; dragging moves only the thumb being held, and the thumbs never cross.
- Tab lands on each thumb in turn; the arrow keys move only the focused one.
- The value updates continuously while dragging, and `commit` fires once on release.

## Accessibility {#a11y}

- The root is `role="group"`, named with `aria-label` or `aria-labelledby`; both thumbs are `role="slider"`, named "Minimum" and "Maximum" from the locale, with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.

## API {#api}

### Props {#props}

| Prop         | Type                                       | Default      | Description                                |
| ------------ | ------------------------------------------ | ------------ | ------------------------------------------ |
| `modelValue` | `[number, number]`                         | `[min, max]` | Start and end                              |
| `min`        | `number`                                   | `0`          | Minimum                                    |
| `max`        | `number`                                   | `100`        | Maximum                                    |
| `step`       | `number`                                   | `1`          | Step                                       |
| `minSteps`   | `number`                                   | `0`          | Minimum number of steps between the thumbs |
| `marks`      | `Array<{ value: number; label?: string }>` | —            | Ticks                                      |
| `label`      | `'auto' \| 'always' \| 'none'`             | `'auto'`     | How the value labels show                  |
| `format`     | `(value: number) => string`                | —            | Text of the value labels                   |
| `size`       | `'sm' \| 'md' \| 'lg'`                     | `'md'`       | Size                                       |
| `disabled`   | `boolean`                                  | `false`      | Whether the slider is disabled             |
| `class`      | `string`                                   | —            | Classes appended to the root element       |

### Events {#events}

| Event               | Payload                   | Description                                    |
| ------------------- | ------------------------- | ---------------------------------------------- |
| `update:modelValue` | `value: [number, number]` | The value changed, continuously while dragging |
| `commit`            | `value: [number, number]` | A drag or a key press ended                    |
