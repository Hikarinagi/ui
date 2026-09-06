---
title: TimeField
description: Types a time segment by segment.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/time-field/TimeField.vue
  - label: TimeField
    href: https://reka-ui.com/docs/components/time-field
---

<Demo name="time-field/hero" />

## Usage {#usage}

```ts
import { TimeField } from '@hina-ui/vue'
```

The time field splits a time into hour and minute segments. Each segment accepts digits only, moves on to the next once it is complete, and the up and down arrow keys step it. `v-model` binds an `HH:mm` string, or `HH:mm:ss` at second precision, the same shape as the browser's native time input. Segment order, separators and placeholders follow the current locale, and 12-hour locales add an AM/PM segment. Attributes it does not declare land on the group element that wraps the segments, so name it with `aria-label` or `aria-labelledby`.

<Demo name="time-field/basic" />

## Examples {#examples}

### Granularity {#granularity}

`granularity` sets the precision: the default `minute` has hour and minute, `second` adds seconds and `hour` has the hour only. `hourCycle` picks the 12 or 24 hour clock, defaulting to the locale.

<Demo name="time-field/granularity" />

### Minute step {#step}

`minuteStep` steps the minute segment by a fixed amount and snaps typed minutes to the nearest step, for slots planned by the quarter or half hour.

<Demo name="time-field/step" />

### Range {#range}

`min` and `max` bound the accepted range; a value outside it shows as invalid but is still emitted. `placeholder` sets the time the segments start from while the field is empty, the current time by default.

<Demo name="time-field/range" />

### Clearable {#clearable}

`clearable` adds a button at the end that empties the value to `null` and returns focus to the first segment.

<Demo name="time-field/clearable" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`, matching the input of the same step in height.

<Demo name="time-field/sizes" />

### States {#states}

`invalid` gives the field a warning color, `disabled` disables the group and `readonly` keeps it focusable but not editable. `variant="secondary"` is the flat form used inside a surface.

<Demo name="time-field/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the whole time input through `aria-labelledby`, and the error message is rendered by the field; validation rules and submission belong to the [Form](/components/form). The value is an `HH:mm` string, so it can be compared as a string.

<Demo name="time-field/form" />

## Behavior {#behavior}

- Clicking a segment starts typing; a click on the blank area focuses the first empty segment.
- Each segment accepts digits only and moves on once complete; the left and right arrow keys move between segments, up and down step the value and Backspace clears the current segment.
- A value is emitted only when every segment is filled; clearing any segment makes the value `null`.
- Values outside `min` or `max` are still emitted and marked invalid.

## Accessibility {#a11y}

- Segments are `role="spinbutton"` with localized names and current values; separators are hidden from assistive technology.
- Name the group with `aria-label` or `aria-labelledby`.
- `invalid` and out-of-range values both set `aria-invalid` on the group element.

## API {#api}

### Props {#props}

| Prop          | Type                             | Default      | Description                                        |
| ------------- | -------------------------------- | ------------ | -------------------------------------------------- |
| `modelValue`  | `string \| null`                 | `null`       | An `HH:mm` string, `HH:mm:ss` at second precision  |
| `placeholder` | `string`                         | Current time | Where the segments start from while empty, `HH:mm` |
| `min`         | `string`                         | —            | Lower bound of the accepted range                  |
| `max`         | `string`                         | —            | Upper bound of the accepted range                  |
| `granularity` | `'hour' \| 'minute' \| 'second'` | `'minute'`   | Precision                                          |
| `hourCycle`   | `12 \| 24`                       | Locale       | Hour cycle                                         |
| `minuteStep`  | `number`                         | —            | Step of the minute segment                         |
| `clearable`   | `boolean`                        | `false`      | Whether the clear button is shown                  |
| `readonly`    | `boolean`                        | `false`      | Whether the field is read only                     |
| `name`        | `string`                         | —            | Form field name                                    |
| `variant`     | `'primary' \| 'secondary'`       | `'primary'`  | Variant                                            |
| `size`        | `'sm' \| 'md' \| 'lg'`           | `'md'`       | Size                                               |
| `disabled`    | `boolean`                        | `false`      | Whether the field is disabled                      |
| `invalid`     | `boolean`                        | `false`      | Whether validation failed                          |
| `class`       | `string`                         | —            | Classes appended to the root element               |

### Slots {#slots}

| Slot       | Description                    |
| ---------- | ------------------------------ |
| `leading`  | Content of the leading square  |
| `trailing` | Content of the trailing square |

### Events {#events}

| Event               | Payload                 | Description           |
| ------------------- | ----------------------- | --------------------- |
| `update:modelValue` | `value: string \| null` | The value changed     |
| `clear`             | —                       | The clear was clicked |
