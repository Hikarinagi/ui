---
title: Checkbox
description: Ticks one option, or several out of many.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/checkbox/Checkbox.vue
  - label: Checkbox
    href: https://reka-ui.com/docs/components/checkbox
---

<Demo name="checkbox/hero" />

## Usage {#usage}

```ts
import { Checkbox } from '@hina-ui/vue'
```

The checkbox joins the box and its label into one clickable unit. `v-model` binds a boolean, and the value `'indeterminate'` shows the mixed state. The default slot is the label; clicking either the label or the box toggles. Attributes it does not declare land on the inner box element.

<Demo name="checkbox/basic" />

## Examples {#examples}

### Description {#description}

`description` adds a line of supporting text under the label, one size smaller.

<Demo name="checkbox/description" />

### Indeterminate {#indeterminate}

The value `'indeterminate'` shows a dash. The usual case is "select all": the parent is indeterminate while some children are ticked, and clicking it ticks them all.

<Demo name="checkbox/indeterminate" />

### Sizes {#sizes}

`size` is `sm`, `md` or `lg`; the box is 14, 16 or 18 pixels and the text follows.

<Demo name="checkbox/sizes" />

### States {#states}

`invalid` turns the box border to the danger colour; `disabled` disables the whole control.

<Demo name="checkbox/states" />

### Box only {#bare}

Without a label only the box renders, and it must then be named with `aria-label`. Row selection in a table is the typical case.

<Demo name="checkbox/bare" />

### In a form {#form}

Inside a [FormField](/components/form-field) the error message is rendered by the field and linked to the checkbox; validation rules and submission belong to the [Form](/components/form). The checkbox carries its own text, so the field needs no label.

<Demo name="checkbox/form" />

## Behaviour {#behavior}

- Clicking the label or the box toggles. Tab lands on the box, Space toggles and Enter does not, as with a native checkbox.
- Clicking an indeterminate checkbox ticks it.
- Hovering anywhere on the control inks the box, pressing deepens it; the tick scales in and fades out.

## Accessibility {#a11y}

- The box is a button with `role="checkbox"` and `aria-checked`, `mixed` when indeterminate. The root is a `label`, so the text is the accessible name.
- Without a label, name the box with `aria-label` or `aria-labelledby`.
- `invalid` also sets `aria-invalid`.

## API {#api}

### Props {#props}

| Prop          | Type                         | Default | Description                                 |
| ------------- | ---------------------------- | ------- | ------------------------------------------- |
| `modelValue`  | `boolean \| 'indeterminate'` | `false` | Whether ticked; `'indeterminate'` for mixed |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`  | Size                                        |
| `description` | `string`                     | —       | Supporting text under the label             |
| `disabled`    | `boolean`                    | `false` | Whether the control is disabled             |
| `invalid`     | `boolean`                    | `false` | Whether the control failed validation       |
| `class`       | `string`                     | —       | Classes appended to the root element        |

### Slots {#slots}

| Slot      | Payload | Description |
| --------- | ------- | ----------- |
| `default` | —       | The label   |

### Events {#events}

| Event               | Payload          | Description       |
| ------------------- | ---------------- | ----------------- |
| `update:modelValue` | `value: boolean` | The value changed |
