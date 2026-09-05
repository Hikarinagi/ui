---
title: TreeSelect
description: Picks one item from a tree.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tree-select/TreeSelect.vue
  - label: Tree
    href: https://reka-ui.com/docs/components/tree
---

<Demo name="tree-select/hero" />

## Usage {#usage}

```ts
import { TreeSelect } from '@hina-ui/vue'
```

The tree select shares its trigger with `Select` and opens a tree that expands level by level. `items` supplies the nodes, each `{ value, label }`, and a node with `children` can be expanded; `v-model` binds the chosen node's value, and a node at any level can be chosen.

<Demo name="tree-select/basic" />

## Examples {#examples}

### Expanded by default {#expanded}

`defaultExpanded` lists the nodes expanded when the tree opens. The path to the chosen node is always expanded as well.

<Demo name="tree-select/expanded" />

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

| Prop              | Type                       | Default     | Description                               |
| ----------------- | -------------------------- | ----------- | ----------------------------------------- |
| `modelValue`      | `string \| number \| null` | —           | Value of the chosen node                  |
| `items`           | `TreeSelectNode[]`         | —           | The nodes, see the type below             |
| `placeholder`     | `string`                   | locale pack | Text shown when nothing is chosen         |
| `defaultExpanded` | `Array<string \| number>`  | `[]`        | Nodes expanded when the panel opens       |
| `open`            | `boolean`                  | `false`     | Whether the panel is open; `v-model:open` |
| `variant`         | `'primary' \| 'secondary'` | `'primary'` | Variant                                   |
| `size`            | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                      |
| `invalid`         | `boolean`                  | `false`     | Whether validation failed                 |
| `disabled`        | `boolean`                  | `false`     | Whether the select is disabled            |
| `class`           | `string`                   | —           | Classes appended to the trigger           |

### Slots {#slots}

| Slot   | Payload                    | Description          |
| ------ | -------------------------- | -------------------- |
| `node` | `{ node: TreeSelectNode }` | Content of each node |

### Events {#events}

| Event               | Payload                   | Description                |
| ------------------- | ------------------------- | -------------------------- |
| `update:modelValue` | `value: string \| number` | The chosen value changed   |
| `update:open`       | `open: boolean`           | The panel opened or closed |

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
