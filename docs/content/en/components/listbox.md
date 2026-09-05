---
title: Listbox
description: An always-visible list of options.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/listbox/Listbox.vue
  - label: Listbox
    href: https://reka-ui.com/docs/components/listbox
---

<Demo name="listbox/hero" />

## Usage {#usage}

```ts
import { Listbox } from '@hina-ui/vue'
```

The listbox keeps its options on the page and shares its option data with `Select`. `v-model` binds the chosen value, or an array once `multiple` is set. The list scrolls inside its box past `maxHeight`. Attributes it does not declare land on the inner list element.

<Demo name="listbox/basic" />

## Examples {#examples}

### Multiple {#multiple}

With `multiple` set several options can be chosen at once; clicking again unticks.

<Demo name="listbox/multiple" />

### Groups {#groups}

A group carries a `label` and its `options`, and can be mixed with plain options.

<Demo name="listbox/groups" />

### Custom content {#custom}

The `option` slot customises each row.

<Demo name="listbox/custom" />

### Scrolling {#scroll}

`maxHeight` caps the list, at `20rem` by default; past it the list scrolls inside its box.

<Demo name="listbox/scroll" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="listbox/variants" />

### States {#states}

`disabled` disables the whole list, and `disabled` on an option disables that option only.

<Demo name="listbox/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the list through `aria-labelledby`, and the error message is rendered by the field; validation rules and submission belong to the [Form](/components/form).

<Demo name="listbox/form" />

## Behaviour {#behavior}

- Clicking toggles the choice. After tabbing into the list, the arrow keys move the highlight, Enter or Space chooses, and disabled options are skipped.
- Past its height the list scrolls inside its box, and the keyboard highlight scrolls with it.

## Accessibility {#a11y}

- The list is `role="listbox"`, with `aria-multiselectable` when multiple; each option is `role="option"` with `aria-selected`; groups are `role="group"` linked to their label.
- Name the list with `aria-label` or `aria-labelledby`.

## API {#api}

### Props {#props}

| Prop         | Type                                                  | Default     | Description                              |
| ------------ | ----------------------------------------------------- | ----------- | ---------------------------------------- |
| `modelValue` | `string \| number \| null \| Array<string \| number>` | —           | The chosen value, an array when multiple |
| `options`    | `SelectItems`                                         | —           | The items, same type as `Select`         |
| `multiple`   | `boolean`                                             | `false`     | Whether several can be chosen            |
| `maxHeight`  | `string`                                              | `'20rem'`   | Maximum height of the list               |
| `variant`    | `'primary' \| 'secondary'`                            | `'primary'` | Variant                                  |
| `disabled`   | `boolean`                                             | `false`     | Whether the list is disabled             |
| `class`      | `string`                                              | —           | Classes appended to the root element     |

### Slots {#slots}

| Slot     | Payload                    | Description         |
| -------- | -------------------------- | ------------------- |
| `option` | `{ option: SelectOption }` | Content of each row |

### Events {#events}

| Event               | Payload                                              | Description              |
| ------------------- | ---------------------------------------------------- | ------------------------ |
| `update:modelValue` | `value: string \| number \| Array<string \| number>` | The chosen value changed |
