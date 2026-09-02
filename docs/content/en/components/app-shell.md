---
title: AppShell
description: The outer frame of an application, holding the sidebar, header and main area.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/app-shell/AppShell.vue
---

<Demo name="app-shell/hero" />

## Usage {#usage}

```ts
import { AppShell } from '@hina-ui/vue'
```

`AppShell` fills the viewport and divides the interface into three parts: the `sidebar` slot on the left, the `header` slot along the top and the default slot for the main area. All three are optional.

It is also the source of the sidebar's state. `Sidebar`, `SidebarGroup`, `SidebarTrigger` and any `NavLink` inside the sidebar read their state from here; outside an `AppShell` they fall back to the expanded form and `SidebarTrigger` does not render at all.

<Demo name="app-shell/basic" />

The component is one viewport tall by default. A frame embedded within a page can override the height through `class`, which is what the examples on this page do.

## Examples {#examples}

### Collapsed form {#collapsible}

`collapsible` decides what the sidebar becomes when collapsed on desktop: `rail` leaves a strip of icons, `hidden` takes the sidebar away entirely. The default is `rail`.

The state can be bound two-way with `v-model:sidebar`, taking `expanded`, `rail` or `hidden`. Bind it when the current form has to be read or set from elsewhere; otherwise leave the component to manage it.

<Demo name="app-shell/collapsible" />

### Scrolling the main area {#scroll}

The main area brings its own scroll container, so however long the content grows it scrolls within that area while the header and sidebar stay put.

<Demo name="app-shell/scroll" />

## Behaviour {#behavior}

- At viewport widths of 1024 pixels and above the layout is desktop and the sidebar sits permanently on the left; below that the sidebar moves into a drawer, carrying the contents of the `sidebar` slot unchanged.
- On desktop, `SidebarTrigger` switches between expanded and the form named by `collapsible`; on narrow screens it opens the drawer.
- The drawer's open state can be bound with `v-model:mobileOpen`.
- With `autoClose` on, a route change closes the drawer so it does not stay in front of the content after navigating. It is on by default.
- `restoreKey` is placed on the main area's scroll container for scroll-position restoration.
- A tooltip provider is built in, so the hover hints a rail sidebar shows need no extra wrapper.

## Accessibility {#a11y}

- The header renders as `header` and the main area as `main`; the sidebar's navigation landmark comes from `Sidebar` itself.
- `SidebarTrigger` carries an accessible name in the interface language (“Toggle sidebar” in English).
- In the drawer form, focus is trapped inside the drawer and returned to the trigger on close, which `Drawer` guarantees.

## API {#api}

### Props {#props}

| Prop          | Type                 | Default  | Description                                     |
| ------------- | -------------------- | -------- | ----------------------------------------------- |
| `collapsible` | `'rail' \| 'hidden'` | `'rail'` | What the sidebar collapses to on desktop        |
| `autoClose`   | `boolean`            | `true`   | Whether a route change closes the mobile drawer |
| `restoreKey`  | `string`             | —        | Scroll-restoration key for the main area        |
| `class`       | `string`             | —        | Classes appended to the root                    |

### Two-way bindings {#models}

| Name         | Type           | Default      | Description                       |
| ------------ | -------------- | ------------ | --------------------------------- |
| `sidebar`    | `SidebarState` | `'expanded'` | Sidebar form on desktop           |
| `mobileOpen` | `boolean`      | `false`      | Whether the mobile drawer is open |

### Slots {#slots}

| Slot      | Description                                        |
| --------- | -------------------------------------------------- |
| `sidebar` | Sidebar content, moved into the drawer when narrow |
| `header`  | Content of the top bar                             |
| `default` | Content of the main area                           |

### Expose {#expose}

| Name           | Type                       | Description                              |
| -------------- | -------------------------- | ---------------------------------------- |
| `mainViewport` | `HTMLElement \| undefined` | Viewport element of the main scroll area |
| `mainArea`     | `ScrollArea \| undefined`  | The main area's scroll container         |
