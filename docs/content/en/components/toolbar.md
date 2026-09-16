---
title: Toolbar
description: Compose buttons, links and toggle groups with shared keyboard navigation.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/toolbar/Toolbar.vue
  - label: Toolbar
    href: https://reka-ui.com/docs/components/toolbar
---

<Demo name="toolbar/hero" />

## Usage {#usage}

`Toolbar` provides toolbar semantics, sizing and arrow-key navigation. `ToolbarButton` performs an action, `ToolbarLink` renders a link, and `ToolbarSeparator` separates controls. Controls reuse [Button](/en/components/button) styling.

```ts
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
} from '@hina-ui/vue'
```

Name the toolbar with `label` or `aria-labelledby`. Text buttons use the default slot, with `#icon` and `#trailing` for adjacent content. For icon-only controls, set `label` and place the icon in the default slot. This provides square sizing, an accessible name, and a tooltip inside [TooltipProvider](/en/components/tooltip#provider), matching [IconButton](/en/components/icon-button).

<Demo name="toolbar/basic" />

## Examples {#examples}

### Single and multiple selection {#toggles}

`ToolbarToggleGroup` defaults to `type="single"`, binding a string or `undefined`. Activating the selected item clears it. With `type="multiple"`, bind an array of strings; each item toggles independently. Use `default-value` for uncontrolled initial state.

Each `ToolbarToggleItem` needs a unique `value` within its group. Arrow keys only move focus; click, Enter or Space changes selection.

<Demo name="toolbar/toggles" />

### Vertical {#vertical}

`orientation="vertical"` stacks controls and uses the up/down arrow keys. Separators turn automatically. Set each control's `side` to change tooltip placement.

<Demo name="toolbar/vertical" />

### Appearance {#variants}

`primary` has a border and surface background, `secondary` uses an inset background, and `bare` removes the background, border and padding.

<Demo name="toolbar/variants" />

### Sizes {#sizes}

Buttons, links and toggle items inherit the toolbar's `size`. Individual controls can override it. Gaps and control heights follow density tokens.

<Demo name="toolbar/sizes" />

### Disabled {#disabled}

`Toolbar.disabled` disables all controls. `ToolbarToggleGroup.disabled` disables its toggle items, while an item's `disabled` only affects itself. Arrow-key navigation skips disabled controls. `loading` also disables the control.

<Demo name="toolbar/disabled" />

### Composing controls {#composition}

Use `ToolbarButton` as the trigger of [DropdownMenu](/en/components/dropdown-menu) or [Popover](/en/components/popover) to preserve both the overlay's and toolbar's keyboard behavior.

`as-child` merges behavior and attributes into one child control without nesting buttons. This example reuses [Toggle](/en/components/toggle). Custom children must forward attributes and events to their focusable element. Set disabled and loading states on `ToolbarButton` so it also leaves arrow-key navigation.

<Demo name="toolbar/composition" />

### RTL {#rtl}

`dir="rtl"` changes layout and left/right arrow behavior together. When omitted, direction comes from [ConfigProvider](https://reka-ui.com/docs/utilities/config-provider) or the nearest ancestor's `dir`.

<Demo name="toolbar/rtl" />

## Behavior and accessibility {#accessibility}

The container has `role="toolbar"`, toggle groups use `role="group"`, and toggle items expose `aria-pressed`. Buttons default to `type="button"` and do not submit a surrounding form.

| Key               | Behavior                                                            |
| ----------------- | ------------------------------------------------------------------- |
| Tab / Shift + Tab | Enter or leave the toolbar; re-entry restores the last focused item |
| ← / →             | Move focus in a horizontal toolbar, reversed in RTL                 |
| ↑ / ↓             | Move focus in a vertical toolbar                                    |
| Home / End        | Move to the first / last enabled item                               |
| Enter / Space     | Activate buttons or links, or change toggle state                   |

`loop` defaults to true, allowing navigation between the last and first items. Horizontal controls can wrap naturally. Arrow keys continue to follow DOM order rather than a two-dimensional grid.

Controls that need the same arrow keys for their own operation, such as text inputs or [Slider](/en/components/slider), should retain their own keyboard handling. Do not use `ToolbarButton` to add them to this arrow-key sequence.

## API {#api}

### Toolbar

| Prop          | Type                                 | Default        | Description                                         |
| ------------- | ------------------------------------ | -------------- | --------------------------------------------------- |
| `label`       | `string`                             | —              | Accessible name; alternatively pass aria-labelledby |
| `orientation` | `'horizontal' \| 'vertical'`         | `'horizontal'` | Layout and navigation direction                     |
| `dir`         | `'ltr' \| 'rtl'`                     | Inherited      | Reading direction                                   |
| `loop`        | `boolean`                            | `true`         | Wrap focus at either end                            |
| `disabled`    | `boolean`                            | `false`        | Disable all controls                                |
| `size`        | `'sm' \| 'md' \| 'lg'`               | `'md'`         | Control size                                        |
| `variant`     | `'primary' \| 'secondary' \| 'bare'` | `'primary'`    | Container appearance                                |
| `class`       | `string`                             | —              | Root classes                                        |

Place toolbar parts in the default slot. Native attributes are forwarded to the root.

### ToolbarButton / ToolbarLink / ToolbarToggleItem

| Prop       | Type                                                  | Default                        | Description                                        |
| ---------- | ----------------------------------------------------- | ------------------------------ | -------------------------------------------------- |
| `label`    | `string`                                              | —                              | Accessible name and tooltip for icon-only controls |
| `tooltip`  | `boolean`                                             | `true`                         | Show a tooltip with label and TooltipProvider      |
| `side`     | `'top' \| 'right' \| 'bottom' \| 'left'`              | `'top'`                        | Tooltip placement                                  |
| `size`     | `'sm' \| 'md' \| 'lg'`                                | Inherited                      | Control size                                       |
| `variant`  | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'` | `'ghost'`                      | Button appearance                                  |
| `tone`     | `'accent' \| 'neutral' \| 'danger'`                   | `'neutral'`                    | Color tone                                         |
| `disabled` | `boolean`                                             | `false`                        | Disable this control                               |
| `loading`  | `boolean`                                             | `false`                        | Show loading state and disable                     |
| `ripple`   | `boolean`                                             | `true`                         | Press ripple                                       |
| `as`       | `string \| Component`                                 | `'button'`, or `'a'` for links | Rendered element                                   |
| `asChild`  | `boolean`                                             | `false`                        | Merge into a single child                          |
| `class`    | `string`                                              | —                              | Control classes                                    |

`ToolbarLink` also accepts `href`, `target` and `rel`. `ToolbarToggleItem` requires `value: string` and must be inside `ToolbarToggleGroup`. The default, `#icon` and `#trailing` slots match Button. Native attributes and events are forwarded to the control.

### ToolbarToggleGroup

| Prop           | Type                              | Default    | Description                      |
| -------------- | --------------------------------- | ---------- | -------------------------------- |
| `v-model`      | `string \| string[] \| undefined` | —          | Current selection                |
| `defaultValue` | `string \| string[]`              | —          | Uncontrolled initial selection   |
| `type`         | `'single' \| 'multiple'`          | `'single'` | Selection mode                   |
| `label`        | `string`                          | —          | Group name                       |
| `disabled`     | `boolean`                         | `false`    | Disable the group's toggle items |
| `class`        | `string`                          | —          | Group classes                    |

Place toggle items in the default slot. `update:modelValue` fires when selection changes. Items remain part of the outer Toolbar's single focus sequence.

### ToolbarSeparator

| Prop         | Type      | Default | Description                         |
| ------------ | --------- | ------- | ----------------------------------- |
| `decorative` | `boolean` | `true`  | Whether the separator is decorative |
| `class`      | `string`  | —       | Separator classes                   |

Separators are perpendicular to the toolbar's orientation and do not receive keyboard focus.
