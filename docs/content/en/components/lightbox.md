---
title: Lightbox
description: A full-screen image preview with controlled visibility and selection.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/lightbox/Lightbox.vue
---

<Demo name="lightbox/hero" />

## Usage {#usage}

```ts
import { Lightbox, type LightboxItem } from '@hina-ui/vue'
```

Provide images through `items`, control visibility with `v-model:open`, and select the current image with `v-model:index`. Mount the component in the Vue component tree; event handlers can update these values.

Lightbox works independently of [Image](/components/image). The [Button](/components/button) in the example only opens the preview.

## Source transition {#source}

Return the source `<img>` element from the item’s `source` callback. The preview expands from that image and returns to its current position when closed. Set `fit` to match the source image’s cropping; rounded clipping on an outer container also participates in the transition.

The example wraps [Image](/components/image) in a [Button](/components/button) and reads the source image from the click event. The callback can also return an existing native `<img>` on the page.

<Demo name="lightbox/source" />

## Behaviour {#behavior}

- `src` and `preview` are used as provided, including regular image addresses and valid blob URLs.
- `source` is optional. A visible source image supplies the position and clipping shape for opening and closing. Without a source, the preview opens with a fade and a small scale transition.
- `preview` can supply a larger image that replaces `src` once loaded.
- Zooming, panning, rotation, downloading and paging behave like [Image previews](/components/image#preview).
- The caller owns blob URLs and should keep them valid while the preview uses them.
- The component exposes controlled state. An application can connect imperative calls through shared state and a mounted preview component.

## Accessibility {#a11y}

- The current item's `alt` labels its image and the preview dialog.
- Focus remains inside the preview while it is open, and page scrolling is locked.
- `Escape` closes the preview; `←` and `→` move between images.

## API {#api}

| Prop            | Type             | Default  | Description                              |
| --------------- | ---------------- | -------- | ---------------------------------------- |
| `items`         | `LightboxItem[]` | Required | Image sequence                           |
| `v-model:open`  | `boolean`        | `false`  | Whether the preview is open              |
| `v-model:index` | `number`         | `0`      | Current image index, starting at zero    |
| `loop`          | `boolean`        | `false`  | Whether paging wraps at either end       |
| `class`         | `string`         | —        | Additional classes for the preview layer |

### LightboxItem {#item}

| Field     | Type                                          | Description                                                              |
| --------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| `id`      | `string`                                      | Stable, unique identifier; use distinct identifiers for different images |
| `src`     | `string`                                      | Image address                                                            |
| `alt`     | `string`                                      | Image description and dialog name                                        |
| `preview` | `string`                                      | Optional larger image address                                            |
| `fit`     | `ImageVariants['fit']`                        | Source image fit, used to calculate the opening transition               |
| `source`  | `() => HTMLImageElement \| null \| undefined` | Optional function returning the source image                             |
