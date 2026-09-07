---
title: Empty
description: A placeholder for an area with nothing in it, saying why it is empty and what to do next.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/empty/Empty.vue
---

<Demo name="empty/hero" />

## Usage {#usage}

```ts
import { Empty } from '@hina-ui/vue'
```

`title` says in one sentence why the area is empty and `description` adds what to do next. Icon, text and actions stack in the centre from top to bottom, and the component fills the width of its container.

<Demo name="empty/basic" />

## Examples {#examples}

### Actions {#actions}

The `actions` slot holds the actions that lead out of the empty state, usually one primary button and perhaps a secondary one.

<Demo name="empty/actions" />

### Icon {#icon}

The default icon is an inbox. Use the `icon` slot for one that fits the situation, such as a crossed-out magnifier for a search without results; set it to `false` to show no icon.

<Demo name="empty/icon" />

### Illustration {#illustration}

The `icon` slot can also hold an image. Slot content gets no round background, and its size is up to the content.

<Demo name="empty/illustration" />

### Sizes {#sizes}

Three sizes change the icon, text and padding together: `sm` for small areas inside cards, `md` by default, `lg` for a whole empty page.

<Demo name="empty/sizes" />

### Inside a panel {#panel}

As the empty state of a list or table, place it directly in the body of a [Panel](/components/panel) or a [Card](/components/card).

<Demo name="empty/panel" />

## Accessibility {#a11y}

- The icon or illustration is decorative and hidden from assistive technology; title and description are plain text.
- Buttons in the actions area keep their own accessible names; nothing extra is needed.

## API {#api}

### Props {#props}

| Prop          | Type                   | Default | Description                       |
| ------------- | ---------------------- | ------- | --------------------------------- |
| `title`       | `string`               | —       | Title                             |
| `description` | `string`               | —       | Text under the title              |
| `icon`        | `boolean`              | `true`  | Whether to show the default icon  |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size                              |
| `class`       | `string`               | —       | Extra classes on the root element |

### Slots {#slots}

| Slot      | Description                                        |
| --------- | -------------------------------------------------- |
| default   | Extra content below the text                       |
| `icon`    | An icon or illustration replacing the default icon |
| `actions` | Actions at the bottom                              |
