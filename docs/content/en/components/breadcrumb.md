---
title: Breadcrumb
description: Shows where the current page sits in the hierarchy.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/breadcrumb/Breadcrumb.vue
---

<Demo name="breadcrumb/hero" />

## Usage {#usage}

```ts
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/vue'
```

`Breadcrumb` is the navigation landmark, `BreadcrumbItem` is one level of the hierarchy and `BreadcrumbSeparator` sits between items. Items and separators alternate, and the last item is marked with `current`.

A `current` item is not a link: it renders as text carrying `aria-current="page"`. Linking the current page to itself achieves nothing and leaves screen readers announcing a link that goes nowhere.

<Demo name="breadcrumb/basic" />

A breadcrumb records position in the hierarchy, not browsing history. It runs from the site root down to the current page regardless of how the reader arrived.

## Examples {#examples}

### Separator {#separator}

The separator is a right-pointing chevron by default. The default slot replaces it with anything — a slash and a middle dot are the usual alternatives. Keep one separator style throughout a single trail.

<Demo name="breadcrumb/separator" />

### Router links {#router}

`as` sets what an item renders as, defaulting to `a`. Pass a router component in Nuxt or Vue Router for client-side navigation; remaining attributes such as `to` and `href` pass through to that element.

Use `as-child` to take over rendering entirely, in which case the item's classes are merged onto the slot's root element.

<Demo name="breadcrumb/router" />

### Icons {#icon}

An item can hold any content. The first item often uses an icon in place of the word “Home”; when it does, mark the icon `aria-hidden` and add a `VisuallyHidden` name for screen readers — otherwise the item is a link with no accessible name.

<Demo name="breadcrumb/icon" />

### Landmark name {#label}

`Breadcrumb` renders as a `nav` landmark with an accessible name in the interface language. When a page holds several navigation landmarks, name each with `label` so they can be told apart in a screen reader's landmark list.

<Demo name="breadcrumb/label" />

## Accessibility {#a11y}

- The wrapper is a `nav` landmark holding an ordered list, so screen readers announce the number of items and each item's position.
- Separators carry `aria-hidden` and are not announced.
- The current item carries `aria-current="page"` and is not clickable.
- The default landmark name follows the interface language (“Breadcrumb” in English) and `label` overrides it.
- When an icon replaces text, supply a readable name separately.

## API {#api}

### Breadcrumb {#props}

| Prop    | Type     | Default            | Description                     |
| ------- | -------- | ------------------ | ------------------------------- |
| `label` | `string` | Interface language | Accessible name of the landmark |
| `class` | `string` | —                  | Classes appended to the root    |

| Slot      | Description                      |
| --------- | -------------------------------- |
| `default` | Alternating items and separators |

### BreadcrumbItem {#item}

| Prop      | Type                  | Default | Description                                        |
| --------- | --------------------- | ------- | -------------------------------------------------- |
| `current` | `boolean`             | `false` | Whether this is the current page, rendered as text |
| `as`      | `string \| Component` | `'a'`   | Element or component to render as                  |
| `asChild` | `boolean`             | `false` | Let the slot's root element do the rendering       |
| `class`   | `string`              | —       | Classes appended to the root                       |

Remaining attributes pass through to the rendered element, such as `href` or a router component's `to`.

| Slot      | Description  |
| --------- | ------------ |
| `default` | Item content |

### BreadcrumbSeparator {#separator-api}

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |

| Slot      | Description                                   |
| --------- | --------------------------------------------- |
| `default` | Separator content, a right chevron by default |
