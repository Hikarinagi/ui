---
title: CheckboxGroup
description: A set of checkboxes sharing one array value.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/checkbox-group/CheckboxGroup.vue
  - label: Checkbox
    href: https://reka-ui.com/docs/components/checkbox
---

<Demo name="checkbox-group/hero" />

## Usage {#usage}

```ts
import { CheckboxGroup } from '@hina-ui/vue'
```

The group renders one `Checkbox` per entry in `options`, and `v-model` binds the array of chosen values; the option type is the same as `Select`'s. Attributes it does not declare land on the root, so name the group with `aria-label` or `aria-labelledby`.

<Demo name="checkbox-group/basic" />

## Examples {#examples}

### Horizontal {#horizontal}

With `orientation="horizontal"` the options run in a row and wrap when they run out of room.

<Demo name="checkbox-group/horizontal" />

### Description {#description}

An option's `description` shows under its label.

<Demo name="checkbox-group/description" />

### Sizes {#sizes}

`size` is passed to every checkbox.

<Demo name="checkbox-group/sizes" />

### States {#states}

`disabled` on an option disables that option only; on the group it disables them all. `invalid` reaches every box.

<Demo name="checkbox-group/states" />

### Custom content {#custom}

The `option` slot customises each label.

<Demo name="checkbox-group/custom" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the whole group through `aria-labelledby`, and the description and error message are rendered by the field; validation rules and submission belong to the [Form](/components/form).

<Demo name="checkbox-group/form" />

## Behaviour {#behavior}

- Ticking adds the value to the array, ticking again removes it; the array keeps the order values were ticked in.
- Every checkbox is its own Tab stop, Space toggles the focused one and the arrow keys do not move focus, as with a native group of checkboxes.

## Accessibility {#a11y}

- The root is `role="group"`, named with `aria-label` or `aria-labelledby`; each item keeps the `Checkbox` semantics.

## API {#api}

### Props {#props}

| Prop          | Type                         | Default      | Description                          |
| ------------- | ---------------------------- | ------------ | ------------------------------------ |
| `modelValue`  | `Array<string \| number>`    | `[]`         | The chosen values                    |
| `options`     | `SelectOption[]`             | —            | The items, same type as `Select`     |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction                     |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`       | Size of every checkbox               |
| `disabled`    | `boolean`                    | `false`      | Whether the whole group is disabled  |
| `invalid`     | `boolean`                    | `false`      | Whether the group failed validation  |
| `class`       | `string`                     | —            | Classes appended to the root element |

### Slots {#slots}

| Slot     | Payload                    | Description        |
| -------- | -------------------------- | ------------------ |
| `option` | `{ option: SelectOption }` | Label of each item |

### Events {#events}

| Event               | Payload                          | Description               |
| ------------------- | -------------------------------- | ------------------------- |
| `update:modelValue` | `value: Array<string \| number>` | The chosen values changed |
