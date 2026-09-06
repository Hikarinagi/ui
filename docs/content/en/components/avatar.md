---
title: Avatar
description: A round portrait standing for a person or an entity.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/avatar/Avatar.vue
---

<Demo name="avatar/hero" />

## Usage {#usage}

```ts
import { Avatar } from '@hina-ui/vue'
```

`src` is the picture and `name` is the person behind it. The picture shows once it loads; failing that, the initials of the name; failing that, a generic icon.

<Demo name="avatar/basic" />

## Examples {#examples}

### Sizes {#sizes}

The three steps are 24, 32 and 40 pixels. An avatar is always round; there is no square or rounded-corner option.

<Demo name="avatar/sizes" />

### Fallbacks {#fallback}

Initials follow the writing system: a Chinese, Japanese or Korean name gives its first character, a Western one the initials of its first two parts. A picture that fails to load falls back the same way, and the broken image never shows.

<Demo name="avatar/fallback" />

### Groups {#group}

`AvatarGroup` stacks several avatars together. `max` caps how many are shown and folds the rest into a `+N`. A `size` on the group sets the size for all of them, and an avatar with its own `size` keeps it.

<Demo name="avatar/group" />

### Custom content {#custom}

The default slot replaces the built-in fallback with an icon or a short piece of text.

<Demo name="avatar/custom" />

## Behaviour {#behavior}

- The avatar is rendered by [Image](/components/image), so its address goes through `provideImageResolver` too and a skeleton holds the circle while it loads.
- The picture fills the circle with `object-fit: cover`, so an image of a different aspect ratio is not stretched.
- The fallback shows when there is no `src` or the picture fails; a failed picture is removed.
- Image's other props can be written straight on Avatar — `fallback`, `lazy`, `eager` and the rest are passed through.

## Accessibility {#a11y}

- With a picture, `alt` is its alternative text; without `alt` it falls back to `name`.
- The initials and the icon are decorative: a screen reader reads the name in the surrounding text rather than announcing the avatar twice.

## API {#api}

| Prop    | Type                   | Default | Description                            |
| ------- | ---------------------- | ------- | -------------------------------------- |
| `src`   | `string`               | —       | The picture                            |
| `alt`   | `string`               | —       | Alternative text; falls back to `name` |
| `name`  | `string`               | —       | The name the initials come from        |
| `size`  | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size                                   |
| `class` | `string`               | —       | Classes appended to the root           |

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | Replaces the built-in fallback |

### AvatarGroup {#group-api}

| Prop    | Type                   | Default | Description                                   |
| ------- | ---------------------- | ------- | --------------------------------------------- |
| `max`   | `number`               | —       | How many to show; the rest fold into a count  |
| `size`  | `'sm' \| 'md' \| 'lg'` | —       | Size for the group; an avatar may override it |
| `class` | `string`               | —       | Classes appended to the container             |

| Slot      | Description |
| --------- | ----------- |
| `default` | The avatars |
