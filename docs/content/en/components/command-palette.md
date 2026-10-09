---
title: CommandPalette
description: A keyboard-summoned search panel for picking commands and pages.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/command-palette/CommandPalette.vue
  - label: Listbox
    href: https://reka-ui.com/docs/components/listbox
---

<Demo name="command-palette/hero" />

## Usage {#usage}

```ts
import { CommandPalette } from '@hina-ui/vue'
```

::: vue

`items` is the list of entries. Each item has at least an `id` and a `label`, and may carry `description`, `keywords`, `icon`, `kbd` and `onSelect`; an object with `label` and `items` is a group. The default slot is the trigger. Selecting an item calls its `onSelect`, then emits `select`, then closes the panel.

:::

::: react

`items` is the list of entries. Each item has at least an `id` and a `label`, and may carry `description`, `keywords`, `icon`, `kbd` and `onSelect`; an object with `label` and `items` is a group. `children` is the trigger. Selecting an item calls the item's `onSelect`, then the component's `onSelect`, then closes the panel.

:::

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

### Inline {#inline}

With `inline` the panel is no longer wrapped in an overlay and renders in the document flow, which suits embedding it in a page rather than summoning it with a shortcut. The inline form registers no global hotkey, and selecting an item leaves the panel in place.

<Demo name="command-palette/inline" />

### Custom item content {#custom-item}

::: vue

The `#item` slot replaces the content inside every item row; the default icon, label, description and key hint are not rendered. The row itself stays a listbox option: highlighting, keyboard navigation, `disabled` and selection are unchanged, also with `virtualize`.

The slot receives `{ item, match }`. `match` is the range `{ start, end }` of `item.label` matched by the search text; it is `null` when the search is empty, when the item matched through `keywords` or `description` only, or with `ignoreFilter`.

An item's `data` carries application data. Its type is inferred from `items`, and `item.data` keeps that type in the `#item` slot and in the `select` event; declare the list as `CommandItems<Book>`. The example puts the author in `keywords`: searching by author gives a `null` `match` and the title is not marked.

:::

::: react

`renderItem` replaces the content inside every item row; the default icon, label, description and key hint are not rendered. The row itself stays a listbox option: highlighting, keyboard navigation, `disabled` and selection are unchanged, also with `virtualize`.

The render function receives `{ item, match }`. `match` is the range `{ start, end }` of `item.label` matched by the search text; it is `null` when the search is empty, when the item matched through `keywords` or `description` only, or with `ignoreFilter`.

An item's `data` carries application data. Its type is inferred from `items`, and `item.data` keeps that type in `renderItem` and in `onSelect`; declare the list as `CommandItems<Book>`. The example puts the author in `keywords`: searching by author gives a `null` `match` and the title is not marked.

:::

<Demo name="command-palette/custom-item" />

### Custom input row {#custom-input}

::: vue

The `#input` slot replaces the whole input row, the search icon and the input included; the default row's height, padding and divider are removed with it. Put exactly one `CommandPaletteInput` inside it; that component keeps filtering, keyboard navigation, auto focus and `aria-label`, and uses the panel's `placeholder`.

:::

::: react

`input` replaces the whole input row, the search icon and the input included; the default row's height, padding and divider are removed with it. Put exactly one `CommandPaletteInput` inside it; that component keeps filtering, keyboard navigation, auto focus and `aria-label`, and uses the panel's `placeholder`.

:::

<Demo name="command-palette/custom-input" />

### Virtual scrolling {#virtual}

`virtualize` renders rows near the viewport, sharing measurement and scrolling with [VirtualList](/components/virtual-list). It is off by default. Pass `{ estimateSize, overscan }` to configure estimated row height and the buffer on each side; actual heights are measured. Keyboard navigation covers the full collection and skips disabled items. Search still processes the full dataset. Commands unmount outside the rendered range; keep persistent state externally by command id.

<Demo name="command-palette/virtual" />

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

`T` is the type of an item's `data`. It is inferred from `items` and defaults to `unknown`.

| Prop           | Type                | Default     | Description                                           |
| -------------- | ------------------- | ----------- | ----------------------------------------------------- |
| `items`        | `CommandItems<T>`   | —           | Required. Items and groups                            |
| `virtualize`   | `VirtualizeOptions` | `false`     | Virtual scrolling; content-based estimate, overscan 6 |
| `placeholder`  | `string`            | from locale | Placeholder of the input                              |
| `label`        | `string`            | from locale | Accessible name of the panel                          |
| `hotkey`       | `string`            | —           | Global hotkey, e.g. `mod+k`                           |
| `ignoreFilter` | `boolean`           | `false`     | Skip built-in filtering; the caller owns the list     |
| `inline`       | `boolean`           | `false`     | Render as an inline panel instead of an overlay       |
| `class`        | `string`            | —           | Extra classes on the panel                            |

### Models {#models}

| Name     | Type      | Description               |
| -------- | --------- | ------------------------- |
| `open`   | `boolean` | Whether the panel is open |
| `search` | `string`  | Search text in the input  |

### Events {#events}

| Event    | Payload                  | Description                    |
| -------- | ------------------------ | ------------------------------ |
| `select` | `(item: CommandItem<T>)` | Emitted when an item is chosen |

### Slots {#slots}

| Slot    | Payload                                                     | Description                                                                        |
| ------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| default | —                                                           | The trigger                                                                        |
| `item`  | `{ item: CommandItem<T>, match: CommandItemMatch \| null }` | Content inside an item row; replaces the default icon, label, description and hint |
| `input` | —                                                           | The input row; replaces the search icon and the input                              |

### CommandPaletteInput {#command-palette-input}

The input used when the input row is replaced. It only works inside a CommandPalette and throws when used outside one.

| Prop          | Type     | Default                   | Description                                    |
| ------------- | -------- | ------------------------- | ---------------------------------------------- |
| `placeholder` | `string` | the panel's `placeholder` | Placeholder; takes precedence over the panel's |
| `class`       | `string` | —                         | Extra classes on the input                     |

Other attributes pass through to the native `input`.

### Types {#types}

| Field         | Type         | Description                           |
| ------------- | ------------ | ------------------------------------- |
| `id`          | `string`     | Required. Unique key of the item      |
| `label`       | `string`     | Required. Label                       |
| `description` | `string`     | Text under the label, also matched    |
| `keywords`    | `string[]`   | Matched but never shown               |
| `icon`        | `Component`  | Icon before the label                 |
| `kbd`         | `string[]`   | Key hint at the end of the row        |
| `disabled`    | `boolean`    | Cannot be selected                    |
| `data`        | `T`          | Data carried by the item, not matched |
| `onSelect`    | `() => void` | Called when selected                  |

A group is `{ label: string; items: CommandItem<T>[] }`, and `CommandItems<T>` is an array of items and groups.

::: vue

The `CommandItem<T>`, `CommandGroup<T>`, `CommandItems<T>`, `CommandItemMatch` and `CommandItemSlotProps<T>` types are exported from the package entry.

:::

::: react

The `CommandItem<T>`, `CommandGroup<T>`, `CommandItems<T>`, `CommandItemMatch` and `CommandItemRenderProps<T>` types are exported from the package entry.

:::

```ts
interface CommandItemMatch {
  start: number
  end: number
}
```

```ts
type VirtualizeOptions = boolean | { estimateSize?: number; overscan?: number }
```
