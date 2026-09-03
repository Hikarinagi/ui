---
title: ButtonGroup
description: Joins several buttons into one unit that shares borders and corners.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/button-group/ButtonGroup.vue
---

<Demo name="button-group/hero" />

## Usage {#usage}

```ts
import { ButtonGroup } from '@hina-ui/vue'
```

Put the buttons straight into the group; joining them is the container's job. The outer corners at each end are kept, the corners where two buttons meet are dropped, and adjacent borders overlap into one rule rather than sitting side by side.

<Demo name="button-group/basic" />

Buttons in a group should share one variant and one tone. Only actions of equal standing belong together; actions of different weight should be placed apart.

## Examples {#examples}

### Variants {#variants}

Variant and tone are set on each button; the container does not assign them.

<Demo name="button-group/variants" />

### Sizes {#sizes}

Size is likewise set on the buttons. A group must use one size throughout, otherwise the heights of neighbouring buttons will not line up.

<Demo name="button-group/sizes" />

### Vertical {#orientation}

With `orientation="vertical"` the group joins vertically, the shared edges move to the top and bottom, and the width of the group is set by its widest item.

<Demo name="button-group/orientation" />

### Full width {#block}

With `block` the group fills the width of its container and the buttons divide the remaining space equally. This form suits dialog footers and mobile layouts.

<Demo name="button-group/block" />

### Dividers {#divider}

When buttons share a background colour, the boundary between them is not obvious. `divider` adds a thin rule between them, shorter than the full edge, coloured from the current text colour.

<Demo name="button-group/divider" />

### Mixing in icon buttons {#mixed}

`Button` and `IconButton` can be joined in one group; a common pattern is a primary action followed by a dropdown trigger.

<Demo name="button-group/mixed" />

### Unavailable {#disabled}

The container has no `disabled` property. To disable a whole group, set `disabled` on each button; a single button can also be disabled on its own.

<Demo name="button-group/disabled" />

## Custom styles {#styling}

`class` is appended to the container. To change the corners at each end, set them from the container with child selectors rather than writing them on every button.

<Demo name="button-group/custom" />

## Behaviour {#behavior}

- Buttons in a group no longer scale on press.
- The focused button is raised above the others, so its focus ring is never covered by a neighbour.
- The container is a `role="group"` and `label` becomes the accessible name of the whole group. A vertical group also carries `aria-orientation="vertical"`.

## API {#api}

### Props {#props}

| Prop          | Type                         | Default        | Description                                |
| ------------- | ---------------------------- | -------------- | ------------------------------------------ |
| `label`       | `string`                     | —              | Accessible name of the group               |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction in which buttons are joined      |
| `block`       | `boolean`                    | `false`        | Fill the container and divide space evenly |
| `divider`     | `boolean`                    | `false`        | Show a rule between adjacent buttons       |
| `class`       | `string`                     | —              | Classes appended to the root               |

### Slots {#slots}

| Slot      | Description              |
| --------- | ------------------------ |
| `default` | The buttons in the group |
