---
title: VirtualList
description: Render items near the viewport with dynamic sizing and programmatic scrolling.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/virtual-list/VirtualList.vue
---

<Demo name="virtual-list/hero" />

## Usage {#usage}

```ts
import { VirtualList, type VirtualListExpose } from '@hina-ui/vue'
```

Supply `items` and a `getKey` function returning a unique, stable string or number. The default slot receives `{ item, index }` and preserves the full item type. Avoid array positions as keys when data can change or move.

The component includes [ScrollArea](/components/scroll-area) and defaults to a height of `320px`. `height` accepts pixels or a CSS length; `100%` requires a parent with a definite height. Item content and appearance are customizable. There is no default border, selection state, or click behavior. The first example contains ten thousand items and uses [Tag](/components/tag) for trailing content.

The examples use [Text](/components/text) for typography and [Stack](/components/stack) and [Inline](/components/inline) for layout.

## Examples {#examples}

### Fixed sizes {#fixed}

With `:dynamic="false"`, `estimateSize` specifies the actual item height and DOM measurement is disabled. A function `(item, index) => number` supports known, differing sizes. Sizes include item padding and borders, but exclude `gap`. Content must fit within its declared size.

<Demo name="virtual-list/fixed" />

### Dynamic sizes {#dynamic}

`dynamic` is enabled by default. Items grow with their content, and `estimateSize` estimates unmeasured items. Choose a value close to their expected size. Expanding content, loaded images, and viewport resizing update item measurements and subsequent positions. The total scroll extent changes as estimates are refined.

Use `gap` for spacing between items and `paddingStart` / `paddingEnd` for leading and trailing space, all in pixels. Avoid item margins for this spacing: margins are outside the measured item box. This example uses [Collapsible](/components/collapsible) to expand content, with the list tracking its animated height. Open state is stored outside each item by key and survives scrolling out of view and back.

<Demo name="virtual-list/dynamic" />

### Scrolling and visible ranges {#scroll}

Use a component reference to call `scrollToIndex(index, { align, behavior })` or `scrollToOffset(offset, { behavior })`. Indexes start at `0`. Alignment supports `start`, `center`, `end`, and `auto`; the default `auto` scrolls only when the target is outside the viewport. Out-of-range indexes are clamped to the first or last item.

`behavior="smooth"` enables smooth scrolling, falling back to immediate scrolling when reduced motion is requested. Long jumps with dynamic sizes continue to adjust as the target area is measured. Use fixed mode when exact sizes are known.

`rangeChange` reports the first and last visible indexes, excluding overscan and additional items retained for focus. It can drive incremental loading; request state and whether more data exists remain under your control. This example uses [NumberInput](/components/number-input) to choose an item.

<Demo name="virtual-list/scroll" />

### Horizontal and RTL {#horizontal}

With `orientation="horizontal"`, `estimateSize` describes width and `height` controls the container height. In dynamic mode, give slot content its natural width; fixed mode uses the declared width. Direction can be inherited or set with `dir`. RTL items run from right to left; scrolling methods still accept positive logical offsets.

<Demo name="virtual-list/horizontal" />

### Loading and empty states {#states}

`loading` uses [LoadingOverlay](/components/loading-overlay) to center an indicator over the list while preserving existing items, scroll position, and viewport dimensions. The indicator is also centered when there are no items, and empty content is hidden during loading. Use `#loading` to replace the overlay content, `#empty` to replace empty content, or `emptyText` to change the default empty message.

The example combines [Switch](/components/switch) and [Empty](/components/empty). The component does not fetch or clear data.

<Demo name="virtual-list/states" />

## SSR and measurement {#ssr}

The server renders an initial range using `estimateSize`, `initialRect`, and `initialOffset`, reserving the full estimated scroll extent. The default initial viewport is `320px` wide and uses numeric `height`; a CSS string height uses a `320px` estimate. Supply `initialRect` for a more accurate initial range and keep it consistent between server and client.

`viewport` becomes available when [ScrollArea](/components/scroll-area) initializes. Until then, the last programmatic scrolling request is queued. `initialOffset` sets the initial position only; use scrolling methods for subsequent changes.

Dynamic measurements are cached by stable key. Call `measure()` to clear this cache and remeasure mounted items after bulk changes to content that is currently unmounted.

## Accessibility {#a11y}

