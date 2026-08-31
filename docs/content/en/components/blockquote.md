---
title: Blockquote
description: Quotes a whole passage from elsewhere and credits its source.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/blockquote/Blockquote.vue
  - label: Callout
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/callout/Callout.vue
---

<Demo name="blockquote/hero" />

## Usage {#usage}

```ts
import { Blockquote } from '@hikarinagi/ui'
```

The component renders a native `blockquote` with a rule along its starting edge and secondary text colour, setting it apart from body text.

<Demo name="blockquote/basic" />

## Examples {#examples}

### Crediting the source {#cite}

`cite` adds an attribution line below the quotation, in a lighter colour than the quotation itself. It can be a person, a title or a note about where the text came from.

<Demo name="blockquote/cite" />

### Several paragraphs {#paragraphs}

The default slot accepts multiple paragraphs. Spacing between them is up to the caller.

<Demo name="blockquote/paragraphs" />

### Quotations in body content {#prose}

`Prose` applies the same styling to native `blockquote` elements inside it, so rendered Markdown and rich text need no tag replacement.

<Demo name="blockquote/prose" />

## Accessibility {#a11y}

- The component renders a native `blockquote`, which screen readers announce as a quotation.
- The attribution produced by `cite` sits in a `footer` and is read together with the quotation.

## API {#api}

### Props {#props}

| Prop    | Type     | Default | Description                     |
| ------- | -------- | ------- | ------------------------------- |
| `cite`  | `string` | —       | Source, shown as an attribution |
| `class` | `string` | —       | Classes appended to the root    |

### Slots {#slots}

| Slot      | Description        |
| --------- | ------------------ |
| `default` | The quoted content |
