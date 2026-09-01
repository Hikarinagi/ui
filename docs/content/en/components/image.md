---
title: Image
description: An image that loads lazily, holds its box and falls back when it fails.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/image/Image.vue
  - label: Skeleton
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/skeleton/Skeleton.vue
---

<Demo name="image/hero" />

## Usage {#usage}

```ts
import { Image } from '@hikarinagi/ui'
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

The component only takes `src`, and does not care whether it is a full address or a key in object storage. `provideImageResolver` injects a function that turns `src` into the final address; anything like processing parameters belongs to that function and never has to travel through the component. Without a resolver, `src` is used as it is.

<Demo name="image/resolver" />

## Behaviour {#behavior}

- Lazy by default: an intersection observer watches the box, and the address is only attached once the picture comes within `rootMargin` of the viewport, which defaults to 200 pixels.
- On the server the observer has not run yet, so a lazy picture is rendered without an address. Turn `lazy` off and `eager` on for first-screen pictures.
- The skeleton covers the whole box, including the space `contain` and friends leave empty. Once the picture is decoded it appears underneath, and only then does the skeleton fade away.
- A lazy picture is not painted while the skeleton is up, so the skeleton's edge never lets the picture bleed through.
- A picture with `lazy` off sits above the skeleton and appears as soon as the browser has painted it, without waiting for script; the skeleton beneath it is dropped outright, with no fade.
- Where the browser has no intersection observer, the picture loads as soon as the component mounts rather than being held back forever.
- Attributes that are not props land on the `img` element, so `sizes`, `srcset` and the like work as usual.
- Changing `src` resets the fallback, so a new picture starts from its own address rather than the previous fallback.

## Accessibility {#a11y}

- `alt` goes straight to the `img`. Leave it empty for decorative pictures so screen readers skip them.
- The skeleton is `aria-hidden`; the loading state belongs to the region that owns the picture.

## API {#api}

| Prop         | Type                                                       | Default   | Description                                  |
| ------------ | ---------------------------------------------------------- | --------- | -------------------------------------------- |
| `src`        | `string`                                                   | —         | The address, passed through the resolver     |
| `alt`        | `string`                                                   | `''`      | Alternative text                             |
| `fallback`   | `string`                                                   | —         | Loaded when `src` fails                      |
| `fit`        | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | How the picture fills its box                |
| `ratio`      | `number`                                                   | —         | Width divided by height, reserved in advance |
| `lazy`       | `boolean`                                                  | `true`    | Wait until it nears the viewport             |
| `rootMargin` | `string`                                                   | `'200px'` | How early loading starts                     |
| `skeleton`   | `boolean`                                                  | `true`    | Whether a skeleton shows while loading       |
| `eager`      | `boolean`                                                  | `false`   | Request at high priority, decode in sync     |
| `draggable`  | `boolean`                                                  | —         | Whether the picture can be dragged           |
| `class`      | `string`                                                   | —         | Classes appended to the box                  |
| `imageClass` | `string`                                                   | —         | Classes appended to the `img`                |

| Event   | Payload                   | Description                  |
| ------- | ------------------------- | ---------------------------- |
| `load`  | `size: { width, height }` | The picture has loaded       |
| `error` | —                         | Every address has been tried |

| Slot       | Description                            |
| ---------- | -------------------------------------- |
| `skeleton` | Replaces the built-in loading skeleton |
| `empty`    | Rendered when there is no `src`        |
| `error`    | Rendered when loading has failed       |
