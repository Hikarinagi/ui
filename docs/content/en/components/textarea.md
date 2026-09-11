---
title: Textarea
description: A multi-line text field.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/textarea/Textarea.vue
---

<Demo name="textarea/hero" />

## Usage {#usage}

```ts
import { Textarea } from '@hina-ui/vue'
```

The field renders a native `textarea` with `v-model` bound to its text. It is three rows tall by default and can be stretched vertically from the corner. Attributes it does not declare land on the `textarea`, so `placeholder`, `maxlength`, `name` and the like work as usual.

<Demo name="textarea/basic" />

## Examples {#examples}

### Auto height {#autosize}

With `autosize` set the height follows the content and the resize handle is hidden. Pass an object to bound the number of rows; past `maxRows` the field scrolls inside.

<Demo name="textarea/autosize" />

### Sizes {#sizes}

Three sizes, matching the input. With a single line of content the height equals the input of the same size.

<Demo name="textarea/sizes" />

### Variants {#variants}

`primary` has a border, background and shadow; `secondary` uses a tinted background; `bare` is transparent, without a border, shadow, hover fill or container focus ring. Size and padding keep their existing settings.

`bare` preserves the disabled state and `aria-invalid`; [FormField](/components/form-field) can display the error message.

<Demo name="textarea/variants" />

### States {#states}

`invalid` marks a failed validation and `disabled` prevents editing.

<Demo name="textarea/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label points at the textarea through `for`, and the description and error message are rendered by the field and linked to it; validation rules and submission belong to the [Form](/components/form).

<Demo name="textarea/form" />

## Behaviour {#behavior}

- Hover, focus, invalid and disabled behave the same as [Input](/components/input).
- Auto height is recomputed on input and on `v-model` changes; the lower bound defaults to `rows`.
- Content beyond the visible rows scrolls inside the field, with the same scrollbar as [ScrollArea](/components/scroll-area).
- Clicking blank space inside the field also focuses it.

## Accessibility {#a11y}

- Renders a native `textarea`, so keyboard and screen reader behaviour comes from the browser.
- Pair it with a `label` element or an `aria-label` for its name.
- `invalid` also sets `aria-invalid`.

## API {#api}

### Props {#props}

| Prop       | Type                                                | Default      | Description                                       |
| ---------- | --------------------------------------------------- | ------------ | ------------------------------------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'bare'`                | `'primary'`  | Variant                                           |
| `size`     | `'sm' \| 'md' \| 'lg'`                              | `'md'`       | Size                                              |
| `rows`     | `number`                                            | `3`          | Number of rows                                    |
| `autosize` | `boolean \| { minRows?: number; maxRows?: number }` | `false`      | Whether the height follows the content            |
| `resize`   | `'none' \| 'vertical'`                              | `'vertical'` | Whether it can be stretched; off with auto height |
| `invalid`  | `boolean`                                           | `false`      | Whether validation failed                         |
| `disabled` | `boolean`                                           | `false`      | Whether the field is disabled                     |
| `class`    | `string`                                            | —            | Classes appended to the root element              |

| Event               | Payload         | Description      |
| ------------------- | --------------- | ---------------- |
| `update:modelValue` | `value: string` | The text changed |
