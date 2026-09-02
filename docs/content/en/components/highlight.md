---
title: Highlight
description: A highlight block that follows a target element.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/highlight/Highlight.vue
---

<Demo name="highlight/hero" />

## Usage {#usage}

```ts
import { Highlight } from '@hina-ui/vue'
```

`Highlight` is an absolutely positioned block that measures the element `target` points at and moves there. When the target changes it travels continuously rather than disappearing in one place and appearing in another.

It draws nothing of its own: background, radius and stacking all come from `class`. The surrounding container has to establish a positioning context.

Use it wherever one highlight moves between several items — the selected background of a segmented control, the current position in an in-page contents list. Give each item its own background instead and switching becomes one thing vanishing while another appears; moving a single block keeps the eye with it.

## Examples {#examples}

### Spanning a range {#range}

Given both `target` and `until`, the block covers the whole run between them, both ends included. This suits a current position that is a stretch rather than a point, such as several sections visible at once.

With `target` alone the two are the same and only that element is covered.

<Demo name="highlight/range" />

### Axis {#axis}

`axis` decides which directions are followed: `x` tracks horizontal position and width, `y` tracks vertical position and height, `both` tracks all four. The default is `both`.

When one axis is fixed, the other's position and size come from `class` — a horizontal segmented control pairs `axis="x"` with `inset-y-1`, a vertical contents list pairs `axis="y"` with `inset-x-1`.

## Behaviour {#behavior}

- It moves when the target or the range changes, and follows size changes through a resize observer.
- With no target it renders nothing at all and leaves no placeholder.
- With reduced motion enabled it arrives in place without a travelling transition.
- Position is computed from the target's offset within its positioned ancestor, so target and highlight must share one positioning context.

## Accessibility {#a11y}

- The component carries `aria-hidden` and is pure decoration; it never enters the accessibility tree.
- The current position must also be expressed semantically — `aria-current` or `aria-pressed` on the selected item — and never by this block alone.

## API {#api}

### Props {#props}

| Prop     | Type                   | Default  | Description                                           |
| -------- | ---------------------- | -------- | ----------------------------------------------------- |
| `target` | `HTMLElement \| null`  | `null`   | The element to follow                                 |
| `until`  | `HTMLElement \| null`  | `null`   | End of the range; omitted, only the target is covered |
| `axis`   | `'x' \| 'y' \| 'both'` | `'both'` | Axes to follow                                        |
| `class`  | `string`               | —        | Classes appended to the root                          |
