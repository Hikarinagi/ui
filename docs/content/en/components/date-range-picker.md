---
title: DateRangePicker
description: Types a date range or picks it from a calendar.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/date-range-picker/DateRangePicker.vue
  - label: Popover
    href: https://reka-ui.com/docs/components/popover
---

<Demo name="date-range-picker/hero" />

## Usage {#usage}

```ts
import { DateRangePicker } from '@hina-ui/vue'
```

The date range picker combines the segmented field of `DateRangeField` with `RangeCalendar`: type the start and end dates straight into the segments, or click the button at the end to pick them from a calendar. `v-model` binds a `{ start, end }` object whose fields are `YYYY-MM-DD` ISO 8601 strings, the same shape both parts use. Attributes it does not declare land on the group element that wraps the segments, so name it with `aria-label` or `aria-labelledby`.

<Demo name="date-range-picker/basic" />

## Examples {#examples}

### Range and unavailable dates {#range}

`min` and `max` constrain both the field and the calendar, `unavailable` marks dates as unavailable and `maximumDays` caps how many days a span may contain.

<Demo name="date-range-picker/range" />

### Clearable {#clearable}

`clearable` adds a clear button after the segments that empties both sides and sets the value to `null`.

<Demo name="date-range-picker/clearable" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`, matching the input of the same step in height; the calendar in the popover uses the same step.

<Demo name="date-range-picker/sizes" />

### States {#states}

`invalid` gives the field a warning color, `disabled` disables the group and `readonly` makes it read only. `variant="secondary"` is the flat form used inside a surface.

<Demo name="date-range-picker/states" />

## Behavior {#behavior}

- Clicking the button at the end opens the calendar with focus on the current start date. The first click in the calendar sets the start, updating the value to the start plus `null` while the calendar stays open; the second sets the end, after which the value updates, the calendar closes and focus returns to the button.
- The calendar is a modal popover: focus stays inside it while open, the page stops scrolling, and clicking anywhere outside it, the field included, closes it.
- Esc closes the calendar and returns focus to the button. Inside the month and year views, Esc first steps back a level.
- The calendar opens below the field, aligned with its left edge.

## Accessibility {#a11y}

- See `DateRangeField` and `RangeCalendar` for the semantics of the segments and the calendar.
- The button that opens the calendar carries a localized name and `aria-expanded`.
- Name the group with `aria-label` or `aria-labelledby`.

## API {#api}

### Props {#props}

| Prop            | Type                              | Default     | Description                                       |
| --------------- | --------------------------------- | ----------- | ------------------------------------------------- |
| `modelValue`    | `DateRangeValue \| null`          | `null`      | The selected span, both ends `YYYY-MM-DD`         |
| `open`          | `boolean`                         | `false`     | Whether the calendar is open, `v-model:open`      |
| `placeholder`   | `string`                          | Today       | Where the segments and calendar start while empty |
| `min`           | `string`                          | —           | Lower bound of the selectable range               |
| `max`           | `string`                          | —           | Upper bound of the selectable range               |
| `maximumDays`   | `number`                          | —           | Maximum number of days a span may contain         |
| `unavailable`   | `(date: string) => boolean`       | —           | Whether a given date is unavailable               |
| `weekStartsOn`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | Locale      | First day of the week                             |
| `weekdayFormat` | `'narrow' \| 'short'`             | `'narrow'`  | Format of the weekday names                       |
| `fixedWeeks`    | `boolean`                         | `true`      | Whether the calendar always shows six weeks       |
| `clearable`     | `boolean`                         | `false`     | Whether the clear button is shown                 |
| `readonly`      | `boolean`                         | `false`     | Whether the field is read only                    |
| `name`          | `string`                          | —           | Form field name                                   |
| `variant`       | `'primary' \| 'secondary'`        | `'primary'` | Variant                                           |
| `size`          | `'sm' \| 'md' \| 'lg'`            | `'md'`      | Size                                              |
| `disabled`      | `boolean`                         | `false`     | Whether the field is disabled                     |
| `invalid`       | `boolean`                         | `false`     | Whether validation failed                         |
| `class`         | `string`                          | —           | Classes appended to the root element              |

`DateRangeValue` is `{ start: string | null; end: string | null }` and is exported from the package entry.

### Slots {#slots}

| Slot      | Description                   |
| --------- | ----------------------------- |
| `leading` | Content of the leading square |

### Events {#events}

| Event               | Payload                         | Description                   |
| ------------------- | ------------------------------- | ----------------------------- |
| `update:modelValue` | `value: DateRangeValue \| null` | The value changed             |
| `update:open`       | `open: boolean`                 | The calendar opened or closed |
| `clear`             | —                               | The clear was clicked         |
