---
title: Pagination
description: Selects a page within a numbered range.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/pagination/Pagination.vue
  - label: Pagination
    href: https://reka-ui.com/docs/components/pagination
---

<Demo name="pagination/hero" />

## Usage {#usage}

```ts
import { Pagination } from '@hina-ui/vue'
```

Bind the current page with `v-model`, starting at `1`. `total` is the number of items and `page-size` is the number per page; together they determine the page count. Clicking a page number or a navigation button updates the current page.

<Demo name="pagination/basic" />

## Examples {#examples}

### Page range {#edges}

`sibling-count` controls how many neighbouring pages appear on each side of the current page. `show-edges` is enabled by default, keeping the first and last page numbers visible with ellipses for gaps.

`show-first-last` adds arrow buttons that jump to the first and last pages. It is disabled by default and can be set independently of `show-edges`.

<Demo name="pagination/edges" />

### Total and page size {#range}

When the total or page size changes, a current page beyond the new range moves to the last page and updates `v-model`. The two buttons below toggle `total` and `page-size` respectively.

<Demo name="pagination/range" />

### Sizes {#sizes}

`size` accepts `sm`, `md` or `lg`, following [Button](/components/button) dimensions. Longer page numbers grow to fit their content.

<Demo name="pagination/sizes" />

### States {#states}

`disabled` disables every button. Backward controls are disabled on the first page and forward controls on the last page. With `total="0"`, page `1` remains visible and all directional controls are disabled.

<Demo name="pagination/states" />

### Direction {#direction}

`dir` accepts `ltr` or `rtl` and takes precedence over Reka's global direction configuration. Without either setting, direction is inherited from surrounding elements. In RTL the order and arrows reverse together; next still increases the page number.

<Demo name="pagination/direction" />

### Page content {#content}

`#page` receives `{ page, selected }` and replaces the content inside each numbered button, preserving its interaction and current-page semantics. `#ellipsis` replaces the ellipsis content.

The example uses [Text](/components/text) to set the weight of the current page number.

<Demo name="pagination/content" />

## Behaviour {#behavior}

- The current page stays between `1` and the page count. Passing a value outside this range also updates `v-model`.
- The page count is `Math.ceil(total / pageSize)`, with a minimum of `1`.
- Buttons wrap when the container is too narrow. Use `sibling-count` and `show-edges` to reduce the visible page range.
- The component manages page selection; the caller handles fetching and displaying data.

## Accessibility {#a11y}

- The root is a `nav` landmark with a name in the interface language; `label` overrides it.
- The current page carries `aria-current="page"`. Page and directional buttons have localised names; arrows and ellipses are hidden from assistive technology.
- Tab moves between enabled buttons; Enter or Space activates them. Disabled buttons are skipped.
- Every button has `type="button"` and does not submit a surrounding form.

## API {#api}

### Props {#props}

| Prop            | Type                   | Default            | Description                                |
| --------------- | ---------------------- | ------------------ | ------------------------------------------ |
| `modelValue`    | `number`               | `1`                | Current page; supports `v-model`           |
| `total`         | `number`               | Required           | Total number of items                      |
| `pageSize`      | `number`               | `10`               | Items per page                             |
| `siblingCount`  | `number`               | `1`                | Neighbouring pages on each side            |
| `showEdges`     | `boolean`              | `true`             | Keep edge page numbers and ellipses        |
| `showFirstLast` | `boolean`              | `false`            | Show first and last arrow buttons          |
| `size`          | `'sm' \| 'md' \| 'lg'` | `'md'`             | Button size                                |
| `disabled`      | `boolean`              | `false`            | Disable all buttons                        |
| `dir`           | `'ltr' \| 'rtl'`       | —                  | Direction; inherited when omitted          |
| `label`         | `string`               | Interface language | Accessible name of the navigation landmark |
| `class`         | `string`               | —                  | Classes appended to the root               |

Remaining attributes pass through to the root element.

### Events {#events}

| Event               | Payload        | Description                                                |
| ------------------- | -------------- | ---------------------------------------------------------- |
| `update:modelValue` | `page: number` | A page is selected or the current page moves within bounds |

### Slots {#slots}

| Slot       | Props                                 | Description                     |
| ---------- | ------------------------------------- | ------------------------------- |
| `page`     | `{ page: number; selected: boolean }` | Content inside numbered buttons |
| `ellipsis` | —                                     | Ellipsis content                |
