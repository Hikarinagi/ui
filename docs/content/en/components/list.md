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
import { List } from '@hikarinagi/ui'
```

Renders a `ul` by default, with items written as `li`. The list is indented and its markers are lighter than body text.

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
- Items must be direct children of the list; do not wrap them in another container.

## API {#api}

### Props {#props}

| Prop      | Type      | Default | Description                  |
| --------- | --------- | ------- | ---------------------------- |
| `ordered` | `boolean` | `false` | Render an ordered list       |
| `class`   | `string`  | —       | Classes appended to the root |

Remaining attributes are passed to the root element, for example `start` and `reversed`.

### Slots {#slots}

| Slot      | Description    |
| --------- | -------------- |
| `default` | The list items |
