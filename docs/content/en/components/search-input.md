---
title: SearchInput
description: A field for entering a search query.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/search-input/SearchInput.vue
---

<Demo name="search-input/hero" />

## Usage {#usage}

```ts
import { SearchInput } from '@hina-ui/vue'
```

The field starts with a search icon and shows a clear button at the end once it has content, with `v-model` bound to the query. Enter emits `search` with the current value and Esc clears it. Attributes it does not declare land on the `input`.

<Demo name="search-input/basic" />

## Examples {#examples}

### Loading {#loading}

`loading` swaps the search icon for a spinner while a search request is in flight.

<Demo name="search-input/loading" />

### Sizes {#sizes}

Three sizes, matching the input.

<Demo name="search-input/sizes" />

### Variants {#variants}

`primary` sits directly on the page background with a border and shadow; `secondary` sits inside a surface such as a card, with only a tinted fill.

<Demo name="search-input/variants" />

### States {#states}

`disabled` prevents editing. With `clearable` off the clear button is never shown.

<Demo name="search-input/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label points at the input, and the error message is rendered by the field; validation rules and submission belong to the [Form](/components/form), and Enter to submit and the submit button keep their default behavior.

<Demo name="search-input/form" />

## Behaviour {#behavior}

- The clear button only appears with content and when not disabled; clicking it does not blur the text area.
- Esc clears only when there is content and does nothing otherwise.
- Hover, focus and disabled behave the same as the input.

## Accessibility {#a11y}

- The text area is `type="search"`, so mobile keyboards show a search action key.
- The clear button is reachable with Tab and named from the locale pack. The root sets `aria-busy` while `loading`.
- Pair it with a `label` element or an `aria-label` for its name.

## API {#api}

### Props {#props}

| Prop         | Type                       | Default     | Description                          |
| ------------ | -------------------------- | ----------- | ------------------------------------ |
| `modelValue` | `string`                   | `''`        | The query                            |
| `clearable`  | `boolean`                  | `true`      | Whether the clear button is shown    |
| `loading`    | `boolean`                  | `false`     | Whether the spinner is shown         |
| `variant`    | `'primary' \| 'secondary'` | `'primary'` | Variant                              |
| `size`       | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Size                                 |
| `disabled`   | `boolean`                  | `false`     | Whether the field is disabled        |
| `class`      | `string`                   | —           | Classes appended to the root element |

| Event               | Payload         | Description               |
| ------------------- | --------------- | ------------------------- |
| `update:modelValue` | `value: string` | The query changed         |
| `search`            | `value: string` | Enter submitted the query |
| `clear`             | —               | The query was cleared     |
