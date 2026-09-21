---
title: Affix
description: Keep toolbars, actions and section headings at the edge of a scrolling region.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/affix/Affix.vue
---

<Demo name="affix/hero" />

## Usage {#usage}

```ts
import { Affix } from '@hina-ui/vue'
```

Wrap the content that should stick. It follows the top of its nearest scrolling region by default; `offset` sets the distance from that edge in pixels.

```vue
<Affix :offset="16">
  <Card>Toolbar or actions</Card>
</Affix>
```

Affix uses native `position: sticky`, preserving layout space, width and DOM identity. It adds no card styling, background, scroll container or movement, scaling or fading animation. Slot content owns its appearance.

## Examples {#examples}

### Offset and disabled state {#offset}

The first example lets you adjust the offset, disable affixing and complete checklist items. `disabled` restores ordinary flow without losing internal state. Use `#default="{ affixed }"` or `@change` to detect whether the content is at the chosen edge, for example to add a toolbar shadow.

```vue
<Affix v-slot="{ affixed }" :offset="16" :disabled="disabled">
  <Card :class="affixed ? 'shadow-md' : 'shadow-none'">Actions</Card>
</Affix>
```

Prefer changing colors or shadows on state changes. Changing height or margins can repeatedly move the threshold.

### Bottom actions {#bottom}

Put the action bar at its natural position and set `position="bottom"`. While that position is below the visible region, the bar stays at the bottom. It rejoins the content when its natural position comes into view, and remains bounded by its parent region.

<Demo name="affix/bottom" />

### Parent boundaries {#boundary}

Each Affix is constrained by its parent layout region. These headings stick only within their own groups, then leave with the group instead of covering later content.

<Demo name="affix/boundary" />

## Scroll containers and layout {#layout}

- The nearest ancestor with a scrolling mechanism is used automatically; otherwise the page viewport is used. Place Affix inside ScrollArea without reading its `viewport` or passing a `target`.
- The parent needs room for sticky movement. A wrapper only as tall as Affix leaves no travel distance. In a horizontal Flex, use `self-start` on a sidebar Affix to retain its natural height instead of stretching it to the full column.
- `overflow: auto / scroll / hidden` establishes a new sticky reference. When clipping should not establish a scroll container, use `overflow: clip` where appropriate. A non-scrolling `overflow: hidden` ancestor prevents page-level sticking.
- Width, clipping, direction and stacking remain part of the original layout. The default stack level is `z-10`, adjustable through `class`. Use FloatButton for an action that should always be fixed in a viewport corner.

```vue
<ScrollArea class="h-96">
  <Stack>
    <Affix :offset="12"><Card>Filters and batch actions</Card></Affix>
    <DataList :items="items" :get-key="item => item.id">
      <template #default="{ item }">{{ item.title }}</template>
    </DataList>
  </Stack>
</ScrollArea>
```

## SSR and performance {#rendering}

CSS owns positioning, so SSR and the client use the same layout without a measured switch to fixed positioning. Content remains readable and sticky before JavaScript runs.

The `affixed` slot value is `false` on the server and synchronizes after mount. Scroll and resize measurements only detect edge state, are batched within a frame, and emit only on changes. They never write positioning or placeholder dimensions on every frame. The state returns to `false` when the parent boundary pushes the element away from the chosen edge.

## API {#api}

### Props {#props}

| Prop       | Type                | Default | Description                                                   |
| ---------- | ------------------- | ------- | ------------------------------------------------------------- |
| `as`       | `string`            | `'div'` | Root tag                                                      |
| `position` | `'top' \| 'bottom'` | `'top'` | Sticky edge                                                   |
| `offset`   | `number`            | `0`     | Offset in pixels; negative values are supported               |
| `disabled` | `boolean`           | `false` | Restore normal flow                                           |
| `class`    | `string`            | —       | Root styling; native attributes and style also reach the root |

### Slots {#slots}

| Slot      | Props                  | Description                                  |
| --------- | ---------------------- | -------------------------------------------- |
| `default` | `{ affixed: boolean }` | Whether content is at the chosen sticky edge |

### Events {#events}

| Event    | Payload            | Description                     |
| -------- | ------------------ | ------------------------------- |
| `change` | `affixed: boolean` | Emitted when edge state changes |

### Expose {#expose}

| Name      | Type                       | Description                                                           |
| --------- | -------------------------- | --------------------------------------------------------------------- |
| `element` | `HTMLElement \| undefined` | Root element                                                          |
| `affixed` | `boolean`                  | Current edge state                                                    |
| `update`  | `() => void`               | Recheck state next frame; normal scrolling and resizing are automatic |

The root exposes `data-position`, `data-affixed` and `data-disabled` for custom styling.
