---
title: Indicator
description: A small dot that shows a status.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/indicator/Indicator.vue
---

<Demo name="indicator/hero" />

## Usage {#usage}

```ts
import { Indicator } from '@hina-ui/vue'
```

The dot has a colour and nothing else. Put it before text to show the status of that item, or pin it to the corner of an avatar with `Badge` to show presence.

<Demo name="indicator/basic" />

## Examples {#examples}

### Tones {#tones}

Six tones; the default is `neutral`.

<Demo name="indicator/tones" />

### Sizes {#sizes}

Three sizes; the default is `md`.

<Demo name="indicator/sizes" />

### Pulse {#pulse}

With `pulse` set the dot sends out a fading ring, for a status that is in progress such as ongoing or live.

<Demo name="indicator/pulse" />

### Spoken label {#label}

When no text next to the dot states the status, give screen readers one through `label`.

<Demo name="indicator/label" />

### On an avatar {#badge}

Use the `bare` mode of `Badge` to pin the dot to the corner of an avatar, with the dot in the `content` slot.

<Demo name="indicator/badge" />

## Behaviour {#behavior}

- The dot is not interactive and does not follow the state of its host.
- When the system asks for reduced motion the `pulse` ring is not shown.

## Accessibility {#a11y}

- Without `label` the dot is hidden from assistive technology; the status should be stated by the text next to it.
- With `label` set, screen readers read that text, for example “Online”.

## API {#api}

### Props {#props}

| Prop    | Type                                                                    | Default     | Description                          |
| ------- | ----------------------------------------------------------------------- | ----------- | ------------------------------------ |
| `tone`  | `'neutral' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | Tone                                 |
| `size`  | `'sm' \| 'md' \| 'lg'`                                                  | `'md'`      | Size                                 |
| `pulse` | `boolean`                                                               | `false`     | Whether to send out a fading ring    |
| `label` | `string`                                                                | —           | Text read by screen readers          |
| `as`    | `string`                                                                | `'span'`    | The rendered tag                     |
| `class` | `string`                                                                | —           | Classes appended to the root element |
