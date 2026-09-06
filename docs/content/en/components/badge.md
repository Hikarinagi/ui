---
title: Badge
description: Pins an unread count or short marker to the corner of its host.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/badge/Badge.vue
---

<Demo name="badge/hero" />

## Usage {#usage}

```ts
import { Badge } from '@hina-ui/vue'
```

The host element goes in the default slot and `content` is pinned to its corner. The component only positions and renders the badge; the host itself is untouched.

<Demo name="badge/basic" />

## Examples {#examples}

### Maximum {#max}

When `content` is a number greater than `max`, it is shown as the limit followed by a plus sign. The default limit is 99.

<Demo name="badge/max" />

### Tones {#tones}

Defaults to `danger`. Use `danger` for unread and pending items, `accent` or `neutral` for ordinary counts, and the remaining three by their meaning.

<Demo name="badge/tones" />

### Sizes {#sizes}

Both sizes use the same font size; they differ in the height and minimum width of the badge. Use `md` for larger hosts or textual content.

<Demo name="badge/sizes" />

### Placement {#placement}

`placement` selects the corner, with four values. The default is the top end corner.

<Demo name="badge/placement" />

### Round hosts {#circle}

Set `shape="circle"` for a round host. The anchor point moves inward so the badge sits against the arc rather than the corner of the bounding box.

<Demo name="badge/circle" />

### Custom content {#content}

The `content` slot replaces what the badge shows, for example an icon.

Whether the badge renders is still decided by the `content` property, so it must be set to a non-empty value when the slot is used. Provide an accessible name through `label` in that case.

<Demo name="badge/content" />

With `bare` set the badge draws no background or padding and only positions and outlines its content, which decides the size. Put an `Indicator` in the slot to show a status dot on the corner of an avatar.

<Demo name="indicator/badge" />

### Outline {#outline}

`outline` is on by default and draws a ring in the page background colour, cutting the badge out of the host's edge. Turn it off over darker hosts.

<Demo name="badge/outline" />

### Appearing and disappearing {#visibility}

The badge does not render when `content` is 0, an empty string or unset. Both appearing and disappearing scale and fade.

<Demo name="badge/visibility" />

## Accessibility {#a11y}

- A bare number lacks context, so use `label` to spell it out, for example “3 unread”. That text is read by screen readers only and is not shown on screen.
- The component does not change the semantics of its host. A button host is still a button.

## API {#api}

### Props {#props}

| Prop        | Type                                                                    | Default     | Description                               |
| ----------- | ----------------------------------------------------------------------- | ----------- | ----------------------------------------- |
| `content`   | `string \| number \| null`                                              | —           | Badge content; nothing renders when empty |
| `max`       | `number`                                                                | `99`        | Upper limit for numeric content           |
| `tone`      | `'danger' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'info'` | `'danger'`  | Semantic tone                             |
| `size`      | `'sm' \| 'md'`                                                          | `'sm'`      | Size                                      |
| `placement` | `'top-end' \| 'top-start' \| 'bottom-end' \| 'bottom-start'`            | `'top-end'` | Which corner to pin to                    |
| `shape`     | `'rect' \| 'circle'`                                                    | `'rect'`    | Shape of the host                         |
| `outline`   | `boolean`                                                               | `true`      | Draw a ring in the page background colour |
| `bare`      | `boolean`                                                               | `false`     | Only position, without a background       |
| `label`     | `string`                                                                | —           | Full wording for screen readers           |
| `class`     | `string`                                                                | —           | Classes appended to the wrapper           |

### Slots {#slots}

| Slot      | Description                |
| --------- | -------------------------- |
| `default` | The host element           |
| `content` | Replaces the badge content |
