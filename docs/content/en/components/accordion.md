---
title: Accordion
description: A list of sections that expand and collapse in turn.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/accordion/Accordion.vue
  - label: Variants
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/accordion/accordion.variants.ts
---

<Demo name="accordion/hero" />

## Usage {#usage}

```ts
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@hina-ui/vue'
```

The component has four parts: `Accordion` holds the expanded state, `AccordionItem` is one section, `AccordionTrigger` is that section's heading and toggle, and `AccordionContent` is the collapsed body. Each section is identified by `value`.

By default only one section is open at a time, and opening another closes the current one. The trigger carries its own indicator that rotates with the state.

<Demo name="accordion/basic" />

Use `Collapsible` when only one piece of content needs to fold.

## Examples {#examples}

### Allow closing all {#collapsible}

By default the open section cannot be closed by clicking it again. With `collapsible` set the current section can be closed and the list may end up fully collapsed. `defaultValue` names the section open at first.

<Demo name="accordion/collapsible" />

### Several sections open {#multiple}

With `type` set to `multiple` each section opens and closes on its own, and `v-model` and `defaultValue` take arrays.

<Demo name="accordion/multiple" />

### Controlled {#controlled}

`v-model` hands the expanded state to the outside, so other controls on the page can switch sections too.

<Demo name="accordion/controlled" />

### Disabled {#disabled}

`disabled` on `AccordionItem` disables one section; `disabled` on `Accordion` disables the whole list.

<Demo name="accordion/disabled" />

### Heading level {#level}

The trigger renders inside a heading element, `h3` by default. `level` changes it to fit the page's heading structure.

<Demo name="accordion/level" />

### Changing the indicator {#icon}

The `icon` slot only replaces the indicator glyph, and the rotation stays with the component; `icon` set to `false` removes the indicator.

<Demo name="accordion/icon" />

## Behaviour {#behavior}

- The content height animates when a section opens or closes, with the same transition in both directions.
- Closed content is removed from the accessibility tree, and keyboard focus does not enter it.
- Sections are separated by hairlines. The component has no background or border of its own; put it in a `Card` for a card look.

## Accessibility {#a11y}

- The trigger is a button inside a heading, with `aria-expanded` and `aria-controls`.
- The up and down arrow keys move focus between triggers; `Home` and `End` jump to the first and last.
- The content has the `region` role and screen readers read it as one.

## API {#api}

### Accordion {#props}

| Prop           | Type                     | Default    | Description                                         |
| -------------- | ------------------------ | ---------- | --------------------------------------------------- |
| `type`         | `'single' \| 'multiple'` | `'single'` | Whether one or several sections can be open at once |
| `collapsible`  | `boolean`                | `false`    | Whether all sections may be closed in `single` mode |
| `modelValue`   | `string \| string[]`     | —          | The open sections, supports `v-model`               |
| `defaultValue` | `string \| string[]`     | —          | The sections open at first                          |
| `disabled`     | `boolean`                | `false`    | Whether the whole list is disabled                  |
| `class`        | `string`                 | —          | Classes appended to the root element                |

| Event               | Payload                     | Description               |
| ------------------- | --------------------------- | ------------------------- |
| `update:modelValue` | `value: string \| string[]` | The open sections changed |

### AccordionItem {#item}

| Prop       | Type      | Default | Description                      |
| ---------- | --------- | ------- | -------------------------------- |
| `value`    | `string`  | —       | Identifies the section, required |
| `disabled` | `boolean` | `false` | Whether the section is disabled  |
| `class`    | `string`  | —       | Classes appended to the section  |

### AccordionTrigger {#trigger}

| Prop    | Type                    | Default | Description                     |
| ------- | ----------------------- | ------- | ------------------------------- |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `3`     | Heading level                   |
| `icon`  | `boolean`               | `true`  | Whether to show the indicator   |
| `class` | `string`                | —       | Classes appended to the trigger |

| Slot      | Description                  |
| --------- | ---------------------------- |
| `default` | The trigger's text           |
| `icon`    | Replaces the indicator glyph |

### AccordionContent {#content}

| Prop    | Type     | Default | Description                     |
| ------- | -------- | ------- | ------------------------------- |
| `class` | `string` | —       | Classes appended to the content |
