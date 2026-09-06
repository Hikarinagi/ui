---
title: DateTimePicker
description: Types a date and time or picks them from a calendar and a time field.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/date-time-picker/DateTimePicker.vue
  - label: Popover
    href: https://reka-ui.com/docs/components/popover
---

<Demo name="date-time-picker/hero" />

## Usage {#usage}

```ts
import { DateTimePicker } from '@hina-ui/vue'
```

The date time picker combines a minute-precision `DateField` with a `Calendar` and a `TimeField` in a popover: type straight into the segments, or click the button at the end to pick the date in the calendar and adjust the time in the time field. `v-model` binds a `YYYY-MM-DDTHH:mm` ISO 8601 string, `YYYY-MM-DDTHH:mm:ss` at second precision, the same shape as the browser's native date time input. Attributes it does not declare land on the group element that wraps the segments, so name it with `aria-label` or `aria-labelledby`.

<Demo name="date-time-picker/basic" />

## Examples {#examples}

### Range and unavailable dates {#range}

`min` and `max` constrain the field with full date times, and the calendar disables dates by their date part; `unavailable` marks dates as unavailable; `minuteStep` steps the minute segment in the popover.

<Demo name="date-time-picker/range" />

### Clearable {#clearable}

`clearable` adds a clear button after the segments that empties the value to `null`.

<Demo name="date-time-picker/clearable" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`, matching the input of the same step in height; the calendar, time field and button in the popover use the same step.

<Demo name="date-time-picker/sizes" />

### States {#states}

`invalid` gives the field a warning color, `disabled` disables the group and `readonly` makes it read only. `variant="secondary"` is the flat form used inside a surface.

<Demo name="date-time-picker/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the input, and the error message is rendered by the field; validation rules and submission belong to the [Form](/components/form).

<Demo name="date-time-picker/form" />

## Behavior {#behavior}

- Clicking the button at the end opens the popover with focus on the current date. Picking a day updates only the date part, keeps the time part and leaves the popover open; with no value yet, the time part comes from `placeholder`, or midnight without one.
- The time field in the popover edits the time part directly. Clicking "OK" closes the popover and returns focus to the button; clicking anywhere outside or pressing Esc closes it too, since every step is already written back.
- The popover is modal: focus stays inside it while open and the page stops scrolling. Esc inside the time segments does not close the popover; use "OK" or click outside.
- The popover opens below the field, aligned with its left edge.

## Accessibility {#a11y}

- See `DateField`, `Calendar` and `TimeField` for the semantics of the segments, the calendar and the time field; the time field in the popover carries a localized name.
- The button that opens the popover carries a localized name and `aria-expanded`.
- Name the group with `aria-label` or `aria-labelledby`.

## API {#api}

### Props {#props}

| Prop            | Type                              | Default     | Description                                                                                              |
| --------------- | --------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `modelValue`    | `string \| null`                  | `null`      | `YYYY-MM-DDTHH:mm`, down to `ss` at second precision                                                     |
| `open`          | `boolean`                         | `false`     | Whether the popover is open, `v-model:open`                                                              |
| `placeholder`   | `string`                          | Today       | Where the segments and calendar start while empty; its time part is the default time after picking a day |
| `min`           | `string`                          | —           | Lower bound of the accepted range                                                                        |
| `max`           | `string`                          | —           | Upper bound of the accepted range                                                                        |
| `granularity`   | `'minute' \| 'second'`            | `'minute'`  | Precision                                                                                                |
| `hourCycle`     | `12 \| 24`                        | Locale      | Hour cycle                                                                                               |
| `minuteStep`    | `number`                          | —           | Step of the minute segment in the popover                                                                |
| `unavailable`   | `(date: string) => boolean`       | —           | Whether a given date is unavailable                                                                      |
| `weekStartsOn`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | Locale      | First day of the week                                                                                    |
| `weekdayFormat` | `'narrow' \| 'short'`             | `'narrow'`  | Format of the weekday names                                                                              |
| `fixedWeeks`    | `boolean`                         | `true`      | Whether the calendar always shows six weeks                                                              |
| `clearable`     | `boolean`                         | `false`     | Whether the clear button is shown                                                                        |
| `readonly`      | `boolean`                         | `false`     | Whether the field is read only                                                                           |
| `name`          | `string`                          | —           | Form field name                                                                                          |
| `variant`       | `'primary' \| 'secondary'`        | `'primary'` | Variant                                                                                                  |
| `size`          | `'sm' \| 'md' \| 'lg'`            | `'md'`      | Size                                                                                                     |
| `disabled`      | `boolean`                         | `false`     | Whether the field is disabled                                                                            |
| `invalid`       | `boolean`                         | `false`     | Whether validation failed                                                                                |
| `class`         | `string`                          | —           | Classes appended to the root element                                                                     |

### Slots {#slots}

| Slot      | Description                   |
| --------- | ----------------------------- |
| `leading` | Content of the leading square |

### Events {#events}

| Event               | Payload                 | Description                  |
| ------------------- | ----------------------- | ---------------------------- |
| `update:modelValue` | `value: string \| null` | The value changed            |
| `update:open`       | `open: boolean`         | The popover opened or closed |
| `clear`             | —                       | The clear was clicked        |
