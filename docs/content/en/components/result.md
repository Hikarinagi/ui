---
title: Result
description: The outcome of an operation, as success, error, warning or info.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/result/Result.vue
---

<Demo name="result/hero" />

## Usage {#usage}

```ts
import { Result } from '@hina-ui/vue'
```

`status` sets the icon and colour, `title` states the outcome and `description` adds the consequence or the next step. The layout is the same as [Empty](/components/empty): icon, text and actions stack in the centre, and the component fills the width of its container.

<Demo name="result/basic" />

## Examples {#examples}

### Status {#status}

Four statuses: `success`, `error`, `warning` and `info`, with `info` as the default.

<Demo name="result/status" />

### Actions {#actions}

The `actions` slot holds what to do next, usually one primary button and perhaps a secondary one.

<Demo name="result/actions" />

### Extra content {#extra}

Content in the default slot shows under the text, for details such as an order number or an error report.

<Demo name="result/extra" />

### Custom icon {#icon}

The `icon` slot replaces the status icon with another icon or an illustration.

<Demo name="result/icon" />

### Sizes {#sizes}

Three sizes change the icon, text and padding together; `lg` is for a whole result page.

<Demo name="result/sizes" />

## Accessibility {#a11y}

- The icon is decorative and hidden from assistive technology; the status is conveyed by the title and description.
- The root element carries `data-status` with the same value as `status`.

## API {#api}

### Props {#props}

| Prop          | Type                                          | Default  | Description                       |
| ------------- | --------------------------------------------- | -------- | --------------------------------- |
| `status`      | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Status of the outcome             |
| `title`       | `string`                                      | —        | Title                             |
| `description` | `string`                                      | —        | Text under the title              |
| `size`        | `'sm' \| 'md' \| 'lg'`                        | `'md'`   | Size                              |
| `class`       | `string`                                      | —        | Extra classes on the root element |

### Slots {#slots}

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
| default   | Extra content under the text                      |
| `icon`    | An icon or illustration replacing the status icon |
| `actions` | Actions at the bottom                             |
