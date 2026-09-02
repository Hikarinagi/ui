---
title: Drawer
description: A modal panel that slides in from the edge of the screen.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/drawer/Drawer.vue
  - label: Dialog
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/dialog/Dialog.vue
---

<Demo name="drawer/hero" />

## Usage {#usage}

```ts
import { Drawer } from '@hina-ui/vue'
```

`title` is required and `description` is the line under it. The default slot is the trigger, the `content` slot is the body, and the `footer` slot holds the actions. Both slots receive a `close` method.

<Demo name="drawer/basic" />

The drawer opens flush against the edge of the screen, fills the full height and keeps square corners. The scrim, the scroll lock and the focus trap are the same as in Dialog.

## Examples {#examples}

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

### Controlled {#controlled}

`open` supports two-way binding. Leaving out the default slot renders no trigger, so the drawer can only be opened from outside.

<Demo name="drawer/controlled" />

### Locked {#locked}

With `locked`, neither Escape nor a click on the scrim closes the drawer, and the close button is disabled but still shown. Closing through `open` still works.

<Demo name="drawer/locked" />

## Behaviour {#behavior}

- The page is locked from scrolling while the drawer is open, focus is trapped inside the panel, and it returns to the trigger on close.
- Escape or a click on the scrim closes the drawer; `locked` disables both.
- The body is a ScrollArea, so its scrollbar matches every other scrolling region in the project.

## Accessibility {#a11y}

- The panel is a `role="dialog"`, with `title` and `description` wired to `aria-labelledby` and `aria-describedby`.
- The title renders as an `<h2>`, below the page heading level.
- The close button carries an accessible name taken from the current language.

## API {#api}

### Drawer {#props}

| Prop          | Type                   | Default | Description                           |
| ------------- | ---------------------- | ------- | ------------------------------------- |
| `title`       | `string`               | —       | Required. The drawer title            |
| `description` | `string`               | —       | The line under the title              |
| `side`        | `'start' \| 'end'`     | `'end'` | Which edge it slides in from          |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | Width of the drawer                   |
| `locked`      | `boolean`              | `false` | Whether the user is kept from closing |
| `open`        | `boolean`              | —       | Whether it is open; supports v-model  |
| `class`       | `string`               | —       | Classes appended to the panel         |

| Slot      | Payload     | Description                             |
| --------- | ----------- | --------------------------------------- |
| `default` | —           | The trigger; omit it to render none     |
| `content` | `{ close }` | The body, scrolling when it is too tall |
| `footer`  | `{ close }` | The actions along the bottom            |
