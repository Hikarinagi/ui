---
title: MonthGrid
description: Display schedules, check-ins, prices or daily status in a monthly table.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/month-grid/MonthGrid.vue
---

<Demo name="month-grid/hero" />

## Usage {#usage}

```ts
import { MonthGrid } from '@hina-ui/vue'
```

`v-model:month` controls the displayed month as `YYYY-MM`. The default slot receives each day's metadata and renders below its date number. Add text, status or independent actions.

```vue
<MonthGrid v-model:month="month" today="2026-09-21" label="Team schedule">
  <template #default="{ date }">
    <Text v-for="event in eventsByDate[date]" :key="event.id" size="xs">
      {{ event.title }}
    </Text>
  </template>
</MonthGrid>
```

| Task                                            | Component             |
| ----------------------------------------------- | --------------------- |
| Select a date for a form                        | Calendar / DatePicker |
| Browse daily content or act on a particular day | MonthGrid             |

MonthGrid has no selected date, selection highlight or whole-cell click event. Compose buttons, links and overlays inside its slots without nested buttons or intercepted keyboard events.

## Examples {#examples}

### Customize around the default date {#check-in}

`#day-trailing` adds status, holidays or counts beside the date. The component keeps date formatting, today's marker and the accessible name. Use `#date` to change only the date content inside the existing `time` element; keep this slot to text and decoration, with interactive controls in the other slots.

This example hides the built-in header and uses `cellClass` for full-cell check-in and day-off backgrounds. The default slot holds today's action. Records belong to the application.

<Demo name="month-grid/check-in" />

### Full day content and room rates {#prices}

`#day` replaces the entire content area, including the date header and default content. The component still owns the table cell and its layout wrapper. Set `dayPadding=0` and let the slot button handle its padding to fill the content area.

This example combines dates, prices, stock, sold-out states and application selection. Buttons own their disabled state and `aria-pressed`; MonthGrid does not hold a booking value.

<Demo name="month-grid/prices" />

### Add actions without replacing navigation {#actions}

The schedule example uses `#header-actions` to add a category filter while keeping the month heading, month/year picker and navigation. Actions wrap onto a separate row in narrow containers. The slot receives the same context as `#header`.

```vue
<MonthGrid v-model:month="month">
  <template #header-actions>
    <Select v-model="category" :options="categories" aria-label="Schedule category" />
  </template>
</MonthGrid>
```

Providing `#header` replaces the whole header, including the default actions area. Set `:show-header="false"` to remove the header and its spacing while retaining the table's accessible name.

### Cell styling and layout {#customization}

| Hook           | Target                    | Typical use                                           |
| -------------- | ------------------------- | ----------------------------------------------------- |
| `cellClass`    | The date's `td`           | Full-cell state backgrounds, borders and cell padding |
| `dayClass`     | The inner content wrapper | Alignment, spacing and layout                         |
| `dayMinHeight` | Minimum content height    | Size the day independently of header controls         |
| `dayPadding`   | Content padding           | Compact layouts or full-area actions                  |

Both class props accept a string or `(day: MonthGridDay) => string | undefined`. Callbacks receive the date slot context, including for adjacent-month cells whose content is hidden. Classes merge with defaults so callers can override them without descendant selectors.

Both dimension props accept numbers in pixels or CSS lengths such as `112`, `'7rem'` or `'var(--my-calendar-spacing)'`. Padding also accepts shorthand such as `'4px 8px'`. Omitted values use Hina sizes and responsive spacing. Minimum height does not clip content: extra content can grow its row. Entry limits and “more” controls belong to the application.

### Custom header and date bounds {#header}

`#header` exposes the displayed month, date range and navigation methods that respect the bounds. Replace the header with a select or your own toolbar. This example also demonstrates variable week counts, adjacent-month visibility and Sunday-first weeks.

`min` and `max` use `YYYY-MM-DD`. Navigation stays within their months, and out-of-range days receive `isDisabled`. **Bind `:disabled="isDisabled"` on slot actions yourself**; the component does not interfere with application content.

<Demo name="month-grid/header" />

### Month and year navigation {#navigation}

The default header includes previous/next month, a current-month shortcut and a month heading. The heading opens the month picker; its year heading opens the year picker. Both reuse Calendar views. Choosing a month restores focus to the heading without scrolling. Escape returns from years to months, then closes the picker.

Set `:show-today="false"` to hide the current-month shortcut. `disabled` stops default navigation and sets every day's `isDisabled` to true. Custom headers should honor `canPrev`, `canNext` and `canToday`.

### Loading data {#data}

`range-change` fires after client mount, then when the month, first weekday or week count changes. It provides the month and the table's first and last ISO dates, allowing requests to include adjacent months.

```vue
<MonthGrid v-model:month="month" @range-change="loadRange">
  <template #default="{ date }">
    <Text size="xs">{{ summaries[date] }}</Text>
  </template>
</MonthGrid>
```

Requests, loading feedback, failures and stale-response handling belong to the caller. Prefetch SSR data from the known month at page level instead of depending on the client-only event. The range always describes the whole table, even when adjacent-month content is hidden.

## First paint and layout {#rendering}

