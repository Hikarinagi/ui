---
title: Page
description: The skeleton of a page's content, with a header, body and aside.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/page/Page.vue
---

<Demo name="page/hero" />

## Usage {#usage}

```ts
import { Page, PageAside, PageBody, PageHeader } from '@hina-ui/vue'
```

`Page` is the container for a page's content and handles the maximum width, centring and vertical padding. `PageHeader` is the title region, `PageBody` the main content and `PageAside` the secondary column on the right, passed through the `aside` slot.

`Page` and `AppShell` work at two different levels: `AppShell` divides the sidebar, top bar and main area, while `Page` structures what sits inside that main area. They stack, and either can be used alone.

<Demo name="page/basic" />

The `title` on `PageHeader` renders as the page's top-level heading, so a page should hold only one `PageHeader`.

`size` sets the maximum width of the content and passes through to the underlying `Container`: `sm` is 48rem, `md` 64rem, `lg` 72rem and `xl` 80rem, defaulting to `md`. Long-form reading wants a narrower step; a detail page with an aside wants a wider one.

## Examples {#examples}

### Header {#header}

`eyebrow` is a small line above the title, usually a category or parent; `title` is the heading; `description` is a sentence beneath it. All three are optional.

The `actions` slot holds page-level actions, sitting below the title on narrow screens and to its right on wider ones. The default slot comes at the end of the header, for tags, ratings and anything else that belongs directly under the title.

<Demo name="page/header" />

### Aside {#aside}

`PageAside` suits an in-page contents list, related entries and similar secondary content. It sticks to the top as the page scrolls and is hidden entirely below a viewport width of 1280 pixels, so nothing that exists only here may go in it.

`label` renders as the aside's small heading and doubles as the accessible name of the region.

<Demo name="page/aside" />

## Behaviour {#behavior}

- Direct children of `Page` are spaced 8 units apart, and children of `PageBody` 6 units apart.
- The aside sits beside the main column, which takes the remaining width, with 10 units between them.
- The aside sticks to the top of the container and stays in view while the page scrolls.
- From medium screens up the header moves its actions to the right of the title; on narrow screens they wrap underneath.

## Accessibility {#a11y}

- `PageHeader` renders as `header` and `PageAside` as an `aside` landmark.
- `title` is the page's top-level heading and should appear only once per page.
- Given a `label`, `PageAside` generates a second-level heading and links it with `aria-labelledby`, so several asides can be told apart in a screen reader's landmark list.
- The aside is hidden on narrow screens, so its content must be reachable elsewhere too.

## API {#api}

### Page {#props}

| Prop    | Type                           | Default | Description                  |
| ------- | ------------------------------ | ------- | ---------------------------- |
| `size`  | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | Maximum width of the content |
| `class` | `string`                       | —       | Classes appended to the root |

| Slot      | Description                       |
| --------- | --------------------------------- |
| `default` | Content of the main column        |
| `aside`   | The secondary column on the right |

### PageHeader {#header-api}

| Prop          | Type     | Default | Description                                   |
| ------------- | -------- | ------- | --------------------------------------------- |
| `eyebrow`     | `string` | —       | Small line above the title                    |
| `title`       | `string` | —       | Page title, rendered as the top-level heading |
| `description` | `string` | —       | Sentence beneath the title                    |
| `class`       | `string` | —       | Classes appended to the root                  |

| Slot      | Description                      |
| --------- | -------------------------------- |
| `default` | Content at the end of the header |
| `actions` | Page-level actions               |

### PageBody {#body}

| Prop    | Type     | Default | Description                  |
| ------- | -------- | ------- | ---------------------------- |
| `class` | `string` | —       | Classes appended to the root |

| Slot      | Description  |
| --------- | ------------ |
| `default` | Main content |

### PageAside {#aside-api}

| Prop    | Type     | Default | Description                                    |
| ------- | -------- | ------- | ---------------------------------------------- |
| `label` | `string` | —       | Small heading, doubling as the accessible name |
| `class` | `string` | —       | Classes appended to the root                   |

| Slot      | Description          |
| --------- | -------------------- |
| `default` | Content of the aside |
