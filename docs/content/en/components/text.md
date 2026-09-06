---
title: Text
description: Body text, used for the vast majority of writing in an interface.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/text/Text.vue
---

<Demo name="text/hero" />

## Usage {#usage}

```ts
import { Text } from '@hina-ui/vue'
```

Renders a `p` at body size in a regular weight. Most of the time no property is needed at all.

<Demo name="text/basic" />

## Examples {#examples}

### Sizes {#sizes}

Seven steps, from 13 pixels to 30. `base` is body text, `md` suits a lead paragraph, `sm` is for supporting interface text, `xs` for tiny labels such as badges, and `lg` and above usually belong to `Heading`.

<Demo name="text/sizes" />

### Tones {#tones}

`default` is body colour, `muted` and `faint` step down from it, `disabled` marks unavailable content, and the remaining four carry meaning.

<Demo name="text/tones" />

### Weight {#weight}

Three weights. Body text is regular, table headers and labels are medium, and semibold is for emphasis.

<Demo name="text/weight" />

### Truncation {#truncate}

With `truncate`, text wider than its container ends in an ellipsis and never wraps.

<Demo name="text/truncate" />

### Rendered tag {#as}

`as` chooses the tag to render. Inside a sentence use `span`, so a paragraph does not break the inline flow.

<Demo name="text/as" />

## Accessibility {#a11y}

- Tones only change colour, never meaning. Information carried by colour alone should also be stated in words.
- `faint` and `disabled` have low contrast and are not meant for text people need to read.

## API {#api}

### Props {#props}

| Prop       | Type                                                                                                        | Default     | Description                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------- |
| `size`     | `'xs' \| 'sm' \| 'base' \| 'md' \| 'lg' \| 'xl' \| '2xl'`                                                   | `'base'`    | Font size                                     |
| `tone`     | `'default' \| 'muted' \| 'faint' \| 'disabled' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Tone                                          |
| `weight`   | `'normal' \| 'medium' \| 'semibold'`                                                                        | `'normal'`  | Font weight                                   |
| `truncate` | `boolean`                                                                                                   | `false`     | Truncate to one line with an ellipsis         |
| `as`       | `string \| Component`                                                                                       | `'p'`       | Element or component to render                |
| `asChild`  | `boolean`                                                                                                   | `false`     | Render nothing, merging into the single child |
| `class`    | `string`                                                                                                    | —           | Classes appended to the root                  |

### Slots {#slots}

| Slot      | Description      |
| --------- | ---------------- |
| `default` | The text content |
