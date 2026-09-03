---
title: Kbd
description: A keyboard key, for documenting shortcuts.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/kbd/Kbd.vue
---

<Demo name="kbd/hero" />

## Usage {#usage}

```ts
import { Kbd } from '@hina-ui/vue'
```

The component renders a native `kbd` element in a monospaced face, with a bottom border heavier than the other three so it reads as a keycap. One component is one key.

<Demo name="kbd/basic" />

## Examples {#examples}

### Key combinations {#combination}

Each key gets its own component and the connector between them is up to the caller. Keys pressed together are joined with a plus sign; keys pressed in sequence are described in words.

<Demo name="kbd/combination" />

### Scales with its context {#inline}

The font size is relative and works out to 81.25% of the surrounding text, so it shrinks along with smaller paragraphs.

<Demo name="kbd/inline" />

### Keys in body content {#prose}

`Prose` applies the same styling to native `kbd` elements inside it, so rendered Markdown and rich text need no tag replacement.

<Demo name="kbd/prose" />

## Accessibility {#a11y}

- The component renders a native `kbd` element, which screen readers announce as user input.
- Spelling key names out reads better than symbols, for example “Enter” rather than an arrow.

## API {#api}

### Props {#props}

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |

### Slots {#slots}

| Slot      | Description  |
| --------- | ------------ |
| `default` | The key name |
