---
title: Drawer
description: A modal panel that slides in from the edge of the screen.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/drawer/Drawer.vue
  - label: Dialog
    href: https://reka-ui.com/docs/components/dialog
---

<Demo name="drawer/hero" />

## Usage {#usage}

```ts
import { Drawer } from '@hina-ui/vue'
```

`title` is required and `description` is the line under it. The default slot is the trigger, the `content` slot is the body, and the `footer` slot holds the actions. The `content`, `footer`, and custom-layout `body` slots receive a `close` method.

<Demo name="drawer/basic" />

The drawer opens flush against the edge of the screen, fills the full height and keeps square corners. The scrim, the scroll lock and the focus trap are the same as in [Dialog](/components/dialog).

## Examples {#examples}

### Title content {#title}

As with [Dialog](/components/dialog), the `icon` slot displays a decorative icon before the title, and the `title` slot replaces the title content, falling back to the `title` prop. The custom title keeps its `<h2>` semantics and accessible name association.

The example includes a [Tag](/components/tag) in the title.

<Demo name="drawer/title" />

### Hidden header {#header}

Set `:header="false"` to hide the header, including its title, description, and close button; content and footer keep their existing layout. `title` is still required and remains available with the supplied `description` as visually hidden content. The `icon` and `title` slots are not rendered.

<Demo name="drawer/header" />

### Close button {#closable}

`closable` defaults to `true`. Setting it to `false` only hides the header's close button. Escape and clicking the scrim still close the panel; `locked` controls these dismissal behaviors. The built-in close button is not rendered with a hidden header or a `body` slot.

<Demo name="drawer/closable" />

### Custom panel content {#body}

`#body="{ close }"` takes over the internal layout, replacing the default header, content, and footer. The component no longer adds content padding, region gaps, or a [ScrollArea](/components/scroll-area) wrapper. The slot controls scrolling and bottom safe-area spacing. An empty slot still replaces the default layout.

In this mode, `header`, `closable`, and the `icon`, `title`, `content`, and `footer` slots do not participate in rendering. `title` is still required; it and the supplied description remain visually hidden. The scrim, focus trap, and `locked` remain active, and the slot's `close()` can close the panel programmatically.

The example uses [CloseButton](/components/close-button), [ScrollArea](/components/scroll-area), and [Button](/components/button) to compose a flush header, a separate scroll area, and a fixed footer.

<Demo name="drawer/body" />

### Side {#side}

`side` takes `start` or `end`, meaning the start and end edges of the writing direction. In English that is the left and right edge; in a right-to-left language they swap automatically.

<Demo name="drawer/side" />

### Sizes {#sizes}

`size` sets the width of the drawer: 288, 360 and 480 pixels. On a narrow screen the width never exceeds the viewport minus 48 pixels.

<Demo name="drawer/sizes" />

### Navigation {#navigation}

A list of `NavLink`s inside a drawer is the navigation menu of a narrow screen. `AppShell` already ships this shape: the sidebar folds into a drawer once the screen is narrow, so there is nothing to assemble.

<Demo name="drawer/navigation" />

### Long content {#scroll}

Content past the available height scrolls inside the `content` slot while the title and footer stay put.

<Demo name="drawer/scroll" />

### Scroll viewport {#viewport}

Use the component ref's `viewport` to access the actual scrollable element of its built-in [ScrollArea](/components/scroll-area). Read `scrollTop`, call `scrollTo()`, or pass it to scroll listeners and observers.

`viewport` has type `HTMLElement | undefined`. It is `undefined` before the content scroll area initializes, without a `content` slot, and after content unmounts. It remains available during exit and updates to a new element on reopening. Watch `() => modal.value?.viewport` to act when ready or attach listeners, and remove listeners in the watch cleanup callback.

With a `body` slot, the built-in scroll area is replaced and `viewport` is `undefined`. Reference a custom scroll area directly.

The example uses [Button](/components/button) to scroll with `viewport.scrollTo()`.

<Demo name="drawer/viewport" />

### Controlled {#controlled}

`open` supports two-way binding. Leaving out the default slot renders no trigger, so the drawer can only be opened from outside.

<Demo name="drawer/controlled" />

### Locked {#locked}

With `locked`, neither Escape nor a click on the scrim closes the drawer, and any visible close button is disabled. Closing through `open` still works.

<Demo name="drawer/locked" />

## Behaviour {#behavior}

- Overlays stack in opening order, with the latest above earlier overlays, regardless of component mount order. Closing preserves the full exit animation before removing the overlay.
- The page is locked from scrolling while the drawer is open, focus is trapped inside the panel, and it returns to the trigger on close.
- Escape or a click on the scrim closes the drawer; `locked` disables both.
- The default body uses [ScrollArea](/components/scroll-area); a `body` slot controls its own scrolling.

## Accessibility {#a11y}

- The panel is a `role="dialog"`, with `title` and `description` wired to `aria-labelledby` and `aria-describedby`.
- The title renders as an `<h2>`. With a hidden header or a `body` slot, the `title` prop provides a visually hidden heading.
- The close button carries an accessible name taken from the current language.

## API {#api}

### Drawer {#props}

| Prop          | Type                   | Default | Description                                                               |
| ------------- | ---------------------- | ------- | ------------------------------------------------------------------------- |
| `title`       | `string`               | —       | Required. The drawer title                                                |
| `description` | `string`               | —       | The line under the title                                                  |
| `side`        | `'start' \| 'end'`     | `'end'` | Which edge it slides in from                                              |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | Width of the drawer                                                       |
| `header`      | `boolean`              | `true`  | Show the header; preserve the accessible name and description when hidden |
| `closable`    | `boolean`              | `true`  | Show the close button in the header                                       |
| `locked`      | `boolean`              | `false` | Whether the user is kept from closing                                     |
| `open`        | `boolean`              | —       | Whether it is open; supports v-model                                      |
| `class`       | `string`               | —       | Classes appended to the panel                                             |

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
