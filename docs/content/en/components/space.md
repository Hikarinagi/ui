---
title: Space
description: An empty element that takes up room inside a flex container.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/space/Space.vue
---

<Demo name="space/hero" />

## Usage {#usage}

```ts
import { Space } from '@hina-ui/vue'
```

Space is an empty element, meaningful only inside a flex container. By default it eats the remaining room and pushes what sits on either side apart. Even spacing between children belongs to the container's `gap`; Space is for the one place that needs to stretch or to hold a gap of its own.

<Demo name="space/flex" />

## Examples {#examples}

### Fixed sizes {#sizes}

Given a `size` it stops stretching and holds a fixed square instead: 4, 8, 16, 24 and 32 pixels.

<Demo name="space/sizes" />

## Accessibility {#a11y}

Space carries `aria-hidden`, so screen readers skip it.

## API {#api}

| Prop    | Type                                             | Default  | Description                        |
| ------- | ------------------------------------------------ | -------- | ---------------------------------- |
| `size`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'flex'` | `'flex'` | A fixed step, or `flex` to stretch |
| `class` | `string`                                         | —        | Classes appended to the element    |
