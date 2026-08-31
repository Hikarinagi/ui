---
title: Code
description: Inline code within body text, for variable names, properties and commands.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/code/Code.vue
  - label: CodeBlock
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/code-block/CodeBlock.vue
---

<Demo name="code/hero" />

## Usage {#usage}

```ts
import { Code } from '@hikarinagi/ui'
```

The component renders a native `code` element in a monospaced face with a tinted background and rounded corners. Use it to mark a short piece of code inside a sentence: a variable, a property, a file name or a single command.

<Demo name="code/basic" />

## Examples {#examples}

### Scales with its context {#inline}

The font size is relative and works out to 87.5% of the surrounding text, so it shrinks along with smaller paragraphs instead of standing out.

<Demo name="code/inline" />

### Inline code in body content {#prose}

`Prose` applies the same styling to native `code` elements inside it, so rendered Markdown and rich text need no tag replacement.

<Demo name="code/prose" />

### Blocks of code {#block}

Code longer than one line belongs in `CodeBlock`, which adds syntax highlighting, a language badge and a copy button.

<Demo name="code/block" />

## Accessibility {#a11y}

- The component renders a native `code` element, which screen readers announce as code.
- The background only separates the code from its surroundings and carries no state, so there are no tones.

## API {#api}

### Props {#props}

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |

### Slots {#slots}

| Slot      | Description   |
| --------- | ------------- |
| `default` | The code text |
