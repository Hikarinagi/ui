---
title: Heading
description: Headings whose semantic level and visual size are set independently.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/heading/Heading.vue
---

<Demo name="heading/hero" />

## Usage {#usage}

```ts
import { Heading } from '@hina-ui/vue'
```

`level` decides which of `h1` to `h6` is rendered and defaults to 2. The font size follows the level, so `level` is usually the only property you need.

<Demo name="heading/basic" />

## Examples {#examples}

### Levels {#levels}

Six levels map to six sizes, from 30 pixels down to 14. Sizes of `xl` and above tighten the letter spacing.

<Demo name="heading/levels" />

### Semantics apart from size {#size}

`size` sets the font size without changing the tag. The heading outline follows the content, the visual size follows the layout, and the two need not agree.

<Demo name="heading/size" />

### Weight {#weight}

Defaults to `semibold`. Use `medium` or `normal` where a page needs lighter headings.

<Demo name="heading/weight" />

### Truncation {#truncate}

With `truncate`, a heading wider than its container ends in an ellipsis and never wraps.

<Demo name="heading/truncate" />

### Headings in body content {#prose}

`Prose` applies the same sizes to native `h1` to `h6` inside it, so rendered Markdown and rich text need no tag replacement.

<Demo name="heading/prose" />

## Accessibility {#a11y}

- A page should have exactly one `h1`, with the remaining headings stepping down by content rather than by appearance. Change `size` when you need larger or smaller text.
- Screen readers navigate by heading, and only a correct order produces a usable outline.

## API {#api}

### Props {#props}

| Prop       | Type                                                      | Default         | Description                           |
| ---------- | --------------------------------------------------------- | --------------- | ------------------------------------- |
| `level`    | `1 \| 2 \| 3 \| 4 \| 5 \| 6`                              | `2`             | Which heading tag to render           |
| `size`     | `'xs' \| 'sm' \| 'base' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | follows `level` | Font size                             |
| `weight`   | `'normal' \| 'medium' \| 'semibold'`                      | `'semibold'`    | Font weight                           |
| `truncate` | `boolean`                                                 | `false`         | Truncate to one line with an ellipsis |
| `class`    | `string`                                                  | —               | Classes appended to the root          |

### Slots {#slots}

| Slot      | Description      |
| --------- | ---------------- |
| `default` | The heading text |
