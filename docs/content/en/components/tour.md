---
title: Tour
description: A step-by-step guide that highlights parts of the page.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/tour/Tour.vue
---

<Demo name="tour/hero" />

## Usage {#usage}

```ts
import { Tour } from '@hina-ui/vue'
```

`steps` lists the steps. Each step points at an element on the page with `target` and gives a `title` and a `description`. While open, a mask covers the page and leaves only the target visible, with the card next to it and an arrow pointing at it; when `target` is empty or no element matches, the card sits in the centre of the viewport. `open` and `step` both support two-way binding, and `step` starts at 1.

`target` can be a CSS selector, an element, a function returning a target, a `{ x, y, width, height }` rectangle such as a `DOMRect`, a virtual element with `getBoundingClientRect()`, or an array of these; an array highlights the box around all of them. It is read when the step becomes active, so it can point at elements rendered after the tour opens. Rectangles use viewport coordinates; elements and virtual elements are followed when the page scrolls or they resize.

## Examples {#examples}

### Blocking the target and validation {#interactive}

The highlighted target can be clicked and typed into by default, and focus moves between the card and the target. `blockTarget` blocks the target, either for the whole tour or for a single step. `beforeChange` runs before every step change and keeps the current step when it returns `false`; when it returns a Promise, the card waits for it and the Next button shows a loading indicator.

<Demo name="tour/interactive" />

### Beacon {#beacon}

`beacon` makes the tour start with a pulsing dot on the top end corner of the first target and opens the card and the mask only when it is clicked; after that, Next and Back move between cards directly. `beacon: true` on a step also stops on the beacon when navigation reaches that step, and `beacon: false` hides the beacon when the step is where the tour starts. Steps without a target never show a beacon.

<Demo name="tour/beacon" />

### Custom content {#custom}

The `content` slot replaces the description and the `footer` slot replaces the progress and the buttons; both receive the current step together with `next`, `prev` and `skip`. `locked` hides the close button, and Escape no longer skips the tour.

<Demo name="tour/custom" />

### Without a mask {#plain}

`:mask="false"` removes the mask. The page stays usable during the tour and the card is no longer a modal dialog. `mask="dim"` keeps the mask but only darkens the page, without the blur.

<Demo name="tour/plain" />

### Scripted steps {#play}

A step's `play` runs when the step becomes active and can be async. It demonstrates the real interface: opening panels, moving the highlight and driving a virtual pointer. It receives a context with:

- `signal`, aborted when the step is left or the tour closes.
- `defer(cleanup)`, which registers a cleanup. Leaving the step, closing the tour or replaying first aborts `signal`, then runs the cleanups in reverse order.
- `spotlight(target?, options?)`, which moves the highlight to another target within the step, with the card following it. Without `target` it returns to the step's target; `null` closes the highlight and centres the card. `options` takes `padding`, `radius` and `wait`. The Promise settles once the highlight comes to rest.
- `pointer`, the virtual pointer described below.
- `waitFor(target, timeout?)`, which waits for a target to appear and resolves whether it did, waiting 5000ms at most by default.
- `sleep(ms)`, which waits.

Once `signal` is aborted, `sleep`, `spotlight`, `waitFor` and the pointer methods reject with an `AbortError`, which stops the script; the tour ignores that error.

A step with `play` shows a Replay button at the bottom of the card. It does the same as `replay()`: runs the cleanups, moves the highlight back to the step's target and runs the script again.

`blockPage` makes the whole page, including the highlight, ignore clicks and input during the step while the card stays usable. It can be set on the tour or on a single step.

<Demo name="tour/play" />

### Virtual pointer {#pointer}

`pointer` draws a pointer above the tour that never catches clicks. It only shows actions and dispatches no events; the script performs the real action itself, for example by changing state or calling `click()`.

| Method                             | Description                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `move(target, duration?)`          | Moves to the centre of a target or to `{ x, y }`, 600ms by default; a hidden pointer fades in from just below and to the right |
| `tap()`                            | Presses and releases with a ripple                                                                                             |
| `press(duration?)`                 | Long press, 800ms by default, with a growing circle                                                                            |
| `drag(target, duration?, onMove?)` | Holds and drags to a target, 800ms by default; `onMove` receives the pointer position every frame to dispatch real events from |
| `key(key, duration?)`              | Shows a key, 700ms by default, next to the pointer when it is visible and at the bottom of the viewport otherwise              |
| `hide()`                           | Hides the pointer                                                                                                              |

