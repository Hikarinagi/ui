---
title: ScrollTop
description: Return to the top of a page or scroll container after passing a threshold.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/scroll-top/ScrollTop.vue
---

<Demo name="scroll-top/hero" />

## Usage {#usage}

```ts
import { ScrollTop } from '@hina-ui/vue'
```

Without `target`, the component listens to `window` and appears after scrolling more than 300px. Activation resets only the vertical position, preserving horizontal scroll.

```vue
<ScrollTop />
```

When an `AppShell`, `ScrollArea`, or Dialog content viewport handles scrolling, pass its exposed viewport. **Scroll target and button placement are independent**: `target` controls which element scrolls, while `position` controls where the button sits.

```vue
<Card class="relative" :padded="false">
  <ScrollArea ref="area" class="h-72">…</ScrollArea>
  <ScrollTop :target="() => area?.viewport" position="absolute" />
</Card>
```

For `AppShell`, use `() => shell?.mainViewport`. With default fixed positioning, mount the button near the outside of your shell. For a local panel, place it outside the scroll area but inside the positioned container so it does not scroll away with the content.

## Examples {#examples}

### Appearance, scrolling, and focus {#custom}

Reuse `FloatButton` sizes, shapes, visible labels, and positioning. Scrolling is smooth by default; `behavior="instant"` jumps immediately. Reduced-motion preferences always force instant scrolling.

The button remains mounted while a keyboard user still has focus on it, then hides after focus leaves. Alternatively, use `focus-target` to move focus to a heading at the top. The destination must be focusable, for example a heading with `tabindex="-1"`.

<Demo name="scroll-top/custom" />

### A target that mounts later {#target}

A getter follows `ScrollArea` initialization, unmounting, and replacement. An empty getter result hides the button without falling back to page scrolling. Changing the target removes the old listener and immediately checks the new target's scroll position.

<Demo name="scroll-top/target" />

## Behavior {#behavior}

- Uses a passive scroll listener on its target without polling every frame or scanning content.
- Does not read target getters or render a visible button on the server; it measures scroll position after mounting.
- Appears when the vertical scroll position is strictly greater than `threshold`. Threshold changes take effect reactively.
- `loading` and `disabled` block scrolling through both clicks and exposed methods.
- `@click.prevent` cancels the default action. `click` reports activation, not completion of smooth scrolling.

## API {#api}

### Props {#props}

| Prop          | Type                                                                                  | Default                 | Description                                                                   |
| ------------- | ------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `target`      | `HTMLElement \| Window \| null \| (() => HTMLElement \| Window \| null \| undefined)` | `window`                | Scroll target; a getter supports delayed initialization                       |
| `threshold`   | `number`                                                                              | `300`                   | Vertical display threshold in pixels                                          |
| `behavior`    | `'smooth' \| 'instant' \| 'auto'`                                                     | `'smooth'`              | Scroll behavior; `auto` follows the target's CSS scrolling behavior           |
| `focusTarget` | `HTMLElement \| (() => HTMLElement \| null \| undefined)`                             | —                       | Focus destination on activation, using `preventScroll` to avoid an extra jump |
| `label`       | `string`                                                                              | Localized “Back to top” | Button name                                                                   |
| `variant`     | `'solid' \| 'soft' \| 'outline'`                                                      | `'outline'`             | Button appearance                                                             |
| `tone`        | `'accent' \| 'neutral' \| 'danger'`                                                   | `'neutral'`             | Button tone                                                                   |

Also accepts [FloatButton](/components/float-button)'s `position`, `placement`, `offset`, `size`, `shape`, `extended`, `tooltip`, `tooltipSide`, `loading`, `disabled`, `ripple`, `class`, and `style`, with the same defaults. Scroll state controls visibility; there is no `visible` prop.

### Slots {#slots}

| Slot      | Default  | Description        |
| --------- | -------- | ------------------ |
| `default` | Up arrow | Custom button icon |

### Events {#events}

| Event   | Payload      | Description                                            |
| ------- | ------------ | ------------------------------------------------------ |
| `click` | `MouseEvent` | Button activation; prevent default to cancel scrolling |

### Expose {#expose}

| Name          | Type         | Description                                                |
| ------------- | ------------ | ---------------------------------------------------------- |
| `visible`     | `boolean`    | Current visibility, read-only                              |
| `scrollToTop` | `() => void` | Scroll to the target's top using the current configuration |
