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

### Asynchronous confirm {#async}

When the `confirm` handler returns a Promise the dialog waits for it before closing: the confirm button shows a loading indicator, and Cancel and Esc are unavailable meanwhile. If the handler throws, the dialog stays open so the outcome is seen in place.

<Demo name="alert-dialog/async" />

### Controlled {#controlled}

`open` supports two-way binding. Without a default slot no trigger is rendered and the dialog can only be opened from outside.

<Demo name="alert-dialog/controlled" />

### Size and placement {#placement}

`size` defaults to `sm`, 384 pixels wide, and `md` is 448; `placement` works as in Dialog, centered on wide screens and docked to the bottom on narrow ones when unset.

<Demo name="alert-dialog/placement" />

## Behavior {#behavior}

- Focus lands on the Cancel button when the dialog opens, so an accidental Enter does nothing; focus returns to the trigger on close.
- Clicking the scrim does not close it; Esc closes it and counts as cancel.
- The page stops scrolling and focus is trapped inside the panel while it is open.
- When the confirm handler returns a Promise the dialog stays busy until it settles and then closes; a thrown error keeps it open.

## Accessibility {#a11y}

- The panel is `role="alertdialog"`, with the title and description linked through `aria-labelledby` and `aria-describedby`.
- The panel carries `aria-busy` while busy.
- Button text comes from the current locale and can be replaced.

## API {#api}

### Props {#props}

| Prop          | Type                   | Default    | Description                                  |
| ------------- | ---------------------- | ---------- | -------------------------------------------- |
| `title`       | `string`               | —          | Required. The question                       |
| `description` | `string`               | —          | Supporting text                              |
| `confirmText` | `string`               | locale     | Text of the confirm button                   |
| `cancelText`  | `string`               | locale     | Text of the cancel button                    |
| `tone`        | `'accent' \| 'danger'` | `'accent'` | Tone of the confirm button                   |
| `size`        | `'sm' \| 'md'`         | `'sm'`     | Maximum width of the panel                   |
| `placement`   | `'center' \| 'bottom'` | —          | Follows the screen width when unset          |
| `open`        | `boolean`              | —          | Whether it is open, supports two-way binding |
| `class`       | `string`               | —          | Classes appended to the panel                |

### Slots {#slots}

| Slot      | Description                                 |
| --------- | ------------------------------------------- |
| default   | The trigger                                 |
| `content` | Content between the description and buttons |

### Events {#events}

| Event     | Payload | Description                                                |
| --------- | ------- | ---------------------------------------------------------- |
| `confirm` | —       | Confirm was clicked; a Promise from the handler is awaited |
| `cancel`  | —       | Cancel was clicked                                         |
