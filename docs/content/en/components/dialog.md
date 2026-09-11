---
title: Dialog
description: A modal dialog that interrupts the current task.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/dialog/Dialog.vue
  - label: Dialog
    href: https://reka-ui.com/docs/components/dialog
---

<Demo name="dialog/hero" />

## Usage {#usage}

```ts
import { Dialog } from '@hina-ui/vue'
```

`title` is required and `description` is the line under it. The default slot is the trigger, the `content` slot is the body, and the `footer` slot holds the actions. The `content`, `footer` and `body` slots receive a `close` method; `body` replaces the entire interior layout.

<Demo name="dialog/basic" />

The close button, the scrim, the scroll lock and the focus trap all come with the component.

## Examples {#examples}

### Title content {#title}

The `icon` slot displays a decorative icon before the title. The `title` slot replaces the title content and defaults to the `title` prop. Custom titles retain the `<h2>` semantics and provide the dialog's accessible name.

<Demo name="dialog/title" />

### Hidden header {#header}

`header` defaults to `true`. Set it to `false` to hide the entire header and its close button while retaining the content and footer layout. The required `title` and any provided description remain visually hidden for assistive technology. The `icon` and `title` slots are not rendered in this mode.

<Demo name="dialog/header" />

### Close button {#closable}

`closable` defaults to `true`. Set it to `false` to hide only the close button. Escape and clicks on the scrim still close the dialog; `locked` controls these two behaviours. The header's close button is always omitted when `header` is `false`.

<Demo name="dialog/closable" />

### Custom panel content {#body}

`#body="{ close }"` replaces the entire panel interior, including the default header, content and footer. The component adds no inner padding, section gaps or [ScrollArea](/components/scroll-area) wrapper; the slot controls its own padding and scrolling. An empty slot does not restore the default layout.

In this mode, `header`, `closable`, and the `icon`, `title`, `content` and `footer` slots do not affect rendering. The required `title` and any provided description remain visually hidden. Size, placement, the scrim, focus containment and `locked` still apply. The slot's `close()` method can close the dialog programmatically.

<Demo name="dialog/body" />

### Sizes {#sizes}

`size` sets the panel's maximum width and defaults to `md`. The five widths are listed below; the actual width is constrained by the viewport.

| size  | Maximum width |
| ----- | ------------- |
| `sm`  | 24rem         |
| `md`  | 28rem         |
| `lg`  | 36rem         |
| `xl`  | 42rem         |
| `2xl` | 56rem         |

<Demo name="dialog/sizes" />

### Custom width {#width}

`class` styles the panel. Use `max-w-[40rem]` or `max-w-[52rem]` to override the preset maximum width. With the default placement, narrow screens still use the available width with space on both sides.

<Demo name="dialog/width" />

### Placement {#placement}

Without `placement`, the dialog is centred on a wide screen and sits along the bottom at the available width on a narrow one. `center` always centres it, `top` aligns it to the top, and `bottom` aligns it to the bottom. `top` slides in from above and sits 1rem from the top with at least 1rem of space at the sides. Its width remains controlled by `size` and constrained by the viewport.

<Demo name="dialog/placement" />

### Long content {#scroll}

In the default layout, content past the available height scrolls inside the `content` slot while the title and footer stay put. The panel itself never runs past the viewport.

<Demo name="dialog/scroll" />

### Controlled {#controlled}

`open` supports two-way binding. Leaving out the default slot renders no trigger, so the dialog can only be opened from outside.

<Demo name="dialog/controlled" />

### Locked {#locked}

With `locked`, neither Escape nor a click on the scrim closes the dialog, and a rendered close button becomes disabled. Closing through `open` still works.

<Demo name="dialog/locked" />

## Behaviour {#behavior}

- The page is locked from scrolling while the dialog is open, focus is trapped inside the panel, and it returns to the trigger on close.
- Escape or a click on the scrim closes the dialog; `locked` disables both.
- The default body uses [ScrollArea](/components/scroll-area).

## Accessibility {#a11y}

- The panel is a `role="dialog"`, with `title` and `description` wired to `aria-labelledby` and `aria-describedby`.
- The title renders as an `<h2>`. Hiding the header or providing `body` retains a visually hidden title generated from the `title` prop.
- The close button carries an accessible name taken from the current language.

## API {#api}

### Dialog {#props}

| Prop          | Type                                    | Default | Description                             |
| ------------- | --------------------------------------- | ------- | --------------------------------------- |
| `title`       | `string`                                | —       | Required. The dialog title              |
| `description` | `string`                                | —       | The line under the title                |
| `size`        | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'`  | Maximum width of the panel              |
| `placement`   | `'center' \| 'top' \| 'bottom'`         | —       | Follows the screen width when omitted   |
| `header`      | `boolean`                               | `true`  | Show the header and its close button    |
| `closable`    | `boolean`                               | `true`  | Show the close button within the header |
| `locked`      | `boolean`                               | `false` | Whether the user is kept from closing   |
| `open`        | `boolean`                               | —       | Whether it is open; supports v-model    |
| `class`       | `string`                                | —       | Classes appended to the panel           |

| Slot      | Payload     | Description                                                      |
| --------- | ----------- | ---------------------------------------------------------------- |
| `default` | —           | The trigger; omit it to render none                              |
| `icon`    | —           | Decorative icon before the title                                 |
| `title`   | —           | Title content; defaults to the title prop                        |
| `body`    | `{ close }` | Entire interior; replaces the default header, content and footer |
| `content` | `{ close }` | The body, scrolling when it is too tall                          |
| `footer`  | `{ close }` | The actions along the bottom                                     |
