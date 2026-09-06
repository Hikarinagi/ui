---
title: PrevNext
description: A pair of links at the foot of a page leading to its neighbours.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/prev-next/PrevNext.vue
---

<Demo name="prev-next/hero" />

## Usage {#usage}

```ts
import { PrevNext, PrevNextLink } from '@hina-ui/vue'
```

`PrevNext` is the navigation landmark and the two-column container; `PrevNextLink` is one side of it. `direction` is required and takes `prev` or `next`, deciding which column the link falls in, which way the arrow points and the default caption.

The default slot is the title of the target page. The caption — “Previous page” or “Next page” — comes from the component according to `direction` and the interface language.

<Demo name="prev-next/basic" />

Use it for neighbouring pages in a linear reading order, such as the previous and next articles in a guide or chapters in a novel. Paginating a filtered result set is a different job and not this component's.

## Examples {#examples}

### One side only {#single}

The first and last pages have only one direction to go, so a single `PrevNextLink` is enough. `next` always occupies the right column, so it stays on the right when it appears alone, in the same place as when both sides are present.

<Demo name="prev-next/single" />

### Captions {#label}

`label` on `PrevNextLink` overrides the caption; `label` on `PrevNext` overrides the landmark's accessible name. Both have defaults in the interface language, so rewrite them to match the level of the content — “Previous volume” in place of “Previous page”, for instance.

<Demo name="prev-next/label" />

### Router links {#router}

`as` sets what the link renders as, defaulting to `a`. Pass a router component for client-side navigation and attributes such as `to` pass through.

<Demo name="prev-next/router" />

## Behaviour {#behavior}

- One column on narrow screens, two columns from the `sm` breakpoint up.
- `prev` aligns to the left and `next` to the right, with the arrow on the outer side of the text.
- `next` always occupies the right column and never slides across when it appears alone.
- Links carry `rel="prev"` or `rel="next"`, which search engines and browsers use to read the sequence.
- A ripple spreads from the point of contact on click.

## Accessibility {#a11y}

- The wrapper is a `nav` landmark whose default accessible name follows the interface language (“Pagination” in English); `label` overrides it.
- Arrows carry `aria-hidden`; direction is carried by the caption rather than the glyph.
- A link's accessible name covers both the caption and the target title, which screen readers announce together, so no extra description is needed.

## API {#api}

### PrevNext {#props}

| Prop    | Type     | Default            | Description                     |
| ------- | -------- | ------------------ | ------------------------------- |
| `label` | `string` | Interface language | Accessible name of the landmark |
| `class` | `string` | —                  | Classes appended to the root    |

| Slot      | Description                   |
| --------- | ----------------------------- |
| `default` | One or both directional links |

### PrevNextLink {#link}

| Prop        | Type                  | Default            | Description                                  |
| ----------- | --------------------- | ------------------ | -------------------------------------------- |
| `direction` | `'prev' \| 'next'`    | Required           | Direction: sets column, arrow and caption    |
| `label`     | `string`              | Interface language | Caption text                                 |
| `as`        | `string \| Component` | `'a'`              | Element or component to render as            |
| `asChild`   | `boolean`             | `false`            | Let the slot's root element do the rendering |
| `class`     | `string`              | —                  | Classes appended to the root                 |

Remaining attributes pass through to the rendered element, such as `href` or a router component's `to`.

| Slot      | Description              |
| --------- | ------------------------ |
| `default` | Title of the target page |
