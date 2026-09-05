---
title: TagsInput
description: Enters several values as removable tags.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tags-input/TagsInput.vue
  - label: TagsInput
    href: https://reka-ui.com/docs/components/tags-input
---

<Demo name="tags-input/hero" />

## Usage {#usage}

```ts
import { TagsInput } from '@hina-ui/vue'
```

A tags input keeps several values in one field, each shown as a removable tag. `v-model` binds an array of strings. Typing text and pressing Enter, or typing the delimiter, turns the text into a tag; when the tags no longer fit on one line the field grows downward. Attributes it does not declare land on the inner text input, so name it with `aria-label` or `aria-labelledby`.

<Demo name="tags-input/basic" />

It differs from `MultiSelect` in where the values come from: a multi select picks from given options, a tags input accepts any text.

## Examples {#examples}

### Limit and duplicates {#max}

`max` caps the number of tags and `duplicate` decides whether repeated values are allowed. Rejected input fires `invalid` with the text.

<Demo name="tags-input/max" />

### Delimiter and paste {#delimiter}

`delimiter` defaults to a comma and accepts another character or a regular expression. `addOnPaste` is on by default and splits pasted text by the delimiter; `addOnBlur` also turns leftover text into a tag when the input loses focus.

<Demo name="tags-input/delimiter" />

### Clearable {#clearable}

`clearable` shows a clear button at the end that removes every tag at once and fires `clear`.

<Demo name="tags-input/clearable" />

### Sizes {#sizes}

`size` has three steps, `sm`, `md` and `lg`. With no tags the height equals an input of the same step.

<Demo name="tags-input/sizes" />

### States {#states}

`invalid` gives the field a warning color, `disabled` disables the group and its tags cannot be removed. `variant="secondary"` is the flat form used inside a surface.

<Demo name="tags-input/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label points at the input, and the description and error message are rendered by the field; validation rules and submission belong to the [Form](/components/form). The value is an array of strings, so count limits go on the array and length limits on the items.

<Demo name="tags-input/form" />

## Behavior {#behavior}

- Enter or the delimiter turns the current text into a tag and clears the input.
- With an empty input, Backspace removes the last tag.
- Clicking a tag or the blank area of the field focuses the input.
- Every tag ends with a remove button.
- Values beyond `max` or duplicates are not added and fire `invalid`.

## Accessibility {#a11y}

- Name the text input with `aria-label` or `aria-labelledby`; undeclared attributes land on it.
- Every tag's remove button carries a name from the locale.
- `invalid` also sets `aria-invalid` on the text input.

## API {#api}

### Props {#props}

| Prop          | Type                       | Default     | Description                                 |
| ------------- | -------------------------- | ----------- | ------------------------------------------- |
| `modelValue`  | `string[]`                 | `[]`        | The tags                                    |
| `placeholder` | `string`                   | —           | Placeholder of the text input               |
| `max`         | `number`                   | `0`         | Maximum number of tags, `0` for no limit    |
| `duplicate`   | `boolean`                  | `false`     | Whether repeated tags are allowed           |
| `delimiter`   | `string \| RegExp`         | `','`       | Delimiter                                   |
| `addOnPaste`  | `boolean`                  | `true`      | Whether pasted text is split into tags      |
| `addOnBlur`   | `boolean`                  | `false`     | Whether leftover text becomes a tag on blur |
| `clearable`   | `boolean`                  | `false`     | Whether to show the clear button            |
| `name`        | `string`                   | —           | Form field name                             |
| `variant`     | `'primary' \| 'secondary'` | `'primary'` | Variant                                     |
| `size`        | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                        |
| `disabled`    | `boolean`                  | `false`     | Whether the group is disabled               |
| `invalid`     | `boolean`                  | `false`     | Whether the group failed validation         |
| `class`       | `string`                   | —           | Classes appended to the root element        |

### Events {#events}

| Event               | Payload           | Description                       |
| ------------------- | ----------------- | --------------------------------- |
| `update:modelValue` | `value: string[]` | The tags changed                  |
| `invalid`           | `value: string`   | Input was rejected                |
| `clear`             | —                 | The clear button emptied the tags |
