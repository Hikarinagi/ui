---
title: Menubar
description: A row of menus, like the menu bar of a desktop app.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/menubar/Menubar.vue
  - label: Menubar
    href: https://reka-ui.com/docs/components/menubar
---

<Demo name="menubar/hero" />

## Usage {#usage}

```ts
import { Menubar, MenubarMenu, MenubarItem } from '@hina-ui/vue'
```

`Menubar` is a horizontal bar holding several `MenubarMenu`s; each menu's `label` is its trigger text on the bar and its default slot holds the items. Clicking a trigger opens the menu, and while one is open moving the pointer onto another trigger switches to it. Items, checkbox items, radio items, groups, labels, separators and submenus are the same set as in [DropdownMenu](/components/dropdown-menu), only named with the `Menubar` prefix.

<Demo name="menubar/basic" />

## Examples {#examples}

### Items {#items}

The `icon` slot of an item holds a leading icon and `trailing` holds trailing content such as a shortcut; give irreversible actions such as delete `tone="danger"`. `MenubarLabel` is a title that cannot be selected, and `MenubarSeparator` draws a line.

<Demo name="menubar/items" />

### Checkbox and radio items {#choices}

`MenubarCheckboxItem` is a toggle where several can be on at once and the menu stays open after toggling; wrap a set of mutually exclusive options in `MenubarRadioGroup`.

<Demo name="menubar/choices" />

### Submenus {#submenu}

The `label` of `MenubarSub` is the entry to the submenu and its default slot holds the items.

<Demo name="menubar/submenu" />

### Controlled {#controlled}

`v-model` binds the `value` of the open menu, an empty string when none is open; a menu can be opened from outside.

<Demo name="menubar/controlled" />

### Disabled menus {#disabled}

`disabled` on a `MenubarMenu` disables its trigger; `disabled` on an item only makes that item unselectable.

<Demo name="menubar/disabled" />

## Behavior {#behavior}

- Clicking a trigger opens its menu and clicking again closes it; while a menu is open, moving the pointer onto another trigger switches to that menu.
- Left and right arrows move between triggers and switch menus while one is open; up and down move between items, Enter or Space picks one, and Esc closes the menu and returns focus to the trigger.
- The page keeps scrolling and stays interactive while a menu is open, which is what lets the pointer move between triggers; picking an item or clicking outside closes it.

## Accessibility {#a11y}

- The root is `role="menubar"`, named through `label`; triggers are `menuitem`s with `aria-haspopup`, and the open panel is `role="menu"`.
- The triggers form a roving tab stop: Tab enters and leaves once, and the arrow keys move within.

## API {#api}

### Menubar {#props}

| Prop         | Type      | Default | Description                                        |
| ------------ | --------- | ------- | -------------------------------------------------- |
| `label`      | `string`  | —       | Accessible name of the bar                         |
| `loop`       | `boolean` | `true`  | Whether the arrow keys wrap around at the ends     |
| `modelValue` | `string`  | —       | `value` of the open menu, supports two-way binding |
| `class`      | `string`  | —       | Classes appended to the root element               |

### MenubarMenu {#menu}

| Prop       | Type      | Default   | Description                        |
| ---------- | --------- | --------- | ---------------------------------- |
| `label`    | `string`  | —         | Trigger text                       |
| `value`    | `string`  | generated | Identifies the menu for `v-model`  |
| `disabled` | `boolean` | `false`   | Whether the trigger is disabled    |
| `class`    | `string`  | —         | Classes appended to the menu panel |

| Slot    | Description     |
| ------- | --------------- |
| default | The menu items  |
| `label` | Trigger content |

### Items and other parts {#parts}

`MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarGroup`, `MenubarLabel`, `MenubarSeparator` and `MenubarSub` take exactly the props, slots and events of their DropdownMenu counterparts; see [DropdownMenu](/components/dropdown-menu#item).
