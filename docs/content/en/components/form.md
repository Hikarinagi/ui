---
title: Form
description: Collects field values, validates them and submits.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/form/Form.vue
---

<Demo name="form/hero" />

## Usage {#usage}

```ts
import { Form, FormField } from '@hina-ui/vue'
```

The form keeps the values of a set of fields, their validation rules and the submit action in one place. `values` takes a reactive object, and controls bind to its properties with `v-model` as usual; `rules` takes the validation rules, which run on submit, and the handler of the `submit` event is only called once they all pass. Wrap each field in a [FormField](/components/form-field), which renders the label, the description and the error message and connects the control to the field automatically.

<Demo name="form/basic" />

## Examples {#examples}

### Validation rules {#rules}

`rules` accepts two forms. One is an object that implements the Standard Schema specification, so schemas from Valibot, Zod, ArkType and similar libraries can be passed as they are; issue paths are joined with `.` into field names. The other is a function that receives the current values and returns an object keyed by field name with the error text as the value, an empty object when nothing is wrong; it may also return a Promise.

<Demo name="form/validator" />

### When to validate {#timing}

By default validation runs on submit; after a failed submit every change validates again, so errors clear as soon as they are fixed. With `validateOn` set to `blur`, a field starts validating once it loses focus; with `change`, every change validates.

<Demo name="form/timing" />

### Errors from the server {#server}

The server may still reject some fields after a submit. Call `setErrors` through a template ref with a map from field names to error text, and the errors show under their fields; once the value of that field changes, its error clears on its own. An error without a matching field is available as `error` on the default slot for you to display.

<Demo name="form/server" />

### Submitting and disabled {#state}

When the `submit` handler returns a Promise, the form stays in the submitting state until it settles, every field is disabled, and the `submitting` slot prop drives the loading indicator of the button. `disabled` disables the whole form.

<Demo name="form/state" />

## Behavior {#behavior}

- Submitting validates first; on failure the errors show, focus moves to the first invalid control, and the submit handler is not called.
- Once validation passes the handler is called; when it returns a Promise the form waits for it and stays in the submitting state meanwhile.
- After a failed submit, or with `validateOn` set to `change`, value changes validate again; with `blur`, only fields that have lost focus show errors.
- Errors set through `setErrors` take precedence and clear once the value of their field changes.
- An issue with an empty path belongs to no field and is exposed as the form-level `error` slot prop.

## Accessibility {#a11y}

- The root is a native form with the browser's own validation hints turned off; Enter to submit and the submit button keep their default behavior.
- While submitting the root carries `aria-busy`.
- Error messages are rendered by FormField and linked to the control with `aria-describedby` and `aria-invalid`.

## API {#api}

### Props {#props}

| Prop         | Type                             | Default    | Description                                              |
| ------------ | -------------------------------- | ---------- | -------------------------------------------------------- |
| `values`     | `Record<string, unknown>`        | —          | The reactive object that holds the field values          |
| `rules`      | `FormRules`                      | —          | Validation rules, a Standard Schema object or a function |
| `validateOn` | `'submit' \| 'blur' \| 'change'` | `'submit'` | When validation runs                                     |
| `disabled`   | `boolean`                        | `false`    | Whether the whole form is disabled                       |
| `class`      | `string`                         | —          | Classes appended to the root element                     |

### Slots {#slots}

| Slot    | Props                                                   | Description  |
| ------- | ------------------------------------------------------- | ------------ |
| default | `errors`, `error`, `invalid`, `submitting`, `submitted` | Form content |

### Events {#events}

| Event    | Payload                           | Description                                                                  |
| -------- | --------------------------------- | ---------------------------------------------------------------------------- |
| `submit` | `values: Record<string, unknown>` | Fires once validation passes; a Promise from the handler keeps the form busy |

### Methods {#methods}

| Method              | Description                                         |
| ------------------- | --------------------------------------------------- |
| `submit()`          | Runs a submit                                       |
| `validate()`        | Validates and returns whether everything passed     |
| `setErrors(errors)` | Sets external errors keyed by field name            |
| `reset()`           | Clears errors, the blur record and the submit state |

The `FormRules`, `FormErrors`, `FormValidator` and `StandardSchema` types are exported from the package entry.
