---
title: Callout
description: A note written into the content.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/callout/Callout.vue
---

<Demo name="callout/hero" />

## Usage {#usage}

```ts
import { Callout } from '@hina-ui/vue'
```

A callout is a passage written into the content — an aside, a shortcut worth knowing, or something to watch out for. It lives with the content and never appears or disappears on its own.

<Demo name="callout/basic" />

Which one to reach for: `Callout` for a note written into a document or a help page, `Alert` for a message that appears after an action, and `Toast` for brief feedback that clears itself after a few seconds.

## Examples {#examples}

### Tones {#tones}

Six tones, `neutral` by default. The icon follows the tone.

`accent` offers a suggestion or a shortcut; the rest carry the same meaning they do elsewhere on the site: `info` adds background, `success` marks the recommended way, `warning` asks for care, and `danger` flags something that cannot be undone.

<Demo name="callout/tones" />

### Title {#title}

`title` sits above the body and sums the passage up in a phrase. Add one when the body runs long, so a reader can tell at a glance whether it concerns them.

<Demo name="callout/title" />

### Icon {#icon}

Set `icon` to `false` to drop the icon. To swap in a different one use the `icon` slot, keeping `size-5` and `mt-0.5` so it stays aligned with the first line of the body.

<Demo name="callout/icon" />

## Accessibility {#a11y}

- A callout has the `note` role. Screen readers announce it as ordinary content and it never interrupts what is being read. Use `Alert` for a message that must be announced.
- Colour cannot be the only cue: the body itself should read as a tip or a warning.
- The icon is not announced.

## API {#api}

### Props {#props}

| Prop    | Type                                                                    | Default     | Description                  |
| ------- | ----------------------------------------------------------------------- | ----------- | ---------------------------- |
| `tone`  | `'neutral' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Tone                         |
| `title` | `string`                                                                | —           | Title                        |
| `icon`  | `boolean`                                                               | `true`      | Whether the icon is shown    |
| `class` | `string`                                                                | —           | Classes appended to the root |

### Slots {#slots}

| Slot      | Description       |
| --------- | ----------------- |
| `default` | The body          |
| `icon`    | Replaces the icon |
