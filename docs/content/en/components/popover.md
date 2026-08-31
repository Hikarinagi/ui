---
title: Popover
description: A small panel that floats out when a trigger is clicked.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/popover/Popover.vue
  - label: DropdownMenu
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/dropdown-menu/DropdownMenu.vue
---

<Demo name="popover/hero" />

## Usage {#usage}

```ts
import { Popover } from '@hikarinagi/ui'
```

The default slot is the trigger and the `content` slot is what floats out. Clicking the trigger opens the panel; clicking it again, or clicking outside the panel, closes it. The content is laid out freely and can take focus.

<Demo name="popover/basic" />

## Examples {#examples}

### Placement {#placement}

`side` decides which way the panel floats out and `align` how it lines up with the trigger. The default is centred below. When there is not enough room, the panel flips to the opposite side.

<Demo name="popover/placement" />

### Offset {#offset}

`sideOffset` is the distance in pixels between the panel and its trigger.

<Demo name="popover/offset" />

### Controlled {#controlled}

`open` supports two-way binding, so the panel can be opened or closed from outside, and a button inside the panel can close it as well.

<Demo name="popover/controlled" />

### Custom padding {#padded}

The panel is padded by default. Set `padded="false"` when the content should reach the edges and arrange its own spacing.

<Demo name="popover/padded" />

### Triggers {#trigger}

The trigger is not limited to a button; any element that can take focus will do. When an icon button is the trigger, turn its tooltip off so two overlays do not stack up.

<Demo name="popover/trigger" />

## Behaviour {#behavior}

- The page is locked from scrolling while the panel is open.
- The trigger keeps its pressed ink for as long as the panel is open.
- Focus moves into the panel once it opens, and Escape closes it and returns focus to the trigger.
- Clicking outside closes the panel, and that click does not reach the element underneath.

## Accessibility {#a11y}

- The trigger carries `aria-haspopup="dialog"` and `aria-expanded`, and the panel is a `role="dialog"`.
- Headings, descriptions and form controls inside the panel are treated as ordinary page content and announced one by one.
- Focus returns to the trigger once the panel closes, so keyboard users never lose their place.

## API {#api}

### Popover {#props}

| Prop         | Type                                     | Default    | Description                          |
| ------------ | ---------------------------------------- | ---------- | ------------------------------------ |
| `open`       | `boolean`                                | —          | Whether it is open; supports v-model |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Which way it floats out              |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | How it lines up with the trigger     |
| `sideOffset` | `number`                                 | `8`        | Distance from the trigger            |
| `padded`     | `boolean`                                | `true`     | Whether the panel is padded          |
| `class`      | `string`                                 | —          | Classes appended to the panel        |

| Slot      | Description       |
| --------- | ----------------- |
| `default` | The trigger       |
| `content` | The panel content |
