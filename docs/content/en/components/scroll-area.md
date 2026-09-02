---
title: ScrollArea
description: A scrolling region with overlay scrollbars.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/scroll-area/ScrollArea.vue
  - label: AppShell
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/app-shell/AppShell.vue
---

<Demo name="scroll-area/hero" />

## Usage {#usage}

```ts
import { ScrollArea } from '@hina-ui/vue'
```

Give the area a height and it scrolls whatever overflows. The scrollbar floats above the content instead of taking width from it, and it looks the same on every platform.

<Demo name="scroll-area/basic" />

Every scrolling container in the library goes through this component — dropdowns, menus, the bodies of Dialog and Drawer, the main region of AppShell. Nothing else pulls in a scrolling library of its own, so the behaviour cannot drift apart.

## Examples {#examples}

### Direction {#direction}

`direction` takes `vertical`, `horizontal` or `both`. In a horizontal area the wheel scrolls sideways, since a mouse has no natural gesture for it and the overlay scrollbar is hidden most of the time.

<Demo name="scroll-area/horizontal" />

### Edge shadows {#shadow}

A shadow appears at each edge that has content beyond it, and goes away at the ends. Set `shadow` to false where the boundary is already obvious.

<Demo name="scroll-area/shadow" />

### When the scrollbar shows {#autohide}

`autoHide` decides when the scrollbar fades out: `never` keeps it, `scroll` shows it while scrolling, `leave` keeps it until the pointer leaves, and `move` shows it on any pointer movement inside.

<Demo name="scroll-area/autohide" />

### Keyboard access {#focusable}

A region that scrolls but holds nothing focusable cannot be reached by keyboard. Set `focusable` to put it in the tab order as a `role="region"`, and give it a name through `label`.

<Demo name="scroll-area/focusable" />

## Behaviour {#behavior}

- The scrollbar is laid over the content, so the layout width does not change when content starts to overflow.
- Scrolling works before the component takes over: the markup scrolls natively from first paint, and OverlayScrollbars attaches once the browser is idle.
- Content that changes size through an animation updates the scrollbar on its own; there is no observer to wire up.

## Accessibility {#a11y}

- Without `focusable` the area is a plain container: keyboard users reach the focusable elements inside it and the browser scrolls to follow.
- With `focusable` the area is a `role="region"` in the tab order, named by `label`, and the arrow keys scroll it.

## API {#api}

| Prop            | Type                                       | Default      | Description                                 |
| --------------- | ------------------------------------------ | ------------ | ------------------------------------------- |
| `direction`     | `'vertical' \| 'horizontal' \| 'both'`     | `'vertical'` | Which axis scrolls                          |
| `autoHide`      | `'never' \| 'scroll' \| 'leave' \| 'move'` | `'leave'`    | When the scrollbar fades out                |
| `scrollbar`     | `boolean`                                  | `true`       | Whether the scrollbar is visible at all     |
| `wheelRedirect` | `boolean`                                  | `true`       | Wheel scrolls sideways in a horizontal area |
| `shadow`        | `boolean`                                  | `true`       | Whether edges get a shadow                  |
| `focusable`     | `boolean`                                  | `false`      | Put the area in the tab order               |
| `label`         | `string`                                   | —            | Accessible name, used when focusable        |
| `class`         | `string`                                   | —            | Classes appended to the outer element       |

| Slot      | Description          |
| --------- | -------------------- |
| `default` | The scrolled content |
