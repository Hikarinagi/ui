---
title: NumberInput
description: A field for entering numbers.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/number-input/NumberInput.vue
  - label: Variants
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/number-input/number-input.variants.ts
---

<Demo name="number-input/hero" />

## Usage {#usage}

```ts
import { NumberInput } from '@hina-ui/vue'
```

The field pairs a text area with a pair of stepper buttons, with `v-model` bound to the number. Arrow keys, Page Up and Page Down, Home and End, and the mouse wheel while focused all adjust the value. Attributes it does not declare land on the inner `input`.

<Demo name="number-input/basic" />

## Examples {#examples}

### Range and step {#range}

`min` and `max` bound the value and `step` sets how much each change moves it. Typed values snap to the step by default; turn `stepSnapping` off to only clamp the range.

<Demo name="number-input/range" />

### Format {#format}

`formatOptions` takes `Intl.NumberFormat` options, so currencies, percentages and units all display. `locale` sets the separators and symbols; it defaults to the locale pack's language.

<Demo name="number-input/format" />

### Sizes {#sizes}

Three sizes, matching the input.

<Demo name="number-input/sizes" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="number-input/variants" />

### States {#states}

`invalid` marks a failed validation, `disabled` prevents editing, and `readonly` allows focus and copying but no changes.

<Demo name="number-input/states" />

### Without steppers {#controls}

With `controls` off only the text area remains; keyboard and wheel still work.

<Demo name="number-input/controls" />

## Behaviour {#behavior}

- The text is parsed on blur or Enter. Unparseable text reverts to the previous value, and out-of-range values clamp to the bounds.
- Characters that cannot form a number are rejected while typing.
- The steppers repeat while held and disable at the bound they have reached.
- Hover, focus, invalid and disabled behave the same as the input.

## Accessibility {#a11y}

- The root is `role="group"` and the text area is `role="spinbutton"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.
- The steppers are outside the Tab order; keyboard users adjust with the arrow keys. Their names come from the locale pack.
- Pair it with a `label` element or an `aria-label` for its name. `invalid` also sets `aria-invalid`.

## API {#api}

### Props {#props}

| Prop            | Type                       | Default     | Description                          |
| --------------- | -------------------------- | ----------- | ------------------------------------ |
| `modelValue`    | `number \| null`           | —           | The value                            |
| `defaultValue`  | `number`                   | —           | Initial value when uncontrolled      |
| `min`           | `number`                   | —           | Minimum                              |
| `max`           | `number`                   | —           | Maximum                              |
| `step`          | `number`                   | `1`         | Step                                 |
| `stepSnapping`  | `boolean`                  | `true`      | Whether values snap to the step      |
| `formatOptions` | `Intl.NumberFormatOptions` | —           | Display format                       |
| `locale`        | `string`                   | —           | Locale used for formatting           |
| `controls`      | `boolean`                  | `true`      | Whether the steppers are shown       |
| `variant`       | `'primary' \| 'secondary'` | `'primary'` | Variant                              |
| `size`          | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                 |
| `invalid`       | `boolean`                  | `false`     | Whether validation failed            |
| `disabled`      | `boolean`                  | `false`     | Whether the field is disabled        |
| `readonly`      | `boolean`                  | `false`     | Whether the field is read-only       |
| `class`         | `string`                   | —           | Classes appended to the root element |

| Event               | Payload                      | Description       |
| ------------------- | ---------------------------- | ----------------- |
| `update:modelValue` | `value: number \| undefined` | The value changed |
