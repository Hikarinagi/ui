---
title: Statistic
description: A key figure set large, with its label and change.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/statistic/Statistic.vue
---

<Demo name="statistic/hero" />

## Usage {#usage}

```ts
import { Statistic } from '@hina-ui/vue'
```

`label` says what the figure is and `value` is the figure itself. Numbers are grouped according to the interface language; strings are shown as they are. The component has no border or background of its own; place it in a [Card](/components/card) or a [Panel](/components/panel).

<Demo name="statistic/basic" />

## Examples {#examples}

### Change {#delta}

`delta` is the change against the previous period as a ratio, shown as a signed percentage: up in the success colour, down in the danger colour. `deltaLabel` names what it is compared with. For figures where lower is better, set `invert`.

<Demo name="statistic/delta" />

### Number format {#format}

`format` works as in [NumberFormat](/components/number-format): `compact` abbreviates large numbers, `percent` shows a percentage, `currency` shows money together with `currency`; `precision` caps the decimals.

<Demo name="statistic/format" />

### Prefix and suffix {#affix}

`prefix` and `suffix` sit on either side of the figure in a smaller size, for units and symbols.

<Demo name="statistic/affix" />

### Icon {#icon}

The `icon` slot shows an icon on the right; it is decorative.

<Demo name="statistic/icon" />

### Loading {#loading}

With `loading` the figure and the change are each replaced by a skeleton while the label stays visible, so the layout does not jump.

<Demo name="statistic/loading" />

### Sizes {#sizes}

Three sizes change only the size of the figure, `md` by default.

<Demo name="statistic/sizes" />

## Accessibility {#a11y}

- Label, figure and change are plain text, read in reading order.
- The change arrow and the icon on the right are decorative and hidden from assistive technology; the direction is conveyed by the signed percentage.

## API {#api}

### Props {#props}

| Prop         | Type                                                | Default     | Description                         |
| ------------ | --------------------------------------------------- | ----------- | ----------------------------------- |
| `label`      | `string`                                            | —           | Required. What the figure is        |
| `value`      | `number \| string \| null`                          | —           | The figure; empty shows a dash      |
| `format`     | `'decimal' \| 'compact' \| 'percent' \| 'currency'` | `'decimal'` | Number format                       |
| `currency`   | `string`                                            | —           | Currency code, with `currency`      |
| `precision`  | `number`                                            | —           | Maximum number of decimals          |
| `prefix`     | `string`                                            | —           | Symbol before the figure            |
| `suffix`     | `string`                                            | —           | Unit after the figure               |
| `delta`      | `number`                                            | —           | Change as a ratio, `0.12` for 12%   |
| `deltaLabel` | `string`                                            | —           | What the change is compared with    |
| `invert`     | `boolean`                                           | `false`     | Treat a decrease as the good change |
| `loading`    | `boolean`                                           | `false`     | Whether to show a skeleton          |
| `size`       | `'sm' \| 'md' \| 'lg'`                              | `'md'`      | Size of the figure                  |
| `class`      | `string`                                            | —           | Extra classes on the root element   |

### Slots {#slots}

| Slot    | Description              |
| ------- | ------------------------ |
| default | Content under the figure |
| `icon`  | Icon on the right        |
