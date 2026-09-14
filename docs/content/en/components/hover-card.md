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

The hover card gives a link a preview: after the pointer rests on the trigger for a moment the card floats out, and it pulls back once the pointer leaves; focusing the trigger with the keyboard also uses `openDelay`. The default slot is the trigger, usually a link, and the `content` slot is the card. It is something to glance at, so it neither stops the page from scrolling nor takes focus.

<Demo name="hover-card/basic" />

## Examples {#examples}

### Placement {#placement}

`side` sets the direction the card floats out on and `align` how it lines up with the trigger, as in [Popover](/components/popover); the default is right below.

<Demo name="hover-card/placement" />

### Delays {#delay}

`openDelay` is how long the pointer rests before the card opens and `closeDelay` how long after leaving it closes, both in milliseconds. Moving from the trigger into the card does not close it.

<Demo name="hover-card/delay" />

### Controlled {#controlled}

`open` supports two-way binding. The card still closes when the pointer leaves, on a click outside or on Esc, writing `false` back; an outside control only opens it.

<Demo name="hover-card/controlled" />

### External anchor {#anchor}

Leave the default slot empty and pass an external element through `anchor`. Use `v-model:open` to open the card. Updating the anchor and content lets multiple triggers share one card. When the default slot is provided, its trigger is used instead.

An external anchor does not open the card automatically. Setting `open = true` opens immediately, without `openDelay`. Leaving still uses `closeDelay`; moving into the card keeps it open, and moving keyboard focus away from the anchor closes it. Clearing or removing the anchor, or scrolling its ancestors, closes the card.

This example uses [Button](/components/button) to bind pointer and keyboard focus events.

During exit, the card continues to follow a connected anchor. If the anchor is cleared or removed, it finishes exiting at the last recorded position.

<Demo name="hover-card/anchor" />

### Virtual anchors and continuous tracking {#virtual-anchor}

`anchor` also accepts an object with `getBoundingClientRect()` returning a rectangle in viewport coordinates. Import `OverlayAnchor` from the package root. The callback must return the latest coordinates; the object itself does not need to be replaced.

The optional `contextElement` identifies the element associated with those coordinates, allowing scroll ancestors and clipping boundaries to be detected. It does not become a trigger or extend the overlay's interaction area.

`updatePositionStrategy` defaults to `'optimized'`, updating on scrolling, resizing, and layout changes. Set it to `'always'` to check the rectangle every frame while mounted, including coordinate changes without DOM events. The strategy can change while open. Tracking continues throughout exit; clearing the anchor or removing its context element preserves the last position. Measurement stops after unmount.

Virtual anchors have no hover area. Control visibility with `v-model:open`; pointer departure and ancestor scrolling do not close the card, while outside clicks and Escape still do. Element anchors retain their hover, close-delay, and scroll-dismissal behavior.

The example opens with [Button](/components/button) and uses [ScrollArea](/components/scroll-area) as its scroll container. The panel follows changing coordinates and container scrolling.

<Demo name="hover-card/virtual-anchor" />

### Positioner styling {#positioner}

`positionerClass` adds classes to the outer positioning element, while `class` still applies to the inner card. Use utilities or global CSS classes to define movement transitions separately from the card's enter and exit animations.

This example enables `hn-transition-base` when switching anchors while the card is open. It removes the movement transition on initial opening and closing, and disables it when reduced motion is preferred. The triggers use [Button](/components/button).

<Demo name="hover-card/movement" />

## Behavior {#behavior}

- Opens after the pointer rests for `openDelay` and closes `closeDelay` after it leaves; moving into the card keeps it open.
- Focusing the slotted trigger opens after `openDelay`; moving focus away closes after `closeDelay`.
- Returning during the close delay cancels closing. Once the exit animation starts, the content is no longer interactive and hovering its previous area does not reopen it.
- A click outside the card or Esc closes it as well.
- The card does not stop the page from scrolling, and the rest of the page stays interactive.
- Touch does not open it.

## Accessibility {#a11y}

- The card is supplementary; nothing in it should be the only way to reach something.
- The trigger should be focusable so keyboard users can see the card.

## API {#api}

### Props {#props}

| Prop                     | Type                                     | Default       | Description                                                          |
| ------------------------ | ---------------------------------------- | ------------- | -------------------------------------------------------------------- |
| `anchor`                 | `OverlayAnchor \| null`                  | —             | Positioning element or virtual anchor when the default slot is empty |
| `updatePositionStrategy` | `'optimized' \| 'always'`                | `'optimized'` | Position update strategy                                             |
| `side`                   | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'`    | Side the card floats out on                                          |
| `align`                  | `'start' \| 'center' \| 'end'`           | `'center'`    | Alignment against the trigger                                        |
| `sideOffset`             | `number`                                 | `8`           | Distance from the trigger in pixels                                  |
| `openDelay`              | `number`                                 | `300`         | Rest time before opening, in milliseconds                            |
| `closeDelay`             | `number`                                 | `150`         | Delay after leaving before closing, in ms                            |
| `padded`                 | `boolean`                                | `true`        | Whether the card has padding                                         |
| `open`                   | `boolean`                                | —             | Whether it is open, supports two-way binding                         |
| `class`                  | `string`                                 | —             | Classes appended to the card                                         |
| `positionerClass`        | `string`                                 | —             | Classes added to the outer positioning element                       |

### Slots {#slots}

| Slot      | Description                            |
| --------- | -------------------------------------- |
| default   | Optional trigger; omit to use `anchor` |
| `content` | Card content                           |
