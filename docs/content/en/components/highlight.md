---
title: Highlight
description: A highlight that slides between active items.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/highlight/Highlight.vue
  - label: Motion
    href: https://motion.dev/docs/vue-layout-animations
---

<Demo name="highlight/hero" />

## Usage {#usage}

```ts
import { Highlight } from '@hina-ui/vue'
```

`Highlight` marks the current item. It measures nothing; `class` pins it to the box of the active item, and when the active item changes, Motion's layout animation moves it continuously from the old position to the new one instead of hiding it in one place and showing it in another.

It paints nothing of its own. Background, radius and stacking all come from `class`.

### Moving between items {#shared}

Render it inside the currently active item, toggled with `v-if`, and give it an `id`. When the active item changes the old block unmounts and a new one mounts inside the new item; the shared `id` lets Motion fly it from the old position to the new one. Generate the `id` with `useId()` so several instances on one page do not interfere.

The example above does exactly this: every button holds an `absolute inset-0` highlight, and only the active one renders it.

### Translation axis {#axis}

Set `axis="x"` to animate horizontal translation only, or `axis="y"` to animate vertical translation only. Position on the other axis follows the current layout immediately. Width and height changes still animate. The default, `axis="both"`, animates translation on both axes.

[Tabs](/components/tabs) and [SegmentedControl](/components/segmented-control) select the axis from `orientation`; [Anchor](/components/anchor) uses `y`.

### Covering a range {#range}

Lay the list out as a single-column grid with every item on an explicit row and make the highlight a grid item too, spanning the range with `grid-row`. It stays mounted, and the layout animation stretches it continuously whenever the span changes.

<Demo name="highlight/range" />

## Behavior {#behavior}

- At rest its position is a plain CSS box that follows the item's size; nothing is measured or observed.
- Moving and stretching are continuous; Motion corrects the distortion of radius and shadow while scaling.
- With reduced motion enabled it snaps into place without a transition.
- While flying it lives inside the target item. If items are stacking contexts of their own, give idle items a higher layer (such as `z-[1]`) and the active item `z-0`, so it passes beneath the text of the others.
- What the server renders is the real highlight, so the first paint matches the hydrated page.

## Accessibility {#a11y}

- The component is `aria-hidden`; it is decoration only and stays out of the accessibility tree.
- The current position must have its own semantics, such as `aria-current` or `aria-pressed` on the active item; never rely on the highlight alone.

## API {#api}

### Props {#props}

| Prop    | Type                   | Default  | Description                                                    |
| ------- | ---------------------- | -------- | -------------------------------------------------------------- |
| `id`    | `string`               | —        | Shared layout animation id; required when moving between items |
| `axis`  | `'x' \| 'y' \| 'both'` | `'both'` | Translation axis; width and height animations are preserved    |
| `as`    | `'div' \| 'li'`        | `'div'`  | Element to render                                              |
| `class` | `string`               | —        | Classes appended to the root element                           |
