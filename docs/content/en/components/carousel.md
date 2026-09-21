---
title: Carousel
description: Browse related content by dragging, using the keyboard or choosing a position.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/carousel/Carousel.vue
---

<Demo name="carousel/hero" />

## Usage {#usage}

```ts
import { Carousel } from '@hina-ui/vue'
```

Provide `items`, a stable `getKey`, and the content of each slide. There is no imposed card or image design.

```vue
<Carousel v-model:index="index" :items="works" :get-key="work => work.id" indicators>
  <template #default="{ item }">
    <Image :src="item.cover" :alt="item.title" :ratio="16 / 9" :draggable="false" />
  </template>
</Carousel>
```

`index` counts **snap positions**, not necessarily items. With one full-width slide per view they match; grouped or partially visible cards may produce fewer snaps. `snapCount` and navigation controls always refer to the measured snap list. `visibleItems` contains item indices.

## Examples {#examples}

### Variable-width cards and dynamic grouping {#grouped}

Portrait, square and landscape covers keep their original proportions. Each card derives its width from its image ratio, while `item-class="basis-auto"` lets the slide follow that content width. Wide images are capped at the viewport width in narrow containers.

`slides-to-scroll="auto"` groups slides using the measured container and individual card widths, rather than a fixed number of cards per group. Drag the slider to resize the container continuously: snap counts and navigation update automatically, without calling `refresh()` or observing widths in application code. Changes to individual card dimensions also trigger measurement.

The `controls` slot replaces the whole default control row. It receives current state and navigation methods; the slide slot receives the original item, index, visibility and readiness. Switching direction also updates drag and keyboard behavior.

<Demo name="carousel/grouped" />

### Custom indicators {#indicators}

The default picker emphasizes the current position with a capsule. Hit targets keep a fixed size, so changing selection does not shift neighboring controls. Transitions use Hina motion tokens and respect reduced motion.

- `#indicator="{ index, active, snapCount }"` replaces each item's appearance with a thumbnail, number or graphic. Carousel retains the button, selection action, keyboard focus and accessible name. Do not nest links or buttons inside it.
- `#indicators` replaces the entire picker while preserving the previous and next buttons. It receives all `CarouselControls` state and methods plus `viewportId` for `aria-controls`, supporting progress bars, counters and custom navigation.
- Either slot enables the indicator region without the `indicators` prop. `#controls` still replaces the whole navigation row and takes precedence over both slots.

Switch between the default, thumbnails and progress without resetting the carousel. This example has one item per snap, so each thumbnail can use `index` to look up its item. For grouped layouts, `index` still refers to a snap, not an item.

<Demo name="carousel/indicators" />

### Vertical content {#vertical}

A vertical viewport needs a definite height. Here two items share a 288px viewport. Card sizing remains CSS-driven; changing orientation does not change content order.

<Demo name="carousel/vertical" />

### Optional automatic rotation {#autoplay}

Automatic rotation is off by default. When enabled, a visible start/pause control appears before slide content in the tab order.

- Hover, leaving the page viewport, or a hidden browser tab temporarily pauses rotation.
- Focus entering the carousel, dragging, and manual navigation stop rotation. It resumes only after an explicit start.
- Reduced motion prevents automatic startup. Users can still start rotation explicitly; slide changes are then immediate.
- A finite carousel stops at the end. Starting it again returns to the beginning; `loop` enables continuous rotation when enough slides are available.

<Demo name="carousel/autoplay" />

### Initial position and SSR {#initial-index}

With the default full-width slides and one slide per step, SSR renders all picker dots, the selected dot and navigation state. CSS percentages establish the initial position including gutters, with RTL, vertical and looping support. The requested slide is visible without first displaying the beginning of the track. CSS determines slide sizes; use Image's `ratio` to reserve image space.

This example starts at index `2`. Server HTML already displays the third slide, five dots and the third dot selected. Hydration preserves those nodes and takes over interaction. The default layout does not need a `pending` slot.

<Demo name="carousel/initial-index" />

`itemClass` can change slide dimensions; the component does not parse class names to infer geometry. Custom slide layouts and multi-item steps use client measurements for snap positioning. Put purely visual card styles inside the default slot to retain the default layout's SSR positioning. When a custom layout needs a measurement placeholder, `#pending` remains available; match its dimensions to the content. It does not represent network loading: an empty array renders `#empty`, while fetching is managed by the parent.

## Behavior and customization {#behavior}

