---
title: Spoiler
description: Hides spoilers until they are revealed by a click or hover.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/spoiler/Spoiler.vue
---

<Demo name="spoiler/hero" />

## Usage {#usage}

```ts
import { Spoiler } from '@hina-ui/vue'
```

Put the text to hide in the default slot. While hidden it is covered in noise and cannot be selected; a click reveals it, expanding outward from where the pointer landed.

<Demo name="spoiler/basic" />

## Examples {#examples}

### Revealing on hover {#hover}

With `reveal-on="hover"` the content is revealed as the pointer enters and hidden again as it leaves. Keyboard focus and blur do the same.

<Demo name="spoiler/hover" />

### Controlled {#controlled}

`hidden` supports two-way binding, so a whole passage can be revealed from outside.

<Demo name="spoiler/controlled" />

### Content across several lines {#multiline}

A passage spanning several lines can be hidden as a whole. The reveal is centred on the pointer and spreads line by line.

<Demo name="spoiler/multiline" />

### Fallback {#fallback}

The noise cover relies on the browser's paint worklet. Without it the component falls back to a tinted background with a blur, behaving exactly the same. Set `force-fallback` to use that form deliberately.

<Demo name="spoiler/fallback" />

## Behaviour {#behavior}

- Hidden text cannot be selected or copied.
- A reveal expands from the pointer, or from the geometric centre when triggered by keyboard.

## Accessibility {#a11y}

- In click mode the component renders with `role="button"`, takes focus, and responds to both Enter and Space.
- The accessible name changes with state, reading as a prompt to reveal while hidden and as a prompt to hide once revealed.
- `aria-expanded` reflects whether the content is revealed.

## API {#api}

### Props {#props}

| Prop            | Type                 | Default   | Description                      |
| --------------- | -------------------- | --------- | -------------------------------- |
| `hidden`        | `boolean`            | `true`    | Whether hidden; supports v-model |
| `revealOn`      | `'click' \| 'hover'` | `'click'` | How it is revealed               |
| `forceFallback` | `boolean`            | `false`   | Force the fallback form          |
| `class`         | `string`             | —         | Classes appended to the root     |

### Slots {#slots}

| Slot      | Description        |
| --------- | ------------------ |
| `default` | The hidden content |
