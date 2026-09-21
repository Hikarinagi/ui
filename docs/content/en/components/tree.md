---
title: Tree
description: A standalone tree with expandable nodes, cascading checks, and indeterminate parents.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/tree/Tree.vue
  - label: Reka Tree
    href: https://reka-ui.com/docs/components/tree
---

<Demo name="tree/hero" />

## Usage {#usage}

```ts
import { Tree, type TreeNode, type TreeValue } from '@hina-ui/vue'
```

`Tree` renders a tree directly. Use [TreeSelect](/components/tree-select) for a single-selection popup with a trigger. Supply nodes through `items` and nested levels through `children`. Clicking the disclosure arrow only expands or collapses the node; clicking its text or pressing Space or Enter changes selection.

Single selection is the default. `v-model` holds the node's `value`; selecting it again clears the value to `null`.

<Demo name="tree/basic" />

## Examples {#examples}

### Multiple checks and indeterminate parents {#multiple}

Set `multiple` to display checkboxes and bind `v-model` to a `TreeValue[]`. Checking a parent selects all available descendants; unchecking it clears them. Clicking an indeterminate parent completes the selection. Parents show a minus when some descendants are checked and a check when all available children are checked.

States are derived from the entire tree. Collapsing nodes does not clear selection or change indeterminate states. Updates contain every fully checked node, including automatically checked parents; indeterminate parents are excluded. Known nodes follow tree preorder, and bound values absent from the current `items` are preserved.

External values can contain only leaves; parent states are derived automatically. Passing a parent value checks its available descendants. Initialization, expansion, and data refresh do not emit selection changes by themselves. Checkboxes share the visuals and motion of [Checkbox](/components/checkbox).

<Demo name="tree/multiple" />

### Controlled expansion {#expanded}

`defaultExpanded` supplies initial expanded nodes; `v-model:expanded` controls expansion externally. Both use each node's original `value`. An explicit `expanded` value takes precedence, including an empty array. Nodes without children or with `children: []` have no disclosure arrow.

<Demo name="tree/expanded" />

### Custom nodes {#custom}

The `node` slot replaces the text area; `trailing` sits at the end of the row. Both receive the original node and its `selected`, `indeterminate`, `expanded`, and `disabled` states. `selected` means fully selected; an indeterminate node has `selected: false` and `indeterminate: true`. The disclosure arrow and checkbox remain provided by the component.

The example uses [Tag](/components/tag) to show full and partial selection.

<Demo name="tree/custom" />

### Disabled {#disabled}

A node's `disabled` flag disables the node and its subtree, blocking clicks, keyboard selection, and expansion. Cascading checks skip disabled subtrees, which also do not contribute to their parents' checked or indeterminate states. Existing bound values are preserved. An available parent with only disabled children can still be checked independently.

The component's `disabled` prop disables the whole tree while keeping existing selection visible. [FormField](/components/form-field) automatically supplies disabled and validation states, labels, and description associations.

<Demo name="tree/states" />

### Scrolling {#scroll}

The component has no height limit, panel background, or border. Wrap it in [ScrollArea](/components/scroll-area) to limit its visible height.

<Demo name="tree/scroll" />

### Empty content {#empty}

An empty tree displays localized text, replaceable through the `empty` slot. Empty content uses `role="status"` instead of rendering a `role="tree"` without nodes.

<Demo name="tree/empty" />

### Virtual scrolling {#virtual}

`virtualize` renders rows near the viewport, sharing measurement and scrolling with [VirtualList](/components/virtual-list). It is off by default. Pass `{ estimateSize, overscan }` to configure estimated row height and the buffer on each side; actual heights are measured. Keyboard navigation covers the full collection and skips disabled items. Only expanded, visible nodes participate in the window; parent-child navigation and selection do not depend on mounted rows. `maxHeight` defaults to `320px` and applies only with virtualization enabled. It accepts a number or CSS length. Rows unmount outside the rendered range; keep persistent slot state outside the row, keyed by its unique value.

<Demo name="tree/virtual" />

## Keyboard and accessibility {#a11y}

- The root is `role="tree"` and nodes are `role="treeitem"`, preserving levels, sibling positions, and expansion state. Provide a name with `aria-label`, `aria-labelledby`, or [FormField](/components/form-field).
- Single selection uses `aria-selected`. Multiple checks use `aria-checked`, with `mixed` for indeterminate parents. Visual checkboxes do not add extra Tab stops.
- Up and Down move focus; Home and End reach the first and last available nodes. Space and Enter change selection.
- The arrow toward the line end expands or enters children; the arrow toward the line start collapses or returns to the parent. Left and Right swap in RTL. Disabled nodes are skipped during keyboard navigation.

## API {#api}

### Props and models {#props}

| Prop              | Type                               | Default | Description                                           |
| ----------------- | ---------------------------------- | ------- | ----------------------------------------------------- |
| `items`           | `TreeNode[]`                       | —       | Required. Tree nodes                                  |
| `virtualize`      | `VirtualizeOptions`                | `false` | Virtual scrolling; content-based estimate, overscan 6 |
| `maxHeight`       | `number \| string`                 | `320`   | Maximum height of the virtual viewport                |
| `multiple`        | `boolean`                          | `false` | Enable cascading checkbox multiselection              |
| `modelValue`      | `TreeValue \| TreeValue[] \| null` | —       | Single value or array; supports `v-model`             |
| `defaultExpanded` | `TreeValue[]`                      | `[]`    | Initially expanded nodes                              |
| `expanded`        | `TreeValue[]`                      | —       | Expanded nodes; supports `v-model:expanded`           |
| `disabled`        | `boolean`                          | `false` | Disable the entire tree                               |
| `invalid`         | `boolean`                          | `false` | Mark validation as failed                             |
| `class`           | `string`                           | —       | Classes appended to the root                          |

### Slots {#slots}

| Slot       | Payload        | Description                                        |
| ---------- | -------------- | -------------------------------------------------- |
| `node`     | `TreeNodeSlot` | Node content                                       |
| `trailing` | `TreeNodeSlot` | End-of-row content; occupies no space when omitted |
| `empty`    | —              | Empty content                                      |

### Node types {#types}

```ts
export type TreeValue = string | number

export interface TreeNode {
  value: TreeValue
  label: string
  description?: string
  disabled?: boolean
  children?: TreeNode[]
}

export interface TreeNodeSlot {
  node: TreeNode
  selected: boolean
  indeterminate: boolean
  expanded: boolean
  disabled: boolean
}
```

Each `value` must be unique within the tree. Numeric `1` and string `'1'` are distinct values. `description` appears below the label by default; the slot's `disabled` state includes inherited disabling from ancestors and the whole component.

```ts
type VirtualizeOptions = boolean | { estimateSize?: number; overscan?: number }
```
