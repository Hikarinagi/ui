---
title: Slider
description: Picks a number within a range by dragging.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/slider/Slider.vue
  - label: Slider
    href: https://reka-ui.com/docs/components/slider
---

<Demo name="slider/hero" />

## Usage {#usage}

```ts
import { Slider } from '@hina-ui/vue'
```

The slider picks a number between `min` and `max`, bound with `v-model`. The value updates continuously while dragging, and `commit` fires once on release. Attributes it does not declare land on the thumb, so name it with `aria-label` or `aria-labelledby`. Width belongs to the layout; the slider fills its container.

<Demo name="slider/basic" />

## Examples {#examples}

### Range and step {#step}

`min`, `max` and `step` set the range and granularity; the arrow keys move by `step` too.

<Demo name="slider/step" />

### Marks {#marks}

`marks` places ticks on the track; a mark with a `label` shows its text underneath.

<Demo name="slider/marks" />

### Value label {#label}

The value label is a `Tooltip` with the thumb as its trigger: it follows the thumb and flips to the other side near the viewport edge. By default the current value shows on hover, focus and while dragging; `label="always"` keeps it visible and `label="none"` removes it. `format` customises the text, which defaults to the number formatted for the current language. Like the `IconButton` hint it needs a `TooltipProvider` in the app, and stays hidden without one.

<Demo name="slider/label" />

### Sizes {#sizes}

`size` is `sm`, `md` or `lg`; the track is 20, 24 or 28 pixels tall and the thumb 12, 16 or 20, the same as `Switch`.

<Demo name="slider/sizes" />

### States {#states}

`disabled` disables the whole slider.

<Demo name="slider/states" />

### Commit on release {#commit}

`commit` fires only when a drag or a key press ends, which suits expensive work such as sending a request.

<Demo name="slider/commit" />

## Behaviour {#behavior}

- Clicking anywhere on the track jumps the thumb there and starts dragging; while dragging the thumb and the fill follow the pointer without a transition, and jumps from clicks or keys are eased.
- Tab lands on the thumb; the left and right arrows move by `step`, PageUp / PageDown move by a larger step, Home / End jump to the ends.
- Hovering anywhere on the slider inks the thumb and fades the value label in; the ink deepens while dragging.

## Accessibility {#a11y}

- The thumb is `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-orientation`.
- Name the thumb with `aria-label` or `aria-labelledby`; marks are hidden from screen readers, which read `aria-valuenow`; while shown, the value label is the thumb's `aria-describedby`.

## API {#api}

### Props {#props}

| Prop         | Type                                       | Default  | Description                                          |
| ------------ | ------------------------------------------ | -------- | ---------------------------------------------------- |
| `modelValue` | `number`                                   | —        | The current value, `min` when unbound                |
| `min`        | `number`                                   | `0`      | Minimum                                              |
| `max`        | `number`                                   | `100`    | Maximum                                              |
| `step`       | `number`                                   | `1`      | Step                                                 |
| `marks`      | `Array<{ value: number; label?: string }>` | —        | Ticks                                                |
| `label`      | `'auto' \| 'always' \| 'none'`             | `'auto'` | How the value label shows                            |
| `format`     | `(value: number) => string`                | —        | Text of the value label, locale-formatted by default |
| `size`       | `'sm' \| 'md' \| 'lg'`                     | `'md'`   | Size                                                 |
| `disabled`   | `boolean`                                  | `false`  | Whether the slider is disabled                       |
| `class`      | `string`                                   | —        | Classes appended to the root element                 |

### Events {#events}

| Event               | Payload         | Description                                    |
| ------------------- | --------------- | ---------------------------------------------- |
| `update:modelValue` | `value: number` | The value changed, continuously while dragging |
| `commit`            | `value: number` | A drag or a key press ended                    |
