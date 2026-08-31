---
title: Tag
description: A short label for status, category or attribute.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tag/Tag.vue
  - label: Variants
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tag/tag.variants.ts
---

<Demo name="tag/hero" />

## Usage {#usage}

```ts
import { Tag } from '@hikarinagi/ui'
```

The tag renders a `span`, with its content in the default slot.

A tag only labels; it has no click, selection or removal. Use `Button` when a click should trigger something.

<Demo name="tag/basic" />

## Examples {#examples}

### Variants {#variants}

Three of them: `soft` has a tinted background, `solid` a filled one, and `outline` only a border. The default is `soft`.

Tags in the same list should share one variant and rely on tone alone to carry meaning.

<Demo name="tag/variants" />

### Tones {#tones}

Six tones. `neutral` suits categories and attributes; the other five express state: `accent` for emphasis, `success` for success, `warning` for something needing attention, `danger` for errors or failures, and `info` for supplementary notes.

<Demo name="tag/tones" />

### Sizes {#sizes}

`sm` suits lists and tables, where it sits comfortably beside body text; `md` suits the area beside a title on a detail page.

<Demo name="tag/sizes" />

### Pill {#pill}

With `pill`, both ends become semicircles.

<Demo name="tag/pill" />

### With icons {#icons}

Icons go straight into the default slot, before the text, and scale with the tag.

<Demo name="tag/icons" />

### Long content {#truncate}

Text inside a tag does not wrap. When the content may be long, give the tag a maximum width and let the text truncate.

<Demo name="tag/truncate" />

## Accessibility {#a11y}

- The tag is ordinary text with no role, and screen readers read it as body content.
- Colour must not be the only signal; the words themselves should state the status, for example “Rejected” rather than red alone.
- Tags cannot take focus, so keyboard navigation never stops on them.

## API {#api}

### Props {#props}

| Prop      | Type                                                                    | Default     | Description                  |
| --------- | ----------------------------------------------------------------------- | ----------- | ---------------------------- |
| `variant` | `'soft' \| 'solid' \| 'outline'`                                        | `'soft'`    | Visual style                 |
| `tone`    | `'neutral' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | Semantic tone                |
| `size`    | `'sm' \| 'md'`                                                          | `'sm'`      | Size                         |
| `pill`    | `boolean`                                                               | `false`     | Render with rounded ends     |
| `class`   | `string`                                                                | —           | Classes appended to the root |

### Slots {#slots}

| Slot      | Description             |
| --------- | ----------------------- |
| `default` | The tag's icon and text |
