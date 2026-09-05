---
title: Select
description: Picks one item from a list.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/select/Select.vue
  - label: Select
    href: https://reka-ui.com/docs/components/select
---

<Demo name="select/hero" />

## Usage {#usage}

```ts
import { Select } from '@hina-ui/vue'
```

The select pairs a trigger with a floating list. `options` supplies the items and `v-model` binds the chosen value. Each option is `{ value, label }`, optionally with `description` and `disabled`; an item with an `options` field is a group. The trigger shares the input's field surface.

<Demo name="select/basic" />

## Examples {#examples}

### Groups {#groups}

A group carries a `label` and its `options`, and can be mixed with plain options.

<Demo name="select/groups" />

### Custom content {#custom}

The `option` slot customises each row in the list and the `value` slot customises what the trigger shows; both receive the current option.

<Demo name="select/custom" />

### Sizes {#sizes}

Three sizes, matching the input.

<Demo name="select/sizes" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="select/variants" />

### States {#states}

`invalid` marks a failed validation, `disabled` disables the whole select, and `disabled` on an option disables that option only. An empty list shows a hint.

<Demo name="select/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label points at the trigger, and the description and error message are rendered by the field and linked to it; validation rules, timing and submission belong to the [Form](/components/form).

<Demo name="select/form" />

## Behaviour {#behavior}

- The list opens against the trigger at the same width, and scrolls inside the panel when it is taller than the space available.
- Page scrolling is locked while open; clicking outside or pressing Esc closes it.
- Arrow keys, Home, End and typing the first letters move the highlight.
- Choosing an option closes the list and returns focus to the trigger.

## Accessibility {#a11y}

- The trigger is `role="combobox"`, the list is `role="listbox"` and each option is `role="option"` with `aria-selected`.
- Pair it with a `label` element or an `aria-label` for its name. `invalid` also sets `aria-invalid`.

## API {#api}

### Props {#props}

| Prop           | Type                       | Default     | Description                              |
| -------------- | -------------------------- | ----------- | ---------------------------------------- |
| `modelValue`   | `string \| number \| null` | —           | The chosen value                         |
| `options`      | `SelectItems`              | —           | The items, see the types below           |
| `placeholder`  | `string`                   | locale pack | Text shown when nothing is chosen        |
| `open`         | `boolean`                  | `false`     | Whether the list is open; `v-model:open` |
| `variant`      | `'primary' \| 'secondary'` | `'primary'` | Variant                                  |
| `size`         | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                     |
| `invalid`      | `boolean`                  | `false`     | Whether validation failed                |
| `name`         | `string`                   | —           | Native form field name                   |
| `required`     | `boolean`                  | `false`     | Require a selection when `name` is set   |
| `autocomplete` | `string`                   | —           | Native form autofill hint                |
| `disabled`     | `boolean`                  | `false`     | Whether the select is disabled           |
| `class`        | `string`                   | —           | Classes appended to the trigger          |

### Slots {#slots}

| Slot     | Payload                    | Description                     |
| -------- | -------------------------- | ------------------------------- |
| `value`  | `{ option: SelectOption }` | Content shown in the trigger    |
| `option` | `{ option: SelectOption }` | Content of each row in the list |

### Events {#events}

| Event               | Payload                   | Description               |
| ------------------- | ------------------------- | ------------------------- |
| `update:modelValue` | `value: string \| number` | The chosen value changed  |
| `update:open`       | `open: boolean`           | The list opened or closed |

### Types {#types}

```ts
interface SelectOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

type SelectItems = Array<SelectOption | SelectOptionGroup>
```
