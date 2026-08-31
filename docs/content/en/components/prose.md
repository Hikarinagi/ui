---
title: Prose
description: A rich text container that styles the native tags inside it.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/prose/Prose.vue
  - label: Typography styles
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/styles/typography.css
---

<Demo name="prose/hero" />

## Usage {#usage}

```ts
import { Prose } from '@hikarinagi/ui'
```

Put a fragment of HTML inside the container and its native tags pick up the typography styles. Use it for rendered Markdown, rich text from an API, or content produced by an editor.

<Demo name="prose/basic" />

## Examples {#examples}

### Tags it covers {#elements}

Headings, paragraphs, lists, description lists, quotations, code, tables, rules, marks and keys are all covered, and they match their component counterparts.

<Demo name="prose/elements" />

### Container tag {#as}

`as` chooses the tag to render, defaulting to `div`. A whole article can use `article`.

<Demo name="prose/as" />

### Outer margins {#spacing}

Elements are spaced vertically, but the top margin of the first child and the bottom margin of the last are removed, so the container leaves no extra gap inside a card.

<Demo name="prose/spacing" />

## Behaviour {#behavior}

- The line height is 1.7, and long words or URLs wrap instead of overflowing.
- Styling applies only to native tags inside the container; nothing outside is affected.

## API {#api}

### Props {#props}

| Prop      | Type                  | Default | Description                                   |
| --------- | --------------------- | ------- | --------------------------------------------- |
| `as`      | `string \| Component` | `'div'` | Element or component to render                |
| `asChild` | `boolean`             | `false` | Render nothing, merging into the single child |
| `class`   | `string`              | —       | Classes appended to the root                  |

### Slots {#slots}

| Slot      | Description           |
| --------- | --------------------- |
| `default` | The rich text content |
