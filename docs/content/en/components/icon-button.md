---
title: IconButton
description: An icon-only button that requires a name and shows it on hover.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/icon-button/IconButton.vue
---

<Demo name="icon-button/hero" />

## Usage {#usage}

```ts
import { IconButton } from '@hina-ui/vue'
```

`label` is required and serves as both the accessible name and the tooltip text. The default slot holds the icon.

<Demo name="icon-button/basic" />

Toolbars, the end of table rows and the top corner of cards are where space is tight and this component fits; actions with visible text still use `Button`.

## Examples {#examples}

### Variants and tones {#variants}

Variants and tones are identical to `Button`, but the defaults differ. `IconButton` defaults to `ghost` and `neutral`, because it usually appears in dense interfaces where it should not stand out.

<Demo name="icon-button/variants" />

### Sizes {#sizes}

Three sizes. The button is square, with a side equal to the height of a `Button` at the same step.

<Demo name="icon-button/sizes" />

### States {#states}

With `loading` the button shows a spinner and refuses clicks; with `disabled` it is unavailable. The size stays the same while loading.

<Demo name="icon-button/states" />

### Tooltip {#tooltip}

`side` sets where the tooltip appears, defaulting to above. Setting `tooltip` to `false` keeps the accessible name without showing a tooltip.

<Demo name="icon-button/side" />

The tooltip relies on a `TooltipProvider` at the application root. Without one the button still works, only without the tooltip, and `aria-label` is unaffected.

## Accessibility {#a11y}

- `label` is required and becomes the `aria-label` that screen readers announce.
- Icons are invisible to screen readers, so never drop `label` and rely on the icon alone to carry meaning.
- A loading button carries `aria-busy`, which screen readers announce as busy.

## API {#api}

### Props {#props}

| Prop       | Type                                                  | Default     | Description                                      |
| ---------- | ----------------------------------------------------- | ----------- | ------------------------------------------------ |
| `label`    | `string`                                              | —           | Required. Accessible name, also the tooltip text |
| `tooltip`  | `boolean`                                             | `true`      | Whether to show a tooltip on hover               |
| `side`     | `'top' \| 'right' \| 'bottom' \| 'left'`              | `'top'`     | Where the tooltip appears                        |
| `as`       | `string \| Component`                                 | `'button'`  | Element or component to render                   |
| `asChild`  | `boolean`                                             | `false`     | Render nothing, merging into the single child    |
| `variant`  | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'` | `'ghost'`   | Visual style                                     |
| `tone`     | `'accent' \| 'neutral' \| 'danger'`                   | `'neutral'` | Semantic tone                                    |
| `size`     | `'sm' \| 'md' \| 'lg'`                                | `'md'`      | Size                                             |
| `type`     | `'button' \| 'submit' \| 'reset'`                     | `'button'`  | Native button type                               |
| `pill`     | `boolean`                                             | `false`     | Render as a circle                               |
| `loading`  | `boolean`                                             | `false`     | Whether it is loading                            |
| `disabled` | `boolean`                                             | `false`     | Whether it is disabled                           |
| `class`    | `string`                                              | —           | Classes appended to the root                     |

### Slots {#slots}

| Slot      | Description                                   |
| --------- | --------------------------------------------- |
| `default` | The icon, replaced by a spinner while loading |
