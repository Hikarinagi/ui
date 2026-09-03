---
title: VisuallyHidden
description: Text visible only to screen readers.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/visually-hidden/VisuallyHidden.vue
  - label: VisuallyHidden
    href: https://reka-ui.com/docs/utilities/visually-hidden
---

<Demo name="visually-hidden/hero" />

## Usage {#usage}

```ts
import { VisuallyHidden } from '@hina-ui/vue'
```

`VisuallyHidden` takes content off the screen while keeping it in the accessibility tree: screen readers announce it as usual and it occupies no visual space.

Use it for information the visuals already convey but assistive technology cannot reach. The commonest case is an icon-only control — the glyph means nothing to a screen reader, so a piece of text has to be supplied alongside it.

<Demo name="visually-hidden/basic" />

It is not a way to hide things. Content nobody needs to perceive belongs behind `aria-hidden`, or should not be rendered at all; stuffing filler in here only gives screen reader users more to listen through.

## Behaviour {#behavior}

- The content is clipped to a single pixel, takes up no layout space and does not disturb the typography around it.
- Focus behaviour is unchanged: a focusable element inside still enters the tab order.

## Accessibility {#a11y}

- The content stays in the accessibility tree and is announced in its normal place in the reading order.
- How it differs from `aria-label`: `aria-label` replaces an element's accessible name outright and suits wholesale replacement, while `VisuallyHidden` adds to the readable content and suits phrases meant to be read together with visible text.
- Whatever is added should read as one continuous sentence with its surroundings — “Rated 8.9, out of 10” rather than a stranded word.

## API {#api}

### Slots {#slots}

| Slot      | Description                            |
| --------- | -------------------------------------- |
| `default` | Content visible only to screen readers |
