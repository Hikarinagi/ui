---
title: Stepper
description: Navigates a sequence of steps with guarded transitions.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/stepper/Stepper.vue
---

<Demo name="stepper/hero" />

## Usage {#usage}

```ts
import { Stepper, type StepperItem } from '@hina-ui/vue'
```

`items` defines the steps. `v-model` is the current step number, starting at **1**. Without a model, the component manages its state and starts at `defaultValue`, or the first step.

<Demo name="stepper/basic" />

## Examples {#examples}

### Linear and free navigation {#linear}

`linear` defaults to `true`: previous steps and the immediate next step are available, but later steps cannot be reached directly. Set it to `false` to reach any enabled step.

Linear navigation limits the allowed range; it does not validate data. Use `beforeChange` for validation. Assigning `v-model` externally updates state directly and does not run navigation restrictions or validation.

<Demo name="stepper/linear" />

### Vertical {#vertical}

`orientation="vertical"` places text beside each marker, with connectors extending along descriptions. Horizontal steps place text below their markers and share the available width equally. Orientation also controls arrow-key navigation.

<Demo name="stepper/vertical" />

### States {#states}

Steps before the current one appear completed. `completed` explicitly marks a step as complete, including the last step. `error` takes visual priority while the active step retains its current-position semantics.

An item's `disabled` prevents entering it; root `disabled` prevents all user navigation. `next()` and `prev()` do not skip disabled steps: they return `false` when the adjacent step is disabled.

<Demo name="stepper/states" />

### Content and navigation {#content}

The default slot receives the current step and navigation methods. Compose [Card](/components/card), [Button](/components/button) or other components inside it. The content region only renders when this slot is provided.

The slot remains mounted; the caller controls switching, preserving or resetting its contents. The component instance exposes `next()`, `prev()` and `goTo(step)` with the same behavior as the slot methods.

<Demo name="stepper/content" />

### Guarding navigation {#guard}

`beforeChange(nextStep, previousStep)` runs for pointer activation, keyboard activation and navigation methods. Return `false` to block a change, or `true` / no value to allow it. Promises are supported.

The current step stays active and duplicate requests are blocked while waiting. Thrown errors and rejected promises preserve the step and emit `error`. External current-step, step-structure or disabled-state changes and unmounting invalidate outstanding validation.

This example uses [FormField](/components/form-field) and [Input](/components/input). Clicking the second step and clicking Next both run the same guard.

<Demo name="stepper/guard" />

### Custom indicators and text {#custom}

`#indicator`, `#title` and `#description` receive the original `item`, zero-based `index`, one-based `step`, `state`, `active`, `pending` and `disabled`. Custom fields retain type inference.

This example replaces numbers with icons and adds [Tag](/components/tag) to titles. These slots are inside the step button and should contain non-interactive content. Place inputs, links and other buttons in the default content slot.

<Demo name="stepper/custom" />

### Sizes {#sizes}

`size` adjusts marker and text sizes. Marker dimensions and spacing use Hina tokens and follow density settings.

<Demo name="stepper/sizes" />

### RTL {#rtl}

Direction follows an ancestor's `dir` or the configuration provider, or an explicit `dir="rtl"`. Horizontal placement, connectors and arrow navigation reverse together.

<Demo name="stepper/rtl" />

## Behavior and accessibility {#a11y}

- Steps form a named group containing a list. Set `label` to replace the default accessible name.
- Each step is a button with a title and optional description. The current button has `aria-current="step"`. Error and completion states also have text alternatives.
- Tab moves between enabled steps and content. Left/right arrows move focus horizontally; up/down arrows move it vertically. Enter or Space activates the focused step. Focus movement does not change the current step.
- Navigation does not steal focus from content or submit forms.
- Progress announcements follow the UI locale. Hina motion tokens respect reduced-motion preferences.

## API {#api}

### Props {#props}

| Prop           | Type                         | Default        | Description                             |
| -------------- | ---------------------------- | -------------- | --------------------------------------- |
| `items`        | `T[]`                        | Required       | Steps, where `T extends StepperItem`    |
| `v-model`      | `number`                     | —              | Current step, starting at 1             |
| `defaultValue` | `number`                     | `1`            | Initial uncontrolled step               |
| `orientation`  | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout and keyboard direction           |
| `size`         | `'sm' \| 'md' \| 'lg'`       | `'md'`         | Size                                    |
| `linear`       | `boolean`                    | `true`         | Restrict navigation to sequential steps |
| `disabled`     | `boolean`                    | `false`        | Prevent all user navigation             |
| `beforeChange` | `StepperBeforeChange`        | —              | Navigation guard                        |
| `label`        | `string`                     | From locale    | Accessible group name                   |
| `dir`          | `'ltr' \| 'rtl'`             | Inherited      | Reading direction                       |
| `class`        | `string`                     | —              | Root element classes                    |

An empty list has a displayed step of `0`. Invalid or out-of-range current values are bounded for display without writing back to the model. `defaultValue` only initializes state.

### StepperItem {#item}

| Field         | Type      | Description                                                                           |
| ------------- | --------- | ------------------------------------------------------------------------------------- |
| `title`       | `string`  | Required title                                                                        |
| `description` | `string`  | Optional description                                                                  |
| `disabled`    | `boolean` | Prevent entering the step                                                             |
| `completed`   | `boolean` | Explicit completion; `false` does not override automatic completion of previous steps |
| `error`       | `boolean` | Error state, taking priority over completion                                          |

Step identity and numbers follow array position. `index` starts at 0 and `step` starts at 1.

### Slots {#slots}

| Slot          | Props                  | Description                                    |
| ------------- | ---------------------- | ---------------------------------------------- |
| `default`     | `StepperNavigation<T>` | Current content and navigation                 |
| `indicator`   | `StepperSlotProps<T>`  | Number, check, error icon or loading indicator |
| `title`       | `StepperSlotProps<T>`  | Title                                          |
| `description` | `StepperSlotProps<T>`  | Description                                    |

`StepperSlotProps<T>` is `{ item, index, step, state, active, pending, disabled }`. `state` is `'inactive' | 'active' | 'completed' | 'error'`. `pending` identifies the step awaiting validation; `disabled` includes explicit disabling and linear range restrictions.

`StepperNavigation<T>` is `{ step, item, total, pending, canNext, canPrev, next, prev, goTo }`. `item` is `undefined` for an empty list. Navigation returns `Promise<boolean>`: `true` when a model update is requested, or `false` when blocked, unchanged or stale.

### Events {#events}

| Event               | Payload          | Description                       |
| ------------------- | ---------------- | --------------------------------- |
| `update:modelValue` | `step: number`   | Requests a current-step update    |
| `error`             | `error: unknown` | A navigation guard threw an error |

### Expose {#expose}

Component refs expose `step`, `pending`, `canNext`, `canPrev`, `next()`, `prev()` and `goTo(step)`. `beforeChange` has the signature `(nextStep: number, previousStep: number) => boolean | void | Promise<boolean | void>`.
