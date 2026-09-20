---
title: Editable
description: Edit text in place with save and cancel.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/editable/Editable.vue
---

<Demo name="editable/hero" />

## Usage {#usage}

```ts
import { Editable } from '@hina-ui/vue'
```

For names, titles and notes that normally appear as text. `v-model` holds the committed value; typing changes an internal draft until you save. Cancel restores the committed text. Use [Input](/components/input) or [Textarea](/components/textarea) for fields that remain visible and synchronize every keystroke.

Click to edit. The input receives focus and selects its text. Enter or focus leaving the whole component saves; Esc cancels. Moving focus between the input and its controls does not submit, and clicking Cancel never triggers a blur save first.

<Demo name="editable/basic" />

## Examples {#examples}

### Activation and submission {#activation}

`activationMode` supports click, double click and manual activation. Click and double-click modes both accept Enter or Space when focused; Tab alone does not start editing. Manual mode uses the edit button, `v-model:editing`, or the exposed `edit()` method.

`submitMode` determines keyboard and blur submission. The explicit save control always works:

| Value    | Behavior                                                |
| -------- | ------------------------------------------------------- |
| `both`   | Save on Enter or focus leaving the component; default   |
| `enter`  | Save on Enter; preserve editing and the draft on blur   |
| `blur`   | Save on outside focus; Enter does not submit            |
| `manual` | Only save explicitly; Enter and blur preserve the draft |

The first example uses `multiline` for its description: Enter inserts a newline; Ctrl / ⌘ + Enter follows the Enter rule above. IME composition does not trigger save or cancel.

Multiline editing uses [Textarea](/components/textarea). Content beyond `rows` scrolls inside [ScrollArea](/components/scroll-area), keeping the caret visible while typing.

<Demo name="editable/activation" />

### Async saving and retry {#async}

Pass a function using `:on-save="save"`. It receives the new and previous values and may return a Promise. The model updates and `submit` fires only after success. Unchanged values exit editing without another save.

While saving, the draft and input stay visible, a loading indicator appears, and repeated submission and cancellation are blocked. Throwing an `Error` displays its message; other failures use the localized fallback. The `error` event receives the original error. Failure preserves the draft for retry or cancellation; editing clears the old error. Use `onSave` for requests the component must await, rather than an async `@submit` listener: `submit` is a success notification.

External model updates, closing `editing`, disabling the control, making it read-only, or unmounting invalidate outstanding results. They cannot overwrite a newer value. Network cancellation remains the caller's responsibility.

<Demo name="editable/async" />

### Custom preview and controls {#custom}

`#preview` changes how the value is displayed while keeping activation and focus management. In click and double-click modes the preview is a button, so do not nest interactive controls or links inside it. `#actions` provides state and methods for a custom action area.

Set `:controls="false"` to hide built-in controls. With manual activation or submission, supply the corresponding actions through slots or exposed methods.

<Demo name="editable/custom" />

### Sizes and states {#states}

The three sizes share Input's typography, height and padding. Single-line preview and input have equal width and text alignment; controls appear underneath without squeezing the text. Read-only content can be selected and copied. Disabled content cannot enter editing.

<Demo name="editable/states" />

### In a form {#form}

[FormField](/components/form-field) connects labels, descriptions, errors and disabled state. Form validates committed values. This example uses `v-model:editing` to disable submission of the whole form until the field edit is confirmed.

`required` and `maxlength` constrain the editor itself. Use Form rules or throw a validation error from `onSave` for more complex rules. `name` includes the committed value in native FormData.

<Demo name="editable/form" />

## Keyboard and focus {#keyboard}

- Preview: Tab focuses; Enter or Space starts editing. Manual mode uses the edit control.
- Single-line input: Enter follows `submitMode` without submitting an outer form.
- Multiline input: Enter inserts a newline; Ctrl / ⌘ + Enter follows `submitMode`.
- Esc cancels the draft without closing a surrounding Dialog. Composition and pending saves block cancellation.
- Saving and cancellation return focus to the preview if focus is still inside the component. They do not take focus back from another control.
- Initial `editing=true` renders the editor during SSR without grabbing focus on mount. Later transitions into editing focus it automatically.

## API {#api}

### Props {#props}

| Prop             | Type                                      | Default        | Description                                    |
| ---------------- | ----------------------------------------- | -------------- | ---------------------------------------------- |
| `modelValue`     | `string`                                  | `''`           | Committed text; supports `v-model`             |
| `editing`        | `boolean`                                 | `false`        | Edit state; supports `v-model:editing`         |
| `activationMode` | `'click' \| 'dblclick' \| 'manual'`       | `'click'`      | How to begin editing                           |
| `submitMode`     | `'enter' \| 'blur' \| 'both' \| 'manual'` | `'both'`       | Keyboard and blur submission                   |
| `selectOnFocus`  | `boolean`                                 | `true`         | Select all text on entering edit mode          |
| `multiline`      | `boolean`                                 | `false`        | Use a textarea                                 |
| `rows`           | `number`                                  | `3`            | Initial textarea rows                          |
| `controls`       | `boolean`                                 | `true`         | Show default actions                           |
| `onSave`         | `EditableSave`                            | —              | Awaited callback before updating the model     |
| `placeholder`    | `string`                                  | Localized text | Empty preview and input placeholder            |
| `name`           | `string`                                  | —              | Native form field name for the committed value |
| `required`       | `boolean`                                 | `false`        | Prevent committing an empty value              |
| `maxlength`      | `number`                                  | —              | Input length limit                             |
| `size`           | `'sm' \| 'md' \| 'lg'`                    | `'md'`         | Size                                           |
| `disabled`       | `boolean`                                 | `false`        | Disable editing                                |
| `readonly`       | `boolean`                                 | `false`        | Read-only text; allows selection and copying   |
| `invalid`        | `boolean`                                 | `false`        | Mark the field invalid                         |
| `class`          | `string`                                  | —              | Root classes                                   |

Other attributes such as `id`, `aria-label`, and `autocomplete` go to the active preview or input. `class` styles the root; `style` styles the active preview or input.

### Slots {#slots}

| Slot      | Scope                               | Description                 |
| --------- | ----------------------------------- | --------------------------- |
| `preview` | `{ value: string, empty: boolean }` | Display the committed value |
| `actions` | `EditableControls`                  | Replace default controls    |

### Events {#events}

| Event               | Payload                                | Description                  |
| ------------------- | -------------------------------------- | ---------------------------- |
| `update:modelValue` | `string`                               | Successfully committed value |
| `update:editing`    | `boolean`                              | Editing changed              |
| `edit`              | —                                      | Entered edit mode            |
| `submit`            | `value: string, previousValue: string` | Saved a change successfully  |
| `cancel`            | `draft: string`                        | Discarded draft              |
| `error`             | `unknown`                              | Save callback failed         |

### Exposed methods and types {#expose}

Instances expose `edit()`, `submit(): Promise<boolean>`, `cancel()`, `focus()`, and the current `input`, `draft`, `saving`, and `error`. `input` exists only while editing on the client. `submit()` returns whether editing completed successfully. `cancel()` has no effect during saving.

```ts
type EditableSave = (value: string, previousValue: string) => void | Promise<void>

interface EditableControls {
  editing: boolean
  draft: string
  dirty: boolean
  saving: boolean
  disabled: boolean
  error: string
  edit: () => void
  submit: () => Promise<boolean>
  cancel: () => void
}
```
