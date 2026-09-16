---
title: Timeline
description: An ordered sequence of events with connected markers.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/timeline/Timeline.vue
---

<Demo name="timeline/hero" />

## Usage {#usage}

```ts
import { Timeline, type TimelineItem } from '@hina-ui/vue'
```

`items` defines the event order. Each item can provide a `title`, `description` and `time`. Connectors extend with content height and end at the last marker. Provide stable `id` values when items update or reorder.

<Demo name="timeline/basic" />

## Examples {#examples}

### Marker colors {#tones}

`tone` sets the default marker color. An item's `tone` overrides it. Colors do not imply completion or selection; express status in text as well.

<Demo name="timeline/tones" />

### Alignment {#alignment}

`align="start"` places the axis at the start with content after it. `end` places the axis at the end with content before it. `alternate` centers the axis and alternates the content between both sides. Both sides have equal width in the vertical alternate layout.

<Demo name="timeline/alignment" />

### Opposite time {#opposite}

`time-position="opposite"` moves time labels to the other side of the axis, with equal-width sides in the vertical layout. `#opposite` replaces that region; providing it reserves space on the opposite side.

`time` is displayed as supplied. `dateTime` adds a machine-readable value and makes the default time label a `time` element. For localized formatting, place [Time](/components/time) in `#time`.

<Demo name="timeline/opposite" />

### Horizontal {#horizontal}

`orientation="horizontal"` arranges markers horizontally. `start` places content below the axis, `end` above it, and `alternate` alternates above and below. Content of different lengths shares the same horizontal axis.

Items divide the available width equally. For more items, set a minimum width and wrap the timeline in [ScrollArea](/components/scroll-area). The component does not automatically change direction or clip content.

<Demo name="timeline/horizontal" />

### Sizes {#sizes}

`size` controls typography and spacing between events. Spacing follows density tokens; `md` is the default.

<Demo name="timeline/sizes" />

### Custom markers and content {#custom}

`#marker` replaces the node with [Avatar](/components/avatar), [Spinner](/components/spinner) or an icon. `#content` replaces the entire content region, including the default time, title and description. Use `#time`, `#title` or `#description` to replace an individual part.

Every slot receives `{ item, index }`. `item` retains custom field types and `index` is its position in the displayed order. This example composes [Card](/components/card) and [Tag](/components/tag) in the content and shows a spinner on a pending item.

<Demo name="timeline/custom" />

### Reverse order {#reverse}

`reverse` reverses the rendered order without mutating the input array. The final connector, slot indexes and alternating positions follow the displayed order.

<Demo name="timeline/reverse" />

### RTL {#rtl}

Direction is inherited from an ancestor's `dir`, or set directly with `dir="rtl"`. Vertical start/end positions and horizontal item order follow it.

<Demo name="timeline/rtl" />

## Accessibility {#a11y}

- The root is an ordered list. Items are read in DOM order; use `aria-label` to name the list.
- Markers and connectors are decorative and hidden from assistive technology. Keep marker slots non-interactive; put links and buttons in content or opposite slots for normal keyboard access.
- No extra tab stops or implicit selected, completed or current-step semantics are added.
- There is no built-in animation. Custom loading indicators follow their own reduced-motion settings.

## API {#api}

### Props {#props}

| Prop           | Type                              | Default      | Description                                   |
| -------------- | --------------------------------- | ------------ | --------------------------------------------- |
| `items`        | `T[]`                             | Required     | Ordered items, where `T extends TimelineItem` |
| `orientation`  | `'vertical' \| 'horizontal'`      | `'vertical'` | Layout direction                              |
| `align`        | `'start' \| 'end' \| 'alternate'` | `'start'`    | Position of the axis relative to content      |
| `size`         | `'sm' \| 'md' \| 'lg'`            | `'md'`       | Typography and event spacing                  |
| `tone`         | `TimelineTone`                    | `'accent'`   | Default marker color                          |
| `timePosition` | `'content' \| 'opposite'`         | `'content'`  | Default time label position                   |
| `reverse`      | `boolean`                         | `false`      | Reverse the displayed order                   |
| `class`        | `string`                          | —            | Root element classes                          |

Native attributes such as `dir`, `aria-label` and `style` are forwarded to the root.

### TimelineItem {#item}

| Field         | Type               | Description                                                            |
| ------------- | ------------------ | ---------------------------------------------------------------------- |
| `id`          | `string \| number` | Stable identity; falls back to the displayed index                     |
| `title`       | `string`           | Title                                                                  |
| `description` | `string`           | Description                                                            |
| `time`        | `string`           | Time text displayed without formatting                                 |
| `dateTime`    | `string`           | The time element's `datetime` attribute; does not format or sort items |
| `tone`        | `TimelineTone`     | Marker color override                                                  |

`TimelineTone`: `'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'`. All item fields are optional; slots can supply the full presentation.

### Slots {#slots}

| Slot          | Props                        | Description                                         |
| ------------- | ---------------------------- | --------------------------------------------------- |
| `marker`      | `{ item: T, index: number }` | Decorative marker; a hollow dot by default          |
| `content`     | `{ item: T, index: number }` | Entire content region                               |
| `title`       | `{ item: T, index: number }` | Title                                               |
| `description` | `{ item: T, index: number }` | Description                                         |
| `time`        | `{ item: T, index: number }` | Time label, positioned by `timePosition`            |
| `opposite`    | `{ item: T, index: number }` | Opposite region, overriding the opposite time label |

Also exports `TimelineItem`, `TimelineSlotProps<T>`, `TimelineTone`, `TimelineSize`, `TimelineOrientation` and `TimelineAlign` types.
