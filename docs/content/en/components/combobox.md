---
title: Combobox
description: A select that filters as you type.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/combobox/Combobox.vue
  - label: Combobox
    href: https://reka-ui.com/docs/components/combobox
---

<Demo name="combobox/hero" />

## Usage {#usage}

```ts
import { Combobox } from '@hina-ui/vue'
```

The combobox pairs a text field with a floating list and shares its option data with `Select`. `v-model` binds the chosen value, typing filters the list by option label, and the button at the end opens or closes the list. The text area shares the input's field surface; attributes it does not declare land on the inner `input`.

<Demo name="combobox/basic" />

The complete option type is inferred from `options`. Slot parameters preserve additional fields and their types; `v-model` still binds to `value`. See [Select](/components/select#types) for the type definitions.

## Examples {#examples}

### Groups {#groups}

A group carries a `label` and its `options`; groups left empty by the filter are hidden with it.

<Demo name="combobox/groups" />

### Remote data {#remote}

`ignoreFilter` disables local filtering, and `v-model:search` provides the input text. Pass the search results directly to `options`; the dropdown renders only those results.

`selectedOption` supplies the selected item separately. Its `value` must match `v-model` to provide the displayed name; it neither adds a candidate nor changes the selection. Names are remembered when results are replaced or cleared. Asynchronously supplied or updated names are reflected without overwriting an active search; closing the list restores the latest name. When both sources contain the same value, `selectedOption` takes precedence for the displayed selection name.

`loading` replaces the toggle arrow with a loading indicator while keeping typing, selection and clearing available. Request state and debouncing are controlled by the caller.

The example requests a static JSON file shipped with the docs and simulates filtering in the caller, without a server proxy. Replace the request URL and result mapping when connecting a search API.

<Demo name="combobox/remote" />

### Clearable {#clearable}

`clearable` shows a clear button while there is a value; clicking it empties both the value and the text.

<Demo name="combobox/clearable" />

### Sizes {#sizes}

Three sizes, matching the input.

<Demo name="combobox/sizes" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="combobox/variants" />

### States {#states}

`invalid` marks a failed validation, `disabled` disables the whole combobox, and `disabled` on an option disables that option only.

<Demo name="combobox/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label points at the input, and the description and error message are rendered by the field and linked to it; validation rules and submission belong to the [Form](/components/form).

<Demo name="combobox/form" />

## Behaviour {#behavior}

- Clicking the text area or pressing an arrow key opens the list; typing filters it by option label, and a hint shows when nothing matches.
- Choosing an option closes the list and fills the text with its label; on blur, text that was not chosen reverts to the chosen option, while deleting all the text clears the value.
- The list opens against the text area at the same width, and scrolls inside the panel when it is taller than the space available.
- The toggle and clear buttons do not blur the text area.

## Accessibility {#a11y}

- The text area is `role="combobox"` with `aria-autocomplete="list"`, the list is `role="listbox"` and each option is `role="option"` with `aria-selected`.
- The toggle button is outside the Tab order and named from the locale pack.
- While loading, the field surface has `aria-busy="true"`.
- Pair it with a `label` element or an `aria-label` for its name. `invalid` also sets `aria-invalid`.

## API {#api}

### Props {#props}

`T extends SelectOption` is inferred from `options` and `selectedOption`, and defaults to `SelectOption`.

| Prop             | Type                       | Default     | Description                                                    |
| ---------------- | -------------------------- | ----------- | -------------------------------------------------------------- |
| `modelValue`     | `string \| number \| null` | —           | The chosen value                                               |
| `options`        | `SelectItems<T>`           | —           | The items, see [Select](/components/select#types)              |
| `selectedOption` | `T \| null`                | —           | Selected item data for display only; not added to the dropdown |
| `search`         | `string`                   | `''`        | The current text; `v-model:search`                             |
| `placeholder`    | `string`                   | locale pack | Text shown when nothing is chosen                              |
| `ignoreFilter`   | `boolean`                  | `false`     | Whether filtering is left to the caller                        |
| `loading`        | `boolean`                  | `false`     | Whether to show the loading indicator                          |
| `clearable`      | `boolean`                  | `false`     | Whether the clear button is shown                              |
| `open`           | `boolean`                  | `false`     | Whether the list is open; `v-model:open`                       |
| `variant`        | `'primary' \| 'secondary'` | `'primary'` | Variant                                                        |
| `size`           | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                                           |
| `invalid`        | `boolean`                  | `false`     | Whether validation failed                                      |
| `disabled`       | `boolean`                  | `false`     | Whether the combobox is disabled                               |
| `class`          | `string`                   | —           | Classes appended to the root element                           |

### Slots {#slots}

| Slot     | Payload         | Description                     |
| -------- | --------------- | ------------------------------- |
| `option` | `{ option: T }` | Content of each row in the list |

### Events {#events}

| Event               | Payload                   | Description               |
| ------------------- | ------------------------- | ------------------------- |
| `update:modelValue` | `value: string \| number` | The chosen value changed  |
| `update:search`     | `search: string`          | The text changed          |
| `update:open`       | `open: boolean`           | The list opened or closed |
| `clear`             | —                         | The value was cleared     |
