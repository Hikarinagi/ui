---
title: Popover
description: A small panel that floats out when a trigger is clicked.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/popover/Popover.vue
  - label: Popover
    href: https://reka-ui.com/docs/components/popover
---

<Demo name="popover/hero" />

## Usage {#usage}

```ts
import { Popover } from '@hina-ui/vue'
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

### External anchor {#anchor}

`anchor` accepts `HTMLElement | null`. Set it to omit the default slot and control visibility with `v-model:open`. The panel waits until the anchor is available. Changing the anchor while open updates the position; clearing it on close preserves the exit position.

When both the default slot and `anchor` are provided, the slot controls triggering and `anchor` controls positioning. The caller manages click and keyboard behavior, `aria-haspopup`, and `aria-expanded` on external elements.

<Demo name="popover/anchor" />

### Modality {#modal}

`modal` defaults to `true`, locking page scrolling and restricting outside interaction while open. With `:modal="false"`, the page remains scrollable and interactive. Clicking outside still closes the panel.

### Focus and dismissal {#focus}

Call `event.preventDefault()` in `openAutoFocus` or `closeAutoFocus` to cancel default focus behavior. Without a default trigger, closing restores the element focused before opening; the anchor is only used for positioning. If the caller has already moved focus outside, the previous element is not focused again.

Use `interactOutside` to prevent dismissal from outside pointer or focus interactions, and `escapeKeyDown` to prevent Escape dismissal. `aria-label`, `aria-describedby`, and `data-*` attributes are forwarded to the panel.

### Custom padding {#padded}

The panel is padded by default. Set `padded="false"` when the content should reach the edges and arrange its own spacing.

<Demo name="popover/padded" />

### Triggers {#trigger}

The trigger is not limited to a button; any element that can take focus will do. When an icon button is the trigger, turn its tooltip off so two overlays do not stack up.

<Demo name="popover/trigger" />

## Behaviour {#behavior}

- In the default modal mode, the page is locked from scrolling while the panel is open.
- The trigger keeps its pressed ink for as long as the panel is open.
- Focus moves into the panel once it opens, and Escape closes it and returns focus to the trigger.
- In the default modal mode, clicking outside closes the panel without passing the click to the element underneath.

## Accessibility {#a11y}

- Without a default trigger, provide an `aria-label` for the panel. Closing restores the element focused before opening by default.
- The trigger carries `aria-haspopup="dialog"` and `aria-expanded`, and the panel is a `role="dialog"`.
- Headings, descriptions and form controls inside the panel are treated as ordinary page content and announced one by one.
- With a default trigger, focus returns to it once the panel closes unless focus restoration is cancelled.

## API {#api}

### Popover {#props}

| Prop         | Type                                     | Default    | Description                                     |
| ------------ | ---------------------------------------- | ---------- | ----------------------------------------------- |
| `open`       | `boolean`                                | —          | Whether it is open; supports v-model            |
| `anchor`     | `HTMLElement \| null`                    | —          | External positioning element                    |
| `modal`      | `boolean`                                | `true`     | Restrict outside interaction and lock scrolling |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Which way it floats out                         |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | How it lines up with the trigger                |
| `sideOffset` | `number`                                 | `8`        | Distance from the trigger                       |
| `padded`     | `boolean`                                | `true`     | Whether the panel is padded                     |
| `class`      | `string`                                 | —          | Classes appended to the panel                   |

| Slot      | Description       |
| --------- | ----------------- |
| `default` | Optional trigger  |
| `content` | The panel content |

| Event                | Argument                                       | Description                                                      |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| `openAutoFocus`      | `Event`                                        | Before focusing on open; can be prevented                        |
| `closeAutoFocus`     | `Event`                                        | Before restoring focus on close; can be prevented                |
| `escapeKeyDown`      | `KeyboardEvent`                                | Escape key; dismissal can be prevented                           |
| `pointerDownOutside` | `PointerDownOutsideEvent`                      | Outside pointer down; dismissal can be prevented                 |
| `focusOutside`       | `FocusOutsideEvent`                            | Focus moves outside; dismissal can be prevented                  |
| `interactOutside`    | `PointerDownOutsideEvent \| FocusOutsideEvent` | Outside pointer or focus interaction; dismissal can be prevented |
