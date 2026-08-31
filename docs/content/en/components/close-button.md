---
title: CloseButton
description: Dismisses dialogs, drawers and toasts.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/close-button/CloseButton.vue
  - label: IconButton
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/icon-button/IconButton.vue
---

<Demo name="close-button/hero" />

## Usage {#usage}

```ts
import { CloseButton } from '@hikarinagi/ui'
```

The icon and the accessible name are built in, so no property is required. The default name is “Close”; just listen for `click`.

<Demo name="close-button/basic" />

## Examples {#examples}

### Sizes {#sizes}

Defaults to `sm`. A close button usually sits on a title row or in the top corner of a card, where `sm` matches the height of the neighbouring text most closely. Enlarge it where touch is the primary input.

<Demo name="close-button/sizes" />

### Tooltip {#tooltip}

No tooltip is shown by default. When the name is rewritten to something more specific, turn the tooltip on and set its direction with `side`.

<Demo name="close-button/tooltip" />

### Unavailable {#disabled}

With `disabled` the button cannot be clicked and cannot take keyboard focus. Blocking dismissal while a form submits is a common case.

<Demo name="close-button/disabled" />

## Appearance {#appearance}

Variant, tone and shape are not exposed; they are fixed to the `ghost` variant, the `neutral` tone and a circle, with the icon fixed to an X.

If another appearance or another icon is needed, use `IconButton` directly.

## Dialogs and toasts {#overlays}

`Dialog`, `Drawer` and `Toast` already place a close button at the end of their title row, so there is no need to add another. When `Dialog` or `Drawer` sets `locked`, that built-in button is disabled with it.

<Demo name="close-button/in-dialog" />

## Accessibility {#a11y}

- The default name is “Close” and can be rewritten through `label` to something more specific, such as “Close preview”.
- The button renders a native `button`, takes keyboard focus, and responds to both Enter and Space.
- Screen readers read only the name; the icon is not announced.

## API {#api}

### Props {#props}

| Prop       | Type                   | Default | Description                                |
| ---------- | ---------------------- | ------- | ------------------------------------------ |
| `label`    | `string`               | Close   | Accessible name, also used as tooltip text |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'sm'`  | Size                                       |
| `tooltip`  | `boolean`              | `false` | Whether to show a tooltip                  |
| `disabled` | `boolean`              | `false` | Whether the button is unavailable          |
| `class`    | `string`               | —       | Classes appended to the button             |

Remaining attributes are passed to `IconButton`, for example `side` for the tooltip direction.
