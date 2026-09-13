---
title: Pagination
description: Change pages, adjust page size and browse omitted page ranges.
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

Bind the current page with `v-model`, starting at `1`. `total` is the item count and `page-size` is the number of items per page. Page and navigation buttons update the current page.

By default, Pagination displays page numbers, previous and next buttons, and interactive ellipses. Information, the size selector and the page input are optional.

<Demo name="pagination/basic" />

## Examples {#examples}

### Page range {#edges}

`sibling-count` sets the number of adjacent pages on each side of the current page. `show-edges` is enabled by default, keeping the first and last pages visible and using ellipses for omitted ranges.

`show-first-last` independently enables the first and last arrow buttons. It is off by default.

<Demo name="pagination/edges" />

### Ellipsis {#ellipsis}

Click an ellipsis with a mouse to skip `2 × siblingCount + 1` pages in that direction. Hover to open its omitted page range. The list excludes pages already visible in the pagination bar and closes after selection. A touch tap opens the list directly.

Both ellipses share one popup. Switching sides updates its position and range; repeated skips refresh the open range. The popup flips when space is limited. Long ranges scroll and only render choices near the visible area.

<Demo name="pagination/ellipsis" />

### Optional controls {#controls}

`show-info` displays the item range, total count and page count. Set `item-count` to the actual number of items shown on the current page. Otherwise the range uses `page-size`, capped at the total count.

Set `page-size-options` to display the size selector and bind it with `v-model:page-size`. Selecting a new size resets the page to `1` and emits `change` once with the new `{ page, pageSize }`. Use that payload to update data.

`show-jump` displays a page input. Enter or blur commits the value, clamped to the valid range. Empty or invalid input restores the current page; Escape cancels editing.

<Demo name="pagination/controls" />

### Total and page size {#range}

External changes to `total` or `page-size` preserve the current page when it remains valid. Otherwise the page is clamped to the last page and `v-model` updates. External changes to valid controlled values do not echo a `change` event.

<Demo name="pagination/range" />

### Layout and composition {#layout}

`align` positions the parts with `start`, `center`, `end` or `between`. Use the default slot to arrange `PaginationInfo`, `PaginationContent`, `PaginationSize` and `PaginationJump`. These components share their parent's state, size, disabled state and locale.

The default slot of `PaginationInfo` receives pagination state for custom text. This example uses [Inline](/components/inline) to group the controls on the right.

<Demo name="pagination/layout" />

### Loading {#loading}

`pending` disables pagination actions and closes the ellipsis list. When `#list` is provided, its content stays mounted, becomes inert and is covered by [LoadingOverlay](/components/loading-overlay).

A temporary total of `0` while loading does not overwrite the bound page. Out-of-range pages are corrected after loading ends. This example uses a timer to change loading state; the component does not fetch data.

<Demo name="pagination/loading" />

### Hide single-page navigation {#hidden}

`hide-single-page` hides the navigation when there is at most one page. The `#list` slot remains mounted.

<Demo name="pagination/hidden" />

### Sizes {#sizes}

`size` accepts `sm`, `md` or `lg`, using [Button](/components/button) dimensions. Longer page numbers expand to fit their content.

<Demo name="pagination/sizes" />

### States {#states}

`disabled` disables every control. Backward controls are disabled on the first page and forward controls on the last page. With `total="0"`, page `1` remains and all direction controls are disabled.

<Demo name="pagination/states" />

### Direction {#direction}

`dir` accepts `ltr` or `rtl`, taking precedence over Reka's global direction. Without either, direction is inherited from ancestor elements. RTL mirrors the controls and arrows; next still increases the page number.

<Demo name="pagination/direction" />

### Page content {#content}

`#page` receives `{ page, selected }` and replaces button content while preserving interaction and current-page semantics. `#ellipsis` receives `{ side, expanded }` and replaces ellipsis button content.

This example uses [Text](/components/text) to change the selected page's font weight.

<Demo name="pagination/content" />

## Behavior {#behavior}

