---
title: LoadingOverlay
description: A loading indicator laid over an area, shown after a short wait.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/loading-overlay/LoadingOverlay.vue
---

<Demo name="loading-overlay/hero" />

## Usage {#usage}

```ts
import { LoadingOverlay } from '@hina-ui/vue'
```

The loading overlay fills the nearest positioned container, dims the content and puts a loading indicator on top; place it inside a container with `relative` and drive it with `visible`. It blocks interaction underneath as soon as it appears, but only becomes visible after a short wait, so a request that finishes quickly never flashes it.

<Demo name="loading-overlay/basic" />

## Examples {#examples}

### Text {#text}

`text` shows a line under the indicator and doubles as the indicator's accessible name.

<Demo name="loading-overlay/text" />

### Delay and minimum stay {#delay}

`delay` is how long the overlay waits after `visible` turns true before fading in, 300 milliseconds by default; taken away within that time, nothing shows. Set it to `0` to show at once, which suits actions the user started knowingly. `minVisible` is how long it stays once shown, 300 milliseconds by default, so it does not flash; set it to `0` to fade out the moment the request ends.

<Demo name="loading-overlay/delay" />

### Custom content {#custom}

The default slot replaces the indicator and text inside the veil, for a brand figure, a progress note or anything of your own; the veil, the delay and the blocking of interaction stay the same. Custom content should carry `role="status"` or equivalent text so assistive technology knows there is a wait.

<Demo name="loading-overlay/custom" />

### Covering the viewport {#fixed}

`fixed` makes the overlay cover the whole viewport for page-level waits.

<Demo name="loading-overlay/fixed" />

## Behavior {#behavior}

- When `visible` turns true the area stops answering interaction at once and the overlay fades in after `delay`; when it turns false it fades out and is removed, staying up to `minVisible` first if it appeared only just now.
- Taken away within the wait, it never flashes.
- The overlay neither stops the page from scrolling nor takes focus; to interrupt a whole task use the lock of a [Dialog](/components/dialog).

## Accessibility {#a11y}

- The indicator is `role="status"`, named by `text` or by the locale's "loading" when there is none.
- The visible text is hidden from assistive technology so it is not announced twice.

## API {#api}

### Props {#props}

| Prop         | Type                   | Default | Description                                            |
| ------------ | ---------------------- | ------- | ------------------------------------------------------ |
| `visible`    | `boolean`              | `false` | Whether the overlay shows                              |
| `text`       | `string`               | —       | Line under the indicator                               |
| `fixed`      | `boolean`              | `false` | Whether it covers the whole viewport                   |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size of the indicator                                  |
| `delay`      | `number`               | `300`   | Milliseconds to wait before showing; `0` shows at once |
| `minVisible` | `number`               | `300`   | Milliseconds it stays at least once shown              |
| `class`      | `string`               | —       | Classes appended to the overlay                        |

### Slots {#slots}

| Slot    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| default | Content inside the veil; the indicator and `text` by default |
