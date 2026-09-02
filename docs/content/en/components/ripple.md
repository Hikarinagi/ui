---
title: Ripple
description: A ripple spreading from the point of contact.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/ripple/Ripple.vue
---

<Demo name="ripple/hero" />

## Usage {#usage}

```ts
import { Ripple } from '@hina-ui/vue'
```

Place `Ripple` inside the element that should answer a press, and the ripple spreads from wherever the finger or pointer landed. Controls such as `Button` already carry one; only hand-built pressable regions need it added.

The host element has three requirements: a positioning and stacking context (`relative isolate`), clipped overflow (`overflow-hidden`), and being the layer that answers the press itself — the component attaches its pointer listeners to its parent. The ripple inherits the host's corner radius and needs none of its own.

<Demo name="ripple/disabled" />

## Behaviour {#behavior}

- The ripple grows from the point of contact, sized against the host's diagonal, so it covers panels large and small.
- A very brief press still plays out a minimum duration, so a quick click is never reduced to a flicker.
- Touch input waits a moment before starting, which separates a tap from a swipe; a swipe raises no ripple.
- Moving the pointer outside the host after pressing cancels it, and coming back within bounds resumes.
- With reduced motion enabled the spread does not play.
- In forced-colors mode nothing is rendered.

## Accessibility {#a11y}

- The component carries `aria-hidden` and is pure decoration; it never enters the accessibility tree.
- It provides no semantics or interaction of its own. The host must be a focusable, operable element, and keyboard users get their feedback from the focus ring and the state layer.

## API {#api}

### Props {#props}

| Prop       | Type      | Default | Description               |
| ---------- | --------- | ------- | ------------------------- |
| `disabled` | `boolean` | `false` | Whether the ripple is off |
