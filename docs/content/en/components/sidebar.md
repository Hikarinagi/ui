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
import { Sidebar, SidebarGroup, SidebarLabel, SidebarTrigger } from '@hina-ui/vue'
```

`Sidebar` goes in the `sidebar` slot of an [AppShell](/components/app-shell), with its entries — usually a run of [NavLink](/components/nav-link) — in the default slot. It brings its own navigation landmark and scroll container, so a long list scrolls within the column.

Its form comes from [AppShell](/components/app-shell); it holds no state of its own. Outside an [AppShell](/components/app-shell) it is always expanded and cannot be collapsed.

<Demo name="sidebar/basic" />

Every [NavLink](/components/nav-link) inside the sidebar should carry a `label`: once collapsed to a rail the text fades out and `label` takes over as both the hover hint and the accessible name.

## Examples {#examples}

### Groups {#groups}

`SidebarGroup` gathers entries under a collapsible heading. `label` is the group name and `defaultOpen` sets whether it starts open, which it does by default.

<Demo name="sidebar/groups" />

### Header and footer {#slots}

The `header` and `footer` slots sit above and below the entries and neither scrolls with them.

The header and footer retain their expanded content width, preventing content from squeezing or wrapping during collapse. Wrap text and secondary actions in `SidebarLabel` to fade them out with [NavLink](/components/nav-link) labels and delay their fade-in on expansion. Keep the logo and [Avatar](/components/avatar) outside it so their size and position stay fixed.

`SidebarLabel` preserves its layout space. In rail form, its contents are hidden from view, interaction, screen readers and keyboard focus. The `header` and `footer` slots still provide `{ state }` for custom content that needs the current form.

<Demo name="sidebar/slots" />

## Behaviour {#behavior}

- The three forms are 256 pixels wide when expanded, 56 as a rail and 0 when hidden, and the width transitions continuously between them.
- Collapsed to a rail, `SidebarGroup` is forced open, its heading fades into a divider while retaining the same space. Entries in expanded groups keep their vertical positions.
- The entry area is a scroll container; the header and footer stay fixed at either end.
- When fully hidden, the entire sidebar leaves interaction and keyboard focus.
- Width and label transitions use Hina motion tokens and switch instantly with reduced motion enabled.
- Inside the mobile [Drawer](/components/drawer), horizontal padding comes from the drawer. The header, entries and footer retain their vertical padding.

## Accessibility {#a11y}

- The entry area is a `nav` landmark whose default accessible name follows the interface language (“Sidebar navigation” in English); `label` overrides it.
- In the rail form the entry text is invisible, but each [NavLink](/components/nav-link)'s `label` remains as its `aria-label`.
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

### SidebarLabel {#label}

Controls the visibility of custom labels and secondary content in rail form. Always visible outside a sidebar state provider.

| Prop    | Type     | Default  | Description                  |
| ------- | -------- | -------- | ---------------------------- |
| `as`    | `string` | `'span'` | Element to render            |
| `class` | `string` | —        | Classes appended to the root |

| Slot      | Description                                         |
| --------- | --------------------------------------------------- |
| `default` | Content hidden when the sidebar collapses to a rail |

### SidebarTrigger {#trigger}

The button that switches the sidebar's form, usually placed in the `header` slot of [AppShell](/components/app-shell). It has nothing to configure and does not render outside an [AppShell](/components/app-shell).

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |
