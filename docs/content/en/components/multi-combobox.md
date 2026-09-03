---
title: MultiCombobox
description: Types to search and picks several items.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/multi-combobox/MultiCombobox.vue
  - label: Combobox
    href: https://reka-ui.com/docs/components/combobox
---

<Demo name="multi-combobox/hero" />

## Usage {#usage}

```ts
import { MultiCombobox } from '@hina-ui/vue'
```

The multi combobox is the multi-value form of `Combobox`: type in the field to narrow the list, pick several items, and the chosen ones sit as chips before the text input, wrapping when they no longer fit. `v-model` binds an array of chosen values and `options` has the same type as `Select`. Attributes it does not declare land on the inner text input, so name it with `aria-label` or `aria-labelledby`.

<Demo name="multi-combobox/basic" />

It differs from `MultiSelect` in whether you type: a multi select picks from a fixed list and locks page scrolling while open; a multi combobox narrows the list by typing and never locks scrolling, so the field stays editable. It differs from `TagsInput` in where values come from: a tags input accepts any text, here every value must come from the options.

## Examples {#examples}

### Remote search {#remote}

The example below queries a live search endpoint: `ignoreFilter` turns off local filtering, `v-model:search` hands the typed text to the caller, which debounces it for 300 ms with `refDebounced` from VueUse, refetches with `useFetch` whenever the term changes while aborting the previous request, and writes the results into `options`; while `loading` the toggle arrow becomes a spinner. The component remembers the name of every option it has seen, so chips keep their names while the result list changes with the query; when editing existing data, include the current values in the initial `options`. Debouncing and cancelling requests belong to the caller.

<Demo name="multi-combobox/remote" />

### Custom content {#custom}

The `option` slot customises each row in the list, for example with a cover and an id.

<Demo name="multi-combobox/custom" />

### Clearable {#clearable}

`clearable` adds a button at the end that empties everything and returns focus to the input. Each chip has its own remove button, so it is off by default.

<Demo name="multi-combobox/clearable" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`. With nothing chosen the height equals an input of the same step.

<Demo name="multi-combobox/sizes" />

### States {#states}

`invalid` gives the field a warning color and `disabled` disables the group. `variant="secondary"` is the flat form used inside a surface.

<Demo name="multi-combobox/states" />

## Behavior {#behavior}

- Typing opens the list and filters it; the arrow keys move the highlight, Enter ticks or unticks the highlighted item, the list stays open and the typed text and its filtering stay put, so several items from one query can be ticked in a row; clearing the input brings the whole list back.
- Clicking the blank area of the field or the text of a chip focuses the input and opens the list, the same as clicking the input.
- With an empty input, Backspace removes the last chip.
- Esc or a click outside closes the list. Page scrolling is never locked.
- Chosen items stay ticked in the list; picking one again unticks it.

## Accessibility {#a11y}

- The text input is `role="combobox"`, the list is `role="listbox"` and each option is `role="option"` with `aria-selected`.
- Name the text input with `aria-label` or `aria-labelledby`; the remove, clear and toggle buttons carry names from the locale.
- `invalid` also sets `aria-invalid` on the text input.

## API {#api}

### Props {#props}

| Prop           | Type                       | Default     | Description                                       |
| -------------- | -------------------------- | ----------- | ------------------------------------------------- |
| `modelValue`   | `Array<string \| number>`  | `[]`        | The chosen values                                 |
| `options`      | `SelectItems`              | —           | The items, same type as `Select`                  |
| `placeholder`  | `string`                   | locale pack | Placeholder of the input while nothing is chosen  |
| `search`       | `string`                   | `''`        | Text in the input; `v-model:search`               |
| `ignoreFilter` | `boolean`                  | `false`     | Whether to skip local filtering for remote search |
| `loading`      | `boolean`                  | `false`     | Whether the toggle arrow shows a spinner          |
| `clearable`    | `boolean`                  | `false`     | Whether the clear-all button is shown             |
| `name`         | `string`                   | —           | Form field name                                   |
| `open`         | `boolean`                  | `false`     | Whether the list is open; `v-model:open`          |
| `variant`      | `'primary' \| 'secondary'` | `'primary'` | Variant                                           |
| `size`         | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                              |
| `disabled`     | `boolean`                  | `false`     | Whether the group is disabled                     |
| `invalid`      | `boolean`                  | `false`     | Whether the group failed validation               |
| `class`        | `string`                   | —           | Classes appended to the root element              |

### Slots {#slots}

| Slot     | Payload                    | Description                     |
| -------- | -------------------------- | ------------------------------- |
| `option` | `{ option: SelectOption }` | Content of each row in the list |

### Events {#events}

| Event               | Payload                          | Description               |
| ------------------- | -------------------------------- | ------------------------- |
| `update:modelValue` | `value: Array<string \| number>` | The chosen values changed |
| `update:search`     | `value: string`                  | The typed text changed    |
| `update:open`       | `open: boolean`                  | The list opened or closed |
| `clear`             | —                                | Everything was cleared    |