Moves and drags read their end point again every frame, so the pointer keeps up with a moving target. A method rejects with an error when its target does not exist; wait for a target that appears after the interface updates with `waitFor()` first.

The pointer follows `(pointer: coarse)` by default: a mouse arrow for fine pointers and a fingertip dot for touch screens. The `pointer` prop can fix it to `'mouse'` or `'touch'`. With reduced motion, moves and drags jump to the end and `onMove` receives only the end position. The pointer hides when the step is left.

### Waiting for a target {#wait}

`wait` is the longest time in milliseconds to wait for the target to appear. When the target does not exist yet as the step becomes active, for example until the script opens a panel, the card hides and the highlight stays where the previous step left it; once the target appears, the card shows up at its new place. If it still does not exist after the wait, the card is centred.

### With modal overlays {#overlays}

The tour sits above Dialog, Drawer, Sheet, menus and other overlays, at `--hn-z-overlay` plus 1. A modal overlay opened by a script treats the tour as its own: clicking the card or the mask does not close it, the card stays visible to screen readers and focus stays on the card. Other layers you draw yourself get the same treatment through [OverlayBranch](/components/overlay-branch).

## Behavior {#behavior}

::: vue

- Opening moves focus to the card; closing returns it to where it was before the tour opened.
- With a mask the card is modal: the rest of the page is hidden from screen readers and Tab cycles inside the card; the target joins the cycle unless `blockTarget` blocks it.
- Left and right arrows move to the previous and next step, swapped in RTL. Escape skips the tour and emits `skip` and `close`. The keys work anywhere while the tour is open, without focus on the card; arrows in text fields are left alone. In a step without `play` or `blockPage`, an overlay opened from the target handles the keys first. Clicking the mask does not close the tour.
- The button of the last step reads Done; clicking it emits `finish` and closes the tour.
- When a step becomes active, a target outside the viewport is scrolled to the centre; `scroll: false` turns this off. The mask and the card follow the target when it moves, resizes or the page scrolls.
- Between steps the card hides, the highlight springs to the new target and, once it rests, the card appears at its new place. When `spotlight()` moves the highlight within a step, the card follows it.
- The highlight opens from the centre of its target and closes in place onto the centre of its target before a step without a target, taking 300ms each.
- When the card does not fit on its side of the target it flips to the other side, and when it still does not fit it shifts into the viewport, over the target if needed.
- Page scrolling stays enabled, and the tour renders nothing on the server.

:::

::: react

- Opening moves focus to the card; closing returns it to where it was before the tour opened.
- With a mask the card is modal: the rest of the page is hidden from screen readers and Tab cycles inside the card; the target joins the cycle unless `blockTarget` blocks it.
- Left and right arrows move to the previous and next step, swapped in RTL. Escape skips the tour and calls `onSkip` and `onClose`. The keys work anywhere while the tour is open, without focus on the card; arrows in text fields are left alone. In a step without `play` or `blockPage`, an overlay opened from the target handles the keys first. Clicking the mask does not close the tour.
- The button of the last step reads Done; clicking it calls `onFinish` and closes the tour.
- When a step becomes active, a target outside the viewport is scrolled to the centre; `scroll: false` turns this off. The mask and the card follow the target when it moves, resizes or the page scrolls.
- Between steps the card hides, the highlight springs to the new target and, once it rests, the card appears at its new place. When `spotlight()` moves the highlight within a step, the card follows it.
- The highlight opens from the centre of its target and closes in place onto the centre of its target before a step without a target, taking 300ms each.
- When the card does not fit on its side of the target it flips to the other side, and when it still does not fit it shifts into the viewport, over the target if needed.
- Page scrolling stays enabled, and the tour renders nothing on the server.

:::

## Accessibility {#a11y}

- The card is `role="dialog"`, with `aria-modal` when a mask is shown. Its name comes from the step title and the description is linked through `aria-describedby`.
- The card carries `aria-busy` while `beforeChange` is pending.
- The beacon is a button whose name contains the step number and title.
- The virtual pointer and the key hint are hidden from screen readers.
- Button texts, the progress and the beacon name come from the current locale and can be replaced.

## API {#api}

### Props {#props}

