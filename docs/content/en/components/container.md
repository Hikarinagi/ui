---
title: Container
description: Holds page content to a readable width and centres it.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/container/Container.vue
  - label: Page
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/page/Page.vue
---

<Demo name="container/hero" />

## Usage {#usage}

```ts
import { Container } from '@hina-ui/vue'
```

Container caps the width of its content and centres it in the parent, with an inset on either side: 16 pixels when narrow, 24 above the `sm` breakpoint.

<Demo name="container/basic" />

## Examples {#examples}

### Sizes {#sizes}

The four widths are 768, 1024, 1152 and 1280 pixels. Prose pages take `sm`; lists and dashboards take `lg` or `xl`.

<Demo name="container/sizes" />

## API {#api}

| Prop    | Type                           | Default | Description                       |
| ------- | ------------------------------ | ------- | --------------------------------- |
| `size`  | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | Maximum width of the content      |
| `as`    | `string`                       | `'div'` | The rendered tag                  |
| `class` | `string`                       | —       | Classes appended to the container |

| Slot      | Description  |
| --------- | ------------ |
| `default` | The children |
