---
title: FileUpload
description: Picks files by clicking or dropping.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/file-upload/FileUpload.vue
---

<Demo name="file-upload/hero" />

## Usage {#usage}

```ts
import { FileUpload } from '@hina-ui/vue'
```

The file upload is a drop area plus a list of the chosen files: clicking the area opens the system file dialog, and dropping files onto it picks them as well. `v-model` binds the chosen files, a single `File` or `null` by default and a `File` array with `multiple`. The component only picks and lists files; it does not upload them, which is up to the caller once the files are in hand. Attributes it does not declare land on the drop area, so name it with `aria-label` or `aria-labelledby`.

<Demo name="file-upload/basic" />

## Examples {#examples}

### Multiple files {#multiple}

`multiple` allows several files at once; a later pick appends to the list and duplicates are kept once.

<Demo name="file-upload/multiple" />

### Type, size and count limits {#limits}

`accept` works like the native attribute and takes extensions or MIME types; `maxSize` caps a single file in bytes; `maxFiles` caps the count with `multiple`. Files that fail never enter the list; they are handed out through the `reject` event with the reason for each.

<Demo name="file-upload/limits" />

### Button variant {#button}

`variant="button"` swaps the drop area for a button, which suits a form row.

<Demo name="file-upload/button" />

### Pick and send {#immediate}

Some places hand files straight to an upload flow and show the results elsewhere, such as an upload tile in an image library. Set `list` to `false` to keep only the drop area, then take the files on change and reset the value.

<Demo name="file-upload/immediate" />

### States {#states}

`invalid` gives the drop area a warning color, `disabled` blocks picking and removing, and `loading` swaps the icon for a spinner and blocks picking while an upload runs. The `icon` slot replaces the icon in the area or button, and when the root is given a fixed size the area fills it.

<Demo name="file-upload/states" />

### In a form {#form}

Inside a [FormField](/components/form-field) the label points at the drop area, and the description and error message are rendered by the field; validation rules and submission belong to the [Form](/components/form). The value is a `File`, so size and type rules go straight into the schema.

<Demo name="file-upload/form" />

## Behavior {#behavior}

- Clicking the area or the button opens the system file dialog; dragging files over the area turns its border to the accent color, and dropping picks them.
- A single pick replaces the previous file; with `multiple` picks append, and files beyond `maxFiles` are rejected.
- Every listed file shows its name and readable size, images show a thumbnail, and the remove button drops that file from the list.
- The default slot replaces the text inside the area or the button.

## Accessibility {#a11y}

- The drop area is a button reachable by keyboard; Enter or Space opens the file dialog, and the hidden file input is invisible to assistive technology.
- Each remove button carries a localized name that includes the file name.
- Name the drop area with `aria-label` or `aria-labelledby`.

## API {#api}

### Props {#props}

| Prop         | Type                     | Default  | Description                                |
| ------------ | ------------------------ | -------- | ------------------------------------------ |
| `modelValue` | `File \| File[] \| null` | `null`   | The chosen files, an array with `multiple` |
| `multiple`   | `boolean`                | `false`  | Whether several files may be picked        |
| `accept`     | `string`                 | —        | Accepted types, as in the native attribute |
| `maxSize`    | `number`                 | —        | Size cap of a single file in bytes         |
| `maxFiles`   | `number`                 | —        | Count cap with `multiple`                  |
| `variant`    | `'area' \| 'button'`     | `'area'` | Variant                                    |
| `list`       | `boolean`                | `true`   | Whether the chosen files are listed        |
| `preview`    | `boolean`                | `true`   | Whether images show a thumbnail            |
| `name`       | `string`                 | —        | Form field name                            |
| `loading`    | `boolean`                | `false`  | Whether a spinner shows and picking stops  |
| `disabled`   | `boolean`                | `false`  | Whether the upload is disabled             |
| `invalid`    | `boolean`                | `false`  | Whether validation failed                  |
| `class`      | `string`                 | —        | Classes appended to the root element       |

### Slots {#slots}

| Slot    | Description                             |
| ------- | --------------------------------------- |
| default | The text inside the drop area or button |
| `icon`  | The icon inside the drop area or button |

### Events {#events}

| Event               | Payload                             | Description                                            |
| ------------------- | ----------------------------------- | ------------------------------------------------------ |
| `update:modelValue` | `value: File \| File[] \| null`     | The chosen files changed                               |
| `reject`            | `rejections: FileUploadRejection[]` | Files were rejected, each with its `file` and `reason` |

The `reason` of a `FileUploadRejection` is `'type'`, `'size'` or `'count'`; the type is exported from the package entry.
