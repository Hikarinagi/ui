---
title: LineClamp
description: Folds long content to a set number of lines, with a button to show the rest.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/line-clamp/LineClamp.vue
---

<Demo name="line-clamp/hero" />

## Usage {#usage}

```ts
import { LineClamp } from '@hina-ui/vue'
```

Put the content in the default slot. Anything past three lines is folded away, the folded edge fades out at the bottom and a "Show all" button appears below; once expanded the button reads "Show less". Content that fits within the line count gets no button.

::: vue

```vue
<LineClamp>{{ synopsis }}</LineClamp>
```

:::

::: react

```tsx
<LineClamp>{synopsis}</LineClamp>
```

:::

The width comes from the container or from `class`. To mask spoilers use [Spoiler](/components/spoiler); to open and close a whole region use [Collapsible](/components/collapsible).

## Examples {#examples}

### Line count {#lines}

`lines` sets how many lines stay visible when folded, 3 by default. Fractions are rounded down and anything below 1 counts as 1.

<Demo name="line-clamp/lines" />

### Block content {#content}

The default slot takes block content such as `Text` paragraphs or `Prose`. Lines are counted across paragraphs, at the line height of the text inside.

<Demo name="line-clamp/content" />

### Controlled {#controlled}

::: vue

`v-model:expanded` binds the expanded state; other controls on the page can expand or fold the same content.

:::

::: react

`expanded` and `onExpandedChange` hand the state to the surrounding page; other controls can expand or fold the same content. When no outside control is needed, `defaultExpanded` sets the initial state. `LineClamp` is itself a client component and renders directly inside a Server Component; a module that passes `onExpandedChange` has to declare `'use client'`.

:::

<Demo name="line-clamp/controlled" />

### Custom labels {#labels}

The button text defaults to `lineClamp.expand` and `lineClamp.collapse` of the UI locale. `expand-label` and `collapse-label` replace it for a single instance.

<Demo name="line-clamp/labels" />

## Behaviour {#behavior}

- The folded height comes from CSS line clamping. The server always outputs the button, and CSS shows the button and the fade according to whether the content overflows, so the first frame is already final and layout and appearance are the same before and after activation.
- Browsers without scroll-driven animations (`animation-timeline`) treat the content as overflowing before activation: the button shows, the fade does not, and the last line ends in an ellipsis; activation then corrects it from the measurement.
- When `expanded` starts as `true`, "Show less" shows before activation; after activation the button is removed if the content does not exceed the line count.
- After activation the component measures again when the container width, the content or `lines` changes, and once more when fonts finish loading. The button shows or hides with the result, including "Show less" in the expanded state.
- Expanding and folding animate the height, and the fade at the bottom fades out and in with it; toggling again mid-transition turns back from the current height. With reduced motion enabled in the system, no transition plays.
- The fade is a mask and does not depend on the background colour; it covers at most 1.5 lines and is shortened in proportion for small line counts. The mask is removed once the expanded state settles.
- After folding through the button, the component scrolls back into view when the transition ends.
- Folding only clips what is shown; the full content stays in the DOM.

## Accessibility {#a11y}

- The button is a native `button`: it takes focus and responds to both Enter and Space.
- `aria-expanded` reflects whether the content is expanded, and `aria-controls` points at the content region.
- The clipped text is not hidden from assistive technology.
- When the content fits within the line count, the button is not shown and is left out of the focus order and the accessibility tree.

## API {#api}

### Props {#props}

::: vue

| Prop            | Type      | Default         | Description                                      |
| --------------- | --------- | --------------- | ------------------------------------------------ |
| `lines`         | `number`  | `3`             | Lines kept when folded; rounded down, at least 1 |
| `expanded`      | `boolean` | `false`         | Whether it is expanded, takes `v-model:expanded` |
| `expandLabel`   | `string`  | From the locale | Text of the button that expands                  |
| `collapseLabel` | `string`  | From the locale | Text of the button that folds                    |
| `class`         | `string`  | —               | Classes appended to the root                     |

Attributes it does not declare land on the root element.

:::

::: react

| Prop              | Type      | Default         | Description                                      |
| ----------------- | --------- | --------------- | ------------------------------------------------ |
| `lines`           | `number`  | `3`             | Lines kept when folded; rounded down, at least 1 |
| `expanded`        | `boolean` | —               | Whether it is expanded; controlled once passed   |
| `defaultExpanded` | `boolean` | `false`         | Initial state when uncontrolled                  |
| `expandLabel`     | `string`  | From the locale | Text of the button that expands                  |
| `collapseLabel`   | `string`  | From the locale | Text of the button that folds                    |
| `className`       | `string`  | —               | Classes appended to the root                     |

Attributes it does not declare land on the root `div`, and `ref` points at that element.

:::

### Slots {#slots}

| Slot      | Description        |
| --------- | ------------------ |
| `default` | The folded content |

### Events {#events}

| Event             | Payload             | Description                |
| ----------------- | ------------------- | -------------------------- |
| `update:expanded` | `expanded: boolean` | The expanded state changed |
