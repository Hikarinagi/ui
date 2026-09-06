---
title: Sidebar
description: The navigation column on the left of an application, collapsible to a rail of icons.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/sidebar/Sidebar.vue
---

<Demo name="sidebar/hero" />

## Usage {#usage}

```ts
import { Sidebar, SidebarGroup, SidebarTrigger } from '@hina-ui/vue'
```

`Sidebar` goes in the `sidebar` slot of an `AppShell`, with its entries — usually a run of `NavLink` — in the default slot. It brings its own navigation landmark and scroll container, so a long list scrolls within the column.

Its form comes from `AppShell`; it holds no state of its own. Outside an `AppShell` it is always expanded and cannot be collapsed.

<Demo name="sidebar/basic" />

Every `NavLink` inside the sidebar should carry a `label`: once collapsed to a rail the text fades out and `label` takes over as both the hover hint and the accessible name.

## Examples {#examples}

### Groups {#groups}

`SidebarGroup` gathers entries under a collapsible heading. `label` is the group name and `defaultOpen` sets whether it starts open, which it does by default.

<Demo name="sidebar/groups" />

### Header and footer {#slots}

The `header` and `footer` slots sit above and below the entries and neither scrolls with them.

Collapsed to a rail the column is only 56 pixels wide, and content in these regions is clipped to fit. What goes here should hold up at both widths — a square mark, a single icon or a small avatar. Both slots receive the current form for callers that need to react to it.

<Demo name="sidebar/slots" />

## Behaviour {#behavior}

- The three forms are 256 pixels wide when expanded, 56 as a rail and 0 when hidden, and the width transitions continuously between them.
- Collapsed to a rail, `SidebarGroup` is forced open, its heading gives way to a divider and leaves the keyboard order, since there is nowhere left to show the group name.
- The entry area is a scroll container; the header and footer stay fixed at either end.
- With reduced motion enabled the width switches instantly rather than transitioning.
- Moved into the mobile drawer, the sidebar drops its own padding and leaves spacing to the drawer.

## Accessibility {#a11y}

- The entry area is a `nav` landmark whose default accessible name follows the interface language (“Sidebar navigation” in English); `label` overrides it.
- In the rail form the entry text is invisible, but each `NavLink`'s `label` remains as its `aria-label`.
- A group heading hidden by the rail also leaves the keyboard order, so no control is focusable while invisible.

## API {#api}

### Sidebar {#props}

| Prop    | Type     | Default            | Description                     |
| ------- | -------- | ------------------ | ------------------------------- |
| `label` | `string` | Interface language | Accessible name of the landmark |
| `class` | `string` | —                  | Classes appended to the root    |

| Slot      | Slot props  | Description               |
| --------- | ----------- | ------------------------- |
| `default` | —           | Sidebar entries           |
| `header`  | `{ state }` | Content above the entries |
| `footer`  | `{ state }` | Content below the entries |

### SidebarGroup {#group}

| Prop          | Type      | Default  | Description                  |
| ------------- | --------- | -------- | ---------------------------- |
| `label`       | `string`  | Required | Group name                   |
| `defaultOpen` | `boolean` | `true`   | Whether it starts open       |
| `class`       | `string`  | —        | Classes appended to the root |

| Slot      | Description          |
| --------- | -------------------- |
| `default` | Entries in the group |

### SidebarTrigger {#trigger}

The button that switches the sidebar's form, usually placed in the `header` slot of `AppShell`. It has nothing to configure and does not render outside an `AppShell`.

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |
