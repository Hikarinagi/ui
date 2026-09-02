---
title: Mark
description: Marks a fragment of text, such as a search hit or something to notice.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/mark/Mark.vue
  - label: Tag
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tag/Tag.vue
---

<Demo name="mark/hero" />

## Usage {#usage}

```ts
import { Mark } from '@hina-ui/vue'
```

The component renders a native `mark` element with a tinted background and a very small radius. The text colour is unchanged, so reading is not interrupted.

<Demo name="mark/basic" />

## Examples {#examples}

### Marking search hits {#search}

Split the text on the keyword and wrap each hit in the component. A single passage can carry several marks.

<Demo name="mark/search" />

### Marks in body content {#prose}

`Prose` applies the same styling to native `mark` elements inside it, so rendered Markdown and rich text need no tag replacement.

<Demo name="mark/prose" />

## Accessibility {#a11y}

- The component renders a native `mark` element, and some screen readers announce where the mark begins and ends.
- The background only guides the eye and carries no state, so there are no tones.

## API {#api}

### Props {#props}

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |

### Slots {#slots}

| Slot      | Description     |
| --------- | --------------- |
| `default` | The marked text |
