---
title: HoverCard
description: A preview card that floats out while hovering a link.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/hover-card/HoverCard.vue
  - label: HoverCard
    href: https://reka-ui.com/docs/components/hover-card
---

<Demo name="hover-card/hero" />

## Usage {#usage}

```ts
import { HoverCard } from '@hina-ui/vue'
```

The hover card gives a link a preview: after the pointer rests on the trigger for a moment the card floats out, and it pulls back once the pointer leaves; focusing the trigger with the keyboard opens it at once. The default slot is the trigger, usually a link, and the `content` slot is the card. It is something to glance at, so it neither stops the page from scrolling nor takes focus.

<Demo name="hover-card/basic" />

## Examples {#examples}

### Placement {#placement}

`side` sets the direction the card floats out on and `align` how it lines up with the trigger, as in Popover; the default is right below.

<Demo name="hover-card/placement" />

### Delays {#delay}

`openDelay` is how long the pointer rests before the card opens and `closeDelay` how long after leaving it closes, both in milliseconds. Moving from the trigger into the card does not close it.

<Demo name="hover-card/delay" />

### Controlled {#controlled}

`open` supports two-way binding. The card still closes when the pointer leaves, on a click outside or on Esc, writing `false` back; an outside control only opens it.

<Demo name="hover-card/controlled" />

## Behavior {#behavior}

- Opens after the pointer rests for `openDelay` and closes `closeDelay` after it leaves; moving into the card keeps it open.
- Focusing the trigger with the keyboard opens it at once, and leaving closes it.
- A click outside the card or Esc closes it as well.
- The card does not stop the page from scrolling, and the rest of the page stays interactive.
- Touch does not open it.

## Accessibility {#a11y}

- The card is supplementary; nothing in it should be the only way to reach something.
- The trigger should be focusable so keyboard users can see the card.

## API {#api}

### Props {#props}

| Prop         | Type                                     | Default    | Description                                  |
| ------------ | ---------------------------------------- | ---------- | -------------------------------------------- |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Side the card floats out on                  |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | Alignment against the trigger                |
| `sideOffset` | `number`                                 | `8`        | Distance from the trigger in pixels          |
| `openDelay`  | `number`                                 | `300`      | Rest time before opening, in milliseconds    |
| `closeDelay` | `number`                                 | `150`      | Delay after leaving before closing, in ms    |
| `padded`     | `boolean`                                | `true`     | Whether the card has padding                 |
| `open`       | `boolean`                                | —          | Whether it is open, supports two-way binding |
| `class`      | `string`                                 | —          | Classes appended to the card                 |

### Slots {#slots}

| Slot      | Description  |
| --------- | ------------ |
| default   | The trigger  |
| `content` | Card content |
