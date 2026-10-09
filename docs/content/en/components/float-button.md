---
title: FloatButton
description: Keep a common action at the edge of a page or container.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/float-button/FloatButton.vue
---

<Demo name="float-button/hero" />

## Usage {#usage}

```ts
import { FloatButton } from '@hina-ui/vue'
```

The button defaults to the logical bottom-end corner of the viewport. Provide an action name through `label` and an icon through the default slot. Use it for common actions such as creating content or opening help. Keep local actions in regular `Button` or `IconButton` controls.

::: vue

```vue
<FloatButton label="New note" @click="createNote"><Plus /></FloatButton>
```

:::

::: react

```tsx
<FloatButton label="New note" onClick={createNote}>
  <Plus />
</FloatButton>
```

:::

::: vue

For a page-level action, mount it near the outer application shell so transformed ancestors do not change its fixed-position containing block. The component stays in place rather than teleporting to `body`, preserving its local theme, direction, and component context. The example above uses `position="absolute"` to keep the action inside its preview panel.

:::

::: react

For a page-level action, mount it near the outer application shell so transformed ancestors do not change its fixed-position containing block. The component stays in place rather than rendering into `body` through a portal, preserving its local theme, direction, and component context. The example above uses `position="absolute"` to keep the action inside its preview panel.

:::

## Examples {#examples}

### Appearance {#appearance}

Choose solid, soft, or outline styling. `shape="square"` uses a rounded square. Icon buttons reuse Tooltip when a `TooltipProvider` is available; `AppShell` already includes one. The accessible `label` is always present, independently of the tooltip.

<Demo name="float-button/appearance" />

### Size and visible labels {#sizes}

`sm`, `md`, and `lg` have default heights of 40, 48, and 56px. `extended` displays the label beside the icon and suppresses the duplicate tooltip. Long labels truncate within the available width.

<Demo name="float-button/sizes" />

### Position and direction {#placement}

`placement` uses logical directions: start and end swap in RTL. `absolute` positions relative to the nearest positioned ancestor. `static` participates in normal layout, allowing composition with `Stack`. `offset` sets the edge spacing, and `{ x, y }` sets the horizontal and vertical spacing separately; fixed positioning also respects device safe areas.

<Demo name="float-button/placement" />

### States and visibility {#states}

`visible` controls enter and exit transitions. An exiting button is inert. `loading` keeps its dimensions and prevents repeated actions, while `disabled` makes it unavailable.

<Demo name="float-button/states" />

### In-app navigation {#link}

::: vue

Set `as` to your router's link component. Attributes such as `to` pass through to the action, preserving SPA navigation.

:::

::: react

The props of `FloatButton` are typed as button attributes and have no `href`. To navigate to another page, use `useRouter` from `next/navigation` in a client component and call `router.push` in `onClick`.

:::

::: vue

```vue
<FloatButton :as="NuxtLink" :to="localePath('/components')" label="Component documentation">
  <BookOpen />
</FloatButton>
```

:::

::: react

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { FloatButton } from '@hina-ui/react'

export function DocsShortcut() {
  const router = useRouter()
  return (
    <FloatButton label="Component documentation" onClick={() => router.push('/components')}>
      <BookOpen />
    </FloatButton>
  )
}
```

:::

## API {#api}

### Props {#props}

::: vue

| Prop          | Type                                                                 | Default        | Description                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`                                                             | Required       | Accessible action name and tooltip text                                                                                                                                                                    |
| `visible`     | `boolean`                                                            | `true`         | Show the button with visibility transitions                                                                                                                                                                |
| `position`    | `'fixed' \| 'absolute' \| 'static'`                                  | `'fixed'`      | Positioning mode                                                                                                                                                                                           |
| `placement`   | `'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'`         | `'bottom-end'` | Corner; ignored in static layout                                                                                                                                                                           |
| `offset`      | `number \| string \| { x?: number \| string; y?: number \| string }` | `6 × spacing`  | Edge spacing; numbers are pixels. The object form sets horizontal `x` and vertical `y` separately, and an omitted axis uses the default. Fixed positioning uses the greater of spacing and safe-area inset |
| `size`        | `'sm' \| 'md' \| 'lg'`                                               | `'md'`         | Button size                                                                                                                                                                                                |
| `shape`       | `'circle' \| 'square'`                                               | `'circle'`     | Circular or rounded-square shape                                                                                                                                                                           |
| `extended`    | `boolean`                                                            | `false`        | Show the label beside the icon                                                                                                                                                                             |
| `variant`     | `'solid' \| 'soft' \| 'outline'`                                     | `'solid'`      | Appearance                                                                                                                                                                                                 |
| `tone`        | `'accent' \| 'neutral' \| 'danger'`                                  | `'accent'`     | Color tone                                                                                                                                                                                                 |
| `tooltip`     | `boolean`                                                            | `true`         | Show a tooltip in icon-only mode                                                                                                                                                                           |
| `tooltipSide` | `'top' \| 'right' \| 'bottom' \| 'left'`                             | `'top'`        | Preferred tooltip side                                                                                                                                                                                     |
| `loading`     | `boolean`                                                            | `false`        | Show progress and block activation                                                                                                                                                                         |
| `disabled`    | `boolean`                                                            | `false`        | Disable the action                                                                                                                                                                                         |
| `ripple`      | `boolean`                                                            | `true`         | Ripple feedback                                                                                                                                                                                            |
| `as`          | `string \| Component`                                                | `'button'`     | Action element or component                                                                                                                                                                                |
| `type`        | `'button' \| 'submit' \| 'reset'`                                    | `'button'`     | Native button type                                                                                                                                                                                         |
| `class`       | `string`                                                             | —              | Button classes                                                                                                                                                                                             |
| `style`       | `StyleValue`                                                         | —              | Button styles                                                                                                                                                                                              |

