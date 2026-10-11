---
title: PinInput
description: Enters a code one character per cell.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/pin-input/PinInput.vue
---

<Demo name="pin-input/hero" />

## Usage {#usage}

```ts
import { PinInput } from '@hina-ui/vue'
```

A pin input splits a fixed-length code into cells that hold one character each. `v-model` binds the whole string and `length` sets the number of cells, six by default. The group contains a single input and the cells display its value: typing a character advances by one cell, Backspace deletes, and pasting distributes the text across the cells. `aria-label`, `aria-labelledby`, `aria-describedby` and `id` land on the input and every other undeclared attribute lands on the root; name the input with `aria-label` or `aria-labelledby`.

<Demo name="pin-input/basic" />

## Examples {#examples}

### Digits and one-time codes {#number}

`type="number"` accepts digits only and brings up the numeric keyboard on mobile devices. `otp` sets autocomplete to one-time-code, so browsers and operating systems can fill in a code received by SMS.

<Demo name="pin-input/number" />

### Masked {#mask}

`mask` shows the entered characters as dots and makes the input a password field, which suits PIN codes.

<Demo name="pin-input/mask" />

### Placeholder {#placeholder}

`placeholder` shows in empty cells and hides in the current cell while it shows the caret.

<Demo name="pin-input/placeholder" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`. Every cell is a square whose side equals the height of an input of the same step.

<Demo name="pin-input/sizes" />

### States {#states}

`invalid` gives every cell a warning border and `disabled` disables the group. `variant="secondary"` is the flat form used inside a surface.

<Demo name="pin-input/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label is linked to the input and clicking it focuses the input; the description and error message are rendered by the field, and validation rules and submission belong to the [Form](/components/form).

<Demo name="pin-input/form" />

## Behavior {#behavior}

- Clicking a cell moves the current position to it; clicking an empty cell lands on the first empty one, and a double click selects everything.
- Typing a character advances by one cell; a character in the current cell is overwritten, and the position stays on the last cell once the group is full.
- Backspace deletes the character in the current cell and the following characters move up; on the empty position it deletes the previous character.
- Text that arrives as a whole, from a paste, autofill or an input method, overwrites the cells from the current one onward and anything beyond the last cell is dropped; text as long as the group replaces the whole value.
- Whitespace is removed and full-width letters and digits are folded to their half-width forms; `type="number"` keeps digits only.
- Characters being composed with an input method show in the cells and are written to the value as they change; the committed text replaces them.
- Left and right arrow keys, Home and End move the current cell, and holding Shift extends the selection. Keyboard focus lands on the first empty cell, or selects everything when the group is full.
- `complete` fires with the whole string when the value changes and fills every cell.

## Accessibility {#a11y}

- The group is one text input, named by `aria-label`, `aria-labelledby` or the label of a FormField; the cells are hidden from assistive technology.
- `invalid` sets `aria-invalid` on the input.

## API {#api}

### Props {#props}

| Prop          | Type                       | Default     | Description                                   |
| ------------- | -------------------------- | ----------- | --------------------------------------------- |
| `modelValue`  | `string`                   | `''`        | The whole value                               |
| `length`      | `number`                   | `6`         | Number of cells                               |
| `type`        | `'text' \| 'number'`       | `'text'`    | Characters accepted                           |
| `mask`        | `boolean`                  | `false`     | Whether to show dots and use a password input |
| `otp`         | `boolean`                  | `false`     | Whether to accept one-time-code autofill      |
| `placeholder` | `string`                   | `''`        | Placeholder shown in empty cells              |
| `name`        | `string`                   | —           | Form field name; the whole value is submitted |
| `variant`     | `'primary' \| 'secondary'` | `'primary'` | Variant                                       |
| `size`        | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                          |
| `disabled`    | `boolean`                  | `false`     | Whether the group is disabled                 |
| `invalid`     | `boolean`                  | `false`     | Whether the group failed validation           |
| `required`    | `boolean`                  | `false`     | Whether the form requires a value             |
| `dir`         | `'ltr' \| 'rtl'`           | —           | Direction; follows the provider by default    |
| `class`       | `string`                   | —           | Classes appended to the root element          |

### Events {#events}

| Event               | Payload         | Description                |
| ------------------- | --------------- | -------------------------- |
| `update:modelValue` | `value: string` | The value changed          |
| `complete`          | `value: string` | A change filled every cell |
