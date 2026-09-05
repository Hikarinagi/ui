---
title: DateRangeField
description: Types a start and an end date segment by segment.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/date-range-field/DateRangeField.vue
  - label: DateRangeField
    href: https://reka-ui.com/docs/components/date-range-field
---

<Demo name="date-range-field/hero" />

## Usage {#usage}

```ts
import { DateRangeField } from '@hina-ui/vue'
```

The date range field puts a start and an end set of date segments in one field, separated by a dash. Each segment accepts digits only and moves on once complete, and finishing the start date moves straight into the end date. `v-model` binds a `{ start, end }` object whose fields are ISO 8601 strings in the same shape as `DateField`; with only one side filled the other is `null`, and with both sides empty the whole value is `null`. Attributes it does not declare land on the group element that wraps the segments, so name it with `aria-label` or `aria-labelledby`.

<Demo name="date-range-field/basic" />

## Examples {#examples}

### Date and time {#datetime}

`granularity` sets the precision for both sides: the default `day` is date only, `hour` adds the hour, `minute` adds hour and minute and `second` adds seconds. `hourCycle` picks the 12 or 24 hour clock, defaulting to the locale.

<Demo name="date-range-field/datetime" />

### Range {#range}

`min` and `max` bound both sides. When either side falls outside them, or the end date is before the start date, the field shows as invalid but the value is still emitted. `placeholder` sets the date the segments start from while the field is empty, today by default.

<Demo name="date-range-field/range" />

### Clearable {#clearable}

`clearable` adds a button at the end that empties both sides, sets the value to `null` and returns focus to the first segment.

<Demo name="date-range-field/clearable" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`, matching the input of the same step in height.

<Demo name="date-range-field/sizes" />

### States {#states}

`invalid` gives the field a warning color, `disabled` disables the group and `readonly` keeps it focusable but not editable. `variant="secondary"` is the flat form used inside a surface.

<Demo name="date-range-field/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the whole range input through `aria-labelledby`, and the error message is rendered by the field; validation rules and submission belong to the [Form](/components/form). The value is an object whose other side is `null` while only one side is filled, so write the completeness check on the object itself for the error to land on this field.

<Demo name="date-range-field/form" />

## Behavior {#behavior}

- Clicking a segment starts typing; a click on the blank area focuses the first empty segment, which is the first end segment once the start date is complete.
- Each segment accepts digits only and moves on once complete, and the last start segment moves into the end date; the left and right arrow keys move between segments, up and down step the value and Backspace clears the current segment.
- A side is emitted only when every one of its segments is filled; clearing any segment makes that side `null`.
- An end before the start, or either side outside `min` and `max`, is still emitted and marked invalid.

## Accessibility {#a11y}

- Segments are `role="spinbutton"` named with a "start date" or "end date" prefix; the dash and the separators are hidden from assistive technology.
- Name the group with `aria-label` or `aria-labelledby`.
- `invalid`, an end before the start and out-of-range values all set `aria-invalid` on the group element.

## API {#api}

### Props {#props}

| Prop          | Type                                      | Default     | Description                                         |
| ------------- | ----------------------------------------- | ----------- | --------------------------------------------------- |
| `modelValue`  | `DateRangeValue \| null`                  | `null`      | `{ start, end }`, both sides ISO 8601 strings       |
| `placeholder` | `string`                                  | Today       | Where the segments start from while empty, ISO 8601 |
| `min`         | `string`                                  | —           | Lower bound of the accepted range                   |
| `max`         | `string`                                  | —           | Upper bound of the accepted range                   |
| `granularity` | `'day' \| 'hour' \| 'minute' \| 'second'` | `'day'`     | Precision                                           |
| `hourCycle`   | `12 \| 24`                                | Locale      | Hour cycle                                          |
| `clearable`   | `boolean`                                 | `false`     | Whether the clear button is shown                   |
| `readonly`    | `boolean`                                 | `false`     | Whether the field is read only                      |
| `name`        | `string`                                  | —           | Form field name                                     |
| `variant`     | `'primary' \| 'secondary'`                | `'primary'` | Variant                                             |
| `size`        | `'sm' \| 'md' \| 'lg'`                    | `'md'`      | Size                                                |
| `disabled`    | `boolean`                                 | `false`     | Whether the field is disabled                       |
| `invalid`     | `boolean`                                 | `false`     | Whether validation failed                           |
| `class`       | `string`                                  | —           | Classes appended to the root element                |

`DateRangeValue` is `{ start: string | null; end: string | null }` and is exported from the package entry.

### Slots {#slots}

| Slot       | Description                    |
| ---------- | ------------------------------ |
| `leading`  | Content of the leading square  |
| `trailing` | Content of the trailing square |

### Events {#events}

| Event               | Payload                         | Description           |
| ------------------- | ------------------------------- | --------------------- |
| `update:modelValue` | `value: DateRangeValue \| null` | The value changed     |
| `clear`             | —                               | The clear was clicked |