- The current page is limited to `1` through the page count. The count is `Math.ceil(total / pageSize)`, with a minimum of `1`.
- A user action that changes the page or size emits `change` once. Selecting the current value does not emit it. Automatic correction of an out-of-range page also emits `change`.
- The size selector always includes the current size and removes duplicate, non-integer and non-positive options.
- Controls wrap when space is limited. Reduce visible pages with `sibling-count` and `show-edges`.

## Accessibility {#a11y}

- The navigation is a `nav` with a localized name, overridable with `label`. The current page has `aria-current="page"`.
- Tab moves between available controls; Enter or Space activates them. Disabled controls are skipped. Buttons do not submit forms.
- Keyboard focus on an ellipsis opens the list. Enter or Space skips a group; ↓ / ↑ enters at the first / last choice.
- Within the list, ↑ / ↓ moves between choices, Home / End moves to its boundaries and PageUp / PageDown moves by the visible range. Enter or Space selects.
- Escape closes the list and restores focus. If selection removes the original ellipsis, focus moves to the current page button. Tab leaves the list in the pagination bar's order.

## API {#api}

### Props {#props}

| Prop              | Type                                        | Default   | Description                                  |
| ----------------- | ------------------------------------------- | --------- | -------------------------------------------- |
| `modelValue`      | `number`                                    | `1`       | Current page; supports `v-model`             |
| `total`           | `number`                                    | Required  | Total item count                             |
| `pageSize`        | `number`                                    | `10`      | Items per page; supports `v-model:page-size` |
| `itemCount`       | `number`                                    | —         | Actual items shown on the current page       |
| `siblingCount`    | `number`                                    | `1`       | Adjacent page count on either side           |
| `showEdges`       | `boolean`                                   | `true`    | Keep boundary pages and ellipses             |
| `showFirstLast`   | `boolean`                                   | `false`   | Show first and last arrow buttons            |
| `showInfo`        | `boolean`                                   | `false`   | Show pagination information                  |
| `showJump`        | `boolean`                                   | `false`   | Show the page input                          |
| `pageSizeOptions` | `number[]`                                  | —         | Show the size selector when non-empty        |
| `hideSinglePage`  | `boolean`                                   | `false`   | Hide navigation with at most one page        |
| `pending`         | `boolean`                                   | `false`   | Loading state                                |
| `align`           | `'start' \| 'center' \| 'end' \| 'between'` | `'start'` | Alignment of the parts                       |
| `size`            | `'sm' \| 'md' \| 'lg'`                      | `'md'`    | Control size                                 |
| `disabled`        | `boolean`                                   | `false`   | Disable all controls                         |
| `dir`             | `'ltr' \| 'rtl'`                            | —         | Direction; inherited when omitted            |
| `label`           | `string`                                    | Locale    | Accessible name of the navigation            |
| `class`           | `string`                                    | —         | Classes for the root                         |

Other attributes are forwarded to the outer `div`, which contains the navigation.

### Events {#events}

| Event               | Payload            | Description                                 |
| ------------------- | ------------------ | ------------------------------------------- |
| `update:modelValue` | `page: number`     | User page change or out-of-range correction |
| `update:pageSize`   | `pageSize: number` | User page-size change                       |
| `change`            | `PaginationChange` | One effective page or size change           |

### Slots {#slots}

| Slot       | Props                                           | Description                  |
| ---------- | ----------------------------------------------- | ---------------------------- |
| `default`  | `PaginationState`                               | Compose navigation controls  |
| `list`     | `PaginationState`                               | Content above the navigation |
| `page`     | `{ page: number; selected: boolean }`           | Page button content          |
| `ellipsis` | `{ side: 'prev' \| 'next'; expanded: boolean }` | Ellipsis button content      |

### Composition and types {#composition}

`PaginationContent` renders pages and navigation buttons and accepts the same `#page` and `#ellipsis` slots. `PaginationInfo` provides `#default(PaginationState)`. `PaginationSize` and `PaginationJump` render the size selector and page input. All four accept `class` and must be placed in the default slot of `Pagination`.

```ts
interface PaginationChange {
  page: number
  pageSize: number
}

interface PaginationState extends PaginationChange {
  total: number
  pageCount: number
  from: number
  to: number
}
```

All components and these types are exported from `@hina-ui/vue`.
