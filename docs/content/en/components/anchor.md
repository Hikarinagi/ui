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

### Trailing content {#trailing}

`#trailing` receives `{ item, active }` for non-interactive content such as a [Tag](/components/tag), text or an icon. `item` is the original entry, including custom fields. Both top-level and second-level entries support the slot.

`active` matches `aria-current="location"`. When several sections are visible, only the first visible entry in directory order is `active`; the existing visible-range highlight is unchanged.

Trailing content aligns to the end of the row without shrinking, while long labels can wrap. Empty trailing content takes no space. Updating a status mark keeps the current entry, and clicking the mark still follows its link.

<Demo name="anchor/trailing" />

### Following a long directory {#scroll}

Place a long directory inside a height-constrained `ScrollArea`. When the current entry leaves the directory viewport, `Anchor` scrolls it fully into view with a small margin. It detects the nearest vertical scroll container, including native containers or a scrollable root element, without requiring a viewport ref.

Visible entries are not repeatedly centered, and browsing the directory manually does not continually pull it back. Initial positioning and size adjustments are instant; subsequent current-entry changes scroll smoothly unless reduced motion is enabled. Following never moves focus or scrolls an outer container shared with the article.

Set `:auto-scroll="false"` to disable following while keeping scroll-spy and highlighting. `@change` receives the current entry's `id`, and a component ref exposes the read-only `current` value, so observing `aria-current` is unnecessary. This example contains 51 entries; scroll the article and directory independently or disable following to compare.

<Demo name="anchor/scroll" />

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

| Prop         | Type      | Default            | Description                                                    |
| ------------ | --------- | ------------------ | -------------------------------------------------------------- |
| `items`      | `T[]`     | Required           | Entries of the contents list                                   |
| `label`      | `string`  | Interface language | Accessible name of the landmark                                |
| `autoScroll` | `boolean` | `true`             | Keep the current entry visible in the directory's own viewport |
| `class`      | `string`  | —                  | Classes appended to the root                                   |

### AnchorItem {#item}

| Field      | Type           | Description                                        |
| ---------- | -------------- | -------------------------------------------------- |
| `id`       | `string`       | `id` of the target element, without the `#`        |
| `label`    | `string`       | Text shown in the contents                         |
| `children` | `AnchorItem[]` | Second-level entries; their own `children` ignored |

### Slots {#slots}

| Slot       | Parameters                  | Description                             |
| ---------- | --------------------------- | --------------------------------------- |
| `trailing` | `{ item, active: boolean }` | Trailing content inside each entry link |

`T` is inferred from `items` and must include the base fields of `AnchorItem`. `item` preserves the original types of top-level entries and their `children`; use a field or discriminant to narrow the type when parent and child fields differ.

### Events {#events}

| Event    | Payload                        | Description                                                                                                                                |
| -------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `change` | `current: string \| undefined` | Emitted when the current entry changes, including its first detection. Becomes `undefined` when resetting entries leaves no current entry. |

### Expose {#expose}

| Property  | Type                  | Description                                                          |
| --------- | --------------------- | -------------------------------------------------------------------- |
| `current` | `string \| undefined` | Read-only current entry id; `undefined` until an entry is identified |
