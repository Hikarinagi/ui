---
title: NumberFormat
description: Formats numbers for the current language.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/number-format/NumberFormat.vue
  - label: Time
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/time/Time.vue
---

<Demo name="number-format/hero" />

## Usage {#usage}

```ts
import { NumberFormat } from '@hikarinagi/ui'
```

`value` is the number to show. The component formats it for the current language and groups thousands by default.

<Demo name="number-format/basic" />

## Examples {#examples}

### Formats {#formats}

Four of them. `decimal` is an ordinary number, `compact` abbreviates large values, `percent` shows a fraction as a percentage, and `currency` also requires a `currency` code.

<Demo name="number-format/formats" />

### Decimal places {#precision}

`precision` caps how many decimal places are shown; missing places are not padded with zeros.

<Demo name="number-format/precision" />

### Following the language {#locale}

Output follows the language provided through `provideUiLocale`. The same number is grouped by ten thousands in Simplified Chinese and by thousands in English.

<Demo name="number-format/locale" />

### Invalid values {#invalid}

When `value` is `null`, `NaN` or infinite, a dash is shown instead of rendering `NaN`.

<Demo name="number-format/invalid" />

## Behaviour {#behavior}

- The `compact` format keeps the full number in `title`, so hovering reveals the unabbreviated value.
- Without a `currency` code the `currency` format falls back to `decimal` and warns in development.

## Accessibility {#a11y}

- The component renders a `span`, and screen readers read the formatted result as text.
- Abbreviating loses precision; the full value is kept in `title`.

## API {#api}

### Props {#props}

| Prop        | Type                                                | Default     | Description                           |
| ----------- | --------------------------------------------------- | ----------- | ------------------------------------- |
| `value`     | `number \| null`                                    | —           | The number to show                    |
| `format`    | `'decimal' \| 'compact' \| 'percent' \| 'currency'` | `'decimal'` | Output format                         |
| `currency`  | `string`                                            | —           | Currency code, required by `currency` |
| `precision` | `number`                                            | —           | Maximum number of decimal places      |
| `class`     | `string`                                            | —           | Classes appended to the root          |
