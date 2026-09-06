---
title: Panel
description: A card with a standard title bar, with places for a title, a count and actions.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/panel/Panel.vue
---

<Demo name="panel/hero" />

## Usage {#usage}

```ts
import { Panel } from '@hina-ui/vue'
```

A panel is a [Card](/components/card) with a standard title bar: `title` is the title, `description` a line under it, `count` a number next to the title, the `icon` slot an icon before the title, the `actions` slot the actions at the end of the title row, and the default slot the body. Panels on the same page therefore all look alike, with no title row to hand-write each time.

<Demo name="panel/basic" />

## Examples {#examples}

### Actions {#actions}

The `actions` slot usually holds one or two small buttons, or a link.

<Demo name="panel/actions" />

### Icon and count {#count}

The icon from the `icon` slot shows before the title and `count` after it; both add information to the title without changing its level.

<Demo name="panel/count" />

### Description {#description}

`description` shows under the title and says in a sentence what this block is.

<Demo name="panel/description" />

### Body without padding {#unpadded}

With `padded` set to `false` the body has no padding, so lists and tables that carry their own row spacing can reach the edge of the card.

<Demo name="panel/unpadded" />

### Heading level {#level}

`level` decides whether the title renders as `h2`, `h3` or `h4`, `h2` by default; a page has a single `h1`, so panel titles start at level two and step down one level when nested in another block.

<Demo name="panel/level" />

## Accessibility {#a11y}

- The title is a real heading element whose level comes from `level`, so assistive technology can jump between headings.
- The icon is decorative and hidden from assistive technology; the count is rendered as text.

## API {#api}

### Props {#props}

| Prop          | Type          | Default | Description                  |
| ------------- | ------------- | ------- | ---------------------------- |
| `title`       | `string`      | —       | Required. The title          |
| `description` | `string`      | —       | Line under the title         |
| `count`       | `number`      | —       | Count next to the title      |
| `level`       | `2 \| 3 \| 4` | `2`     | Heading level of the title   |
| `padded`      | `boolean`     | `true`  | Whether the body has padding |
| `class`       | `string`      | —       | Classes appended to the card |

### Slots {#slots}

| Slot          | Description                         |
| ------------- | ----------------------------------- |
| default       | The body                            |
| `icon`        | Icon before the title               |
| `title`       | Title content                       |
| `description` | Description content                 |
| `actions`     | Actions at the end of the title row |
