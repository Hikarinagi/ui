---
title: Rating
description: Rates with stars or shows a score.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/rating/Rating.vue
  - label: Rating
    href: https://reka-ui.com/docs/components/rating
---

<Demo name="rating/hero" />

## Usage {#usage}

```ts
import { Rating } from '@hina-ui/vue'
```

A rating is a row of stars: clicking a star picks that score, and hovering previews the stars up to it as filled. `v-model` binds a number and `max` sets the number of stars, five by default. Attributes it does not declare land on the group element that wraps the stars, so name it with `aria-label` or `aria-labelledby`.

<Demo name="rating/basic" />

## Examples {#examples}

### Half stars {#half}

With `step` set to `0.5` every star splits into two halves, so scores such as 2.5 can be picked.

<Demo name="rating/half" />

### Read-only display {#readonly}

`readonly` renders the rating as a display-only graphic; the value may be any decimal and the stars fill proportionally, which suits average scores.

<Demo name="rating/readonly" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`.

<Demo name="rating/sizes" />

### States {#states}

`disabled` disables the group; `clearable` is on by default, so clicking the picked star again resets to zero, and turning it off keeps the score.

<Demo name="rating/states" />

## Behavior {#behavior}

- Clicking a star picks that score, and clicking the same star again resets to zero; hovering previews the stars up to the pointer as filled and leaving restores them.
- With focus on a star, the left and right arrow keys move focus and pick, as in a radio group.
- Color changes of the stars are transitioned.

## Accessibility {#a11y}

- When interactive the group is `role="radiogroup"` and every star or half star is a `role="radio"` with a localized name.
- When read only the group is `role="img"` named by the locale as "n out of m stars".
- Name the group with `aria-label` or `aria-labelledby`.

## API {#api}

### Props {#props}

| Prop         | Type                   | Default | Description                                   |
| ------------ | ---------------------- | ------- | --------------------------------------------- |
| `modelValue` | `number`               | `0`     | The score                                     |
| `max`        | `number`               | `5`     | Number of stars                               |
| `step`       | `1 \| 0.5`             | `1`     | Step, `0.5` allows half stars                 |
| `clearable`  | `boolean`              | `true`  | Whether clicking the picked star again resets |
| `readonly`   | `boolean`              | `false` | Whether the rating is display only            |
| `name`       | `string`               | —       | Form field name                               |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size                                          |
| `disabled`   | `boolean`              | `false` | Whether the rating is disabled                |
| `class`      | `string`               | —       | Classes appended to the root element          |

### Events {#events}

| Event               | Payload         | Description       |
| ------------------- | --------------- | ----------------- |
| `update:modelValue` | `value: number` | The score changed |
