---
title: Dialog
description: A modal dialog that interrupts the current task.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/dialog/Dialog.vue
  - label: Drawer
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/drawer/Drawer.vue
---

<Demo name="dialog/hero" />

## Usage {#usage}

```ts
import { Dialog } from '@hina-ui/vue'
```

`title` is required and `description` is the line under it. The default slot is the trigger, the `content` slot is the body, and the `footer` slot holds the actions. Both slots receive a `close` method.

<Demo name="dialog/basic" />

The close button, the scrim, the scroll lock and the focus trap all come with the component.

## Examples {#examples}

### Sizes {#sizes}

`size` sets the maximum width of the panel: 384, 448 and 576 pixels.

<Demo name="dialog/sizes" />

### Placement {#placement}

Without `placement`, the dialog is centred on a wide screen and sits along the bottom at full width on a narrow one. `center` and `bottom` each lock one of those shapes.

<Demo name="dialog/placement" />

### Long content {#scroll}

Content past the available height scrolls inside the `content` slot while the title and footer stay put. The panel itself never runs past the viewport.

<Demo name="dialog/scroll" />

### Controlled {#controlled}

`open` supports two-way binding. Leaving out the default slot renders no trigger, so the dialog can only be opened from outside.

<Demo name="dialog/controlled" />

### Locked {#locked}

With `locked`, neither Escape nor a click on the scrim closes the dialog, and the close button is disabled but still shown. Use it to keep a submission from being interrupted. Closing through `open` still works.

<Demo name="dialog/locked" />

## Behaviour {#behavior}

- The page is locked from scrolling while the dialog is open, focus is trapped inside the panel, and it returns to the trigger on close.
- Escape or a click on the scrim closes the dialog; `locked` disables both.
- The body is a ScrollArea, so its scrollbar matches every other scrolling region in the project.

## Accessibility {#a11y}

- The panel is a `role="dialog"`, with `title` and `description` wired to `aria-labelledby` and `aria-describedby`.
- The title renders as an `<h2>`, below the page heading level.
- The close button carries an accessible name taken from the current language.

## API {#api}

### Dialog {#props}

| Prop          | Type                   | Default | Description                           |
| ------------- | ---------------------- | ------- | ------------------------------------- |
| `title`       | `string`               | —       | Required. The dialog title            |
| `description` | `string`               | —       | The line under the title              |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | Maximum width of the panel            |
| `placement`   | `'center' \| 'bottom'` | —       | Follows the screen width when omitted |
| `locked`      | `boolean`              | `false` | Whether the user is kept from closing |
| `open`        | `boolean`              | —       | Whether it is open; supports v-model  |
| `class`       | `string`               | —       | Classes appended to the panel         |

| Slot      | Payload     | Description                             |
| --------- | ----------- | --------------------------------------- |
| `default` | —           | The trigger; omit it to render none     |
| `content` | `{ close }` | The body, scrolling when it is too tall |
| `footer`  | `{ close }` | The actions along the bottom            |
