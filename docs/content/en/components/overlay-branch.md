---
title: OverlayBranch
description: An outside layer that coexists with modal overlays.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/overlay-branch/OverlayBranch.vue
---

<Demo name="overlay-branch/hero" />

## Usage {#usage}

```ts
import { OverlayBranch } from '@hina-ui/vue'
```

`OverlayBranch` wraps another layer of the page that you manage yourself, such as a hand-built guide layer or a floating toolbar. While a Dialog, Drawer, Sheet, modal Popover or menu is open, the overlay treats its content as its own:

- Pressing or focusing an element in it does not close the overlay and does not fire `interactOutside`.
- It is not set to `aria-hidden`, so screen readers can reach it.
- It is not affected by the `pointer-events` restriction the overlay puts on the rest of the page.
- The focus trap lets focus move into it.

`as` sets the rendered tag, `div` by default. `asChild` hands this behaviour to its only child and renders no node of its own.

## Behavior {#behavior}

- It registers when mounted and unregisters when unmounted; a branch mounted after an overlay opened works too.
- While an overlay sets `pointer-events: none` on `body`, the branch root keeps its own `pointer-events`. A transparent full-screen root with `pointer-events: none` does not block the overlay; parts of it that take input set `pointer-events: auto` themselves. The branch's inline style is restored when the overlay closes.
- The overlay's Tab loop does not include the branch. When focus moves from the branch to an element outside both the overlay and the branch, it returns to the overlay.
- Stacking is up to you. To sit over overlays, render the branch under `body` with a `z-index` above `--hn-z-overlay`. Inside a container that forms a stacking context, such as one with a `z-index` or a `transform`, the branch's `z-index` only counts within that container and the overlay's scrim covers it.

## API {#api}

| Prop      | Type      | Default | Description                                                          |
| --------- | --------- | ------- | -------------------------------------------------------------------- |
| `as`      | `string`  | `'div'` | The rendered tag                                                     |
| `asChild` | `boolean` | `false` | Renders no node of its own and hands its behaviour to its only child |

| Slot      | Description          |
| --------- | -------------------- |
| `default` | Content of the layer |
