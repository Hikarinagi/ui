---
title: Toggle
description: A two-state button that stays pressed.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/toggle/Toggle.vue
  - label: Toggle
    href: https://reka-ui.com/docs/components/toggle
---

<Demo name="toggle/hero" />

## Usage {#usage}

```ts
import { Toggle } from '@hina-ui/vue'
```

A toggle is a button that can stay pressed, for actions that can be switched on or off at any time such as bold, favorite or a filter. `v-model` binds whether it is pressed, the default slot is the text and `#icon` takes a leading icon. It borrows the `ghost` and `outline` looks of `Button`; when pressed, text and ink turn to the accent color. Attributes it does not declare land on the button.

<Demo name="toggle/basic" />

It differs from `Switch` by occasion: a switch stands for a setting, always carries a text and sits on its own row; a toggle is an action, often icon-only, lined up in a toolbar. Compared with a selectable `Chip`, a chip is an inline item, pill-shaped and smaller.

## Examples {#examples}

### Icon only {#icon}

Passing `label` makes it icon-only: the button becomes square, `label` is its accessible name, and inside a `TooltipProvider` it also shows as a tooltip. `#pressed-icon` supplies the icon for the pressed state; the two icons cross-fade.

<Demo name="toggle/icon" />

### Toolbar {#toolbar}

Icon toggles in a row each hold their own boolean and do not affect each other. When exactly one must be selected, use `SegmentedControl`.

<Demo name="toggle/toolbar" />

### Variants {#variants}

`ghost` is the default; `outline` adds a hairline border and suits a toggle standing alone in content.

<Demo name="toggle/variants" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`, matching `Button` step by step.

<Demo name="toggle/sizes" />

### States {#states}

`disabled` disables the button and keeps its pressed state.

<Demo name="toggle/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the error message is rendered by the field and linked to the button; validation rules and submission belong to the [Form](/components/form). The toggle carries its own text, so the field needs no label; when its value decides whether another field is required, the rule goes on the object and names the field the error lands on.

<Demo name="toggle/form" />

## Behavior {#behavior}

- Click, Space or Enter switches between pressed and released.
- The pressed state is expressed by accent ink and text color; hover and press ink stack on top.
- With `#pressed-icon`, the two icons cross-fade instead of cutting.

## Accessibility {#a11y}

- The root is a button with `aria-pressed`; screen readers announce it as a toggle button and its state.
- Icon-only toggles must provide `label`; text toggles are named by their text.

## API {#api}

### Props {#props}

| Prop         | Type                                     | Default   | Description                                 |
| ------------ | ---------------------------------------- | --------- | ------------------------------------------- |
| `modelValue` | `boolean`                                | `false`   | Whether it is pressed                       |
| `label`      | `string`                                 | —         | Name of an icon-only toggle; makes it so    |
| `tooltip`    | `boolean`                                | `true`    | Whether an icon-only toggle shows a tooltip |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`   | Tooltip placement                           |
| `variant`    | `'ghost' \| 'outline'`                   | `'ghost'` | Variant                                     |
| `size`       | `'sm' \| 'md' \| 'lg'`                   | `'md'`    | Size                                        |
| `pill`       | `boolean`                                | `false`   | Whether it is pill-shaped                   |
| `disabled`   | `boolean`                                | `false`   | Whether it is disabled                      |
| `ripple`     | `boolean`                                | `true`    | Whether to show the press ripple            |
| `class`      | `string`                                 | —         | Classes appended to the button element      |

### Slots {#slots}

| Slot           | Payload                | Description                |
| -------------- | ---------------------- | -------------------------- |
| `default`      | —                      | Text                       |
| `icon`         | `{ pressed: boolean }` | Leading icon               |
| `pressed-icon` | —                      | Leading icon while pressed |

### Events {#events}

| Event               | Payload          | Description               |
| ------------------- | ---------------- | ------------------------- |
| `update:modelValue` | `value: boolean` | The pressed state changed |
