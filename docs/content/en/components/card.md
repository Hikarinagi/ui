---
title: Card
description: Gathers a group of content onto one raised surface.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/card/Card.vue
  - label: Variants
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/card/card.variants.ts
---

<Demo name="card/hero" />

## Usage {#usage}

```ts
import { Card } from '@hikarinagi/ui'
```

A card is a surface: its own fill, a hairline border and a resting shadow, one step above the page ground. Content goes into the default slot.

<Demo name="card/basic" />

The card owns the surface, not the arrangement inside it. Leave direction and spacing to layout components such as `Stack` and `Inline`.

## Examples {#examples}

### Padding {#padded}

Padding is on by default and follows the current density. For content that should run to the edge — images, tables — set `padded` to `false` and let an inner container supply the padding instead.

<Demo name="card/padded" />

Add `overflow-hidden` when the content needs to be clipped to the corner radius.

### Semantic element {#as}

`as` sets the rendered element. It defaults to `div`; reach for something else only when the semantics are more precise: `article` for content that stands on its own, `section` for a block within the page, and — when a set of cards is a list — `ul` on the container with `li` on each card.

<Demo name="card/as" />

### Clickable cards {#interactive}

A card carries no clickable styling of its own: no hover tint, no shadow step. When the whole card should be pressable, the caller composes it: `as="button"` for the element, `hn-interactive` for the pointer and focus ring, `hn-state-layer` for the hover ink, `hn-press-lg` to scale the press down to something suited to a large target, plus a `Ripple`.

<Demo name="card/interactive" />

Don't do this when only one part of the card is clickable — put a `Button` or `Link` there and leave the card static.

### Density {#density}

Padding reads a density token, so setting `data-density="compact"` on any ancestor tightens every card inside it. Nothing needs to be passed to the card.

<Demo name="card/density" />

## Accessibility {#a11y}

- A card renders a `div` by default. It carries no role, and screen readers announce its content as ordinary content.
- When the whole card is clickable it must become a `button` or a link. Never attach a click handler to a `div`: the keyboard can't reach it and screen readers won't announce it as a control.
- Use `Heading` for titles inside a card and pick a `level` that continues the page's existing heading outline.

## API {#api}

### Props {#props}

| Prop       | Type      | Default | Description                                                           |
| ---------- | --------- | ------- | --------------------------------------------------------------------- |
| `padded`   | `boolean` | `true`  | Whether the card has padding; the value follows density               |
| `as`       | `string`  | `'div'` | The rendered element                                                  |
| `as-child` | `boolean` | `false` | Render no element of its own and merge the styles onto the sole child |
| `class`    | `string`  | —       | Classes appended to the root element                                  |

### Slots {#slots}

| Slot      | Description        |
| --------- | ------------------ |
| `default` | The card's content |
