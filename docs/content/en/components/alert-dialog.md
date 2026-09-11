---
title: AlertDialog
description: A confirmation dialog that needs an explicit answer.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/alert-dialog/AlertDialog.vue
  - label: AlertDialog
    href: https://reka-ui.com/docs/components/alert-dialog
---

<Demo name="alert-dialog/hero" />

## Usage {#usage}

```ts
import { AlertDialog } from '@hina-ui/vue'
```

The alert dialog asks one question: `title` is the question, `description` spells out the consequence, and a fixed pair of buttons sits at the bottom, with `cancelText` and `confirmText` to change their text. The default slot is the trigger. Clicking the scrim does not close it; Esc or Cancel does, and there is no close button in the corner because answering is how it closes.

<Demo name="alert-dialog/basic" />

## Examples {#examples}

### Destructive actions {#danger}

`tone="danger"` gives the confirm button the danger color for irreversible actions such as deleting.

<Demo name="alert-dialog/danger" />

### Confirmation countdown {#countdown}

`confirmDelay` sets the wait before confirmation in seconds and defaults to `0`. Each opening starts a new countdown. The confirm button is disabled and shows the remaining seconds, then returns to its original label and enabled state. Cancel and Esc remain available while waiting.

Changing `confirmDelay` while open restarts the countdown with the new value; setting it to `0` removes the wait immediately. Positive fractions round up. Non-positive or non-finite values are treated as `0`. A failed confirmation can be retried immediately.

<Demo name="alert-dialog/countdown" />

### Asynchronous confirm {#async}

Pass the confirmation handler through `onConfirm` or `@confirm`. When it returns a Promise or PromiseLike, the dialog waits for completion before closing. The confirm button shows a loading indicator, and Cancel and Esc are unavailable while pending.

The component catches synchronous throws and asynchronous rejections and emits the original reason through `error`. The dialog stays open and the buttons become available for retry. Use `@error` to update an error message.

<Demo name="alert-dialog/async" />

### Controlled {#controlled}

`open` supports two-way binding. Without a default slot no trigger is rendered and the dialog can only be opened from outside.

<Demo name="alert-dialog/controlled" />

### Size and placement {#placement}

`size` defaults to `sm`, 384 pixels wide, and `md` is 448; `placement` works as in [Dialog](/components/dialog), centered on wide screens and docked to the bottom on narrow ones when unset.

<Demo name="alert-dialog/placement" />

## Behavior {#behavior}

- Focus lands on the Cancel button when the dialog opens, so an accidental Enter does nothing; focus returns to the trigger on close.
- Clicking the scrim does not close it; Esc closes it and counts as cancel.
- The page stops scrolling and focus is trapped inside the panel while it is open.
- When the confirm handler returns a Promise the dialog stays busy until it settles. Success closes it; failure emits `error` and keeps it open.

## Accessibility {#a11y}

- The panel is `role="alertdialog"`, with the title and description linked through `aria-labelledby` and `aria-describedby`.
- The panel carries `aria-busy` while busy.
- Button text comes from the current locale and can be replaced.

## API {#api}

### Props {#props}

| Prop           | Type                   | Default    | Description                                               |
| -------------- | ---------------------- | ---------- | --------------------------------------------------------- |
| `title`        | `string`               | —          | Required. The question                                    |
| `description`  | `string`               | —          | Supporting text                                           |
| `confirmText`  | `string`               | locale     | Text of the confirm button                                |
| `confirmDelay` | `number`               | `0`        | Seconds to wait before confirmation on each opening       |
| `cancelText`   | `string`               | locale     | Text of the cancel button                                 |
| `tone`         | `'accent' \| 'danger'` | `'accent'` | Tone of the confirm button                                |
| `size`         | `'sm' \| 'md'`         | `'sm'`     | Maximum width of the panel                                |
| `placement`    | `'center' \| 'bottom'` | —          | Follows the screen width when unset                       |
| `onConfirm`    | `() => unknown`        | —          | Confirmation handler; may return a Promise or PromiseLike |
| `open`         | `boolean`              | —          | Whether it is open, supports two-way binding              |
| `class`        | `string`               | —          | Classes appended to the panel                             |

### Slots {#slots}

| Slot      | Description                                 |
| --------- | ------------------------------------------- |
| default   | The trigger                                 |
| `content` | Content between the description and buttons |

### Events {#events}

| Event     | Payload   | Description                                                |
| --------- | --------- | ---------------------------------------------------------- |
| `confirm` | —         | Confirm was clicked; a Promise from the handler is awaited |
| `cancel`  | —         | Cancel was clicked                                         |
| `error`   | `unknown` | Original confirmation failure; keeps the dialog open       |
