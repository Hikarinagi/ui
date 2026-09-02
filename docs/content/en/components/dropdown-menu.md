---
title: DropdownMenu
description: A set of actions revealed by clicking a trigger.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/dropdown-menu/DropdownMenu.vue
  - label: Popover
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/popover/Popover.vue
---

<Demo name="dropdown-menu/hero" />

## Usage {#usage}

```ts
import { DropdownMenu, DropdownMenuItem } from '@hina-ui/vue'
```

The default slot is the trigger and the `content` slot holds the items. Clicking the trigger opens the menu, and choosing an item closes it again.

<Demo name="dropdown-menu/basic" />

## Examples {#examples}

### Items {#items}

An item takes a leading icon in its `icon` slot and a trailing marker in its `trailing` slot. Set `tone="danger"` for actions that cannot be undone, such as deleting.

<Demo name="dropdown-menu/items" />

### Headings and separators {#label}

`DropdownMenuLabel` is a heading that cannot be selected, and `DropdownMenuSeparator` draws a rule between groups.

<Demo name="dropdown-menu/label" />

### Shortcuts {#shortcut}

Put the shortcut for an item in its `trailing` slot, rendered with `Kbd`. It is only a label; the key binding itself is still registered by the page.

<Demo name="dropdown-menu/shortcut" />

### Groups {#group}

`DropdownMenuGroup` collects related items into one group. Paired with `DropdownMenuLabel`, screen readers announce that heading as the name of the whole group.

<Demo name="dropdown-menu/group" />

### Checkbox items {#checkbox}

`DropdownMenuCheckboxItem` is for options that can be on at the same time, and `checked` supports two-way binding. A tick appears at the end of the item once it is on, and the menu stays open so several can be ticked in a row.

<Demo name="dropdown-menu/checkbox" />

### Radio items {#radio}

Wrap a set of mutually exclusive options in `DropdownMenuRadioGroup`, and the current one is checked automatically. They render as `menuitemradio`, so screen readers announce which one is selected.

<Demo name="dropdown-menu/radio" />

### Submenus {#submenu}

`DropdownMenuSub` opens another layer of menu beside its parent item, which carries an arrow of its own. Hovering the pointer or pressing the right arrow key opens it, and the left arrow key closes it.

<Demo name="dropdown-menu/submenu" />

### Placement {#placement}

`side` decides which way the menu opens and `align` how it lines up with the trigger. The default is centred below.

<Demo name="dropdown-menu/placement" />

### Controlled {#controlled}

`open` supports two-way binding, so the menu can be opened or closed from outside.

<Demo name="dropdown-menu/controlled" />

### Unavailable items {#disabled}

An item with `disabled` cannot be clicked and is skipped while moving through the menu with the keyboard.

<Demo name="dropdown-menu/disabled" />

## Behaviour {#behavior}

- The page is locked from scrolling while the menu is open.
- The trigger keeps its pressed ink for as long as the menu is open.
- Arrow keys move between items and wrap around, typing jumps to a matching item, Enter selects, and Escape closes the menu and returns focus to the trigger. The right arrow key opens a submenu and the left arrow key closes it.
- Choosing an ordinary item or a radio item closes the menu; ticking a checkbox item leaves it open.
- Clicking outside closes the menu, and that click does not reach the element underneath.

## Accessibility {#a11y}

- The trigger carries `aria-haspopup="menu"`, the menu is a `role="menu"` and items are `role="menuitem"`.
- Give the menu a name through `label`; screen readers announce it on entry.
- Radio items render as `menuitemradio` and checkbox items as `menuitemcheckbox`, both with `aria-checked`.
- The parent item of a submenu carries `aria-haspopup="menu"` and `aria-expanded`.

## API {#api}

### DropdownMenu {#props}

| Prop         | Type                                     | Default    | Description                          |
| ------------ | ---------------------------------------- | ---------- | ------------------------------------ |
| `open`       | `boolean`                                | —          | Whether it is open; supports v-model |
| `label`      | `string`                                 | —          | Accessible name of the menu          |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Which way it opens                   |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | How it lines up with the trigger     |
| `sideOffset` | `number`                                 | `8`        | Distance from the trigger            |
| `class`      | `string`                                 | —          | Classes appended to the panel        |

| Slot      | Description |
| --------- | ----------- |
| `default` | The trigger |
| `content` | The items   |

### DropdownMenuItem {#item}

| Prop        | Type                    | Default     | Description                       |
| ----------- | ----------------------- | ----------- | --------------------------------- |
| `tone`      | `'neutral' \| 'danger'` | `'neutral'` | Semantic tone                     |
| `disabled`  | `boolean`               | `false`     | Whether the item is unavailable   |
| `textValue` | `string`                | —           | Text used for type-ahead matching |
| `class`     | `string`                | —           | Classes appended to the item      |

| Event    | Payload        | Description                     |
| -------- | -------------- | ------------------------------- |
| `select` | `event: Event` | Emitted when the item is chosen |

| Slot       | Description      |
| ---------- | ---------------- |
| `default`  | The item text    |
| `icon`     | Leading icon     |
| `trailing` | Trailing content |

### DropdownMenuCheckboxItem {#checkbox-item}

| Prop        | Type      | Default | Description                        |
| ----------- | --------- | ------- | ---------------------------------- |
| `checked`   | `boolean` | `false` | Whether it is on; supports v-model |
| `disabled`  | `boolean` | `false` | Whether the item is unavailable    |
| `textValue` | `string`  | —       | Text used for type-ahead matching  |
| `class`     | `string`  | —       | Classes appended to the item       |

| Slot       | Description      |
| ---------- | ---------------- |
| `default`  | The item text    |
| `trailing` | Trailing content |

### DropdownMenuGroup {#group-api}

Takes only `class`; its default slot holds the items of one group.

### DropdownMenuSub {#sub}

| Prop        | Type      | Default | Description                                   |
| ----------- | --------- | ------- | --------------------------------------------- |
| `open`      | `boolean` | —       | Whether the submenu is open; supports v-model |
| `label`     | `string`  | —       | Text of the parent item                       |
| `disabled`  | `boolean` | `false` | Whether the parent item is unavailable        |
| `textValue` | `string`  | —       | Text used for type-ahead matching             |
| `class`     | `string`  | —       | Classes appended to the submenu panel         |

| Slot      | Description                                |
| --------- | ------------------------------------------ |
| `default` | The items of the submenu                   |
| `label`   | Text of the parent item, overrides `label` |
| `icon`    | Leading icon of the parent item            |

### DropdownMenuRadioGroup {#radio-group}

| Prop         | Type     | Default | Description                          |
| ------------ | -------- | ------- | ------------------------------------ |
| `modelValue` | `string` | —       | The selected value; supports v-model |

### DropdownMenuRadioItem {#radio-item}

| Prop        | Type      | Default | Description                       |
| ----------- | --------- | ------- | --------------------------------- |
| `value`     | `string`  | —       | Required. The value of this item  |
| `disabled`  | `boolean` | `false` | Whether the item is unavailable   |
| `textValue` | `string`  | —       | Text used for type-ahead matching |
| `class`     | `string`  | —       | Classes appended to the item      |

### DropdownMenuLabel and DropdownMenuSeparator {#label-separator}

Both take only `class`. The default slot of `DropdownMenuLabel` is the heading text; `DropdownMenuSeparator` has no content.
