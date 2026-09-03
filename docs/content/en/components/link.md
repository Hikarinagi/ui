---
title: Link
description: A text link that can render as a native anchor or a router component.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/link/Link.vue
---

<Demo name="link/hero" />

## Usage {#usage}

```ts
import { Link } from '@hina-ui/vue'
```

The component renders a native `a` by default and passes attributes straight through, so `href`, `target` and `rel` are written as usual. It uses the accent colour and no underline by default.

<Demo name="link/basic" />

## Examples {#examples}

### Tones {#tones}

Use `accent` for ordinary links in body text and navigation, and `neutral` where the surroundings are already emphasised and a second colour would be noise, such as breadcrumbs.

<Demo name="link/tones" />

### Underline {#underline}

`underline` draws a rule under the text, faint at rest and stronger on hover. Turn it on where links appear densely in body text, so they can be told apart from ordinary words.

<Demo name="link/underline" />

### Router links {#router}

`as` accepts a component, so the link can render as `NuxtLink` or another router component. Its properties are then written as that component expects, for example `to`.

<Demo name="link/router" />

### Links in body content {#prose}

`Prose` gives native `a` elements inside it the accent colour and an underline, so rendered Markdown and rich text need no tag replacement.

<Demo name="link/prose" />

## Accessibility {#a11y}

- Link text should describe the destination; avoid “click here”.
- Add `rel="noreferrer"` when opening in a new tab.

## API {#api}

### Props {#props}

| Prop        | Type                    | Default    | Description                                   |
| ----------- | ----------------------- | ---------- | --------------------------------------------- |
| `tone`      | `'accent' \| 'neutral'` | `'accent'` | Semantic tone                                 |
| `underline` | `boolean`               | `false`    | Whether to underline                          |
| `as`        | `string \| Component`   | `'a'`      | Element or component to render                |
| `asChild`   | `boolean`               | `false`    | Render nothing, merging into the single child |
| `class`     | `string`                | —          | Classes appended to the root                  |

### Slots {#slots}

| Slot      | Description   |
| --------- | ------------- |
| `default` | The link text |
