---
title: Section
description: A titled section of content.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/section/Section.vue
---

<Demo name="section/hero" />

## Usage {#usage}

```ts
import { Section } from '@hina-ui/vue'
```

`Section` groups a run of content together with its heading. `title` renders as a second-level heading, and the children of the section share one spacing rhythm.

It usually sits inside `PageBody`, with a page made of several sections stacked vertically. The gap between sections comes from `PageBody`; the gap within one comes from `Section`.

<Demo name="section/basic" />

## Examples {#examples}

### Without a title {#untitled}

Leave `title` out and no heading is rendered — only the grouping and the internal spacing remain. Use it for content that needs no name but still belongs together.

<Demo name="section/untitled" />

### Anchor targets {#anchor}

Give the section an `id` and it becomes an anchor target for `Anchor`. It carries its own scroll margin, so a heading jumped to does not end up flush against the top of the container.

<Demo name="section/anchor" />

## Behaviour {#behavior}

- Renders as a `section` element whose children stack vertically, 4 units apart.
- The heading is always second level and does not shift with nesting depth.
- Scrolling to the section leaves 6 units of margin above it.

## Accessibility {#a11y}

- A `section` element counts as a landmark only when it has an accessible name, so a section with a `title` is listed as one and a section without is not.
- The heading level is fixed at two; a page's top-level heading should come from `PageHeader`.

## API {#api}

### Props {#props}

| Prop    | Type     | Default | Description                            |
| ------- | -------- | ------- | -------------------------------------- |
| `title` | `string` | —       | Section heading, rendered at level two |
| `id`    | `string` | —       | Element id, used as an anchor target   |
| `class` | `string` | —       | Classes appended to the root           |

### Slots {#slots}

| Slot      | Description            |
| --------- | ---------------------- |
| `default` | Content of the section |
