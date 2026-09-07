---
title: Banner
description: An announcement bar across the top of the page.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/banner/Banner.vue
---

<Demo name="banner/hero" />

## Usage {#usage}

```ts
import { Banner } from '@hina-ui/vue'
```

A banner spans the full width of the page, usually at the very top, for site-wide news such as a release, scheduled maintenance or a campaign. It is a solid block with no radius or border. For a message about one action use [Alert](/components/alert); for a fixed note written into the content use [Callout](/components/callout). Add `sticky top-0` to keep it at the top while the page scrolls.

<Demo name="banner/basic" />

## Examples {#examples}

### Tones {#tones}

Six tones, `accent` by default. The icon follows the tone; set `icon` to `false` to hide it.

<Demo name="banner/tones" />

### Custom icon {#icon}

The `icon` slot replaces the default icon.

<Demo name="banner/icon" />

### Link {#link}

Put a [Link](/components/link) next to the text in the default slot. It takes the banner's text colour and is told apart by its underline.

<Demo name="banner/link" />

### Actions {#actions}

The `actions` slot follows the text and holds a single button.

<Demo name="banner/actions" />

### Closable {#closable}

With `closable` a close button appears at the end and emits `close` when pressed. `v-model:open` controls visibility; remembering that the user closed it is up to the application.

<Demo name="banner/closable" />

### Several notices {#items}

Pass several notices through `items` and render each one in the `item` slot. With more than one, previous and next buttons and a counter appear at the end, the last notice wraps around to the first, and `v-model:index` binds the current notice. Each notice may carry its own `tone` and `icon`; otherwise it takes the banner's. On a switch the icon and text slide together in the direction of travel, and the background and text colours ease over. The close button closes the whole bar.

<Demo name="banner/items" />

### Autoplay {#autoplay}

`autoplay` takes an interval in milliseconds and moves to the next notice at that pace. It pauses while the pointer is over the bar, while focus is inside it or while the page is hidden, and resumes afterwards. It does not run when the user has asked the system for reduced motion.

<Demo name="banner/autoplay" />

### In an AppShell {#app-shell}

The `banner` slot of [AppShell](/components/app-shell) sits above everything, spanning the sidebar and the main area. When the banner is closed, both move up to fill the space.

<Demo name="app-shell/banner" />

## Behaviour {#behavior}

- At viewport widths of 640 pixels and above the text is centred on the bar; below that it starts at the leading edge, takes the whole row apart from the close button and wraps like a paragraph.
- On close the banner collapses and fades out, and the content below moves up smoothly.
- No entrance animation on first render.
- Switching between notices slides the icon and text together in the direction of travel: the next notice enters from the end, the previous one from the start, mirrored in right-to-left writing. The old notice slides out before the new one slides in, and the bar keeps its height.
- Switching to a notice of a different tone eases the background and text colours.

## Accessibility {#a11y}

- The banner is not a live region; screen readers read it in document order.
- The icon is decorative and hidden from assistive technology.
- When notices are switched by hand, the content is a polite live region and screen readers read the new notice; during autoplay it is not, so users are not interrupted repeatedly.
- The close button is named “Close”; the previous and next buttons take their names from `banner.prev` and `banner.next` in the locale.

## API {#api}

### Props {#props}

| Prop       | Type                                                                    | Default    | Description                                                                    |
| ---------- | ----------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `tone`     | `'neutral' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'accent'` | Tone                                                                           |
| `icon`     | `boolean`                                                               | `true`     | Whether to show the icon                                                       |
| `closable` | `boolean`                                                               | `false`    | Whether to show a close button                                                 |
| `open`     | `boolean`                                                               | `true`     | Visibility, supports `v-model:open`                                            |
| `items`    | `T[]`                                                                   | —          | Several notices, rendered by the `item` slot; each may carry `tone` and `icon` |
| `index`    | `number`                                                                | `0`        | Current notice, supports `v-model:index`                                       |
| `autoplay` | `number`                                                                | —          | Interval between notices, in milliseconds                                      |
| `class`    | `string`                                                                | —          | Extra classes on the bar                                                       |

### Events {#events}

| Event          | Payload         | Description                  |
| -------------- | --------------- | ---------------------------- |
| `update:open`  | `open: boolean` | Visibility changed           |
| `update:index` | `index: number` | Current notice changed       |
| `close`        | —               | The close button was pressed |

### Slots {#slots}

| Slot      | Props                        | Description                    |
| --------- | ---------------------------- | ------------------------------ |
| `default` | —                            | Text                           |
| `item`    | `{ item: T, index: number }` | One notice when `items` is set |
| `icon`    | —                            | Replaces the icon              |
| `actions` | —                            | Actions following the text     |