- The server renders weekday headings, all date cells and slot content directly. Layout needs no browser measurement.
- Today defaults to UTC so server and browser local time zones do not disagree. Pass `timeZone` for a fixed business zone. Pass the same `today` and `month` from the page when hydration must remain identical across midnight as well.
- Six fixed weeks keep the row count stable between months. With `fixedWeeks=false`, the table uses the four to six weeks needed by that month.
- `size` provides default day and control dimensions. `dayMinHeight` and `dayPadding` independently override day layout. Content can grow naturally; narrow containers reduce default padding. Limit long event lists or show counts, then open details in a Popover or Dialog.
- Dates use the Gregorian calendar with localized month and weekday names. Week start follows the locale unless overridden. Direction is inherited and RTL is supported.
- Invalid months fall back to today's month. Valid out-of-range months display the nearest allowed month. Invalid bounds are ignored; reversed bounds are ignored together. These fallbacks do not rewrite the caller's model automatically.

## Accessibility {#a11y}

The display uses a native table, caption and weekday headers with `scope="col"`. Default date numbers are time elements with full date names, and today has `aria-current="date"`. Cells do not form a selectable ARIA grid or add Tab stops.

Slot buttons and links retain their normal Tab order. When replacing entire cells, preserve date names and provide accessible names for actions and status icons.

## API {#api}

### Props {#props}

| Prop              | Type                                                     | Default                   | Description                                                          |
| ----------------- | -------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------- |
| `month`           | `string`                                                 | Today's month             | `YYYY-MM`, supports `v-model:month`                                  |
| `dir`             | `'ltr' \| 'rtl'`                                         | Inherited                 | Direction for the table and month/year picker                        |
| `today`           | `string`                                                 | Computed in the time zone | `YYYY-MM-DD`, overrides automatic calculation                        |
| `timeZone`        | `string`                                                 | `'UTC'`                   | IANA time zone for calculating today                                 |
| `min` / `max`     | `string`                                                 | —                         | Date bounds as `YYYY-MM-DD`                                          |
| `weekStartsOn`    | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                        | Locale                    | First weekday; 0 is Sunday                                           |
| `weekdayFormat`   | `'narrow' \| 'short' \| 'long'`                          | `'short'`                 | Weekday label format                                                 |
| `fixedWeeks`      | `boolean`                                                | `true`                    | Always render six weeks                                              |
| `showOutsideDays` | `boolean`                                                | `true`                    | Render adjacent-month content; false preserves blank cells           |
| `showToday`       | `boolean`                                                | `true`                    | Show the current-month shortcut in the default header                |
| `disabled`        | `boolean`                                                | `false`                   | Disable default navigation and provide disabled metadata             |
| `size`            | `'sm' \| 'md' \| 'lg'`                                   | `'md'`                    | Cell and navigation size                                             |
| `label`           | `string`                                                 | Localized “Calendar”      | Table name; the current month is appended                            |
| `class`           | `string`                                                 | —                         | Root styling; native attributes and style also reach the root        |
| `showHeader`      | `boolean`                                                | `true`                    | Render the built-in header or header slot; false leaves no spacer    |
| `dayMinHeight`    | `number \| string`                                       | From size                 | Minimum day content height; numbers are pixels, content can grow     |
| `dayPadding`      | `number \| string`                                       | Responsive                | Day content padding; numbers are pixels, use 0 for full-area actions |
| `cellClass`       | `string \| ((day: MonthGridDay) => string \| undefined)` | —                         | Styles for date td elements                                          |
| `dayClass`        | `string \| ((day: MonthGridDay) => string \| undefined)` | —                         | Styles for date content wrappers                                     |

### Slots {#slots}

| Slot             | Context                     | Description                                                                                                       |
| ---------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `default`        | `MonthGridDay`              | Content below the date header                                                                                     |
| `day`            | `MonthGridDay`              | Replaces the content area, preserving td and layout wrapper; takes precedence over date, day-trailing and default |
| `date`           | `MonthGridDay`              | Content inside time, preserving date semantics and today's marker                                                 |
| `day-trailing`   | `MonthGridDay`              | Supplementary content beside the default date                                                                     |
| `header`         | `MonthGridHeader`           | Replaces the complete navigation header                                                                           |
| `header-actions` | `MonthGridHeader`           | Actions beside default navigation; wraps on narrow containers                                                     |
| `weekday`        | `{ day, label, fullLabel }` | Weekday heading; day is 0–6                                                                                       |
| `footer`         | `{ month, start, end }`     | Supplementary table content                                                                                       |

`MonthGridDay` includes `date` (ISO date), `day` (day number), `dayLabel` (localized number text), `weekday` (0–6, Sunday is 0), `label` (full date name), `isToday`, `isPast`, `isFuture`, `isOutside` and `isDisabled`. Past/future compare dates against the same `today`. The caller defines weekends, holidays and business availability.

`MonthGridHeader` includes `month`, `start`, `end`, `label`, `canPrev`, `canNext`, `canToday`, `prev()`, `next()` and `goToToday()`.

### Events {#events}

| Event          | Payload                 | Description                                      |
| -------------- | ----------------------- | ------------------------------------------------ |
| `update:month` | `string`                | Displayed month changes through navigation       |
| `range-change` | `{ month, start, end }` | Initial client mount and displayed-range changes |

### Expose {#expose}

| Name            | Type             | Description                                       |
| --------------- | ---------------- | ------------------------------------------------- |
| `range`         | `MonthGridRange` | Current month and table date range                |
| `prev` / `next` | `() => void`     | Navigate within bounds, respecting disabled state |
| `goToToday`     | `() => void`     | Navigate to today's month within bounds           |
