---
title: Spinner
description: A spinning indicator for work in progress.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/spinner/Spinner.vue
---

<Demo name="spinner/hero" />

## Usage {#usage}

```ts
import { Spinner } from '@hina-ui/vue'
```

`Spinner` stands for a wait of unknown length. It only indicates; it blocks nothing and brings no scrim.

When a whole block of content is loading and its shape is known, `Skeleton` serves better — placeholders keep the layout steady before the content lands. `Spinner` suits places where a skeleton cannot be drawn, such as inside a button or a small region.

## Examples {#examples}

### Sizes {#sizes}

Three steps: `sm` for buttons and beside inline text, `md` as the default, `lg` for a wait that occupies a block of its own.

<Demo name="spinner/sizes" />

### Colour {#color}

The ring takes the current text colour, so it follows along inside a button or coloured text with no separate styling. Override it with a text-colour class where a specific one is needed.

<Demo name="spinner/color" />

### Label {#label}

The default accessible name follows the interface language (“Loading” in English). When several waits share a page, or the reader needs to know what is being waited on, name each with `label`.

Where visible text already explains the wait, put the same wording in `label` so the two agree.

<Demo name="spinner/label" />

## Behaviour {#behavior}

- One revolution takes a duration from the motion tokens, shared with the other looping animations.
- With reduced motion enabled the rotation stops while the indicator stays visible.
- Size and border thickness change together; do not override one without the other.

## Accessibility {#a11y}

- It carries `role="status"`, so screen readers announce the change without interrupting what they are currently reading.
- The default accessible name comes from the interface language and `label` overrides it.
- It says only that something is in progress and expresses no amount. Where progress is actually known, use a progress bar rather than a spinner.

## API {#api}

### Props {#props}

| Prop    | Type                   | Default            | Description     |
| ------- | ---------------------- | ------------------ | --------------- |
| `size`  | `'sm' \| 'md' \| 'lg'` | `'md'`             | Size            |
| `label` | `string`               | Interface language | Accessible name |

Remaining attributes pass through to the root element, `class` among them.
