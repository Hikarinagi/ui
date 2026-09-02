---
title: DescriptionList
description: Groups of names and values, for listing attributes on detail pages.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/description-list/DescriptionList.vue
  - label: Table
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/table/Table.vue
---

<Demo name="description-list/hero" />

## Usage {#usage}

```ts
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@hikarinagi/ui'
```

`DescriptionList` renders a native `dl`. Names go in `DescriptionTerm` (`dt`) and values in `DescriptionDetails` (`dd`). They stack vertically by default, with names in a medium weight.

<Demo name="description-list/basic" />

## Examples {#examples}

### Two columns {#columns}

Turning the component into a grid puts names and values into two columns side by side. Detail pages in admin interfaces usually look like this.

<Demo name="description-list/columns" />

### One name, several values {#multiple}

A single `dt` can be followed by several `dd` elements, and values can contain other components.

<Demo name="description-list/multiple" />

### Description lists in body content {#prose}

`Prose` applies the same styling to native `dl` elements inside it, so rendered Markdown and rich text need no tag replacement.

<Demo name="description-list/prose" />

## Accessibility {#a11y}

- The component renders a native `dl`, so screen readers announce each name together with its value.
- `dt` and `dd` must be direct children of the `dl`. Wrapping them in another container breaks that relationship.

## API {#api}

### DescriptionList {#props}

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `default` | `DescriptionTerm` and `DescriptionDetails` items |

### DescriptionTerm {#term}

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |

| Slot      | Description   |
| --------- | ------------- |
| `default` | The name text |

### DescriptionDetails {#details}

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |

| Slot      | Description       |
| --------- | ----------------- |
| `default` | The value content |
