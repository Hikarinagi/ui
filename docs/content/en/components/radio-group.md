---
title: RadioGroup
description: Picks exactly one option from a set.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/radio-group/RadioGroup.vue
  - label: RadioGroup
    href: https://reka-ui.com/docs/components/radio-group
---

<Demo name="radio-group/hero" />

## Usage {#usage}

```ts
import { RadioGroup } from '@hina-ui/vue'
```

The group renders one radio per entry in `options`, and `v-model` binds the chosen value; the option type is the same as `Select`'s. Attributes it does not declare land on the root, so name the group with `aria-label` or `aria-labelledby`. Radios only come as a group; there is no standalone `Radio`.

<Demo name="radio-group/basic" />

## Examples {#examples}

### Horizontal {#horizontal}

With `orientation="horizontal"` the options run in a row and wrap when they run out of room.

<Demo name="radio-group/horizontal" />

### Description {#description}

An option's `description` shows under its label.

<Demo name="radio-group/description" />

### Settings rows {#settings}

Use `control-placement="end"` to place the control after the text and `block` to fill the available width. The description stays below the label. `start` and `end` follow the text direction. With `block`, vertical items fill each row; horizontal items share the row equally. `orientation` still controls the arrangement of options.

For RTL, pass `dir="rtl"` to the group or configure Reka's direction provider.

<Demo name="radio-group/settings" />

### Sizes {#sizes}

`size` is passed to every radio; the circle and the text follow it.

<Demo name="radio-group/sizes" />

### States {#states}

`disabled` on an option disables that option only; on the group it disables them all. `invalid` reaches every circle.

<Demo name="radio-group/states" />

### Custom content {#custom}

The `option` slot customises each label.

The complete option type is inferred from `options`. Slot parameters preserve additional fields and their types; `v-model` still binds to `value`. See [Select](/components/select#types) for the type definitions.

<Demo name="radio-group/custom" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the whole group through `aria-labelledby`, and the error message is rendered by the field; validation rules and submission belong to the [Form](/components/form).

<Demo name="radio-group/form" />

## Behaviour {#behavior}

- Clicking the label or the circle chooses that option; the chosen one cannot be clicked back to unchosen.
- The whole group is one Tab stop, landing on the chosen option; the arrow keys move focus and choose at the same time, skip disabled options and wrap around at the ends. This matches native radios.

## Accessibility {#a11y}

- The root is `role="radiogroup"`, named with `aria-label` or `aria-labelledby`; each item is a button with `role="radio"` and `aria-checked`, and the wrapping `label` supplies its name.
- `invalid` sets `aria-invalid` on every radio.

## API {#api}

### Props {#props}

`T extends SelectOption` is inferred from `options` and defaults to `SelectOption`.

| Prop               | Type                         | Default      | Description                                       |
| ------------------ | ---------------------------- | ------------ | ------------------------------------------------- |
| `modelValue`       | `string \| number \| null`   | —            | The chosen value                                  |
| `options`          | `T[]`                        | —            | The items, see [Select](/components/select#types) |
| `orientation`      | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction                                  |
| `size`             | `'sm' \| 'md' \| 'lg'`       | `'md'`       | Size of every radio                               |
| `controlPlacement` | `'start' \| 'end'`           | `'start'`    | Position of the control relative to its text      |
| `block`            | `boolean`                    | `false`      | Fill the group; horizontal items share the width  |
| `disabled`         | `boolean`                    | `false`      | Whether the whole group is disabled               |
| `invalid`          | `boolean`                    | `false`      | Whether the group failed validation               |
| `class`            | `string`                     | —            | Classes appended to the root element              |

### Slots {#slots}

| Slot     | Payload         | Description        |
| -------- | --------------- | ------------------ |
| `option` | `{ option: T }` | Label of each item |

### Events {#events}

| Event               | Payload                   | Description              |
| ------------------- | ------------------------- | ------------------------ |
| `update:modelValue` | `value: string \| number` | The chosen value changed |
