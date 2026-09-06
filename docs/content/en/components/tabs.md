---
title: Tabs
description: Several sets of content shown one at a time in the same place.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/tabs/Tabs.vue
  - label: Tabs
    href: https://reka-ui.com/docs/components/tabs
---

<Demo name="tabs/hero" />

## Usage {#usage}

```ts
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@hina-ui/vue'
```

Four parts: `Tabs` holds the current selection, `TabsList` is the row the tabs sit in, `TabsTrigger` is a single tab, and `TabsContent` is the panel that belongs to it. Triggers and panels are paired by `value`.

<Demo name="tabs/basic" />

Tabs switch between sets of content that stand side by side, in no particular order. When the content needs to be visible at once, use section headings instead; when it is a sequence of steps, use `Stepper`.

## Examples {#examples}

### Shapes {#variants}

`underline` is the default: a rounded line marks the selected tab, which suits content grouped at the width of the body text. In `soft` the selection is a raised block, which suits toolbars and compact switches.

<Demo name="tabs/variants" />

The line or block travels and resizes as the selection moves, rather than jumping.

### Sizes {#sizes}

`size` changes how dense the row is: `sm` for toolbars and compact interfaces, `md` as the default, and `lg` where the row needs more presence, such as the top of a page.

The type size stays the same across all three. Tabs are interface chrome, so their visual weight comes from height, padding and the selection marker.

<Demo name="tabs/sizes" />

### Vertical {#vertical}

Set `orientation` to `vertical` and the tabs stack into a column beside the content, with the arrow keys switching to up and down.

<Demo name="tabs/vertical" />

### When there are too many tabs {#overflow}

Once the tabs overflow their container the row scrolls sideways without showing a scrollbar: edge shadows indicate the scroll position, the mouse wheel scrolls the row directly, and the keyboard cycles through the tabs with the arrow keys.

<Demo name="tabs/overflow" />

### Disabled {#disabled}

`disabled` on a `TabsTrigger` makes that tab unselectable, and the arrow keys skip over it.

<Demo name="tabs/disabled" />

## Accessibility {#a11y}

- Give `TabsList` a `label` describing what this set of tabs switches between.
- Arrow keys move between tabs, `Home` and `End` jump to the ends, and the selection follows the focus.
- The panel is focusable, so keyboard users can move from the tabs straight into the content.

## API {#api}

### Tabs {#props}

| Prop           | Type                         | Default        | Description                       |
| -------------- | ---------------------------- | -------------- | --------------------------------- |
| `modelValue`   | `string`                     | —              | The selected tab, takes `v-model` |
| `defaultValue` | `string`                     | —              | The initially selected tab        |
| `variant`      | `'underline' \| 'soft'`      | `'underline'`  | Shape                             |
| `size`         | `'sm' \| 'md' \| 'lg'`       | `'md'`         | Size                              |
| `orientation`  | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction                         |
| `class`        | `string`                     | —              | Classes appended to the root      |

### TabsList {#list}

| Prop    | Type     | Default | Description                 |
| ------- | -------- | ------- | --------------------------- |
| `label` | `string` | —       | A name for this set of tabs |
| `class` | `string` | —       | Classes appended to the row |

### TabsTrigger {#trigger}

| Prop       | Type      | Default | Description                                  |
| ---------- | --------- | ------- | -------------------------------------------- |
| `value`    | `string`  | —       | Identifier pairing it with a panel; required |
| `disabled` | `boolean` | `false` | Whether the tab can be selected              |
| `class`    | `string`  | —       | Classes appended to the tab                  |

### TabsContent {#content}

| Prop    | Type     | Default | Description                                |
| ------- | -------- | ------- | ------------------------------------------ |
| `value` | `string` | —       | Identifier pairing it with a tab; required |
| `class` | `string` | —       | Classes appended to the panel              |
