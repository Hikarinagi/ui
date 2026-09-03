---
title: CodeBlock
description: A block of code with syntax highlighting, a language badge and copying.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/code-block/CodeBlock.vue
---

<Demo name="code-block/hero" />

## Usage {#usage}

```ts
import { CodeBlock } from '@hina-ui/vue'
```

`code` is required and is rendered verbatim. `lang` names the language, which drives highlighting and the badge in the top corner.

<Demo name="code-block/basic" />

## Examples {#examples}

### Badge text {#label}

The badge shows `lang` by default. Set `label` to show a file name or another note instead; highlighting still follows `lang`.

<Demo name="code-block/label" />

### Without highlighting {#plain}

With no `lang`, nothing is highlighted and no badge is shown; the code appears as written. Command output and plain text suit this.

<Demo name="code-block/plain" />

### Copy button {#copyable}

A copy button sits in the top corner by default. Set `copyable` to `false` to remove it.

<Demo name="code-block/copyable" />

### Long lines {#overflow}

Code does not wrap. Anything wider than the block scrolls horizontally inside it, so the page itself is never stretched. The scrolling area can take focus, after which arrow keys scroll it.

<Demo name="code-block/overflow" />

### Pre-highlighted code {#prerendered}

The `html` property accepts markup that has already been highlighted. Once given, the component skips highlighting and renders that markup directly, while `code` is still used for copying.

Highlighting on the server or at build time keeps the browser from downloading a highlighter. Every code block on this site works that way.

<Demo name="code-block/prerendered" />

## Accessibility {#a11y}

- The scrolling area can take focus and is then scrolled with arrow keys; the focus ring appears around the block.
- The accessible name of that area comes from the badge, falling back to a generic name when no badge is set.
- The copy button is named “Copy code” and becomes “Copied” on success.

## API {#api}

### Props {#props}

| Prop       | Type      | Default | Description                                    |
| ---------- | --------- | ------- | ---------------------------------------------- |
| `code`     | `string`  | —       | Required. The code text, also used for copying |
| `lang`     | `string`  | —       | Language, driving highlighting and the badge   |
| `label`    | `string`  | —       | Badge text, overriding `lang`                  |
| `html`     | `string`  | —       | Pre-highlighted markup; skips highlighting     |
| `copyable` | `boolean` | `true`  | Whether to show the copy button                |
| `class`    | `string`  | —       | Classes appended to the root                   |
