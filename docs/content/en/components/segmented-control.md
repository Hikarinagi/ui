---
title: SegmentedControl
description: Switches among a few peer options.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/segmented-control/SegmentedControl.vue
  - label: ToggleGroup
    href: https://reka-ui.com/docs/components/toggle-group
---

<Demo name="segmented-control/hero" />

## Usage {#usage}

```ts
import { SegmentedControl } from '@hina-ui/vue'
```

A segmented control lays a few peer options in a row; exactly one is selected at any time, and a sliding thumb marks it. `options` uses the types defined by [Select](/components/select#types), `v-model` binds the selected value, and with no bound value the first enabled option is selected. Attributes it does not declare land on the root, so name the group with `aria-label` or `aria-labelledby`.

<Demo name="segmented-control/basic" />

It expresses the same choice as `RadioGroup`; the difference is the occasion. Use a segmented control for up to five short options that take effect immediately; use a radio group when the options need descriptions or the choice is submitted with a form. Unlike `Tabs`, it changes a value rather than which content is shown.

## Examples {#examples}

### Custom content {#custom}

The `#option` slot replaces the content of every item. With icons only, each item is still named by its `label`, so screen readers read it as usual.

The complete option type is inferred from `options`. Slot parameters preserve additional fields and their types; `v-model` still binds to `value`. See [Select](/components/select#types) for the type definitions.

<Demo name="segmented-control/custom" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`. The overall height equals an input of the same step, so it sits in one row with inputs and buttons.

<Demo name="segmented-control/sizes" />

### Block {#block}

`block` stretches the control to the width of its parent, with items of equal width.

<Demo name="segmented-control/block" />

### Vertical {#vertical}

`orientation="vertical"` stacks the items; the thumb moves up and down.

<Demo name="segmented-control/vertical" />

### States {#states}

`disabled` disables the whole group. A `disabled` option disables only that item, and keyboard navigation skips it.

<Demo name="segmented-control/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the whole group through `aria-labelledby`; validation rules and submission belong to the [Form](/components/form). A segmented control always has a value, and that value often decides whether another field is required; such a rule goes on the object and names the field the error lands on.

<Demo name="segmented-control/form" />

## Behavior {#behavior}

- Clicking an item selects it and the thumb slides to it; clicking the selected item again does not deselect it.
- Tab lands on the selected item. Arrow keys move focus between items, Space or Enter selects the focused one, and focus wraps at both ends.
- Hover and press ink land on the item; on the selected item the ink lands on the thumb.

## Accessibility {#a11y}

- The root is `role="group"`; every item is a button with `aria-pressed`.
- Name the group with `aria-label` or `aria-labelledby`. With the `#option` slot, every item is named by its `label`.

## API {#api}

### Props {#props}

`T extends SelectOption` is inferred from `options` and defaults to `SelectOption`.

| Prop          | Type                         | Default                    | Description                                       |
| ------------- | ---------------------------- | -------------------------- | ------------------------------------------------- |
| `modelValue`  | `string \| number`           | value of the first enabled | The selected value                                |
| `options`     | `T[]`                        | —                          | The items, see [Select](/components/select#types) |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`                     | Size                                              |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'`             | Layout direction                                  |
| `block`       | `boolean`                    | `false`                    | Whether to fill the parent width                  |
| `disabled`    | `boolean`                    | `false`                    | Whether the whole group is disabled               |
| `class`       | `string`                     | —                          | Classes appended to the root element              |

### Slots {#slots}

| Slot     | Payload         | Description          |
| -------- | --------------- | -------------------- |
| `option` | `{ option: T }` | Content of each item |

### Events {#events}

| Event               | Payload                   | Description                |
| ------------------- | ------------------------- | -------------------------- |
| `update:modelValue` | `value: string \| number` | The selected value changed |