:::

::: react

| Prop          | Type                                                                 | Default        | Description                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`                                                             | Required       | Accessible action name and tooltip text                                                                                                                                                                    |
| `visible`     | `boolean`                                                            | `true`         | Show the button with visibility transitions                                                                                                                                                                |
| `position`    | `'fixed' \| 'absolute' \| 'static'`                                  | `'fixed'`      | Positioning mode                                                                                                                                                                                           |
| `placement`   | `'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'`         | `'bottom-end'` | Corner; ignored in static layout                                                                                                                                                                           |
| `offset`      | `number \| string \| { x?: number \| string; y?: number \| string }` | `6 × spacing`  | Edge spacing; numbers are pixels. The object form sets horizontal `x` and vertical `y` separately, and an omitted axis uses the default. Fixed positioning uses the greater of spacing and safe-area inset |
| `size`        | `'sm' \| 'md' \| 'lg'`                                               | `'md'`         | Button size                                                                                                                                                                                                |
| `shape`       | `'circle' \| 'square'`                                               | `'circle'`     | Circular or rounded-square shape                                                                                                                                                                           |
| `extended`    | `boolean`                                                            | `false`        | Show the label beside the icon                                                                                                                                                                             |
| `variant`     | `'solid' \| 'soft' \| 'outline'`                                     | `'solid'`      | Appearance                                                                                                                                                                                                 |
| `tone`        | `'accent' \| 'neutral' \| 'danger'`                                  | `'accent'`     | Color tone                                                                                                                                                                                                 |
| `tooltip`     | `boolean`                                                            | `true`         | Show a tooltip in icon-only mode                                                                                                                                                                           |
| `tooltipSide` | `'top' \| 'right' \| 'bottom' \| 'left'`                             | `'top'`        | Preferred tooltip side                                                                                                                                                                                     |
| `loading`     | `boolean`                                                            | `false`        | Show progress and block activation                                                                                                                                                                         |
| `disabled`    | `boolean`                                                            | `false`        | Disable the action                                                                                                                                                                                         |
| `ripple`      | `boolean`                                                            | `true`         | Ripple feedback                                                                                                                                                                                            |
| `as`          | `string \| Component`                                                | `'button'`     | Action element or component                                                                                                                                                                                |
| `type`        | `'button' \| 'submit' \| 'reset'`                                    | `'button'`     | Native button type                                                                                                                                                                                         |
| `className`   | `string`                                                             | —              | Button classes                                                                                                                                                                                             |
| `style`       | `CSSProperties`                                                      | —              | Button styles                                                                                                                                                                                              |

:::

Native attributes and listeners, such as `id`, `form`, and `@click`, pass through to the button.

### Slots {#slots}

| Slot      | Description                                           |
| --------- | ----------------------------------------------------- |
| `default` | Action icon; displayed before the label when extended |

### Expose {#expose}

| Name      | Type                       | Description              |
| --------- | -------------------------- | ------------------------ |
| `element` | `HTMLElement \| undefined` | Current action element   |
| `focus`   | `() => void`               | Focus the enabled button |
