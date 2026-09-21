---
title: Autocomplete
description: Free-text input with caret-aware suggestions.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/autocomplete/Autocomplete.vue
---

<Demo name="autocomplete/hero" />

## Usage {#usage}

```ts
import { Autocomplete } from '@hina-ui/vue'
```

`v-model` always holds the complete input string. Accepting a suggestion edits this text; blur never restores a selected label or clears the input. Use [Combobox](/components/combobox) when the value must belong to a set of options.

`options` is the exact candidate list; the component does not filter it. Without `getCompletion`, accepting an option replaces the entire text with `option.label` and closes the list. Arbitrary text remains valid.

<Demo name="autocomplete/basic" />

## Examples {#examples}

### Continued completion at the caret {#completion}

The first example completes query fragments. Type `sta`, highlight `status:` with an arrow key, and press Enter. The list stays open and offers `ok`, `error`, and `timeout`. Accept a value to close the list, then press Enter to apply the query. Move the caret back to an earlier fragment to replace it while preserving the suffix.

`@query` provides the current text and selection after input, caret movement, selection changes, and completion. `getCompletion(option, context)` synchronously returns a replacement range and inserted text. Ranges use native input UTF-16 offsets, with an inclusive start and exclusive end. The caret moves to the end of the inserted text.

```ts
function complete(option, context) {
  const range = locateToken(context)
  return {
    range,
    text: option.label,
    keepOpen: option.kind === 'key',
  }
}
```

The application supplies `locateToken`, key/value classification, and suggestions. Use `keepOpen: true` to continue completing; the following `query` event contains the updated text and caret. Use the context passed to the current `getCompletion` call instead of a cached selection. A range outside the current text throws `RangeError`.

### Remote suggestions {#remote}

`loading` shows a spinner and list status while preserving text. Replacing `options` clears the old highlight; new results never automatically highlight the first item. Customize empty and loading messages through `#empty` and `#loading`.

The caller owns requests, debouncing, cancellation, and stale-response handling. This example fetches static JSON shipped with the documentation and filters it in the caller. Replace that request with a search endpoint using the same data flow.

<Demo name="autocomplete/remote" />

### Sizes and states {#states}

The input uses the same sizes and variants as [Input](/components/input). [FormField](/components/form-field) supplies label, description, error, and disabled associations. Undeclared attributes such as `name`, `maxlength`, and `aria-label` reach the native input.

<Demo name="autocomplete/states" />

### In a form {#form}

Use `FormField`'s `name` to connect validation rules. Errors and the disabled state during submission reach the input automatically. Suggestions help complete text; custom values remain valid for submission.

Connect `@submit` to the `Form` instance's `submit()`: Enter accepts a highlighted suggestion, or validates and submits the form when nothing is highlighted. The Save button uses the same validation flow.

<Demo name="autocomplete/form" />

## Keyboard and focus {#keyboard}

- Focus, click, or input opens the list while focus stays in the input. No initial suggestion is highlighted.
- Arrow keys navigate enabled suggestions. Keyboard scrolling stays inside the popup.
- Enter accepts a highlighted suggestion. Without one, it closes the list and emits `submit(text)`; it does not also submit a native form.
- `selectOnTab` is off by default. When enabled, Tab accepts a highlighted suggestion and retains input focus. Without a highlight, or with Shift+Tab, normal focus navigation remains intact.
- Escape closes the list first. When already closed, it clears nonempty text and emits `clear`. Neither action submits the query.
- IME composition does not select, submit, or clear. Suggestions update after composition ends.
- Blur preserves text. `readonly` permits focus, text selection, and copying without opening suggestions; `disabled` prevents interaction.

The input, list, and candidates use `combobox`, `listbox`, and `option` roles with `aria-activedescendant` linking the active option. Provide [FormField](/components/form-field), an associated label, or `aria-label`. Option slots are for presentation; avoid nested buttons, links, or other independently interactive controls.

## API {#api}

### Props {#props}

`T extends AutocompleteOption` is inferred from `options`. Extra business fields retain their types in callbacks and slots.

| Prop            | Type                                                        | Default     | Description                                                                                          |
| --------------- | ----------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `modelValue`    | `string`                                                    | `''`        | Complete text; supports `v-model`                                                                    |
| `open`          | `boolean`                                                   | `false`     | Popup state; supports `v-model:open`                                                                 |
| `options`       | `readonly T[]`                                              | —           | Current candidates; each `value` must be stable and unique                                           |
| `getCompletion` | `(option: T, context: CompletionContext) => CompletionEdit` | —           | Synchronous edit; defaults to replacing all text with `label`                                        |
| `loading`       | `boolean`                                                   | `false`     | Loading state; existing candidates stay selectable, so clear stale options in the caller when needed |
| `selectOnTab`   | `boolean`                                                   | `false`     | Accept the highlighted suggestion with Tab                                                           |
| `placeholder`   | `string`                                                    | —           | Placeholder text                                                                                     |
| `variant`       | `'primary' \| 'secondary'`                                  | `'primary'` | Input appearance                                                                                     |
| `size`          | `'sm' \| 'md' \| 'lg'`                                      | `'md'`      | Size                                                                                                 |
| `disabled`      | `boolean`                                                   | `false`     | Disable interaction                                                                                  |
| `readonly`      | `boolean`                                                   | `false`     | Read-only input                                                                                      |
| `invalid`       | `boolean`                                                   | `false`     | Validation failure                                                                                   |
| `class`         | `string`                                                    | —           | Input frame classes                                                                                  |

### Slots {#slots}

| Slot       | Props                            | Description                                                         |
| ---------- | -------------------------------- | ------------------------------------------------------------------- |
| `leading`  | —                                | Leading icon or adornment                                           |
| `trailing` | —                                | Shortcut hint or state marker; follows logical direction in RTL     |
| `option`   | `{ option: T, active: boolean }` | Candidate content; row interaction and accessibility remain managed |
| `empty`    | —                                | Empty results message                                               |
| `loading`  | —                                | Loading message inside the list                                     |

### Events {#events}

| Event               | Payload                    | Description                                                          |
| ------------------- | -------------------------- | -------------------------------------------------------------------- |
| `update:modelValue` | `string`                   | Text changed                                                         |
| `update:open`       | `boolean`                  | Popup state changed                                                  |
| `query`             | `CompletionContext`        | Focus or reopening, text or selection changes, and completed edits   |
| `select`            | `AutocompleteSelection<T>` | Accepted suggestion, including the previous context and applied edit |
| `submit`            | `string`                   | Enter applies text when no suggestion is highlighted                 |
| `clear`             | —                          | Escape cleared nonempty text while the popup was closed              |

### Exposed instance {#expose}

`input` exposes the native `HTMLInputElement`, including `setSelectionRange()`. `focus()` and `blur()` control input focus. The instance is available after mounting.

### Types {#types}

```ts
interface AutocompleteOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

interface CompletionContext {
  text: string
  selectionStart: number
  selectionEnd: number
}

interface CompletionEdit {
  range: [number, number]
  text: string
  keepOpen?: boolean
}

interface AutocompleteSelection<T extends AutocompleteOption = AutocompleteOption> {
  option: T
  context: CompletionContext
  edit: CompletionEdit
}
```
