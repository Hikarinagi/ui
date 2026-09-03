---
title: Chip
description: An item that can be selected or removed.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/chip/Chip.vue
---

<Demo name="chip/hero" />

## Usage {#usage}

```ts
import { Chip } from '@hina-ui/vue'
```

A chip is used in one of two ways: `selectable` makes it selectable, `removable` gives it a remove button, and the two are exclusive. A short label with no interaction is a `Tag`.

<Demo name="chip/basic" />

## Examples {#examples}

### Selectable {#selectable}

With `selectable` set the chip renders as a button and `v-model:selected` binds its selected state. A selected chip takes the accent colour and shows a check icon before its text.

<Demo name="chip/selectable" />

### Removable {#removable}

With `removable` set a remove button sits at the end of the chip and emits `remove` when clicked; the chip itself is not clickable.

<Demo name="chip/removable" />

### Variants and tones {#variants}

`soft` has a tinted background and `outline` only a border; the default is `soft`. The tones are `neutral` and `accent`, with `neutral` as the default.

<Demo name="chip/variants" />

### Sizes {#sizes}

`md` matches the height of a small button; `sm` is for inputs and dense lists.

<Demo name="chip/sizes" />

### With an icon {#icons}

Put the icon in the `icon` slot. On a selectable chip the icon gives way to the check icon once selected.

<Demo name="chip/icons" />

### Disabled {#disabled}

A `disabled` chip ignores clicks, and its remove button is disabled as well.

<Demo name="chip/disabled" />

### As a link {#link}

With `as` set to `a` and an `href`, the chip becomes a link with hover and press feedback, for entry points such as a tag page.

<Demo name="chip/link" />

## Behaviour {#behavior}

- A selectable chip is a native button: click, Enter and Space all toggle it.
- Once selected a check icon appears before the text; with an `icon` slot, the icon gives way to the check.
- With the remove button focused, Enter, Space, Backspace and Delete all emit `remove`; clicking the remove button does not trigger a click on the chip.
- Setting both `selectable` and `removable` warns in development and ignores `removable`.
- A disabled chip ignores clicks and leaves the keyboard focus order.

## Accessibility {#a11y}

- A selectable chip carries `aria-pressed`, so screen readers announce it as a toggle button.
- The remove button is named “Remove”, taken from `chip.remove` in the locale.
- A removable chip is not focusable itself; keyboard focus lands on the remove button directly.

## API {#api}

### Props {#props}

| Prop         | Type                    | Default     | Description                                                  |
| ------------ | ----------------------- | ----------- | ------------------------------------------------------------ |
| `selectable` | `boolean`               | `false`     | Whether the chip can be selected                             |
| `selected`   | `boolean`               | `false`     | Selected state, supports `v-model:selected`                  |
| `removable`  | `boolean`               | `false`     | Whether the chip has a remove button                         |
| `variant`    | `'soft' \| 'outline'`   | `'soft'`    | Visual style                                                 |
| `tone`       | `'neutral' \| 'accent'` | `'neutral'` | Tone                                                         |
| `size`       | `'sm' \| 'md'`          | `'md'`      | Size                                                         |
| `disabled`   | `boolean`               | `false`     | Whether the chip is disabled                                 |
| `ripple`     | `boolean`               | `true`      | Whether pressing shows a ripple                              |
| `as`         | `string`                | —           | The rendered tag: `button` when selectable, otherwise `span` |
| `class`      | `string`                | —           | Classes appended to the root element                         |

### Events {#events}

| Event             | Payload             | Description                   |
| ----------------- | ------------------- | ----------------------------- |
| `update:selected` | `selected: boolean` | The selected state changed    |
| `remove`          | —                   | The remove button was clicked |

### Slots {#slots}

| Slot      | Description             |
| --------- | ----------------------- |
| `default` | The chip's text         |
| `icon`    | An icon before the text |