- The default slot supports images, links, forms and arbitrary composed content. Card height is content-driven; no forced aspect ratio or automatic height transition is added.
- `align="center"` centers snaps. Edge containment can override this alignment to avoid blank space; use `:contain-scroll="false"` when intentional space at either end is part of the design.
- `drag-free` allows the track to rest between snaps. The model still identifies the nearest selected snap.
- Pointer dragging uses the slide track. On image content, set `:draggable="false"` to avoid the browser's native image drag.
- The viewport accepts direction-aware arrow keys and Home / End. Nested inputs, links and buttons retain their own keyboard behavior. Navigation buttons keep focus when changing slides.
- Offscreen items become inert after measuring visibility. Slide labels and the live position announcement are localized. Automatic rotation does not announce every change.
- `data-ready` and `data-orientation` are on the root; slide wrappers expose `data-visible`. Class overrides are merged after defaults.
- Gesture motion follows Hina's motion scale and reduced-motion preference. Autoplay intervals are independent of animation timing.

## API {#api}

### Props {#props}

| Prop             | Type                                                          | Default                | Description                                                  |
| ---------------- | ------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------ |
| `items`          | `readonly T[]`                                                | —                      | Slide data with stable keys                                  |
| `getKey`         | `(item: T, index: number) => string \| number`                | —                      | Required unique key resolver                                 |
| `v-model:index`  | `number`                                                      | 0                      | Zero-based snap position                                     |
| `label`          | `string`                                                      | 本地化文案 / localized | Accessible name of the carousel region                       |
| `dir`            | `'ltr' \| 'rtl'`                                              | 继承 / inherited       | Layout and keyboard direction                                |
| `orientation`    | `'horizontal' \| 'vertical'`                                  | 'horizontal'           | Vertical layouts require a viewport height                   |
| `align`          | `'start' \| 'center' \| 'end'`                                | 'start'                | Slide alignment within the viewport                          |
| `containScroll`  | `false \| 'trimSnaps' \| 'keepSnaps'`                         | 'trimSnaps'            | Remove empty edge space; trimSnaps merges duplicate snaps    |
| `slidesToScroll` | `number \| 'auto'`                                            | 1                      | Items per step; auto groups by viewport size                 |
| `loop`           | `boolean`                                                     | false                  | Loop when content permits; otherwise use finite scrolling    |
| `draggable`      | `boolean`                                                     | true                   | Mouse and touch dragging                                     |
| `dragFree`       | `boolean`                                                     | false                  | Free scrolling after a drag instead of snapping              |
| `autoplay`       | `boolean \| number`                                           | false                  | true uses 5000ms; a number sets the interval, minimum 1000ms |
| `arrows`         | `boolean`                                                     | true                   | Default previous and next controls                           |
| `indicators`     | `boolean`                                                     | false                  | Show a picker dot for each snap                              |
| `gap`            | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`              | 'md'                   | Hina spacing scale                                           |
| `class`          | `string`                                                      | —                      | Root classes                                                 |
| `viewportClass`  | `string`                                                      | —                      | Viewport classes, including vertical height                  |
| `itemClass`      | `string \| ((item: T, index: number) => string \| undefined)` | —                      | Slide classes, including per-item sizes                      |

### Slots {#slots}

| Slot         | Parameters               | Purpose                                                                               |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------- |
| `default`    | `CarouselItemSlot<T>`    | `{ item, index, isVisible, ready }`                                                   |
| `controls`   | `CarouselControls`       | Replace the navigation row                                                            |
| `indicators` | `CarouselIndicatorsSlot` | Replace the picker, retaining arrow controls; `CarouselControls` plus `viewportId`    |
| `indicator`  | `CarouselIndicatorSlot`  | Item appearance: `{ index, active, snapCount }`; interaction stays with the component |
| `pending`    | —                        | Initial measurement placeholder                                                       |
| `empty`      | —                        | Empty data                                                                            |

### Events and exposed controls {#events}

`ready` fires when the engine first initializes with nonempty measurable content; `select` fires when the selected snap changes. Both carry `CarouselState`:

```ts
interface CarouselState {
  index: number
  snapCount: number
  canPrev: boolean
  canNext: boolean
  visibleItems: readonly number[]
  ready: boolean
  playing: boolean
}
```

The exposed `state` and the `controls` slot update reactively. A select event can precede motion settling; use live `visibleItems` for the currently visible content.

`CarouselControls` adds `prev()`, `next()`, `scrollTo(index, instant?)`, `play()` and `pause()`. The component ref exposes the same methods, `state`, `element`, `viewport` and `refresh()`. Normal size changes are observed automatically; use `refresh()` to request a new measurement after an unusual external layout change.

The public types are exported from the package root. Engine instances and engine-specific options are not part of the public API.
