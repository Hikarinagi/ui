---
title: Toast
description: A short piece of feedback that floats in once an action finishes.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/toast/Toaster.vue
  - label: Callout
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/callout/Callout.vue
---

<Demo name="toast/hero" />

## Usage {#usage}

```ts
import { Toaster, toast } from '@hikarinagi/ui'
```

Put one `Toaster` at the root of the app and call `toast()` from anywhere. It returns the id of that toast, which you can use to update or dismiss it.

<Demo name="toast/basic" />

```vue
<template>
  <AppShell>
    <NuxtPage />
    <Toaster />
  </AppShell>
</template>
```

## Examples {#examples}

### Tones {#tones}

Each of the five tones has its own icon and colour. `loading` shows a spinner and stays until dismissed, usually updated into a final result through its `id`.

<Demo name="toast/tones" />

### Description {#description}

`description` is the second line under the message, for the details.

<Demo name="toast/description" />

### Actions {#action}

`action` is the primary button and `cancel` the secondary one; either of them dismisses the toast when clicked. Set `duration` to 0 when the toast needs an answer.

<Demo name="toast/action" />

### Async tasks {#promise}

`toast.promise` takes a promise and moves through `loading`, `success` and `error` on its own. `success` and `error` can be functions, building the message from the result.

<Demo name="toast/promise" />

### Updating in place {#update}

Passing the same `id` updates the tone, the text and the timer of the existing toast instead of adding another one. Progress feedback works this way.

<Demo name="toast/update" />

### Custom rendering {#custom}

`toast.custom` renders the body of a toast with your own component. Whatever is in `props` is passed straight through, and the component also receives a `toastId`. The surface, the border, the shadow and the padding still come from `Toaster`.

<Demo name="toast/custom" />

### How long it stays {#duration}

`duration` is in milliseconds and defaults to 4000, or 0 for `loading`. A duration of 0 means it stays until the close button is pressed or `toast.dismiss(id)` is called.

<Demo name="toast/duration" />

## Behaviour {#behavior}

- The timer pauses while the pointer hovers the toast area or focus is inside it, and resumes on leaving.
- At most five toasts are shown at once; older ones leave.
- Toasts are keyed by `id`, so calling the same id again updates rather than adds.
- Swiping a toast to the right dismisses it.

## Accessibility {#a11y}

- The toast area is a `role="region"` named "Notifications" by default, which `label` overrides.
- Each toast announces through a separate `role="alert"` live region, so a screen reader reads out the message and its description.
- The topmost toast can be reached with Tab, and the close button carries an accessible name.

## API {#api}

### toast {#toast}

| Method                        | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `toast(message, options?)`    | A neutral toast; returns its id                 |
| `toast.success(...)`          | Success                                         |
| `toast.danger(...)`           | Failure                                         |
| `toast.warning(...)`          | Warning                                         |
| `toast.info(...)`             | Information                                     |
| `toast.loading(...)`          | In progress; stays until dismissed              |
| `toast.promise(p, messages)`  | Follows the three states of a promise           |
| `toast.custom(component, {})` | Renders the whole toast with your own component |
| `toast.dismiss(id?)`          | Dismisses one toast, or all of them             |

### ToastOptions {#options}

| Prop          | Type                 | Default | Description                            |
| ------------- | -------------------- | ------- | -------------------------------------- |
| `id`          | `number \| string`   | —       | The same id updates the existing toast |
| `description` | `string`             | —       | The second line under the message      |
| `duration`    | `number`             | `4000`  | Milliseconds on screen; 0 never closes |
| `action`      | `{ label, onClick }` | —       | The primary button                     |
| `cancel`      | `{ label, onClick }` | —       | The secondary button                   |
| `onDismiss`   | `(id) => void`       | —       | Called when the toast is dismissed     |
| `onAutoClose` | `(id) => void`       | —       | Called when the timer closes it        |

### Toaster {#toaster}

| Prop       | Type              | Default | Description                                               |
| ---------- | ----------------- | ------- | --------------------------------------------------------- |
| `position` | `ToasterPosition` | —       | Bottom centre on a narrow screen, top right on a wide one |
| `label`    | `string`          | —       | Accessible name of the toast area                         |
| `class`    | `string`          | —       | Classes appended to the toast area                        |

`ToasterPosition` is one of `top-start`, `top-center`, `top-end`, `bottom-start`, `bottom-center` and `bottom-end`.
