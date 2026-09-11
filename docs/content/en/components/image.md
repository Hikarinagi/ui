---
title: Image
description: An image that loads lazily, holds its box and falls back when it fails.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/image/Image.vue
---

<Demo name="image/hero" />

## Usage {#usage}

```ts
import { Image } from '@hina-ui/vue'
```

The picture waits until it comes near the viewport, with a skeleton holding the box while it loads; once the picture is ready the skeleton fades away. Give the box a size through classes, or a `ratio` to have it reserve the height in advance.

<Demo name="image/basic" />

## Examples {#examples}

### Aspect ratio {#ratio}

`ratio` is the width divided by the height. The box takes that shape before the picture exists, so nothing on the page moves when it lands.

<Demo name="image/ratio" />

### Fit {#fit}

`fit` decides how the picture fills its box; the default is `cover`.

<Demo name="image/fit" />

### First-screen pictures {#eager}

`lazy` is on by default, so a picture waits for the observer and is rendered without an address on the server. Turn `lazy` off and `eager` on for the pictures above the fold: the address ships with the first HTML, the request goes out at `fetchpriority="high"`, and decoding switches to synchronous.

<Demo name="image/eager" />

### Empty and failed {#states}

Without `src` the component renders the `empty` slot. When a picture fails and there is no fallback left, it renders the `error` slot instead.

<Demo name="image/states" />

### Falling back {#fallback}

`fallback` is loaded when `src` fails. Should the fallback fail as well, the `error` slot takes over and `error` is emitted.

<Demo name="image/fallback" />

### Resolving addresses {#resolver}

The component only takes `src`, and does not care whether it is a full address or a key in object storage. `provideImageResolver` injects a function that turns `src` into the final address; anything like processing parameters belongs to that function and never has to travel through the component. Without a resolver, `src` is used as it is. The function also receives a second argument naming the purpose: `'image'` for the picture on the page, `'preview'` for the large picture shown in the preview.

<Demo name="image/resolver" />

### Preview {#preview}

With `preview` set, the picture can be clicked to view it enlarged: it grows from its place on the page to the centre of the screen and shrinks back on close. The preview supports zoom, drag, rotation and download, and dragging the picture down also closes it.

The small and large pictures can be two renditions: the resolver addresses each by purpose, or the large address is passed to `preview` directly. The preview opens with the small picture from the page and swaps in the large one once it is ready.

<Demo name="image/preview" />

### Groups {#group}

Put several pictures inside an `ImageGroup` and opening any of them lets you move through the whole set, in the order they appear on the page. With `loop` on, paging wraps around at both ends.

<Demo name="image/group" />

## Behaviour {#behavior}

- The outer box fills its container width by default, with or without `preview`. An explicit width class overrides this default.

- Lazy by default: an intersection observer watches the box, and the address is only attached once the picture comes within `rootMargin` of the viewport, which defaults to 200 pixels.
- On the server the observer has not run yet, so a lazy picture is rendered without an address. Turn `lazy` off and `eager` on for first-screen pictures.
- The skeleton covers the whole box, including the space left empty by `contain`. Once decoded, the picture fades in above it over 300ms while the skeleton fades out over 200ms, both with ease-out easing.
- A lazy picture stays transparent until its fade begins. Disabling the skeleton keeps the picture's fade-in.
- A picture with `lazy` off sits above the skeleton and appears as soon as the browser has painted it, without waiting for script; the skeleton beneath it is dropped outright, with no fade.
- Where the browser has no intersection observer, the picture loads as soon as the component mounts rather than being held back forever.
- Attributes that are not props land on the `img` element, so `sizes`, `srcset` and the like work as usual.
- Changing `src` resets the fallback, so a new picture starts from its own address rather than the previous fallback.
- While the preview is open the page cannot scroll and focus stays inside the preview; closing returns focus to the picture.
- Dragging down moves the picture with the finger and shrinks it while the page shows through the background; letting go before it has travelled far enough springs it back.
- Pinching zooms around the midpoint of the two fingers, the wheel zooms around the pointer, and a double tap zooms to 2.5× under the finger; another double tap returns to the original size. Zoom tops out at 6×; pinching past either limit gets heavier the further it goes, and springs back on release.
- The picture can only be dragged around once zoomed in. Dragging past an edge meets resistance and springs back; a quick flick keeps the picture gliding to a stop, bouncing off the edges. When zoomed, dragging down only pans and never closes.
- Turning the page resets the previous picture's zoom, position and rotation; when pictures are added to or removed from the page, the group in the preview follows. With a single picture, or once you reach either end, dragging meets resistance and springs back.
- Only the current picture fetches its large rendition; moving on abandons it, so the whole set is never pulled down at once.
- Closing and reopening starts over, with zoom and position reset.
- When the system asks for reduced motion, opening and closing no longer travel, and zooming and gliding lose their transitions as well.

## Accessibility {#a11y}

- `alt` goes straight to the `img`. Leave it empty for decorative pictures so screen readers skip them.
- The skeleton is `aria-hidden`; the loading state belongs to the region that owns the picture.
- A picture with `preview` is a button, named by its `alt`, which also titles the preview; an empty `alt` triggers a warning in development.
- While the preview is open, `←` `→` switch pictures. Every button on the thumbnail strip is named by its picture's `alt`, and the current one carries `aria-current`.

## API {#api}

| Prop         | Type                                                       | Default   | Description                                                  |
| ------------ | ---------------------------------------------------------- | --------- | ------------------------------------------------------------ |
| `src`        | `string`                                                   | —         | The address, passed through the resolver                     |
| `alt`        | `string`                                                   | `''`      | Alternative text                                             |
| `fallback`   | `string`                                                   | —         | Loaded when `src` fails                                      |
| `fit`        | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | How the picture fills its box                                |
| `ratio`      | `number`                                                   | —         | Width divided by height, reserved in advance                 |
| `lazy`       | `boolean`                                                  | `true`    | Wait until it nears the viewport                             |
| `rootMargin` | `string`                                                   | `'200px'` | How early loading starts                                     |
| `skeleton`   | `boolean`                                                  | `true`    | Whether a skeleton shows while loading                       |
| `eager`      | `boolean`                                                  | `false`   | Request at high priority, decode in sync                     |
| `preview`    | `boolean \| string`                                        | `false`   | Opens for a closer look; an address becomes the large source |
| `draggable`  | `boolean`                                                  | —         | Whether the picture can be dragged                           |
| `class`      | `string`                                                   | —         | Classes appended to the box                                  |
| `imageClass` | `string`                                                   | —         | Classes appended to the `img`                                |

| Event   | Payload                   | Description                  |
| ------- | ------------------------- | ---------------------------- |
| `load`  | `size: { width, height }` | The picture has loaded       |
| `error` | —                         | Every address has been tried |

| Slot       | Description                            |
| ---------- | -------------------------------------- |
| `skeleton` | Replaces the built-in loading skeleton |
| `empty`    | Rendered when there is no `src`        |
| `error`    | Rendered when loading has failed       |