- The scroll region is focusable, named with `label`, and supports native keyboard scrolling.
- Content uses `list` / `listitem` semantics. `aria-posinset` and `aria-setsize` describe each item's position within the full collection. There are no implicit selection or menu semantics.
- An item containing focus stays mounted while scrolling until focus leaves it. Removing that item from the data still unmounts it.
- Other offscreen items unmount. Keep persistent input values or expansion state outside the item, indexed by stable key.
- Page search and assistive technology can access only mounted content. Use a regular [List](/components/list) or pagination when all content must be available together.

## API {#api}

### Props {#props}

| Prop            | Type                                                          | Default      | Description                                      |
| --------------- | ------------------------------------------------------------- | ------------ | ------------------------------------------------ |
| `items`         | `readonly T[]`                                                | Required     | Complete data array                              |
| `getKey`        | `(item: T, index: number) => string \| number`                | Required     | Unique, stable item key                          |
| `estimateSize`  | `number \| ((item: T, index: number) => number)`              | `48`         | Positive pixel size; an estimate in dynamic mode |
| `dynamic`       | `boolean`                                                     | `true`       | Measure item sizes automatically                 |
| `height`        | `number \| string`                                            | `320`        | Pixel height or CSS length                       |
| `orientation`   | `'vertical' \| 'horizontal'`                                  | `'vertical'` | Scrolling axis                                   |
| `dir`           | `'ltr' \| 'rtl'`                                              | Inherited    | Content direction                                |
| `overscan`      | `number`                                                      | `5`          | Extra items on each side of the visible range    |
| `gap`           | `number`                                                      | `0`          | Item spacing in pixels                           |
| `paddingStart`  | `number`                                                      | `0`          | Leading space in pixels                          |
| `paddingEnd`    | `number`                                                      | `0`          | Trailing space in pixels                         |
| `initialRect`   | `{ width: number; height: number }`                           | See above    | Initial viewport dimensions for SSR              |
| `initialOffset` | `number`                                                      | `0`          | Initial logical scroll offset in pixels          |
| `loading`       | `boolean`                                                     | `false`      | Loading indicator and `aria-busy`                |
| `emptyText`     | `string`                                                      | Locale       | Default empty message                            |
| `label`         | `string`                                                      | Locale       | Accessible scroll region name                    |
| `shadow`        | `boolean`                                                     | `true`       | ScrollArea edge shadows                          |
| `class`         | `string`                                                      | —            | Root classes                                     |
| `itemClass`     | `string \| ((item: T, index: number) => string \| undefined)` | —            | Item wrapper classes                             |

Other native attributes reach the root. Customize item appearance with `itemClass` without overriding positioning properties. Vertical padding is included in dynamic measurements.

### Slots {#slots}

| Slot      | Props                        | Description              |
| --------- | ---------------------------- | ------------------------ |
| `default` | `{ item: T, index: number }` | Item content             |
| `empty`   | —                            | No items and not loading |
| `loading` | —                            | Loading content          |

### Events {#events}

| Event         | Payload                                    | Description                                                                                           |
| ------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `rangeChange` | `{ startIndex: number; endIndex: number }` | Emitted initially and when the visible range changes; both indexes are `-1` when no items are visible |

### Expose {#expose}

| Name             | Type                                                            | Description                      |
| ---------------- | --------------------------------------------------------------- | -------------------------------- |
| `viewport`       | `HTMLElement \| undefined`                                      | Actual scrolling element         |
| `scrollToIndex`  | `(index, options?: VirtualListScrollOptions) => void`           | Scroll to an item                |
| `scrollToOffset` | `(offset, options?: { behavior?: 'auto' \| 'smooth' }) => void` | Scroll to a logical offset       |
| `measure`        | `() => void`                                                    | Reset cached sizes and remeasure |

Also exports `VirtualListProps<T>`, `VirtualListSlotProps<T>`, `VirtualListKey`, `VirtualListRange`, `VirtualListScrollOptions`, and `VirtualListExpose`.

## Component integration {#integration}

[Select](/components/select#virtual), [MultiSelect](/components/multi-select#virtual), [Combobox](/components/combobox#virtual), [MultiCombobox](/components/multi-combobox#virtual), [Listbox](/components/listbox#virtual), [CommandPalette](/components/command-palette#virtual), [Tree](/components/tree#virtual), [TreeSelect](/components/tree-select#virtual), [DataList](/components/data-list#virtual), [DataTable](/components/data-table#virtual) provide optional `virtualize` support with the same scrolling foundation and their own selection, search and keyboard behavior. They do not need an additional VirtualList wrapper.
