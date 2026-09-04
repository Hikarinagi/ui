---
title: Calendar
description: Shows a month and picks a date.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/calendar/Calendar.vue
  - label: Calendar
    href: https://reka-ui.com/docs/components/calendar
---

<Demo name="calendar/hero" />

## Usage {#usage}

```ts
import { Calendar } from '@hina-ui/vue'
```

The calendar shows one month as a grid and a click picks a day. `v-model` binds an ISO 8601 string in the `YYYY-MM-DD` form, the same shape as `DateField`. The heading, weekday names and the first day of the week follow the current locale. The grid always shows six weeks, so paging never changes its height.

<Demo name="calendar/basic" />

## Examples {#examples}

### Range {#range}

`min` and `max` bound the selectable range; days outside it are disabled and the paging buttons stop at the boundary months.

<Demo name="calendar/range" />

### Unavailable days {#unavailable}

`unavailable` receives a `YYYY-MM-DD` string and returns whether that day cannot be picked; such days are struck through and skipped.

<Demo name="calendar/unavailable" />

### First day of the week and weekday format {#week}

`weekStartsOn` sets the first day of the week from 0 to 6, where 0 is Sunday, defaulting to the locale. `weekdayFormat` picks the weekday names: `narrow` is a single letter, `short` an abbreviation.

<Demo name="calendar/week" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`; each day cell is as tall as the control of the same step, and the paging buttons and heading follow.

<Demo name="calendar/sizes" />

### States {#states}

`readonly` keeps the calendar browsable by keyboard but not selectable; `disabled` disables it entirely.

<Demo name="calendar/states" />

## Behavior {#behavior}

- A click picks the day; clicking the picked day again does not clear it.
- The arrow keys move focus by day and by week, Home and End jump to the ends of the week, PageUp and PageDown page by month, and Enter or Space picks the focused day.
- Moving focus out of the month pages automatically.
- Clicking the heading opens the month view, and clicking the year there opens the year view, twelve years at a time; picking a year returns to the month view, picking a month returns to the day view on that month, and Esc steps back one level. All three views share the same width and height, so switching never jumps.
- `placeholder` sets the month shown, the current month by default; after paging or switching views a date inside the new view is emitted as `update:placeholder`, so `v-model:placeholder` tracks or controls the shown month.

## Accessibility {#a11y}

- The root carries the name from the locale plus the visible month, the grid is `role="grid"` and every day is a button named with its full date.
- Focus roves between days through a single tab stop; the focus ring appears only for keyboard use.
- The paging buttons carry names from the locale.

## API {#api}

### Props {#props}

| Prop            | Type                              | Default       | Description                                     |
| --------------- | --------------------------------- | ------------- | ----------------------------------------------- |
| `modelValue`    | `string \| null`                  | `null`        | The picked day, `YYYY-MM-DD`                    |
| `placeholder`   | `string`                          | current month | The month shown, supports `v-model:placeholder` |
| `min`           | `string`                          | —             | Lower bound of the selectable range             |
| `max`           | `string`                          | —             | Upper bound of the selectable range             |
| `unavailable`   | `(date: string) => boolean`       | —             | Whether a given day cannot be picked            |
| `weekStartsOn`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | locale        | First day of the week                           |
| `weekdayFormat` | `'narrow' \| 'short'`             | `'narrow'`    | Format of the weekday names                     |
| `fixedWeeks`    | `boolean`                         | `true`        | Whether six weeks are always shown              |
| `readonly`      | `boolean`                         | `false`       | Whether the calendar is read only               |
| `disabled`      | `boolean`                         | `false`       | Whether the calendar is disabled                |
| `class`         | `string`                          | —             | Classes appended to the root element            |

### Events {#events}

| Event                | Payload                 | Description                                              |
| -------------------- | ----------------------- | -------------------------------------------------------- |
| `update:modelValue`  | `value: string \| null` | The pick changed                                         |
| `update:placeholder` | `value: string`         | The shown month changed, with a date inside the new view |
