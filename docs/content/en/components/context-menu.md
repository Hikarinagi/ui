---
title: ContextMenu
description: A menu that opens at the pointer on right-click or long press.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/context-menu/ContextMenu.vue
  - label: ContextMenu
    href: https://reka-ui.com/docs/components/context-menu
---

<Demo name="context-menu/hero" />

## Usage {#usage}

```ts
import { ContextMenu, ContextMenuItem } from '@hina-ui/vue'
```

The default slot is the area that answers a right-click, and the `content` slot holds the items. Right-click inside the area, or long-press on a touch screen, and the menu opens at the pointer; picking an item closes it. Items, checkbox items, radio items, groups, labels, separators and submenus are the same set as in [DropdownMenu](/components/dropdown-menu), only named with the `ContextMenu` prefix.

<Demo name="context-menu/basic" />

## Examples {#examples}

### Items {#items}

The `icon` slot of an item holds a leading icon and `trailing` the trailing content; give irreversible actions such as delete `tone="danger"`. `ContextMenuLabel` is a title that cannot be selected, and `ContextMenuSeparator` draws a line.

<Demo name="context-menu/items" />

### Checkbox items {#checkbox}

`ContextMenuCheckboxItem` is a toggle where several can be on at once; `checked` supports two-way binding, and the menu stays open after toggling.

<Demo name="context-menu/checkbox" />

### Radio items {#radio}

Wrap a set of mutually exclusive options in `ContextMenuRadioGroup`; the current one carries the check mark.

<Demo name="context-menu/radio" />

### Submenus {#submenu}

The `label` of `ContextMenuSub` is the entry to the submenu and its default slot holds the items; hovering or pressing the right arrow opens it.

<Demo name="context-menu/submenu" />

### Disabled {#disabled}

`disabled` stops the whole area from answering a right-click, so the browser's own menu shows as usual; `disabled` on an item only makes that item unselectable.

<Demo name="context-menu/disabled" />

## Behavior {#behavior}

- The menu opens at the pointer and flips inward near the viewport edge.
- The page stops scrolling while the menu is open; a click outside, Esc or picking an item closes it.
- Arrow keys move between items, Enter or Space picks one, and typing a letter jumps to a matching item.
- A long press opens the menu on touch screens.

## Accessibility {#a11y}

- The menu is `role="menu"`, named through `label`; items are `menuitem`, `menuitemcheckbox` and `menuitemradio`.
- Actions in a context menu should also be reachable elsewhere on the page, since keyboard and assistive-technology users may not be able to trigger it.

## API {#api}

### ContextMenu {#props}

| Prop       | Type      | Default | Description                                    |
| ---------- | --------- | ------- | ---------------------------------------------- |
| `label`    | `string`  | —       | Accessible name of the menu                    |
| `disabled` | `boolean` | `false` | Whether the area stops answering a right-click |
| `open`     | `boolean` | —       | Whether it is open, supports two-way binding   |
| `class`    | `string`  | —       | Classes appended to the menu panel             |

| Slot      | Description                       |
| --------- | --------------------------------- |
| default   | The area that answers right-click |
| `content` | The items of the menu             |

### Items and other parts {#parts}

`ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuGroup`, `ContextMenuLabel`, `ContextMenuSeparator` and `ContextMenuSub` take exactly the props, slots and events of their DropdownMenu counterparts; see [DropdownMenu](/components/dropdown-menu#item).
