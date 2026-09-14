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

`title` is required and `description` is the line under it. The default slot is the trigger, `content` holds the body, and `footer` holds the actions. The `content`, `footer`, and custom-layout `body` slots receive a `close` method. Dragging the handle or title area downward closes the sheet once it travels far or fast enough; otherwise it snaps back. The close button is hidden by default when a handle is shown.

<Demo name="sheet/basic" />

## Examples {#examples}

### Title content {#title}

As with [Dialog](/components/dialog), the `icon` slot displays a decorative icon before the title, and the `title` slot replaces the title content, falling back to the `title` prop. The custom title keeps its `<h2>` semantics and accessible name association.

The example includes a [Tag](/components/tag) in the title.

<Demo name="sheet/title" />

### Close button {#closable}

`closable` defaults to `true`. Setting it to `false` only hides the header's close button. Escape and clicking the scrim still close the panel; `locked` controls these dismissal behaviors. The built-in close button is not rendered with a hidden header or a `body` slot. Sheet keeps its default behavior of hiding the close button when the handle is shown. With `:handle="false"` and a visible header, `closable` controls the button; the title area remains draggable.

<Demo name="sheet/closable" />

### Custom panel content {#body}

`#body="{ close }"` takes over the internal layout, replacing the default header, content, and footer. The component no longer adds content padding, region gaps, or a [ScrollArea](/components/scroll-area) wrapper. The slot controls scrolling and bottom safe-area spacing. An empty slot still replaces the default layout.

In this mode, `header`, `closable`, and the `icon`, `title`, `content`, and `footer` slots do not participate in rendering. `title` is still required; it and the supplied description remain visually hidden. The scrim, focus trap, and `locked` remain active, and the slot's `close()` can close the panel programmatically.

`handle` still controls the handle independently. It stays above the custom content by default, and only its region can start a drag. Setting `:handle="false"` removes the top drag region and its spacing. Custom body content does not become draggable.

The example uses [CloseButton](/components/close-button), [ScrollArea](/components/scroll-area), and [Button](/components/button) to compose a flush header, a separate scroll area, and a fixed footer.

<Demo name="sheet/body" />

### Long content {#scroll}

Content taller than the available height scrolls inside the `content` slot while the title and footer stay put; the sheet grows up to the viewport minus a margin at the top.

<Demo name="sheet/scroll" />

### Scroll viewport {#viewport}

Use the component ref's `viewport` to access the actual scrollable element of its built-in [ScrollArea](/components/scroll-area). Read `scrollTop`, call `scrollTo()`, or pass it to scroll listeners and observers.

`viewport` has type `HTMLElement | undefined`. It is `undefined` before the content scroll area initializes, without a `content` slot, and after content unmounts. It remains available during exit and updates to a new element on reopening. Watch `() => modal.value?.viewport` to act when ready or attach listeners, and remove listeners in the watch cleanup callback.

With a `body` slot, the built-in scroll area is replaced and `viewport` is `undefined`. Reference a custom scroll area directly.

The example uses [Button](/components/button) to scroll with `viewport.scrollTo()`.

<Demo name="sheet/viewport" />

### Controlled {#controlled}

`open` supports two-way binding. Without a default slot no trigger is rendered and the sheet can only be opened from outside.

<Demo name="sheet/controlled" />

### Locked {#locked}

With `locked`, dragging, Esc and clicking the scrim no longer close the sheet, and the handle dims to show it is unavailable for now; closing through `open` still works.

<Demo name="sheet/locked" />

### Without the handle {#handle}

`handle` set to `false` hides the handle. When the header is visible, a close button appears in its corner and the title area can still be dragged. Set `closable=false` to hide the button.

<Demo name="sheet/handle" />

### Hidden header {#header}

As with [Dialog](/components/dialog), set `:header="false"` to hide the header, including its title, description, and close button. `title` is still required; it and `description` remain available to assistive technology as visually hidden content. The `icon` and `title` slots are not rendered.

`handle` controls the handle independently. With the header hidden, the remaining handle still supports drag-to-dismiss. Also setting `:handle="false"` removes the top drag region, so content starts at the regular padding. Esc, the scrim, and the slots' `close` method can still close the sheet; `locked` keeps its existing behavior.

The example calls `close` from a footer [Button](/components/button).

<Demo name="sheet/header" />

## Behavior {#behavior}

- Overlays stack in opening order, with the latest above earlier overlays, regardless of component mount order. Closing preserves the full exit animation before removing the overlay.
- The sheet slides in from the bottom edge, centered with a maximum width on wide screens and full width on narrow ones, leaving room for the device's safe area at the bottom in the default layout. Custom `body` content controls its own safe-area spacing.
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
| `closable`    | `boolean` | `true`  | Show the close button in the header                                       |
| `locked`      | `boolean` | `false` | Whether the user is kept from closing it                                  |
| `open`        | `boolean` | —       | Whether it is open, supports two-way binding                              |
| `class`       | `string`  | —       | Classes appended to the panel                                             |

### Slots {#slots}

| Slot      | Payload     | Description                                                              |
| --------- | ----------- | ------------------------------------------------------------------------ |
| `default` | —           | The trigger; omit it to render none                                      |
| `icon`    | —           | Decorative icon before the title                                         |
| `title`   | —           | Title content; defaults to the title prop                                |
| `body`    | `{ close }` | Custom internal layout; replaces the default header, content, and footer |
| `content` | `{ close }` | Content, scrolling when it is too tall                                   |
| `footer`  | `{ close }` | Actions along the bottom                                                 |

### Exposed instance {#expose}

| Property   | Type                       | Description                                                                                                                                       |
| ---------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `viewport` | `HTMLElement \| undefined` | Actual scrollable element of the built-in [ScrollArea](/components/scroll-area); available after initialization and cleared when content unmounts |
