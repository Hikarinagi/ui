---
title: DatePicker
description: Types a date or picks it from a calendar.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/date-picker/DatePicker.vue
  - label: Popover
    href: https://reka-ui.com/docs/components/popover
---

<Demo name="date-picker/hero" />

## Usage {#usage}

```ts
import { DatePicker } from '@hina-ui/vue'
```

The date picker puts the segmented `DateField` and the `Calendar` together: type into the segments, or open the calendar from the button at the end and pick a day. `v-model` binds an ISO 8601 string in the `YYYY-MM-DD` form, the same as both parts. Attributes it does not declare land on the group element that wraps the segments, so name it with `aria-label` or `aria-labelledby`.

<Demo name="date-picker/basic" />

## Examples {#examples}

### Range and unavailable days {#range}

`min` and `max` constrain both the field and the calendar; `unavailable` strikes days out.

<Demo name="date-picker/range" />

### Clearable {#clearable}

`clearable` adds a clear button after the segments; clearing sets the value to `null`.

<Demo name="date-picker/clearable" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`, matching the input of the same step; the calendar in the popover uses the same step.

<Demo name="date-picker/sizes" />

### States {#states}

`invalid` gives the field a warning color, `disabled` disables the group and `readonly` makes it read only. `variant="secondary"` is the flat form used inside a surface.

<Demo name="date-picker/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the input, and the description and error message are rendered by the field; validation rules and submission belong to the [Form](/components/form).

<Demo name="date-picker/form" />

## Behavior {#behavior}

- The button at the end opens the calendar with focus on the picked day; picking a day writes the value, closes the calendar and returns focus to the button.
- The calendar is a modal popover: focus stays inside it while open, page scrolling is locked, and clicking anywhere outside it, the field included, closes it.
- Esc closes the calendar and returns focus to the button; inside its month and year views Esc steps back first.
- The calendar opens below the field aligned to its start edge.

## Accessibility {#a11y}

- The segments and the calendar carry the semantics described for `DateField` and `Calendar`.
- The button that opens the calendar has a name from the locale and `aria-expanded`.
- Name the group with `aria-label` or `aria-labelledby`.

## API {#api}

### Props {#props}

| Prop            | Type                              | Default     | Description                                    |
| --------------- | --------------------------------- | ----------- | ---------------------------------------------- |
| `modelValue`    | `string \| null`                  | `null`      | The picked day, `YYYY-MM-DD`                   |
| `open`          | `boolean`                         | `false`     | Whether the calendar is open; `v-model:open`   |
| `placeholder`   | `string`                          | today       | Starting point of the empty field and calendar |
| `min`           | `string`                          | —           | Lower bound of the selectable range            |
| `max`           | `string`                          | —           | Upper bound of the selectable range            |
| `unavailable`   | `(date: string) => boolean`       | —           | Whether a given day cannot be picked           |
| `weekStartsOn`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | locale      | First day of the week                          |
| `weekdayFormat` | `'narrow' \| 'short'`             | `'narrow'`  | Format of the weekday names                    |
| `fixedWeeks`    | `boolean`                         | `true`      | Whether the calendar always shows six weeks    |
| `clearable`     | `boolean`                         | `false`     | Whether the clear button is shown              |
| `readonly`      | `boolean`                         | `false`     | Whether the field is read only                 |
| `name`          | `string`                          | —           | Form field name                                |
| `variant`       | `'primary' \| 'secondary'`        | `'primary'` | Variant                                        |
| `size`          | `'sm' \| 'md' \| 'lg'`            | `'md'`      | Size                                           |
| `disabled`      | `boolean`                         | `false`     | Whether the group is disabled                  |
| `invalid`       | `boolean`                         | `false`     | Whether the field failed validation            |
| `class`         | `string`                          | —           | Classes appended to the root element           |

### Slots {#slots}

| Slot      | Description                      |
| --------- | -------------------------------- |
| `leading` | Content of the leading adornment |

### Events {#events}

| Event               | Payload                 | Description                   |
| ------------------- | ----------------------- | ----------------------------- |
| `update:modelValue` | `value: string \| null` | The value changed             |
| `update:open`       | `open: boolean`         | The calendar opened or closed |
| `clear`             | —                       | The clear was used            |
