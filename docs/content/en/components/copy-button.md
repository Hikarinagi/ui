---
title: CopyButton
description: Writes a piece of text to the clipboard and confirms the result.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/copy-button/CopyButton.vue
---

<Demo name="copy-button/hero" />

## Usage {#usage}

```ts
import { CopyButton } from '@hina-ui/vue'
```

`text` is required and its content is written to the clipboard. On success the icon turns from a copy glyph into a check, the name becomes “Copied”, and both revert after two seconds.

<Demo name="copy-button/basic" />

## Examples {#examples}

### Sizes {#sizes}

Defaults to `sm`. A copy button usually follows a piece of text or a command, where `sm` matches the height of the neighbouring text most closely.

<Demo name="copy-button/sizes" />

### Name and tooltip {#label}

The default name is “Copy”. Where a page has several copy buttons, use `label` to say what each one copies and turn on `tooltip`, so they can be told apart before clicking.

Once copying succeeds the name always switches to “Copied”, and the custom name is not shown during that time.

<Demo name="copy-button/label" />

### Reset delay {#timeout}

`timeout` sets how long the success state lasts, defaulting to 2000 milliseconds. Lengthen it where the button sits inside a long form or at the edge of the page, so the feedback is easier to notice.

<Demo name="copy-button/timeout" />

### The copied event {#event}

On success the component emits `copied` with the text that was written. Nothing is emitted on failure.

<Demo name="copy-button/event" />

## Clipboard limits {#clipboard}

Browsers only expose the clipboard in a secure context, so the page has to be served over HTTPS or from `localhost`. Pages opened through `file://` and some embedded pages have writes rejected.

When a write fails the button does not enter the success state, the icon and name stay as they are, and no `copied` event is emitted.

## Accessibility {#a11y}

- The default name is “Copy” and becomes “Copied” on success, a change screen readers announce.
- The button renders a native `button`, takes keyboard focus, and responds to both Enter and Space.
- The tooltip is off by default and can be turned on with `tooltip`.

## API {#api}

### Props {#props}

| Prop       | Type                   | Default | Description                                 |
| ---------- | ---------------------- | ------- | ------------------------------------------- |
| `text`     | `string`               | —       | Required. The text written to the clipboard |
| `label`    | `string`               | Copy    | Accessible name of the button               |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'sm'`  | Size                                        |
| `timeout`  | `number`               | `2000`  | How long the success state lasts, in ms     |
| `tooltip`  | `boolean`              | `false` | Whether to show a tooltip                   |
| `disabled` | `boolean`              | `false` | Whether the button is unavailable           |
| `class`    | `string`               | —       | Classes appended to the button              |

### Events {#events}

| Event    | Payload        | Description                     |
| -------- | -------------- | ------------------------------- |
| `copied` | `text: string` | Emitted when the write succeeds |
