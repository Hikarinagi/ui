---
title: FormLayout
description: Groups fields into a grid with a title and description.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/form-layout/FormLayout.vue
---

<Demo name="form-layout/hero" />

## Usage {#usage}

```ts
import { FormLayout } from '@hina-ui/vue'
```

The form layout puts a set of related fields into a `fieldset`: `legend` names the group, `description` explains it, and `columns` sets how many columns the fields take, collapsing to one on narrow screens. It usually sits inside a [Form](/components/form) to split a long form into parts, and works on its own as well.

<Demo name="form-layout/basic" />

## Examples {#examples}

### Columns {#columns}

`columns` takes 1 to 4; give a field that should fill a row a spanning class such as `sm:col-span-2`.

<Demo name="form-layout/columns" />

### Sections {#sections}

Several layouts in one form, each with its own title and description, separated by the form's spacing.

<Demo name="form-layout/sections" />

### Disabling a group {#disabled}

`disabled` disables every field in the group; when the whole form is disabled, every group follows.

<Demo name="form-layout/disabled" />

## Behavior {#behavior}

- The grid splits into `columns` from the `sm` breakpoint up and stays a single column below it; four columns first fold to two between `sm` and `lg`.
- Fields in the group still read their errors from the form through `name`; the layout does not change the relation between fields and the form.
- `disabled` is written on the `fieldset` and passed to the fields in the group.

## Accessibility {#a11y}

- The root is a `fieldset` and the title a `legend`, so assistive technology reads the group name before each field.
- The description is linked to the `fieldset` through `aria-describedby`.

## API {#api}

### Props {#props}

| Prop          | Type               | Default | Description                          |
| ------------- | ------------------ | ------- | ------------------------------------ |
| `legend`      | `string`           | —       | Title of the group                   |
| `description` | `string`           | —       | Description text                     |
| `columns`     | `1 \| 2 \| 3 \| 4` | `1`     | Number of grid columns               |
| `disabled`    | `boolean`          | `false` | Whether the whole group is disabled  |
| `class`       | `string`           | —       | Classes appended to the root element |

### Slots {#slots}

| Slot          | Description         |
| ------------- | ------------------- |
| default       | The fields          |
| `legend`      | Title content       |
| `description` | Description content |
