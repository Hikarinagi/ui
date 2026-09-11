---
title: Skeleton
description: A placeholder that holds the shape of content while it loads.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/skeleton/Skeleton.vue
---

<Demo name="skeleton/hero" />

## Usage {#usage}

```ts
import { Skeleton } from '@hina-ui/vue'
```

Wrap the real content and pass `loading`. While it is true the content is hidden but still lays itself out, so the placeholder is exactly the size the content will be; once it turns false the wrapper disappears and only the content is left.

<Demo name="skeleton/wrapping" />

With no content of its own, Skeleton is a plain block whose size comes from its classes.

<Demo name="skeleton/basic" />

## Examples {#examples}

### Shapes {#shapes}

The shape is whatever the classes say: a rounded rectangle for an image, `rounded-full` for an avatar, a short bar for a line of text.

<Demo name="skeleton/shapes" />

## Behaviour {#behavior}

- A gradient wave sweeps across a fixed fill every 1.2 seconds by default, from left to right. The direction reverses in RTL layouts.
- Under `prefers-reduced-motion` the wave stops and the placeholder stays still.
- With `loading` false the component renders its slot and nothing else — no wrapper element is left behind.

## Accessibility {#a11y}

- The placeholder is `aria-hidden` and `inert`, so screen readers skip it and nothing inside can take focus.
- Announce the loading state at the region that owns it, not on each placeholder.

## API {#api}

| Prop      | Type      | Default  | Description                         |
| --------- | --------- | -------- | ----------------------------------- |
| `loading` | `boolean` | `true`   | Whether the placeholder is shown    |
| `as`      | `string`  | `'span'` | The rendered tag                    |
| `class`   | `string`  | —        | Classes appended to the placeholder |

| Slot      | Description                                            |
| --------- | ------------------------------------------------------ |
| `default` | The real content, which gives the placeholder its size |
