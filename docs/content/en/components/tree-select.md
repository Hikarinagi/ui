---
title: TreeSelect
description: Picks one item from a tree.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/tree-select/TreeSelect.vue
  - label: Tree
    href: https://reka-ui.com/docs/components/tree
---

<Demo name="tree-select/hero" />

## Usage {#usage}

```ts
import { TreeSelect } from '@hina-ui/vue'
```

The tree select shares its trigger with [Select](/components/select) and opens a tree that expands level by level. `items` supplies the nodes, each `{ value, label }`, and a node with `children` can be expanded; `v-model` binds the chosen node's value, and a node at any level can be chosen.

<Demo name="tree-select/basic" />

## Examples {#examples}

### Virtual scrolling {#virtual}

`virtualize` renders rows near the viewport, sharing measurement and scrolling with [VirtualList](/components/virtual-list). It is off by default. Pass `{ estimateSize, overscan }` to configure estimated row height and the buffer on each side; actual heights are measured. Keyboard navigation covers the full collection and skips disabled items. Search still processes the full dataset. Only expanded, visible nodes participate in the window; parent-child navigation and selection do not depend on mounted rows. Rows unmount outside the rendered range; keep persistent slot state outside the row, keyed by its unique value.

<Demo name="tree-select/virtual" />

### Expanded by default {#expanded}

`defaultExpanded` lists the nodes expanded when the tree opens. The path to the chosen node is always expanded as well.

<Demo name="tree-select/expanded" />

### Search {#search}

`searchable` adds a search field above the tree. Filtering matches node `label` values without case or accent differences. Matching nodes keep their ancestor paths, which expand automatically; unrelated nodes are hidden. Clearing search restores the previous expansion state and leaves the selection unchanged.

Bind the query with `v-model:search` and set the search field text with `searchPlaceholder`. Closing the panel clears the query. From the search field, Down or Up focuses the first or last enabled node. Up on the first node returns to search. Esc clears a non-empty query first, then closes the panel on the next press.

<Demo name="tree-select/search" />

### Custom content {#custom}

The `node` slot customises each node.

<Demo name="tree-select/custom" />

### Sizes {#sizes}

Three sizes, matching the input.

<Demo name="tree-select/sizes" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="tree-select/variants" />

### States {#states}

`invalid` marks a failed validation, `disabled` disables the whole select, and `disabled` on a node disables that node only.

<Demo name="tree-select/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label points at the trigger, and the error message is rendered by the field and linked to it; validation rules and submission belong to the [Form](/components/form).

<Demo name="tree-select/form" />

## Behaviour {#behavior}

- Clicking the arrow before a node only expands or collapses it; clicking the node itself chooses it and closes the panel.
- Up and Down move focus, Right expands, Left collapses, and Enter or Space chooses.
- The panel opens against the trigger at the same width, and scrolls inside when the tree is taller than the space available.
- Page scrolling is locked while open; clicking outside or pressing Esc closes it.

## Accessibility {#a11y}

- The trigger is `role="combobox"`, the tree is `role="tree"` and each node is `role="treeitem"` with `aria-level`, `aria-expanded` and `aria-selected`.
- Pair it with a `label` element or an `aria-label` for its name. `invalid` also sets `aria-invalid`.

## API {#api}

### Props {#props}

| Prop                | Type                       | Default     | Description                                           |
| ------------------- | -------------------------- | ----------- | ----------------------------------------------------- |
| `modelValue`        | `string \| number \| null` | —           | Value of the chosen node                              |
| `items`             | `TreeSelectNode[]`         | —           | The nodes, see the type below                         |
| `virtualize`        | `VirtualizeOptions`        | `false`     | Virtual scrolling; content-based estimate, overscan 6 |
| `placeholder`       | `string`                   | locale pack | Text shown when nothing is chosen                     |
| `searchable`        | `boolean`                  | `false`     | Show search and filter nodes                          |
| `search`            | `string`                   | `''`        | Query; supports `v-model:search`                      |
| `searchPlaceholder` | `string`                   | locale pack | Search placeholder and accessible name                |
| `defaultExpanded`   | `Array<string \| number>`  | `[]`        | Nodes expanded when the panel opens                   |
| `open`              | `boolean`                  | `false`     | Whether the panel is open; `v-model:open`             |
| `variant`           | `'primary' \| 'secondary'` | `'primary'` | Variant                                               |
| `size`              | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                                  |
| `invalid`           | `boolean`                  | `false`     | Whether validation failed                             |
| `disabled`          | `boolean`                  | `false`     | Whether the select is disabled                        |
| `class`             | `string`                   | —           | Classes appended to the trigger                       |

### Slots {#slots}

| Slot   | Payload                    | Description          |
| ------ | -------------------------- | -------------------- |
| `node` | `{ node: TreeSelectNode }` | Content of each node |

### Events {#events}

| Event               | Payload                   | Description                |
| ------------------- | ------------------------- | -------------------------- |
| `update:modelValue` | `value: string \| number` | The chosen value changed   |
| `update:open`       | `open: boolean`           | The panel opened or closed |
| `update:search`     | `search: string`          | The search query changed   |

### Types {#types}

```ts
interface TreeSelectNode {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
  children?: TreeSelectNode[]
}
```

```ts
type VirtualizeOptions = boolean | { estimateSize?: number; overscan?: number }
```
