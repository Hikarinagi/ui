---
title: Listbox
description: An always-visible list of options.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/listbox/Listbox.vue
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

The `option` slot receives `{ option, selected }` to customise each row.

The complete option type is inferred from `options`. Slot parameters preserve additional fields and their types; `v-model` still binds to option values. See [Select](/components/select#types) for the type definitions.

<Demo name="listbox/custom" />

### Trailing content {#trailing}

`#trailing="{ option, selected }"` replaces the entire trailing area. Without this slot the existing check indicator and its reserved space remain. When the slot is provided, an empty result intentionally removes the tail, including its gap; it does not restore the default indicator. Use `<template #trailing />` to omit it for every row, or conditional content to omit it for individual options.

Custom trailing content determines its own width. The example uses `selected` to switch between a [Tag](/components/tag) and a check icon, and returns empty content for some options. The `option` and `trailing` slots receive the same selection state for grouped and plain options, single and multiple selection.

<Demo name="listbox/trailing" />

Custom trailing content does not change selection behaviour.

### Scrolling {#scroll}

`maxHeight` caps the list, at `20rem` by default; past it the list scrolls inside its box.

<Demo name="listbox/scroll" />

### Variants {#variants}

`primary` has a background, border and shadow; `secondary` has only a tinted background.

`bare` removes the root background, border, shadow and corner radius. Option styling and scrolling remain available.

<Demo name="listbox/variants" />

### Padding {#padding}

`padded` defaults to `true`. Set it to `false` to remove the inner list's 4px surrounding padding, independently of `variant`. Each option and group label keeps its own padding. `class` continues to style the root container.

<Demo name="listbox/padding" />

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

`T extends SelectOption` is inferred from `options` and defaults to `SelectOption`.

| Prop         | Type                                                  | Default     | Description                                       |
| ------------ | ----------------------------------------------------- | ----------- | ------------------------------------------------- |
| `modelValue` | `string \| number \| null \| Array<string \| number>` | —           | The chosen value, an array when multiple          |
| `options`    | `SelectItems<T>`                                      | —           | The items, see [Select](/components/select#types) |
| `multiple`   | `boolean`                                             | `false`     | Whether several can be chosen                     |
| `maxHeight`  | `string`                                              | `'20rem'`   | Maximum height of the list                        |
| `padded`     | `boolean`                                             | `true`      | Keep the inner list's surrounding padding         |
| `variant`    | `'primary' \| 'secondary' \| 'bare'`                  | `'primary'` | Variant                                           |
| `disabled`   | `boolean`                                             | `false`     | Whether the list is disabled                      |
| `class`      | `string`                                              | —           | Classes appended to the root element              |

### Slots {#slots}

| Slot       | Payload                            | Description                                           |
| ---------- | ---------------------------------- | ----------------------------------------------------- |
| `option`   | `{ option: T; selected: boolean }` | Content of each row                                   |
| `trailing` | `{ option: T; selected: boolean }` | Entire trailing area; empty content removes its space |

### Events {#events}

| Event               | Payload                                              | Description              |
| ------------------- | ---------------------------------------------------- | ------------------------ |
| `update:modelValue` | `value: string \| number \| Array<string \| number>` | The chosen value changed |
