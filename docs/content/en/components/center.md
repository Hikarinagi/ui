---
title: Center
description: Centres its content on both axes.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/center/Center.vue
  - label: Flex
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/flex/Flex.vue
---

<Demo name="center/hero" />

## Usage {#usage}

```ts
import { Center } from '@hina-ui/vue'
```

Center is a flex container centred on both axes. It sets no height of its own, so vertical centring depends on the height of the container — usually given by an `h-*` or `min-h-*` class.

<Demo name="center/basic" />

## Examples {#examples}

### Inline {#inline}

`inline` switches to `inline-flex`, keeping the container in the line of text — useful for aligning an icon with the words around it.

<Demo name="center/inline" />

## API {#api}

| Prop     | Type      | Default | Description                       |
| -------- | --------- | ------- | --------------------------------- |
| `inline` | `boolean` | `false` | Whether it is an inline container |
| `as`     | `string`  | `'div'` | The rendered tag                  |
| `class`  | `string`  | —       | Classes appended to the container |

| Slot      | Description  |
| --------- | ------------ |
| `default` | The children |
