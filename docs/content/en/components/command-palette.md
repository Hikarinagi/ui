---
title: CommandPalette
description: A keyboard-summoned search panel for picking commands and pages.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/command-palette/CommandPalette.vue
  - label: Listbox
    href: https://reka-ui.com/docs/components/listbox
---

<Demo name="command-palette/hero" />

## Usage {#usage}

```ts
import { CommandPalette } from '@hina-ui/vue'
```

`items` is the list of entries. Each item has at least an `id` and a `label`, and may carry `description`, `keywords`, `icon`, `kbd` and `onSelect`; an object with `label` and `items` is a group. The default slot is the trigger. Selecting an item calls its `onSelect`, then emits `select`, then closes the panel.

<Demo name="command-palette/basic" />

## Examples {#examples}

### Groups and descriptions {#groups}

Groups have their own headings, and an item's `description` sits under its label. Without a query groups keep their given order; with one, the group holding the best match comes first, and a group with no matching items is not shown.

<Demo name="command-palette/groups" />

### Icons and key hints {#hints}

`icon` shows before the label; `kbd` is a key hint shown at the end of the row. It is only a hint, the panel does not bind those keys for you.

<Demo name="command-palette/hints" />

### Global hotkey {#hotkey}

`hotkey` takes a combination such as `mod+k`, where `mod` is ⌘ on Mac and Ctrl elsewhere; `shift` and `alt` can be added. Pressing it again while the panel is open closes it.

<Demo name="command-palette/hotkey" />

### Controlled {#controlled}

`open` supports two-way binding. Without a default slot no trigger is rendered and the panel can only be opened from outside.

<Demo name="command-palette/controlled" />

### Custom filtering {#filter}

`search` supports two-way binding. With `ignoreFilter` the panel stops filtering on its own and the item list is entirely up to the caller, for example a server-side search.

<Demo name="command-palette/filter" />

## Behavior {#behavior}

- On open the input takes focus and the first item is highlighted; typing filters the list at once, and the matching part of a label is marked in the accent colour.
- Matches are ordered by exact label, label prefix, label substring, keywords, then description; with a query, the group holding the best match comes first. Items beyond the visible height scroll inside the list.
- Arrow keys move the highlight, Enter selects the highlighted item, and hovering moves the highlight too.
- Esc, clicking the scrim, or selecting an item closes the panel; the search text is cleared on close.
- While open the page stops scrolling and focus stays inside the panel; it returns to the trigger on close.
- On wide screens the panel sits in the upper part of the viewport; on narrow screens it sticks to the top at full width.

## Accessibility {#a11y}

- The panel is a dialog whose accessible name is `label`, by default the locale's "Command palette".
- The input points at the highlighted item through `aria-activedescendant`; the list uses the `listbox` and `option` roles, and each group carries its own name.
- Icons are hidden from assistive technology; key hints are rendered as `kbd` elements.

## API {#api}

### Props {#props}

| Prop           | Type           | Default     | Description                                       |
| -------------- | -------------- | ----------- | ------------------------------------------------- |
| `items`        | `CommandItems` | —           | Required. Items and groups                        |
| `placeholder`  | `string`       | from locale | Placeholder of the input                          |
| `label`        | `string`       | from locale | Accessible name of the panel                      |
| `hotkey`       | `string`       | —           | Global hotkey, e.g. `mod+k`                       |
| `ignoreFilter` | `boolean`      | `false`     | Skip built-in filtering; the caller owns the list |
| `class`        | `string`       | —           | Extra classes on the panel                        |

### Models {#models}

| Name     | Type      | Description               |
| -------- | --------- | ------------------------- |
| `open`   | `boolean` | Whether the panel is open |
| `search` | `string`  | Search text in the input  |

### Events {#events}

| Event    | Payload               | Description                    |
| -------- | --------------------- | ------------------------------ |
| `select` | `(item: CommandItem)` | Emitted when an item is chosen |

### Slots {#slots}

| Slot    | Description |
| ------- | ----------- |
| default | The trigger |

### Types {#types}

| Field         | Type         | Description                        |
| ------------- | ------------ | ---------------------------------- |
| `id`          | `string`     | Required. Unique key of the item   |
| `label`       | `string`     | Required. Label                    |
| `description` | `string`     | Text under the label, also matched |
| `keywords`    | `string[]`   | Matched but never shown            |
| `icon`        | `Component`  | Icon before the label              |
| `kbd`         | `string[]`   | Key hint at the end of the row     |
| `disabled`    | `boolean`    | Cannot be selected                 |
| `onSelect`    | `() => void` | Called when selected               |

A group is `{ label: string; items: CommandItem[] }`, and `CommandItems` is an array of items and groups.
