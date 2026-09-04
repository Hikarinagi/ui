---
title: DateField
description: Types a date or time segment by segment.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/date-field/DateField.vue
  - label: DateField
    href: https://reka-ui.com/docs/components/date-field
---

<Demo name="date-field/hero" />

## Usage {#usage}

```ts
import { DateField } from '@hina-ui/vue'
```

The date field splits a date into year, month and day segments. Each segment accepts digits only, moves on to the next once it is complete, and the up and down arrow keys step it. `v-model` binds an ISO 8601 string: `YYYY-MM-DD` for dates and `YYYY-MM-DDTHH:mm` with time, the same shape as the browser's native date inputs, ready to submit or store. Segment order, separators and placeholders follow the current locale. Attributes it does not declare land on the group element that wraps the segments, so name it with `aria-label` or `aria-labelledby`.

<Demo name="date-field/basic" />

## Examples {#examples}

### Date and time {#datetime}

`granularity` sets the precision: the default `day` is date only, `minute` adds hour and minute, `second` adds seconds and `hour` stops at the hour. `hourCycle` picks the 12 or 24 hour clock, defaulting to the locale.

<Demo name="date-field/datetime" />

### Range {#range}

`min` and `max` bound the accepted range; a value outside it puts the field into the invalid state but is still emitted. `placeholder` sets the date the segments start from while the field is empty, today by default.

<Demo name="date-field/range" />

### Clearable {#clearable}

`clearable` adds a button at the end that empties the value to `null` and returns focus to the first segment.

<Demo name="date-field/clearable" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`, matching the input of the same step in height.

<Demo name="date-field/sizes" />

### States {#states}

`invalid` gives the field a warning color, `disabled` disables the group and `readonly` keeps it focusable but not editable. `variant="secondary"` is the flat form used inside a surface.

<Demo name="date-field/states" />

## Behavior {#behavior}

- Clicking a segment or the blank area of the field starts typing; a click on the blank area focuses the first empty segment.
- Each segment accepts digits only and moves on once complete; the left and right arrow keys move between segments, up and down step the value and Backspace clears the current segment.
- A value is emitted only when every segment is filled; clearing any segment makes the value `null`.
- Values outside `min` or `max` are still emitted and marked invalid.

## Accessibility {#a11y}

- Each segment is `role="spinbutton"` with a localized name and its current value; separators are hidden from assistive technology.
- Name the group with `aria-label` or `aria-labelledby`.
- `invalid` and out-of-range values both set `aria-invalid` on the group element.

## API {#api}

### Props {#props}

| Prop          | Type                                      | Default     | Description                                  |
| ------------- | ----------------------------------------- | ----------- | -------------------------------------------- |
| `modelValue`  | `string \| null`                          | `null`      | ISO 8601 string, precision per `granularity` |
| `placeholder` | `string`                                  | today       | Starting point of the empty segments         |
| `min`         | `string`                                  | —           | Lower bound of the accepted range            |
| `max`         | `string`                                  | —           | Upper bound of the accepted range            |
| `granularity` | `'day' \| 'hour' \| 'minute' \| 'second'` | `'day'`     | Precision                                    |
| `hourCycle`   | `12 \| 24`                                | locale      | Hour cycle                                   |
| `clearable`   | `boolean`                                 | `false`     | Whether the clear button is shown            |
| `readonly`    | `boolean`                                 | `false`     | Whether the field is read only               |
| `name`        | `string`                                  | —           | Form field name                              |
| `variant`     | `'primary' \| 'secondary'`                | `'primary'` | Variant                                      |
| `size`        | `'sm' \| 'md' \| 'lg'`                    | `'md'`      | Size                                         |
| `disabled`    | `boolean`                                 | `false`     | Whether the group is disabled                |
| `invalid`     | `boolean`                                 | `false`     | Whether the field failed validation          |
| `class`       | `string`                                  | —           | Classes appended to the root element         |

### Slots {#slots}

| Slot       | Description                       |
| ---------- | --------------------------------- |
| `leading`  | Content of the leading adornment  |
| `trailing` | Content of the trailing adornment |

### Events {#events}

| Event               | Payload                 | Description        |
| ------------------- | ----------------------- | ------------------ |
| `update:modelValue` | `value: string \| null` | The value changed  |
| `clear`             | —                       | The clear was used |
