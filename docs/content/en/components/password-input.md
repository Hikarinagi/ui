---
title: PasswordInput
description: A password field with a visibility toggle.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/password-input/PasswordInput.vue
---

<Demo name="password-input/hero" />

## Usage {#usage}

```ts
import { PasswordInput } from '@hina-ui/vue'
```

The field ends with a button that switches between masked and plain text, with `v-model` bound to the text. Attributes it does not declare land on the `input`; pass `autocomplete`, using `current-password` for sign-in and `new-password` for sign-up and password changes.

<Demo name="password-input/basic" />

## Examples {#examples}

### Visibility {#visible}

`visible` controls whether the text is shown in plain, and supports `v-model:visible`. Two fields sharing one value toggle together.

<Demo name="password-input/visible" />

### Sizes {#sizes}

Three sizes, matching the input.

<Demo name="password-input/sizes" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="password-input/variants" />

### States {#states}

`invalid` marks a failed validation and `disabled` prevents editing.

<Demo name="password-input/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label points at the input, and the description and error message are rendered by the field; validation rules and submission belong to the [Form](/components/form). A rule that spans fields, such as the two entries matching, goes on the object and names the field the error lands on.

<Demo name="password-input/form" />

## Behaviour {#behavior}

- Clicking the toggle does not blur the text area, so typing can continue after switching.
- The toggle only changes how the text is displayed, not its value.
- Hover, focus, invalid and disabled behave the same as the input.

## Accessibility {#a11y}

- The toggle is reachable with Tab; its name switches between "Show password" and "Hide password" with the state.
- Pair it with a `label` element or an `aria-label` for its name. `invalid` also sets `aria-invalid`.

## API {#api}

### Props {#props}

| Prop         | Type                       | Default     | Description                                           |
| ------------ | -------------------------- | ----------- | ----------------------------------------------------- |
| `modelValue` | `string`                   | —           | The text                                              |
| `visible`    | `boolean`                  | `false`     | Whether the text is shown in plain; `v-model:visible` |
| `variant`    | `'primary' \| 'secondary'` | `'primary'` | Variant                                               |
| `size`       | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                                  |
| `invalid`    | `boolean`                  | `false`     | Whether validation failed                             |
| `disabled`   | `boolean`                  | `false`     | Whether the field is disabled                         |
| `class`      | `string`                   | —           | Classes appended to the root element                  |

| Event               | Payload            | Description            |
| ------------------- | ------------------ | ---------------------- |
| `update:modelValue` | `value: string`    | The text changed       |
| `update:visible`    | `visible: boolean` | The visibility changed |
