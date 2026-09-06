---
title: Collapsible
description: A region a single trigger opens and closes.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/collapsible/Collapsible.vue
  - label: Collapsible
    href: https://reka-ui.com/docs/components/collapsible
---

<Demo name="collapsible/hero" />

## Usage {#usage}

```ts
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@hina-ui/vue'
```

Three parts: `Collapsible` holds the open state, `CollapsibleTrigger` is the control that toggles it, and `CollapsibleContent` is the region being folded away.

The trigger is a complete control on its own and **brings an indicator that turns with the state**. Write the label and nothing else — no button to compose, no transition to handle.

<Demo name="collapsible/basic" />

Its appearance is fixed at one unobtrusive step, since open and closed are the only two things it has to say. Where the label belongs in the text — a "read the rest" inside a paragraph — swap the skin through `as-child`, below.

Use it when a single region folds away. For several regions in one group that open one at a time, use `Accordion`.

## Examples {#examples}

### Controlled {#controlled}

`v-model:open` hands the state to the surrounding page, so other controls can drive the same region. When no outside control is needed, `default-open` sets the initial state.

<Demo name="collapsible/controlled" />

### Disabled {#disabled}

With `disabled` the trigger stops responding and the content keeps its current state.

<Demo name="collapsible/disabled" />

### Another glyph, or your own trigger {#custom}

The `icon` slot swaps the indicator's glyph while the component keeps owning the rotation. Setting `icon` to `false` hides the indicator entirely.

`as-child` lends the behaviour to the sole child, which puts both the appearance and the indicator in your hands. Every change of skin — a text link, an outline, a full-width row with an icon slot — goes this way; drop in a `DisclosureIcon` and it still finds the state. The example at the top of this page is exactly that, with `variant="link"`.

The component forwards no appearance props: a disclosure toggle only has to express open and closed, and taking on a button's full range of looks would grow this API into a second Button. Changing the skin means bringing the whole trigger.

<Demo name="collapsible/custom" />

## Behaviour {#behavior}

- The content's height animates as it opens and closes, both directions on the same step.
- While closed the content leaves the accessibility tree, so the keyboard never lands inside it.

## API {#api}

### Collapsible {#props}

| Prop          | Type      | Default | Description                              |
| ------------- | --------- | ------- | ---------------------------------------- |
| `open`        | `boolean` | —       | Whether it is open, takes `v-model:open` |
| `defaultOpen` | `boolean` | `false` | Whether it starts open                   |
| `disabled`    | `boolean` | `false` | Whether it can be operated               |
| `class`       | `string`  | —       | Classes appended to the root             |

| Event         | Payload         | Description       |
| ------------- | --------------- | ----------------- |
| `update:open` | `open: boolean` | The state changed |

### CollapsibleTrigger {#trigger}

| Prop      | Type      | Default | Description                                              |
| --------- | --------- | ------- | -------------------------------------------------------- |
| `icon`    | `boolean` | `true`  | Whether the indicator is shown                           |
| `asChild` | `boolean` | `false` | Skip the built-in button and lend behaviour to the child |
| `class`   | `string`  | —       | Classes appended to the trigger                          |

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | The trigger's label            |
| `icon`    | Replaces the indicator's glyph |

### CollapsibleContent {#content}

| Prop    | Type     | Default | Description                     |
| ------- | -------- | ------- | ------------------------------- |
| `class` | `string` | —       | Classes appended to the content |
