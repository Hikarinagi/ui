---
title: Switch
description: Toggles between on and off.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/switch/Switch.vue
  - label: Switch
    href: https://reka-ui.com/docs/components/switch
---

<Demo name="switch/hero" />

## Usage {#usage}

```ts
import { Switch } from '@hina-ui/vue'
```

A switch stands for a setting that takes effect immediately, unlike a checkbox that waits for a submit. `v-model` binds a boolean, the default slot is the label, and clicking either the label or the track toggles. Attributes it does not declare land on the inner track element.

<Demo name="switch/basic" />

## Examples {#examples}

### Description {#description}

`description` adds a line of supporting text under the label, one size smaller.

<Demo name="switch/description" />

### Settings rows {#settings}

Use `control-placement="end"` to place the control after the text and `block` to fill the available width. The description stays below the label. `start` and `end` follow the text direction.

<Demo name="switch/settings" />

### Sizes {#sizes}

`size` is `sm`, `md` or `lg`; the track is 20, 24 or 28 pixels tall and the text follows.

<Demo name="switch/sizes" />

### States {#states}

`invalid` gives the track a danger-coloured border; `disabled` disables the whole control.

<Demo name="switch/states" />

### Track only {#bare}

Without a label only the track renders, and it must then be named with `aria-label`.

<Demo name="switch/bare" />

### In a form {#form}

Inside a [FormField](/components/form-field) the error message is rendered by the field and linked to the switch; validation rules and submission belong to the [Form](/components/form). The switch carries its own text, so the field needs no label, and its value often decides whether another field is required; such a rule goes on the object and names the field the error lands on.

<Demo name="switch/form" />

## Behaviour {#behavior}

- Clicking the label or the track toggles: the thumb slides across and the track changes colour. Tab lands on the track and Space toggles.
- Hovering anywhere on the control inks the track, pressing deepens it.

## Accessibility {#a11y}

- The track is a button with `role="switch"` and `aria-checked`. The root is a `label`, so the text is the accessible name.
- Without a label, name the track with `aria-label` or `aria-labelledby`.
- `invalid` also sets `aria-invalid`.

## API {#api}

### Props {#props}

| Prop               | Type                   | Default   | Description                                  |
| ------------------ | ---------------------- | --------- | -------------------------------------------- |
| `modelValue`       | `boolean`              | `false`   | Whether the switch is on                     |
| `size`             | `'sm' \| 'md' \| 'lg'` | `'md'`    | Size                                         |
| `description`      | `string`               | —         | Supporting text under the label              |
| `controlPlacement` | `'start' \| 'end'`     | `'start'` | Position of the control relative to its text |
| `block`            | `boolean`              | `false`   | Fill the available row width                 |
| `disabled`         | `boolean`              | `false`   | Whether the control is disabled              |
| `invalid`          | `boolean`              | `false`   | Whether the control failed validation        |
| `class`            | `string`               | —         | Classes appended to the root element         |

### Slots {#slots}

| Slot      | Payload | Description |
| --------- | ------- | ----------- |
| `default` | —       | The label   |

### Events {#events}

| Event               | Payload          | Description       |
| ------------------- | ---------------- | ----------------- |
| `update:modelValue` | `value: boolean` | The value changed |
