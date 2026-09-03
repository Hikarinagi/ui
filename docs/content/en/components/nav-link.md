---
title: NavLink
description: One entry in a navigation list, marking the current page.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/nav-link/NavLink.vue
---

<Demo name="nav-link/hero" />

## Usage {#usage}

```ts
import { NavLink } from '@hina-ui/vue'
```

`NavLink` is one entry in a vertical navigation list. It renders as a link by default and the whole row is clickable. It brings no list container of its own — wrap the entries in a `Stack` or a `nav`.

<Demo name="nav-link/basic" />

Its split with `Link` is clear-cut: `Link` is an inline text link that flows with the sentence around it, while `NavLink` is a row in a navigation structure with a fixed height and a full-row hit area. Do not use `NavLink` in body text.

## Examples {#examples}

### Current entry {#active}

`active` marks the page the reader is on: the text returns to full colour and weight, and a selected state layer appears. It also sets `aria-current="page"`, which is how screen readers announce the current location.

Only one entry in a group should be `active` at a time.

<Demo name="nav-link/active" />

Hovering an active entry adds the hover layer on top of the selected one rather than replacing it, so contrast only rises and the selected state never gets lost mid-hover.

### Icons {#icon}

The `icon` slot sits before the text and the component sizes it to four units, so no size class is needed on the icon itself. The icon is decoration; the text is the readable name.

<Demo name="nav-link/icon" />

### Router links {#router}

`as` sets what the entry renders as, defaulting to `a`. Pass a router component for client-side navigation and attributes such as `to` pass through. The caller decides which entry is current from the route and passes `active`; the component does no route matching of its own.

<Demo name="nav-link/router" />

### Unavailable {#disabled}

`disabled` suits an entry that cannot be entered for now: it drops to half opacity, ignores mouse clicks, leaves the keyboard tab order and carries `aria-disabled="true"`.

An entry that stays unavailable should be removed rather than left greyed out.

<Demo name="nav-link/disabled" />

### Collapsed sidebar {#rail}

Inside a `Sidebar`, `NavLink` follows the sidebar's state. When the sidebar collapses to a rail of icons, the text fades out and `label` is shown as a hover tooltip instead, serving at the same time as the entry's accessible name.

So every `NavLink` inside a `Sidebar` should carry a `label`, otherwise a collapsed entry has neither visible text nor a readable name. Outside a `Sidebar`, `label` has no effect and no tooltip is rendered. See the Sidebar documentation for the pattern.

## Accessibility {#a11y}

- The current entry carries `aria-current="page"`, so position is not conveyed by colour alone.
- An unavailable entry carries `aria-disabled="true"` and leaves the tab order.
- The icon is marked as decoration and stays out of the reading order; the readable name comes from the default slot.
- Collapsed to a rail, the text is invisible but `label` remains as `aria-label`, so announcements are unaffected.
- The component renders no `nav` landmark — the surrounding container must provide one.

## API {#api}

### Props {#props}

| Prop       | Type                  | Default | Description                                          |
| ---------- | --------------------- | ------- | ---------------------------------------------------- |
| `active`   | `boolean`             | `false` | Whether this is the current page                     |
| `disabled` | `boolean`             | `false` | Whether the entry is unavailable                     |
| `label`    | `string`              | —       | Tooltip and accessible name when collapsed to a rail |
| `as`       | `string \| Component` | `'a'`   | Element or component to render as                    |
| `asChild`  | `boolean`             | `false` | Let the slot's root element do the rendering         |
| `class`    | `string`              | —       | Classes appended to the root                         |

Remaining attributes pass through to the rendered element, such as `href` or a router component's `to`.

### Slots {#slots}

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | The entry's text, and its readable name |
| `icon`    | An icon shown before the text           |
