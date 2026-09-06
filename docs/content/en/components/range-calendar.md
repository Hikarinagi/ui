---
title: RangeCalendar
description: Shows a month and picks a date range.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/range-calendar/RangeCalendar.vue
  - label: RangeCalendar
    href: https://reka-ui.com/docs/components/range-calendar
---

<Demo name="range-calendar/hero" />

## Usage {#usage}

```ts
import { RangeCalendar } from '@hina-ui/vue'
```

The range calendar shares its grid, heading and month and year views with `Calendar`; the difference is that it picks a span: click one date as the start, then another as the end. Start and end render as solid cells and the dates between them join into a tinted band. `v-model` binds a `{ start, end }` object whose fields are `YYYY-MM-DD` ISO 8601 strings, the same shape as `DateRangeField`, and is `null` when nothing is selected.

<Demo name="range-calendar/basic" />

## Examples {#examples}

### Range {#range}

`min` and `max` bound the selectable range and disable the dates outside it. `maximumDays` caps how many days a span may contain: once a start date is picked, the dates beyond the cap are disabled until the span is complete.

<Demo name="range-calendar/range" />

### Unavailable dates {#unavailable}

`unavailable` receives a `YYYY-MM-DD` string and returns whether that date is unavailable; unavailable dates are struck through. A span cannot cross an unavailable date.

<Demo name="range-calendar/unavailable" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`, identical to the same step of `Calendar`.

<Demo name="range-calendar/sizes" />

### States {#states}

`readonly` keeps the calendar navigable by keyboard but not selectable; `disabled` disables the whole calendar.

<Demo name="range-calendar/states" />

## Behavior {#behavior}

- The first click sets the start date, at which point the value is `{ start, end: null }`; the second click sets the end. Once a span is set, clicking any date starts a new span from it.
- After the start is set, hovering or moving the focus to another date previews the band in between.
- An end before the start swaps the two.
- Keyboard handling, the month and year views, paging and `placeholder` are the same as `Calendar`.

## Accessibility {#a11y}

- The root carries the localized name and the current month, the grid is `role="grid"` and every cell inside the span carries `aria-selected`.
- The whole grid is one Tab stop; the arrow keys move the focus between dates and the focus ring only appears for keyboard use.

## API {#api}

### Props {#props}

| Prop            | Type                              | Default    | Description                                     |
| --------------- | --------------------------------- | ---------- | ----------------------------------------------- |
| `modelValue`    | `DateRangeValue \| null`          | `null`     | The selected span, both ends `YYYY-MM-DD`       |
| `placeholder`   | `string`                          | This month | The month shown, supports `v-model:placeholder` |
| `min`           | `string`                          | —          | Lower bound of the selectable range             |
| `max`           | `string`                          | —          | Upper bound of the selectable range             |
| `maximumDays`   | `number`                          | —          | Maximum number of days a span may cover         |
| `unavailable`   | `(date: string) => boolean`       | —          | Whether a given date is unavailable             |
| `weekStartsOn`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | Locale     | First day of the week                           |
| `weekdayFormat` | `'narrow' \| 'short'`             | `'narrow'` | Format of the weekday names                     |
| `fixedWeeks`    | `boolean`                         | `true`     | Whether six weeks are always shown              |
| `size`          | `'sm' \| 'md' \| 'lg'`            | `'md'`     | Size                                            |
| `autofocus`     | `boolean`                         | `false`    | Whether to focus the start date on mount        |
| `readonly`      | `boolean`                         | `false`    | Whether the calendar is read only               |
| `disabled`      | `boolean`                         | `false`    | Whether the calendar is disabled                |
| `class`         | `string`                          | —          | Classes appended to the root element            |

`DateRangeValue` is `{ start: string | null; end: string | null }` and is exported from the package entry.

### Events {#events}

| Event                | Payload                         | Description                                              |
| -------------------- | ------------------------------- | -------------------------------------------------------- |
| `update:modelValue`  | `value: DateRangeValue \| null` | The span changed                                         |
| `update:placeholder` | `value: string`                 | The shown month changed, with a date inside the new view |
