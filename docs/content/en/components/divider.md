---
title: Divider
description: A hairline that separates two pieces of content.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/divider/Divider.vue
  - label: Separator
    href: https://reka-ui.com/docs/components/separator
---

<Demo name="divider/hero" />

## Usage {#usage}

```ts
import { Divider } from '@hina-ui/vue'
```

Divider draws a one-pixel line coloured from `--hn-line`. It runs the full width of its container by default.

<Demo name="divider/basic" />

## Examples {#examples}

### With a label {#label}

Text in the default slot breaks the line in two and sits between the halves. This shape works only horizontally.

<Demo name="divider/label" />

### Vertical {#vertical}

`orientation="vertical"` draws a vertical line whose height comes from the cross axis of the flex container, so the container needs a height of its own.

<Demo name="divider/vertical" />

### Decorative {#decorative}

By default it renders as `role="separator"` and is announced by screen readers. A line drawn purely for looks takes `decorative`, which keeps it out of the accessibility tree.

<Demo name="divider/decorative" />

## API {#api}

| Prop          | Type                         | Default        | Description                              |
| ------------- | ---------------------------- | -------------- | ---------------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction                                |
| `decorative`  | `boolean`                    | `false`        | Whether it leaves the accessibility tree |
| `class`       | `string`                     | —              | Classes appended to the line             |

| Slot      | Description                           |
| --------- | ------------------------------------- |
| `default` | Text inside the line; horizontal only |