| Prop           | Type                           | Default        | Description                                                           |
| -------------- | ------------------------------ | -------------- | --------------------------------------------------------------------- |
| `steps`        | `TourStep[]`                   | required       | The steps                                                             |
| `v-model:open` | `boolean`                      | `false`        | Whether the tour is open                                              |
| `v-model:step` | `number`                       | `1`            | The current step, starting at 1                                       |
| `mask`         | `boolean \| 'dim'`             | `true`         | Shows the mask and makes the card modal; `'dim'` darkens without blur |
| `locked`       | `boolean`                      | `false`        | Hides the close button; Escape does not skip                          |
| `beacon`       | `boolean`                      | `false`        | Starts the tour from a beacon                                         |
| `blockTarget`  | `boolean`                      | `false`        | Blocks the target of every step                                       |
| `blockPage`    | `boolean`                      | `false`        | Makes the page except the card ignore clicks and input                |
| `pointer`      | `'auto' \| 'mouse' \| 'touch'` | `'auto'`       | Look of the virtual pointer                                           |
| `beforeChange` | `TourBeforeChange`             | —              | Runs before a step change; `false` keeps the step                     |
| `nextText`     | `string`                       | current locale | Text of the Next button                                               |
| `prevText`     | `string`                       | current locale | Text of the Back button                                               |
| `finishText`   | `string`                       | current locale | Text of the button on the last step                                   |
| `skipText`     | `string`                       | current locale | Name of the close button                                              |
| `replayText`   | `string`                       | current locale | Name of the Replay button                                             |
| `dir`          | `'ltr' \| 'rtl'`               | inherited      | Reading direction                                                     |
| `class`        | `string`                       | —              | Classes added to the card                                             |

`TourBeforeChange` is `(step: number, previousStep: number) => boolean | void | Promise<boolean | void>`.

### TourStep {#step}

| Field         | Type                                                  | Default    | Description                                                         |
| ------------- | ----------------------------------------------------- | ---------- | ------------------------------------------------------------------- |
| `target`      | `TourTarget`                                          | —          | The highlighted target, see [Usage](#usage); empty centres the card |
| `title`       | `string`                                              | —          | Title                                                               |
| `description` | `string`                                              | —          | Description                                                         |
| `side`        | `'top' \| 'right' \| 'bottom' \| 'left'`              | `'bottom'` | Side of the target the card sits on                                 |
| `align`       | `'start' \| 'center' \| 'end'`                        | `'center'` | Alignment of the card against the target                            |
| `padding`     | `number`                                              | `8`        | Space around the target in the highlight, px                        |
| `radius`      | `number`                                              | `8`        | Corner radius of the highlight, px                                  |
| `scroll`      | `boolean`                                             | `true`     | Scrolls a target outside the viewport into view                     |
| `blockTarget` | `boolean`                                             | inherited  | Blocks the target of this step                                      |
| `blockPage`   | `boolean`                                             | inherited  | Blocks the whole page during this step                              |
| `wait`        | `number`                                              | `0`        | Longest wait for the target, ms                                     |
| `play`        | `(context: TourPlayContext) => void \| Promise<void>` | —          | Script run when the step becomes active                             |
| `beacon`      | `boolean`                                             | —          | See [Beacon](#beacon)                                               |

### Slots {#slots}

| Slot      | Props           | Description                           |
| --------- | --------------- | ------------------------------------- |
| `content` | `TourSlotProps` | Replaces the description              |
| `footer`  | `TourSlotProps` | Replaces the progress and the buttons |

`TourSlotProps` is `{ step, current, total, busy, playing, next, prev, skip, replay }`; `playing` is true while the script runs.

### Events {#events}

| Event         | Payload                   | Description                                                                                                     |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `update:open` | `open: boolean`           | Opens or closes the tour                                                                                        |
| `update:step` | `step: number`            | Changes the step                                                                                                |
| `finish`      | —                         | Done was clicked on the last step                                                                               |
| `skip`        | —                         | The close button or Escape was used                                                                             |
| `stepEnter`   | `step: number`            | A step became active, before its script starts                                                                  |
| `stepLeave`   | `step: number`            | A step was left, after its cleanups ran                                                                         |
| `close`       | `reason: TourCloseReason` | The tour closed; the reason is `'finish'`, `'skip'`, `'escape'` or `'close'` (`close()` or closed from outside) |

### Expose {#expose}

::: vue

`next()`, `prev()`, `goTo(step)`, `close()` and `replay()` are available through a template ref. The first three go through `beforeChange`; `close()` closes the tour without emitting `finish` or `skip`; `replay()` runs the current step's script again.

:::

::: react

`next()`, `prev()`, `goTo(step)`, `close()` and `replay()` are available through a ref. The first three go through `beforeChange`; `close()` closes the tour without calling `onFinish` or `onSkip`; `replay()` runs the current step's script again.

:::
