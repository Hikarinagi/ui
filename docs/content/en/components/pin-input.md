---
title: PinInput
description: Enters a code one character per cell.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/pin-input/PinInput.vue
  - label: PinInput
    href: https://reka-ui.com/docs/components/pin-input
---

<Demo name="pin-input/hero" />

## Usage {#usage}

```ts
import { PinInput } from '@hina-ui/vue'
```

A pin input splits a fixed-length code into cells that hold one character each. `v-model` binds the whole string and `length` sets the number of cells, six by default. Typing a character moves focus to the next cell, Backspace moves back, and pasting distributes the text across the cells. Attributes it does not declare land on the root, so name the group with `aria-label` or `aria-labelledby`.

<Demo name="pin-input/basic" />

## Examples {#examples}

### Digits and one-time codes {#number}

`type="number"` accepts digits only. `otp` sets autocomplete to one-time-code, so browsers and operating systems can fill in a code received by SMS.

<Demo name="pin-input/number" />

### Masked {#mask}

`mask` turns every cell into a password field, which suits PIN codes.

<Demo name="pin-input/mask" />

### Placeholder {#placeholder}

`placeholder` shows in empty cells and hides while a cell is focused.

<Demo name="pin-input/placeholder" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`. Every cell is a square whose side equals the height of an input of the same step.

<Demo name="pin-input/sizes" />

### States {#states}

`invalid` gives every cell a warning border and `disabled` disables the group. `variant="secondary"` is the flat form used inside a surface.

<Demo name="pin-input/states" />

## Behavior {#behavior}

- Every cell holds one character; typing moves focus forward, and Backspace in an empty cell moves back and clears the previous cell.
- Pasting distributes the text from the current cell onward; characters beyond the last cell are dropped.
- `complete` fires with the whole string once every cell is filled.
- Left and right arrow keys move focus between cells.

## Accessibility {#a11y}

- The root is `role="group"`; name it with `aria-label` or `aria-labelledby`.
- Every cell carries a "Digit n of N" name from the locale.
- `invalid` also sets `aria-invalid` on every cell.

## API {#api}

### Props {#props}

| Prop          | Type                       | Default     | Description                                   |
| ------------- | -------------------------- | ----------- | --------------------------------------------- |
| `modelValue`  | `string`                   | `''`        | The whole value                               |
| `length`      | `number`                   | `6`         | Number of cells                               |
| `type`        | `'text' \| 'number'`       | `'text'`    | Characters accepted                           |
| `mask`        | `boolean`                  | `false`     | Whether cells display as password fields      |
| `otp`         | `boolean`                  | `false`     | Whether to accept one-time-code autofill      |
| `placeholder` | `string`                   | `''`        | Placeholder shown in empty cells              |
| `name`        | `string`                   | —           | Form field name; the whole value is submitted |
| `variant`     | `'primary' \| 'secondary'` | `'primary'` | Variant                                       |
| `size`        | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                          |
| `disabled`    | `boolean`                  | `false`     | Whether the group is disabled                 |
| `invalid`     | `boolean`                  | `false`     | Whether the group failed validation           |
| `class`       | `string`                   | —           | Classes appended to the root element          |

### Events {#events}

| Event               | Payload         | Description                |
| ------------------- | --------------- | -------------------------- |
| `update:modelValue` | `value: string` | The value changed          |
| `complete`          | `value: string` | Every cell has been filled |
