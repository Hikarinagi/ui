---
title: InputGroup
description: Joins addons and buttons with a field into one surface.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/input-group/InputGroup.vue
  - label: Variants
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/input-group/input-group.variants.ts
---

<Demo name="input-group/hero" />

## Usage {#usage}

```ts
import { InputGroup, InputGroupAddon } from '@hina-ui/vue'
```

The group is itself a complete field: the border, shadow and focus ring live on the group, and the fields, addons and buttons inside share that one shell. Size and variant are set on the group, and the fields inside follow it. `InputGroupAddon` holds a fixed prefix or suffix, text or an icon, separated from the text area by a divider; icons and units inside the border go in the field's own `leading` and `trailing` slots.

<Demo name="input-group/basic" />

## Examples {#examples}

### Attached buttons {#button}

A button placed in the group shares the shell with the text area and does not shrink on press.

<Demo name="input-group/button" />

### Sizes {#sizes}

Size is set on the group and the fields and buttons inside line up with it. Buttons still need the matching size.

<Demo name="input-group/sizes" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="input-group/variants" />

### States {#states}

`invalid` and `disabled` are set on the group and passed down to every field inside.

<Demo name="input-group/states" />

### With other fields {#fields}

Number, search and other fields can all go in a group.

<Demo name="input-group/fields" />

## Behaviour {#behavior}

- Focusing any text area inside the group grows the focus ring around the whole group.
- Clicking an addon focuses the adjacent text area, placing the caret at the start for a prefix and at the end for a suffix. Buttons are unaffected.
- A button inside the group draws its keyboard focus outline inwards, so the group's edge never clips it.
- Hover, invalid and disabled behave the same as the input.

## Accessibility {#a11y}

- Addons are presentational and do not contribute to the field's accessible name. Name the field with a `label` element or an `aria-label`.

## API {#api}

### InputGroup {#input-group}

| Prop       | Type                       | Default     | Description                          |
| ---------- | -------------------------- | ----------- | ------------------------------------ |
| `variant`  | `'primary' \| 'secondary'` | `'primary'` | Variant                              |
| `size`     | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                 |
| `invalid`  | `boolean`                  | `false`     | Whether validation failed            |
| `disabled` | `boolean`                  | `false`     | Whether the group is disabled        |
| `class`    | `string`                   | —           | Classes appended to the root element |

### InputGroupAddon {#input-group-addon}

| Prop    | Type     | Default | Description                          |
| ------- | -------- | ------- | ------------------------------------ |
| `class` | `string` | —       | Classes appended to the root element |
