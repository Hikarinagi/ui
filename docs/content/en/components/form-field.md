---
title: FormField
description: Pairs a control with its label, description and error.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/form-field/FormField.vue
---

<Demo name="form-field/hero" />

## Usage {#usage}

```ts
import { FormField } from '@hina-ui/vue'
```

A form field lays out one control together with its label, description and error message. Inside a [Form](/components/form) it reads the error of its field through `name`; on its own, `error` sets the message directly. Controls from the library connect automatically once placed in a field: the label points at the control, the description and the error are linked with `aria-describedby`, the control turns invalid while an error is present, and the field's `disabled` is passed down.

<Demo name="form-field/basic" />

## Examples {#examples}

### Horizontal layout {#horizontal}

`orientation="horizontal"` puts the label on the leading side and the control on the trailing side. `label-width` accepts a CSS length or a number of pixels; it defaults to `10rem`. Use [FormLayout](/components/form-layout#aligned) to share a label width across fields. The horizontal layout always keeps two columns.

<Demo name="form-field/horizontal" />

### Description placement {#description-placement}

`description-placement="label"` places the description below the label and before the control in reading order. The default, `control`, places it below the control. Errors always stay in the control area. Both placements support the `description` slot and retain the same accessible association.

<Demo name="form-field/description-placement" />

### Responsive layout {#responsive}

`orientation="responsive"` stacks content while the field is narrower than `32rem`, and uses two columns at `32rem` and above. This follows the field's own available width, including inside a multi-column form, rather than the viewport. Resize the example to see the switch.

<Demo name="form-field/responsive" />

### Description {#description}

`description` shows a line of help under the control; the slot of the same name takes richer content.

<Demo name="form-field/description" />

### Required mark {#required}

`required` shows a mark after the label and gives assistive technology the matching text. The mark is only a hint; whether the field is required is up to the validation rules.

<Demo name="form-field/required" />

### Standalone {#standalone}

Outside a form, `error` decides the message directly, which suits places that run their own validation.

<Demo name="form-field/error" />

### Kinds of controls {#controls}

A single control is linked through the label's `for`; grouped controls such as radio groups, checkbox groups, sliders, ratings and date fields are linked to the label through `aria-labelledby`.

<Demo name="form-field/controls" />

## Behavior {#behavior}

- A field holds one control; an `id` or `aria-describedby` set on the control wins over the values the field generates.
- The error message pushes the content below it aside as it appears and pulls back as it leaves; height and spacing change continuously.
- When the field loses focus it notifies its form, which the `blur` validation timing relies on.

## Accessibility {#a11y}

- The label points at the control through `for`; grouped controls link back to the label through `aria-labelledby`.
- The required mark is hidden from assistive technology, and hidden text says the field is required.
- The error message carries `aria-live="polite"`, so it is announced when it appears.

## API {#api}

### Props {#props}

| Prop                   | Type                                         | Default      | Description                                                        |
| ---------------------- | -------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| `name`                 | `string`                                     | —            | Field name used to read the error from the form                    |
| `label`                | `string`                                     | —            | Label text                                                         |
| `description`          | `string`                                     | —            | Description text                                                   |
| `error`                | `string`                                     | —            | Error text set directly                                            |
| `required`             | `boolean`                                    | `false`      | Whether the required mark shows                                    |
| `orientation`          | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` | Label/control layout; inherits from FormLayout                     |
| `descriptionPlacement` | `'label' \| 'control'`                       | `'control'`  | Description below the label or control; inherits from FormLayout   |
| `labelWidth`           | `string \| number`                           | `'10rem'`    | Label column width: CSS length or pixels; inherits from FormLayout |
| `disabled`             | `boolean`                                    | `false`      | Whether the control is disabled                                    |
| `class`                | `string`                                     | —            | Classes appended to the root element                               |

### Slots {#slots}

| Slot          | Description         |
| ------------- | ------------------- |
| default       | The control         |
| `label`       | Label content       |
| `description` | Description content |
