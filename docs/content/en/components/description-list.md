---
title: DescriptionList
description: Groups of names and values, for listing attributes on detail pages.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/description-list/DescriptionList.vue
---

<Demo name="description-list/hero" />

## Usage {#usage}

```ts
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@hina-ui/vue'
```

`DescriptionList` renders a native `dl`. Names go in `DescriptionTerm` (`dt`) and values in `DescriptionDetails` (`dd`). They stack vertically by default, with names in a medium weight.

<Demo name="description-list/basic" />

## Examples {#examples}

### Two columns {#columns}

`orientation="horizontal"` puts names and values into two columns side by side: names in one, values in the other. Detail pages in admin interfaces usually look like this.

<Demo name="description-list/columns" />

The name column is as wide as the longest name. `--hn-dl-term-width` sets a fixed width instead, for lining up several lists.

::: vue

```vue
<DescriptionList orientation="horizontal" class="[--hn-dl-term-width:8rem]">…</DescriptionList>
```

:::

::: react

```tsx
<DescriptionList orientation="horizontal" className="[--hn-dl-term-width:8rem]">
  …
</DescriptionList>
```

:::

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

| Prop          | Type                         | Default      | Description                                                         |
| ------------- | ---------------------------- | ------------ | ------------------------------------------------------------------- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction; `horizontal` gives names and values a column each |
| `class`       | `string`                     | —            | Classes appended to the root                                        |

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
