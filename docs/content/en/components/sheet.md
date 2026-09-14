---
title: Sheet
description: A panel that rises from the bottom of the screen and can be dragged shut.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/sheet/Sheet.vue
  - label: Dialog
    href: https://reka-ui.com/docs/components/dialog
---

<Demo name="sheet/hero" />

## Usage {#usage}

```ts
import { Sheet } from '@hina-ui/vue'
```

The sheet rises from the bottom edge of the screen, docked to it with rounded top corners, and suits sharing, filtering and quick actions on phones. `title` is required and `description` is a line under it; the default slot is the trigger, `content` the body and `footer` the action buttons, both receiving a `close` method. Dragging the handle or the title area downward closes the sheet once it has travelled far enough or fast enough, and snaps it back otherwise. With a handle there is no close button in the corner; the handle is the hint for closing.

<Demo name="sheet/basic" />

## Examples {#examples}

### Long content {#scroll}

Content taller than the available height scrolls inside the `content` slot while the title and footer stay put; the sheet grows up to the viewport minus a margin at the top.

<Demo name="sheet/scroll" />

### Controlled {#controlled}

`open` supports two-way binding. Without a default slot no trigger is rendered and the sheet can only be opened from outside.

<Demo name="sheet/controlled" />

### Locked {#locked}

With `locked`, dragging, Esc and clicking the scrim no longer close the sheet, and the handle dims to show it is unavailable for now; closing through `open` still works.

<Demo name="sheet/locked" />

### Without the handle {#handle}

`handle` set to `false` hides the handle. When the header is visible, a close button appears in its corner and the title area can still be dragged.

<Demo name="sheet/handle" />

### Hidden header {#header}

As with [Dialog](/components/dialog), set `:header="false"` to hide the header, including its title, description, and close button. `title` is still required; it and `description` remain available to assistive technology as visually hidden content.

`handle` controls the handle independently. With the header hidden, the remaining handle still supports drag-to-dismiss. Also setting `:handle="false"` removes the top drag region, so content starts at the regular padding. Esc, the scrim, and the slots' `close` method can still close the sheet; `locked` keeps its existing behavior.

The example calls `close` from a footer [Button](/components/button).

<Demo name="sheet/header" />

## Behavior {#behavior}

- The sheet slides in from the bottom edge, centered with a maximum width on wide screens and full width on narrow ones, leaving room for the device's safe area at the bottom.
- Dragging starts only on the handle and the title area, leaving the body to scrolling; on release the sheet keeps sliding out from where it was let go when it has travelled more than three tenths of its height or fast enough, and snaps back otherwise.
- The page stops scrolling while it is open, focus is trapped inside, and focus returns to the trigger on close.
- Esc and clicking the scrim close it; `locked` disables both along with dragging.

## Accessibility {#a11y}

- The panel is `role="dialog"`, with `title` and `description` linked through `aria-labelledby` and `aria-describedby`.
- The handle is a visual hint hidden from assistive technology; the close button shown with a visible header and no handle carries a localized name.
- Dragging is a shortcut for touch and mouse; keyboard users close it with Esc, and a footer button can call `close`.

## API {#api}

### Props {#props}

| Prop          | Type      | Default | Description                                                               |
| ------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `title`       | `string`  | —       | Required. Title of the sheet                                              |
| `description` | `string`  | —       | Line under the title                                                      |
| `header`      | `boolean` | `true`  | Show the header; keep the accessible name and description when hidden     |
| `handle`      | `boolean` | `true`  | Show the handle; the close button only appears when the header is visible |
| `locked`      | `boolean` | `false` | Whether the user is kept from closing it                                  |
| `open`        | `boolean` | —       | Whether it is open, supports two-way binding                              |
| `class`       | `string`  | —       | Classes appended to the panel                                             |

### Slots {#slots}

| Slot      | Props   | Description        |
| --------- | ------- | ------------------ |
| default   | —       | The trigger        |
| `content` | `close` | The body           |
| `footer`  | `close` | The action buttons |
