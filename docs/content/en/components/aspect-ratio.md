---
title: AspectRatio
description: Holds its content to a given width-to-height ratio.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/aspect-ratio/AspectRatio.vue
  - label: Card
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/card/Card.vue
---

<Demo name="aspect-ratio/hero" />

## Usage {#usage}

```ts
import { AspectRatio } from '@hikarinagi/ui'
```

`ratio` is the width divided by the height and defaults to `16 / 9`. The height follows from the width and that ratio, so images of any size end up in a frame of the same shape.

<Demo name="aspect-ratio/basic" />

## Examples {#examples}

### Common ratios {#ratios}

A division reads better than a decimal: `:ratio="3 / 4"`.

<Demo name="aspect-ratio/ratios" />

### Embedded content {#embed}

Whatever sits inside fills the frame. Images and videos are already set to `object-fit: cover`, filling the frame and cropping the excess; an `iframe` and the like simply stretch to fit.

<Demo name="aspect-ratio/embed" />

## API {#api}

| Prop    | Type     | Default  | Description                           |
| ------- | -------- | -------- | ------------------------------------- |
| `ratio` | `number` | `16 / 9` | Width divided by height               |
| `class` | `string` | —        | Classes appended to the outer element |

| Slot      | Description              |
| --------- | ------------------------ |
| `default` | The content in the frame |
