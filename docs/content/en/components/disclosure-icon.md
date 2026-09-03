---
title: DisclosureIcon
description: An indicator that turns as a region opens and closes.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/disclosure-icon/DisclosureIcon.vue
---

<Demo name="disclosure-icon/hero" />

## Usage {#usage}

```ts
import { DisclosureIcon } from '@hina-ui/vue'
```

The indicator is the arrow on a disclosure control that turns as the region opens. Every disclosure component shares this one piece, and **most of the time you never place it yourself**: `CollapsibleTrigger` brings its own, and so will `Accordion`, `Select` and `Tree`.

There is one case that needs it: **when the trigger comes from the caller**. A `DropdownMenu` trigger is any control at all, and `Collapsible` behaves the same way once it goes through `as-child`.

Drop it into the trigger and stop there — no classes, no transition to handle. The trigger carries the marker the indicator looks for.

## Examples {#examples}

### Direction {#direction}

`down` rests pointing down and turns a half circle, which suits dropdowns and accordions. `end` rests pointing to the end of the line and turns a quarter, which suits sidebar groups and tree nodes.

<Demo name="disclosure-icon/direction" />

It is `end` rather than `right` so the whole thing can flip in right-to-left languages.

### Another glyph {#custom}

The default slot replaces the glyph while the component keeps owning the rotation. A plus turned a quarter lands exactly on a cross.

<Demo name="disclosure-icon/custom" />

### When the state lives outside {#open}

Pass `open` when the state is held in a variable of your own rather than on an ancestor trigger. Once passed, the indicator stops reading its ancestors.

<Demo name="disclosure-icon/open" />

## Boundary {#boundary}

This is a **state indicator**, not a direction marker. The `>` between breadcrumbs and the arrow at the end of a submenu never change with a state; they keep their own static icons.

## Accessibility {#a11y}

- The indicator is always `aria-hidden`. The open state is already announced through the trigger's `aria-expanded`, and saying it twice is noise.
- It is not focusable, so the keyboard never stops on it.

## API {#api}

### Props {#props}

| Prop        | Type              | Default  | Description                                                       |
| ----------- | ----------------- | -------- | ----------------------------------------------------------------- |
| `direction` | `'down' \| 'end'` | `'down'` | Resting orientation, which also sets a half or a quarter turn     |
| `open`      | `boolean`         | —        | State to use; without it the indicator reads the ancestor trigger |
| `class`     | `string`          | —        | Classes appended to the root                                      |

### Slots {#slots}

| Slot      | Description                                           |
| --------- | ----------------------------------------------------- |
| `default` | Replaces the glyph; the component still owns the turn |
