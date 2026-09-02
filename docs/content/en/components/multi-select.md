---
title: MultiSelect
description: Picks several items from a list.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/multi-select/MultiSelect.vue
  - label: Variants
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/multi-select/multi-select.variants.ts
---

<Demo name="multi-select/hero" />

## Usage {#usage}

```ts
import { MultiSelect } from '@hina-ui/vue'
```

The multi-select shares its option data and list with `Select`, with `v-model` bound to an array of chosen values. Chosen items show as chips in the trigger, each removable on its own; with `clearable` set, a button at the end empties them all at once. The list stays open after a pick so several can be ticked in a row.

<Demo name="multi-select/basic" />

## Examples {#examples}

### Groups {#groups}

A group carries a `label` and its `options`, and can be mixed with plain options.

<Demo name="multi-select/groups" />

### Visible chips {#max-visible}

The trigger keeps a fixed height, so only the first `maxVisible` chips show and the rest collapse into "+N".

<Demo name="multi-select/max-visible" />

### Custom content {#custom}

The `option` slot customises each row in the list.

<Demo name="multi-select/custom" />

### Clearable {#clearable}

`clearable` adds a button at the end that empties everything. Each chip has its own remove button, so it is off by default.

<Demo name="multi-select/clearable" />

### Sizes {#sizes}

Three sizes, matching the input; the chips scale with them.

<Demo name="multi-select/sizes" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="multi-select/variants" />

### States {#states}

`invalid` marks a failed validation and `disabled` disables the whole control.

<Demo name="multi-select/states" />

## Behaviour {#behavior}

- Clicking or pressing Enter on an option ticks it and keeps the list open; doing it again unticks it.
- The remove button on a chip and the clear button at the end do not open the list.
- The clear button transitions in and out.
- The list opens against the trigger at the same width, and scrolls inside the panel when it is taller than the space available.
- Page scrolling is locked while open; clicking outside or pressing Esc closes it.

## Accessibility {#a11y}

- The trigger is `role="combobox"`, the list is `role="listbox"` and each option is `role="option"` with `aria-selected`.
- The remove and clear buttons are named from the locale pack and reachable with Tab.
- Pair it with a `label` element or an `aria-label` for its name. `invalid` also sets `aria-invalid`.

## API {#api}

### Props {#props}

| Prop          | Type                       | Default     | Description                              |
| ------------- | -------------------------- | ----------- | ---------------------------------------- |
| `modelValue`  | `Array<string \| number>`  | `[]`        | The chosen values                        |
| `options`     | `SelectItems`              | —           | The items, same type as `Select`         |
| `placeholder` | `string`                   | locale pack | Text shown when nothing is chosen        |
| `maxVisible`  | `number`                   | `2`         | Maximum chips shown in the trigger       |
| `clearable`   | `boolean`                  | `false`     | Whether the clear-all button is shown    |
| `open`        | `boolean`                  | `false`     | Whether the list is open; `v-model:open` |
| `variant`     | `'primary' \| 'secondary'` | `'primary'` | Variant                                  |
| `size`        | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                     |
| `invalid`     | `boolean`                  | `false`     | Whether validation failed                |
| `disabled`    | `boolean`                  | `false`     | Whether the control is disabled          |
| `class`       | `string`                   | —           | Classes appended to the trigger          |

### Slots {#slots}

| Slot     | Payload                    | Description                     |
| -------- | -------------------------- | ------------------------------- |
| `option` | `{ option: SelectOption }` | Content of each row in the list |

### Events {#events}

| Event               | Payload                          | Description               |
| ------------------- | -------------------------------- | ------------------------- |
| `update:modelValue` | `value: Array<string \| number>` | The chosen values changed |
| `update:open`       | `open: boolean`                  | The list opened or closed |
| `clear`             | —                                | Everything was cleared    |
