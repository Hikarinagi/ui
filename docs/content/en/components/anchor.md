---
title: Anchor
description: An in-page table of contents that tracks the section you are reading.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/anchor/Anchor.vue
---

<Demo name="anchor/hero" />

## Usage {#usage}

```ts
import { Anchor } from '@hina-ui/vue'
```

`Anchor` is driven by `items`. Each entry's `id` matches the `id` of an element on the page, and `label` is the text shown in the contents.

It renders the contents, not the content. Every `id` must resolve to an element in the document; an entry whose target is missing is neither tracked nor clickable.

<Demo name="anchor/basic" />

Tracking is based on an element's visibility in the viewport, so the content works equally well in the page's main scroll region or inside a `ScrollArea`.

## Examples {#examples}

### Levels {#nested}

`children` adds a second level, shown one indent in. The contents support two levels only — a `children` array nested inside `children` is not rendered. An in-page contents list deeper than two levels is a sign the page should be split rather than nested further.

<Demo name="anchor/nested" />

### Landmark name {#label}

`Anchor` renders as a `nav` landmark with an accessible name in the interface language (“On this page” in English). When a page holds several navigation landmarks, name each with `label`.

<Demo name="anchor/label" />

## Behaviour {#behavior}

- When several sections are visible at once they are all marked, and the highlight bar stretches across the whole run rather than picking one out.
- The bar moves continuously rather than jumping.
- Roughly the bottom 15% of the viewport does not count as visible, so a section is marked only once it has properly entered the reading area.
- Clicking an entry scrolls smoothly to the target and replaces the hash in the address bar, but adds no history entry.
- With reduced motion enabled the jump is instant rather than smooth.

## Accessibility {#a11y}

- The wrapper is a `nav` landmark holding a list of links.
- The current entry carries `aria-current="location"` — `location` rather than `page`, because the reader is still on the same page and only the position within it has changed.
- Entries are real links whose `href` points at the anchor, so they can be copied or opened in a new tab.
- The highlight bar is decoration; position is carried by `aria-current` and the heavier text together, never by colour alone.

## API {#api}

### Props {#props}

| Prop    | Type           | Default            | Description                     |
| ------- | -------------- | ------------------ | ------------------------------- |
| `items` | `AnchorItem[]` | Required           | Entries of the contents list    |
| `label` | `string`       | Interface language | Accessible name of the landmark |
| `class` | `string`       | —                  | Classes appended to the root    |

### AnchorItem {#item}

| Field      | Type           | Description                                        |
| ---------- | -------------- | -------------------------------------------------- |
| `id`       | `string`       | `id` of the target element, without the `#`        |
| `label`    | `string`       | Text shown in the contents                         |
| `children` | `AnchorItem[]` | Second-level entries; their own `children` ignored |
