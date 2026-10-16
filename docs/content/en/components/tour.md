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

`target` can be a CSS selector, an element or a function returning an element. It is read when the step becomes active, so it can point at elements rendered after the tour opens.

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

`:mask="false"` removes the mask. The page stays usable during the tour and the card is no longer a modal dialog.

<Demo name="tour/plain" />

## Behavior {#behavior}

::: vue

- Opening moves focus to the card; closing returns it to where it was before the tour opened.
- With a mask the card is modal: the rest of the page is hidden from screen readers and Tab cycles inside the card; the target joins the cycle unless `blockTarget` blocks it.
- Left and right arrows move to the previous and next step, swapped in RTL. Escape skips the tour and emits `skip`. Clicking the mask does not close the tour.
- The button of the last step reads Done; clicking it emits `finish` and closes the tour.
- When a step becomes active, a target outside the viewport is scrolled to the centre; `scroll: false` turns this off. The mask and the card follow the target when it moves, resizes or the page scrolls.
- The highlight opens from the centre of its target, slides to the next target between steps and closes in place before a step without a target.
- Page scrolling stays enabled, and the tour renders nothing on the server.

:::

::: react

- Opening moves focus to the card; closing returns it to where it was before the tour opened.
- With a mask the card is modal: the rest of the page is hidden from screen readers and Tab cycles inside the card; the target joins the cycle unless `blockTarget` blocks it.
- Left and right arrows move to the previous and next step, swapped in RTL. Escape skips the tour and calls `onSkip`. Clicking the mask does not close the tour.
- The button of the last step reads Done; clicking it calls `onFinish` and closes the tour.
- When a step becomes active, a target outside the viewport is scrolled to the centre; `scroll: false` turns this off. The mask and the card follow the target when it moves, resizes or the page scrolls.
- The highlight opens from the centre of its target, slides to the next target between steps and closes in place before a step without a target.
- Page scrolling stays enabled, and the tour renders nothing on the server.

:::

## Accessibility {#a11y}

- The card is `role="dialog"`, with `aria-modal` when a mask is shown. Its name comes from the step title and the description is linked through `aria-describedby`.
- The card carries `aria-busy` while `beforeChange` is pending.
- The beacon is a button whose name contains the step number and title.
- Button texts, the progress and the beacon name come from the current locale and can be replaced.

## API {#api}

### Props {#props}

| Prop           | Type               | Default        | Description                                       |
| -------------- | ------------------ | -------------- | ------------------------------------------------- |
| `steps`        | `TourStep[]`       | required       | The steps                                         |
| `v-model:open` | `boolean`          | `false`        | Whether the tour is open                          |
| `v-model:step` | `number`           | `1`            | The current step, starting at 1                   |
| `mask`         | `boolean`          | `true`         | Shows the mask and makes the card modal           |
| `locked`       | `boolean`          | `false`        | Hides the close button; Escape does not skip      |
| `beacon`       | `boolean`          | `false`        | Starts the tour from a beacon                     |
| `blockTarget`  | `boolean`          | `false`        | Blocks the target of every step                   |
| `beforeChange` | `TourBeforeChange` | —              | Runs before a step change; `false` keeps the step |
| `nextText`     | `string`           | current locale | Text of the Next button                           |
| `prevText`     | `string`           | current locale | Text of the Back button                           |
| `finishText`   | `string`           | current locale | Text of the button on the last step               |
| `skipText`     | `string`           | current locale | Name of the close button                          |
| `dir`          | `'ltr' \| 'rtl'`   | inherited      | Reading direction                                 |
| `class`        | `string`           | —              | Classes added to the card                         |

`TourBeforeChange` is `(step: number, previousStep: number) => boolean | void | Promise<boolean | void>`.

### TourStep {#step}

| Field         | Type                                                           | Default    | Description                                     |
| ------------- | -------------------------------------------------------------- | ---------- | ----------------------------------------------- |
| `target`      | `string \| HTMLElement \| (() => HTMLElement \| null) \| null` | —          | The highlighted element; empty centres the card |
| `title`       | `string`                                                       | —          | Title                                           |
| `description` | `string`                                                       | —          | Description                                     |
| `side`        | `'top' \| 'right' \| 'bottom' \| 'left'`                       | `'bottom'` | Side of the target the card sits on             |
| `align`       | `'start' \| 'center' \| 'end'`                                 | `'center'` | Alignment of the card against the target        |
| `padding`     | `number`                                                       | `8`        | Space around the target in the highlight, px    |
| `radius`      | `number`                                                       | `8`        | Corner radius of the highlight, px              |
| `scroll`      | `boolean`                                                      | `true`     | Scrolls a target outside the viewport into view |
| `blockTarget` | `boolean`                                                      | inherited  | Blocks the target of this step                  |
| `beacon`      | `boolean`                                                      | —          | See [Beacon](#beacon)                           |

### Slots {#slots}

| Slot      | Props           | Description                           |
| --------- | --------------- | ------------------------------------- |
| `content` | `TourSlotProps` | Replaces the description              |
| `footer`  | `TourSlotProps` | Replaces the progress and the buttons |

`TourSlotProps` is `{ step, current, total, busy, next, prev, skip }`.

### Events {#events}

| Event         | Payload         | Description                         |
| ------------- | --------------- | ----------------------------------- |
| `update:open` | `open: boolean` | Opens or closes the tour            |
| `update:step` | `step: number`  | Changes the step                    |
| `finish`      | —               | Done was clicked on the last step   |
| `skip`        | —               | The close button or Escape was used |

### Expose {#expose}

::: vue

`next()`, `prev()`, `goTo(step)` and `close()` are available through a template ref. The first three go through `beforeChange`; `close()` closes the tour without emitting `finish` or `skip`.

:::

::: react

`next()`, `prev()`, `goTo(step)` and `close()` are available through a ref. The first three go through `beforeChange`; `close()` closes the tour without calling `onFinish` or `onSkip`.

:::
