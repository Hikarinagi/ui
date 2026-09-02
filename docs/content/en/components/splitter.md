---
title: Splitter
description: Panes whose proportions are adjusted by dragging a divider.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/splitter/Splitter.vue
  - label: Reka UI
    href: https://reka-ui.com/docs/components/splitter
---

<Demo name="splitter/hero" />

## Usage {#usage}

```ts
import { Splitter, SplitterHandle, SplitterPanel } from '@hina-ui/vue'
```

`Splitter` is the container, `SplitterPanel` is a pane and `SplitterHandle` is the draggable divider between panes. Panes and dividers alternate: one divider sits between every two panes.

The container needs a definite size. A horizontal splitter needs a height; a vertical one needs both height and width. Sizes are given to `Splitter` through `class`. Without a height the panes collapse to nothing and the splitter looks as though it never rendered.

<Demo name="splitter/basic" />

Pane sizes are always percentages between 0 and 100. Pixel values are not accepted.

## Examples {#examples}

### Direction {#direction}

`direction` sets the axis, defaulting to `horizontal` for side-by-side panes; `vertical` stacks them. The divider's orientation, its drag axis and the arrow keys that move it all follow, with nothing else to configure.

<Demo name="splitter/direction" />

### Size constraints {#sizes}

`defaultSize` is a pane's initial share; `minSize` and `maxSize` bound how far it can be dragged. All three are percentages. Panes without a `defaultSize` share the remaining space evenly.

Constraints keep a pane from being dragged to an unusable width — a contents pane too narrow to read the entries, for instance.

Within one group, either give every pane a `defaultSize` or give none of them one. The even share is worked out in the browser; on the server the container size is unknown, so an unsized pane falls back to an equal-share baseline. If a neighbouring pane does carry a `defaultSize`, the server-rendered first paint is visibly out of proportion and only snaps to the right ratio once the browser takes over. With no sizes at all the panes come out even, and server and browser agree.

<Demo name="splitter/sizes" />

### Collapsible {#collapsible}

`collapsible` lets a pane be dragged to `collapsedSize` and stay there instead of springing back to `minSize`. `collapsedSize` defaults to `0`, which collapses the pane entirely.

This is not the same as `minSize`: `minSize` is the floor during a drag, while `collapsible` snaps to the collapsed state once that floor is crossed.

<Demo name="splitter/collapsible" />

### Nesting {#nested}

A pane can hold another `Splitter`, usually running along the opposite axis, which gives layouts such as contents plus editor plus preview. Give the inner container `h-full` so it fills the pane it sits in.

<Demo name="splitter/nested" />

### Remembering sizes {#persist}

`autoSaveId` stores the current proportions in browser storage and restores them on the next visit. Several splitters on one page need distinct ids, otherwise they overwrite one another.

Once shipped, an id should not change: changing it discards the proportions people have saved and falls back to the defaults.

<Demo name="splitter/persist" />

### Divider name {#label}

The divider carries an accessible name in the interface language. When a page holds several dividers and the default name cannot tell them apart, name each one with `label`.

<Demo name="splitter/label" />

## Accessibility {#a11y}

- The divider is focusable and shows a focus ring; arrow keys adjust the proportions by a fixed step, equivalent to dragging.
- The divider's role and current proportion come from the underlying primitive, so screen readers announce its name along with the current percentage.
- The default accessible name follows the interface language (“Resize panel” in English) and `label` overrides it. Name each divider when several are present.
- The divider is not decoration. Do not remove it from the focus order with `aria-hidden` or a negative `tabindex`; that leaves keyboard users unable to adjust the panes.

## API {#api}

### Splitter {#props}

| Prop         | Type                         | Default        | Description                          |
| ------------ | ---------------------------- | -------------- | ------------------------------------ |
| `direction`  | `'horizontal' \| 'vertical'` | `'horizontal'` | Axis the panes are laid out along    |
| `autoSaveId` | `string`                     | —              | Id under which proportions are saved |
| `class`      | `string`                     | —              | Classes appended to the root         |

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | Alternating panes and dividers |

### SplitterPanel {#panel}

| Prop            | Type      | Default | Description                                 |
| --------------- | --------- | ------- | ------------------------------------------- |
| `defaultSize`   | `number`  | —       | Initial share, as a percentage              |
| `minSize`       | `number`  | —       | Lower bound while dragging, as a percentage |
| `maxSize`       | `number`  | `100`   | Upper bound while dragging, as a percentage |
| `collapsible`   | `boolean` | `false` | Whether it snaps shut past the lower bound  |
| `collapsedSize` | `number`  | `0`     | Share when collapsed, as a percentage       |
| `class`         | `string`  | —       | Classes appended to the root                |

| Slot      | Description  |
| --------- | ------------ |
| `default` | Pane content |

### SplitterHandle {#handle}

| Prop    | Type     | Default            | Description                    |
| ------- | -------- | ------------------ | ------------------------------ |
| `label` | `string` | Interface language | Accessible name of the divider |
| `class` | `string` | —                  | Classes appended to the root   |
