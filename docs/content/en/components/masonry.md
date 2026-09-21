---
title: Masonry
description: Arrange covers, images and cards at their natural heights.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/masonry/Masonry.vue
---

<Demo name="masonry/hero" />

## Usage {#usage}

```ts
import { Masonry } from '@hina-ui/vue'
```

Provide data, a stable `get-key`, and an item slot. Items fill the shortest column by default. The number of columns follows the **container width**.

```vue
<Masonry :items="photos" :get-key="photo => photo.id" :min-column-width="200" label="Photos">
  <template #default="{ item }">
    <Image :src="item.src" :alt="item.title" :ratio="item.width / item.height" />
  </template>
</Masonry>
```

Masonry owns layout, without adding card styling, click actions or an internal scroll container. Compose entries with Card, Image or your own content. Place the component inside ScrollArea for local scrolling. Prefer Grid, DataList or DataTable for aligned rows and direct comparisons.

## Examples {#examples}

### Initial layout placeholder {#pending}

For SSR, provide `#pending` to cover initial positioning with a skeleton or another placeholder. SSR and the first client render show the same placeholder. Real items remain mounted and measurable at their actual width, but are invisible, inert and excluded from the Tab sequence. They become visible after their first layout is positioned.

CSR uses the same behavior. **This is a component-managed slot, not a separate `pending` prop.** Pass `loading` while fetching the first batch. Before content is available, `#pending` is shown; once a layout exists, subsequent requests use the trailing `#loading` slot and keep the cards visible. Clearing and fetching again starts a new initial load.

<Demo name="masonry/pending" />

The skeleton uses CSS columns with varied card heights and Masonry spacing tokens. It needs no JavaScript measurement, so the SSR first paint already shows a staggered placeholder without another Grid-to-masonry transition.

`#pending` waits for the first layout, not image downloads, font loading or arbitrary asynchronous slot work. Reserve known image dimensions with `ratio`. The placeholder and final list can still have different total heights; use a similarly sized placeholder or an outer minimum height when page movement matters.

Without `#pending`, SSR keeps the visible Grid fallback. With it, client initialization is required to reveal the items. There is no need to author separate SSR and CSR templates.

### Columns and direction {#responsive}

`min-column-width` sets the preferred minimum column width in px. A narrower container uses one column that fits its width. Explicit `columns` fixes the column count and ignores the minimum width; automatic columns are usually better on small screens.

Direction is inherited or set with `dir`. Column positions use logical coordinates.

<Demo name="masonry/responsive" />

### Expanding content {#dynamic}

Images, wrapped text and Collapsible height changes update the layout automatically. Stable DOM nodes preserve each item's internal component state.

<Demo name="masonry/dynamic" />

### Placement order {#order}

By default, the next entry fills the shortest column for a compact layout. `sequential` cycles through columns 1, 2, 3 and so on, preserving horizontal order within each cycle at the cost of less balanced column heights.

Both modes retain **data order in the DOM and Tab sequence**. Items are not regrouped into separate column containers. Visual positions still have different heights; prefer a regular list when a strict reading sequence is important.

<Demo name="masonry/order" />

### Loading and empty states {#loading}

`loading` preserves existing entries and adds a status at the end. `#empty` appears when there are no entries and loading is false. The caller owns requests, pagination and when to load more. Stable keys preserve existing entries on append without automatic scrolling.

<Demo name="masonry/loading" />

## Rendering and performance {#rendering}

- With `#pending`, SSR and initial layout show a placeholder while real items remain measurable. Items are revealed after positioning. A hidden or zero-width container continues waiting until measurement is possible.
- Without `#pending`, SSR renders a complete responsive Grid and switches to masonry after mount, which can move later items. Without JavaScript, that Grid remains; with `#pending`, the placeholder remains instead. Clients without ResizeObserver dismiss the placeholder and fall back to Grid.
- ResizeObserver caches item heights. Changes in the same frame are batched and only changed geometry is written. There is no continuous polling while idle or scrolling.
- All entries are rendered; this component is not virtualized. Paginate or load large collections in batches. Use VirtualList for virtualized regular lists.
- Reflow does not add movement or scaling animations. Tab order stays stable; surviving focused elements keep focus during reordering without extra scrolling.
- Use `itemClass` for appearance and `gap` for spacing. Do not add item margins or override item position and width. Apply outer padding, borders and backgrounds to the root `class`.

## API {#api}

### Props {#props}

| Prop             | Type                                                          | Default              | Description                                                                     |
| ---------------- | ------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------- |
| `items`          | `readonly T[]`                                                | Required             | Item data                                                                       |
| `getKey`         | `(item: T, index: number) => string \| number`                | Required             | Unique, stable business key; avoid indices for mutable or reordered collections |
| `columns`        | `number`                                                      | —                    | Fixed column count; otherwise based on container width                          |
| `minColumnWidth` | `number`                                                      | `240`                | Minimum width for automatic columns, in px                                      |
| `gap`            | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`              | `'md'`               | Hina spacing; md uses density tokens                                            |
| `sequential`     | `boolean`                                                     | `false`              | Cycle through columns instead of choosing the shortest                          |
| `loading`        | `boolean`                                                     | `false`              | Busy list state and loading status at the end                                   |
| `emptyText`      | `string`                                                      | Localized “No items” | Empty state text                                                                |
| `label`          | `string`                                                      | —                    | Accessible list name                                                            |
| `dir`            | `'ltr' \| 'rtl'`                                              | Inherited            | Layout direction                                                                |
| `class`          | `string`                                                      | —                    | Root styling; native attributes and style also reach the root                   |
| `itemClass`      | `string \| ((item: T, index: number) => string \| undefined)` | —                    | Item wrapper styling                                                            |

### Slots {#slots}

| Slot      | Props                        | Description                                                                |
| --------- | ---------------------------- | -------------------------------------------------------------------------- |
| `default` | `{ item: T, index: number }` | Item content                                                               |
| `empty`   | —                            | Empty state                                                                |
| `pending` | —                            | Initial layout and first-request placeholder with loading status semantics |
| `loading` | —                            | Replace the trailing status; the wrapper keeps `role="status"`             |

### Events {#events}

| Event    | Payload                               | Description                                                                                      |
| -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `layout` | `{ columns: number, height: number }` | First measurement or a change in column count or list height; height excludes the loading status |

### Expose {#expose}

| Name      | Type                       | Description                                                                 |
| --------- | -------------------------- | --------------------------------------------------------------------------- |
| `element` | `HTMLElement \| undefined` | Root element                                                                |
| `measure` | `() => void`               | Remeasure on the next frame; ordinary size or content changes are automatic |

Inherited spacing tokens are tracked with a dedicated size probe, without observing style mutations throughout the application DOM.
