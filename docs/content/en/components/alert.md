---
title: Alert
description: A message bar that appears in the page after something happens.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/alert/Alert.vue
---

<Demo name="alert/hero" />

## Usage {#usage}

```ts
import { Alert } from '@hina-ui/vue'
```

An alert reports something that just happened, such as a successful save, a failed publish or a required sign-in. It sits within the page content and screen readers announce it on their own. A fixed note written into the content is a `Callout`; brief feedback that floats in is a `Toast`.

<Demo name="alert/basic" />

## Examples {#examples}

### Tones {#tones}

Six tones; the default is `neutral`. The icon follows the tone, and `icon` set to `false` removes it.

<Demo name="alert/tones" />

### Custom icon {#icon}

The `icon` slot replaces the default icon.

<Demo name="alert/icon" />

### Title {#title}

`title` is shown before the body.

<Demo name="alert/title" />

### Closable {#closable}

With `closable` set a close button sits at the end and emits `close` when clicked. `v-model:open` controls whether the alert is shown.

<Demo name="alert/closable" />

### Actions {#actions}

The `actions` slot sits after the body, for one or two buttons.

<Demo name="alert/actions" />

## Behaviour {#behavior}

- The alert expands and fades in when it appears, collapses and fades out when closed, and the surrounding content moves smoothly.
- No entrance animation plays on first render.

## Accessibility {#a11y}

- `danger` and `warning` alerts have the `alert` role and are announced at once; the other tones have the `status` role and are read after the current announcement.
- The close button is named “Close”.

## API {#api}

### Props {#props}

| Prop       | Type                                                                    | Default     | Description                                |
| ---------- | ----------------------------------------------------------------------- | ----------- | ------------------------------------------ |
| `tone`     | `'neutral' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Tone                                       |
| `title`    | `string`                                                                | —           | Title                                      |
| `icon`     | `boolean`                                                               | `true`      | Whether to show the icon                   |
| `closable` | `boolean`                                                               | `false`     | Whether to show a close button             |
| `open`     | `boolean`                                                               | `true`      | Whether the alert is shown, `v-model:open` |
| `class`    | `string`                                                                | —           | Classes appended to the bar                |

### Events {#events}

| Event         | Payload         | Description                  |
| ------------- | --------------- | ---------------------------- |
| `update:open` | `open: boolean` | The shown state changed      |
| `close`       | —               | The close button was clicked |

### Slots {#slots}

| Slot      | Description                |
| --------- | -------------------------- |
| `default` | Body                       |
| `icon`    | Replaces the icon          |
| `actions` | Action area after the body |
