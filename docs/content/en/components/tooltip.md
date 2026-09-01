---
title: Tooltip
description: A short note shown on hover or focus.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tooltip/Tooltip.vue
  - label: Popover
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/popover/Popover.vue
---

<Demo name="tooltip/hero" />

## Usage {#usage}

```ts
import { Tooltip } from '@hikarinagi/ui'
```

The default slot is the trigger and the `content` prop is the text of the tooltip. It appears on pointer hover or keyboard focus, and goes away when the pointer leaves or Escape is pressed.

<Demo name="tooltip/basic" />

An icon button carries a tooltip of its own: `label` serves as both the accessible name and the tooltip text, so there is no need to wrap one.

Tooltip needs a `TooltipProvider` above it, and `AppShell` already includes one. Without a provider the component renders only the trigger.

## Examples {#examples}

### Placement {#placement}

`side` decides which side the tooltip appears on and `align` how it lines up with the trigger. The default is centred above. When there is not enough room, it flips to the opposite side.

<Demo name="tooltip/placement" />

### Offset {#offset}

`sideOffset` is the distance in pixels between the tooltip and its trigger.

<Demo name="tooltip/offset" />

### Tooltip content {#content}

The `content` slot takes more than text, a shortcut for instance. A line past the maximum width wraps on its own.

<Demo name="tooltip/content" />

### Delay {#delay}

`delayDuration` is how long a hover lasts before the tooltip appears. `skipDelayDuration` is the window after one closes during which moving to the next trigger skips the delay. Both apply to every Tooltip inside the `TooltipProvider`.

<Demo name="tooltip/delay" />

### Disabling {#disabled}

With `disabled`, no overlay is built and only the trigger is rendered.

<Demo name="tooltip/disabled" />

## Behaviour {#behavior}

- The tooltip appears on focus only when the focus came from the keyboard. Focus left behind by a mouse click, or returned by a closing overlay, does not show it.
- The tooltip does not lock page scrolling; it follows its trigger as the page scrolls.

## Accessibility {#a11y}

- The trigger carries `aria-describedby` pointing at the tooltip, so a screen reader reads it after the trigger itself.
- The tooltip takes no focus and is not in the tab order. Interactive content belongs in a Popover instead.

## API {#api}

### Tooltip {#props}

| Prop         | Type                                     | Default    | Description                      |
| ------------ | ---------------------------------------- | ---------- | -------------------------------- |
| `content`    | `string`                                 | —          | The text of the tooltip          |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    | Which side it appears on         |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | How it lines up with the trigger |
| `sideOffset` | `number`                                 | `8`        | Distance from the trigger        |
| `disabled`   | `boolean`                                | `false`    | Whether the tooltip is disabled  |
| `class`      | `string`                                 | —          | Classes appended to the tooltip  |

| Slot      | Description                          |
| --------- | ------------------------------------ |
| `default` | The trigger                          |
| `content` | Tooltip content, overrides `content` |

### TooltipProvider {#provider}

| Prop                | Type     | Default | Description                                      |
| ------------------- | -------- | ------- | ------------------------------------------------ |
| `delayDuration`     | `number` | `150`   | Milliseconds of hover before it appears          |
| `skipDelayDuration` | `number` | `300`   | Window in milliseconds that skips the next delay |

| Slot      | Description                         |
| --------- | ----------------------------------- |
| `default` | The subtree sharing these durations |
