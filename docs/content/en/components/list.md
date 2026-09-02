---
title: List
description: Ordered and unordered lists.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/list/List.vue
  - label: DescriptionList
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/description-list/DescriptionList.vue
---

<Demo name="list/hero" />

## Usage {#usage}

```ts
import { List, ListItem } from '@hina-ui/vue'
```

`List` renders a `ul` by default and `ListItem` renders each `li`. The list is indented and its markers are lighter than body text.

<Demo name="list/basic" />

## Examples {#examples}

### Ordered lists {#ordered}

`ordered` renders an `ol`, turning the markers into numbers.

<Demo name="list/ordered" />

### Nesting {#nested}

An item can contain another list, and the indentation accumulates with each level.

<Demo name="list/nested" />

### Where numbering starts and which way it runs {#numbering}

The component does not intercept attributes, so the native properties of `ol` can be written directly: `start` sets the first number and `reversed` counts down.

<Demo name="list/numbering" />

### Lists in body content {#prose}

`Prose` applies the same styling to native `ul` and `ol` elements inside it, so rendered Markdown and rich text need no tag replacement.

<Demo name="list/prose" />

## Accessibility {#a11y}

- The component renders a native `ul` or `ol`, so screen readers announce how many items there are.
- Items must be direct children of the list; wrapping them in another container makes the announced count wrong.

## API {#api}

### List {#props}

| Prop      | Type      | Default | Description                  |
| --------- | --------- | ------- | ---------------------------- |
| `ordered` | `boolean` | `false` | Render an ordered list       |
| `class`   | `string`  | —       | Classes appended to the root |

| Slot      | Description    |
| --------- | -------------- |
| `default` | The list items |

Remaining attributes are passed to the root element, for example `start` and `reversed`.

### ListItem {#item}

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| `default` | The item's content, which may nest another list |

Remaining attributes are passed to the root element, for example `value` to set one item's number in an ordered list.
