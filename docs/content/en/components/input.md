---
title: Input
description: A single-line text field.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/input/Input.vue
---

<Demo name="input/hero" />

## Usage {#usage}

```ts
import { Input } from '@hina-ui/vue'
```

The field renders a native `input` with `v-model` bound to its text. Attributes it does not declare land on the `input`, so `type`, `placeholder`, `maxlength`, `autocomplete` and the like work as usual.

<Demo name="input/basic" />

## Examples {#examples}

### Adornments {#adornments}

The `leading` and `trailing` slots sit on either side of the text area, for icons, units or shortcut hints. Each slot takes a square as tall as the field, with its content centred.

<Demo name="input/adornments" />

### Clearable {#clearable}

`clearable` shows a clear button once there is content; clicking it empties the field and emits `clear`.

<Demo name="input/clearable" />

### Loading {#loading}

`loading` shows a spinner. It replaces the icon in the `leading` slot when there is one, and sits at the end otherwise.

<Demo name="input/loading" />

### Sizes {#sizes}

`sm` suits tables and toolbars, `md` regular forms, and `lg` prominent places such as a sign-in page.

<Demo name="input/sizes" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="input/variants" />

### States {#states}

`invalid` marks a failed validation and `disabled` prevents editing.

<Demo name="input/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label points at the input through `for`, and the description and error message are rendered by the field and linked to it; validation rules, timing and submission belong to the [Form](/components/form).

<Demo name="input/form" />

## Behaviour {#behavior}

- The fill darkens on hover, an accent ring grows from the edge on focus, and the border and ring turn to the danger colour when invalid.
- The clear button only appears with content and when not disabled; clicking it does not blur the text area.
- Clicking an adornment focuses the text area, placing the caret at the start for a leading one and at the end for a trailing one.
- Adornments, the clear button and the spinner all transition in and out.

## Accessibility {#a11y}

- Pair it with a `label` element or an `aria-label` for its name.
- Slot icons are decorative; give an icon an `aria-label` when its meaning matters.
- `invalid` also sets `aria-invalid` and `loading` sets `aria-busy`. The clear button is named from the locale pack.

## API {#api}

### Props {#props}

| Prop         | Type                       | Default     | Description                          |
| ------------ | -------------------------- | ----------- | ------------------------------------ |
| `modelValue` | `string`                   | —           | The text                             |
| `clearable`  | `boolean`                  | `false`     | Whether the clear button is shown    |
| `loading`    | `boolean`                  | `false`     | Whether the spinner is shown         |
| `variant`    | `'primary' \| 'secondary'` | `'primary'` | Variant                              |
| `size`       | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                 |
| `invalid`    | `boolean`                  | `false`     | Whether validation failed            |
| `disabled`   | `boolean`                  | `false`     | Whether the field is disabled        |
| `class`      | `string`                   | —           | Classes appended to the root element |

### Slots {#slots}

| Slot       | Description                         |
| ---------- | ----------------------------------- |
| `leading`  | Adornment at the start of the field |
| `trailing` | Adornment at the end of the field   |

### Events {#events}

| Event               | Payload         | Description          |
| ------------------- | --------------- | -------------------- |
| `update:modelValue` | `value: string` | The text changed     |
| `clear`             | —               | The text was cleared |
