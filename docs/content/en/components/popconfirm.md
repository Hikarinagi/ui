---
title: Popconfirm
description: A confirmation bubble that floats out next to its trigger.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/popconfirm/Popconfirm.vue
  - label: Popover
    href: https://reka-ui.com/docs/components/popover
---

<Demo name="popconfirm/hero" />

## Usage {#usage}

```ts
import { Popconfirm } from '@hina-ui/vue'
```

The popconfirm asks one question right next to its trigger, which suits small, local confirmations such as deleting a row or undoing an action; a weighty confirmation that has to interrupt the current task belongs to an [AlertDialog](/components/alert-dialog). `title` is the question, `description` spells out the consequence, and the pair of buttons at the bottom takes `cancelText` and `confirmText` for its text. The default slot is the trigger.

<Demo name="popconfirm/basic" />

## Examples {#examples}

### Destructive actions {#danger}

`tone="danger"` gives the confirm button the danger color for irreversible actions such as deleting.

<Demo name="popconfirm/danger" />

### Asynchronous confirm {#async}

When the `confirm` handler returns a Promise the bubble waits for it before closing: the confirm button shows a loading indicator, and Cancel, Esc and clicking outside are unavailable meanwhile. If the handler throws, the bubble stays open.

<Demo name="popconfirm/async" />

### Placement {#placement}

`side` and `align` work as in Popover; the default is right below the trigger, flipping to the other side when space runs out.

<Demo name="popconfirm/placement" />

### Controlled {#controlled}

`open` supports two-way binding, so the bubble can be opened or closed from outside.

<Demo name="popconfirm/controlled" />

## Behavior {#behavior}

- Focus lands on the Cancel button when the bubble opens, so an accidental Enter does nothing; focus returns to the trigger on close.
- Esc and clicking outside only close the bubble and do not fire `cancel`; only the Cancel button does.
- The page stops scrolling while it is open, and the trigger keeps its pressed look.
- When the confirm handler returns a Promise the bubble stays busy until it settles and then closes; a thrown error keeps it open.

## Accessibility {#a11y}

- The panel is `role="dialog"`, named after its trigger, with the question and description linked together through `aria-describedby`.
- The panel carries `aria-busy` while busy.
- Button text comes from the current locale and can be replaced.

## API {#api}

### Props {#props}

| Prop          | Type                                     | Default    | Description                                  |
| ------------- | ---------------------------------------- | ---------- | -------------------------------------------- |
| `title`       | `string`                                 | —          | Required. The question                       |
| `description` | `string`                                 | —          | Supporting text                              |
| `confirmText` | `string`                                 | locale     | Text of the confirm button                   |
| `cancelText`  | `string`                                 | locale     | Text of the cancel button                    |
| `tone`        | `'accent' \| 'danger'`                   | `'accent'` | Tone of the confirm button                   |
| `side`        | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Side the bubble floats out on                |
| `align`       | `'start' \| 'center' \| 'end'`           | `'center'` | Alignment against the trigger                |
| `sideOffset`  | `number`                                 | `8`        | Distance from the trigger in pixels          |
| `open`        | `boolean`                                | —          | Whether it is open, supports two-way binding |
| `class`       | `string`                                 | —          | Classes appended to the panel                |

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
