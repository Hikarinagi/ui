---
title: Button
description: Triggers a single action. Variant sets the visual style, tone sets the meaning.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/button/Button.vue
  - label: Variants
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/button/button.variants.ts
  - label: Interaction styles
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/styles/interaction.css
---

<Demo name="button/hero" />

## Usage {#usage}

```ts
import { Button } from '@hina-ui/vue'
```

Give one screen a single primary action, put the rest in lighter variants, and use the neutral tone for cancelling.

<Demo name="button/basic" />

## Examples {#examples}

### Variants {#variants}

Five visual styles, growing lighter from solid to plain text. `link` keeps only the text and an underline, with no background and no press effect.

<Playground
  name="Button"
  label="Button"
  :controls="[
    { prop: 'variant', options: ['solid', 'soft', 'outline', 'ghost', 'link'] },
    { prop: 'tone', options: ['accent', 'neutral', 'danger'] },
  ]"
/>

### Tones {#tones}

Use `accent` for the primary action, `neutral` for secondary actions and cancelling, and `danger` for anything that cannot be undone. Tone and variant are independent.

<Playground
  name="Button"
  label="Confirm"
  :controls="[
    { prop: 'tone', options: ['accent', 'neutral', 'danger'] },
    { prop: 'variant', options: ['solid', 'soft', 'outline', 'ghost'] },
  ]"
/>

### Sizes {#sizes}

Three sizes, whose height and padding scale with density.

<Playground
  name="Button"
  label="Button"
  :controls="[
    { prop: 'size', options: ['sm', 'md', 'lg'], default: 'md' },
    { prop: 'variant', options: ['solid', 'soft', 'outline'] },
  ]"
/>

### Density {#density}

Density is declared on a container and applies to every control inside it. The top row is the default density, the bottom row the compact one.

<Demo name="button/density" />

### Icons {#icons}

`#icon` holds a leading icon and `#trailing` a trailing one.

<Demo name="button/icons" />

### Icon only {#icon-only}

Use `IconButton` when a button holds only an icon. That component requires `label`, which serves as both the accessible name and the tooltip text.

<Demo name="button/icon-only" />

### Button groups {#group}

`ButtonGroup` joins several buttons into one unit, merging the corners and borders where they meet. `divider` adds a rule between adjacent buttons.

<Demo name="button/group" />

### States {#states}

With `loading` the button shows a spinner and refuses clicks; with `disabled` it is unavailable.

<Playground
  name="Button"
  label="Save"
  :controls="[
    { prop: 'loading' },
    { prop: 'disabled' },
    { prop: 'variant', options: ['solid', 'soft', 'outline', 'ghost'] },
  ]"
/>

The spinner replaces the leading icon first; with no leading icon it replaces the trailing one; with neither it is centred over the label. The label then turns transparent but stays in place, so the width of the button does not change.

<Demo name="button/loading" />

### Submitting {#pending}

A click moves the button into the loading state, during which further clicks are ignored and the label changes with it.

<Demo name="button/loading-state" />

### Signing in with a provider {#sign-in}

`block` makes the button fill the width of its container, with the brand icon in the leading slot.

<Demo name="button/sign-in" />

### Shape and width {#shape}

`pill` gives the button rounded ends and `block` makes it fill the width of its container.

<Playground
  name="Button"
  label="Continue"
  :controls="[{ prop: 'pill' }, { prop: 'block' }, { prop: 'size', options: ['sm', 'md', 'lg'], default: 'md' }]"
/>

### As a link {#link}

`as` renders the button as an `a` element or as `NuxtLink`, with the same appearance and interaction.

<Demo name="button/link" />

Where only the appearance of a link is wanted, without the semantics of a button, use the `Link` component rather than `variant="link"`.

If the target component renders its own root element, use `asChild` instead: the button renders nothing itself and merges its classes and behaviour into the single child.

```vue
<template>
  <Button as-child>
    <NuxtLink to="/guide/installation">Get started</NuxtLink>
  </Button>
</template>
```

## Custom styles {#styling}

### Tailwind classes {#class}

Whatever is passed as `class` goes through tailwind-merge, where the later declaration of the same property wins, so `!important` is unnecessary.

<Demo name="button/custom" />

### Global overrides {#global}

The colours, corner radius and focus ring of a button all come from semantic variables. Redeclaring those variables in any scope changes the appearance of the buttons inside it.

```css
.brand-purple {
  --hn-accent: oklch(0.55 0.22 300);
  --hn-accent-on: #ffffff;
  --hn-focus-ring: oklch(0.5 0.22 300);
}
```

## Style reference {#style-reference}

### Size variables {#size-tokens}

| Variable             | Default    | Compact    |
| -------------------- | ---------- | ---------- |
| `--hn-control-h-sm`  | `1.75rem`  | `1.5rem`   |
| `--hn-control-h-md`  | `2.25rem`  | `1.875rem` |
| `--hn-control-h-lg`  | `2.75rem`  | `2.25rem`  |
| `--hn-control-px-sm` | `0.625rem` | `0.375rem` |
| `--hn-control-px-md` | `1rem`     | `0.5rem`   |
| `--hn-control-px-lg` | `1.25rem`  | `0.75rem`  |
| `--hn-control-gap`   | `0.375rem` | `0.25rem`  |

The compact density suits dense interfaces such as admin tables. Density does not follow the device type, so if a touch screen needs larger hit targets, use the default density explicitly.

### State attributes {#state-attrs}

When rendered as a native `button`, the native `disabled` is used directly. Other elements have no native disabled semantics, so the following attributes carry the state instead.

| Attribute       | Meaning                                  |
| --------------- | ---------------------------------------- |
| `data-loading`  | Loading                                  |
| `aria-busy`     | Loading, announced by screen readers     |
| `data-disabled` | Unavailable                              |
| `aria-disabled` | Unavailable, announced by screen readers |
| `tabindex="-1"` | Unavailable, skipped by keyboard focus   |

A loading button counts as unavailable.

### Hover and press {#interaction}

- The focus ring appears on keyboard focus only; a mouse click leaves no outline.
- Hover and press add a translucent layer rather than replacing the background, and touch devices leave no lingering hover state.
- The ripple spreads from the point of contact, and the press layer no longer stacks on top of it. The `link` variant has no ripple.

## Accessibility {#a11y}

- An icon-only button must have an accessible name; without one, a warning is printed in development. Prefer `IconButton` directly.
- A loading button carries `aria-busy`, which screen readers announce as busy.

## API {#api}

### Props {#props}

| Prop       | Type                                                  | Default    | Description                                   |
| ---------- | ----------------------------------------------------- | ---------- | --------------------------------------------- |
| `as`       | `string \| Component`                                 | `'button'` | Element or component to render                |
| `asChild`  | `boolean`                                             | `false`    | Render nothing, merging into the single child |
| `variant`  | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'` | `'solid'`  | Visual style                                  |
| `tone`     | `'accent' \| 'neutral' \| 'danger'`                   | `'accent'` | Semantic tone                                 |
| `size`     | `'sm' \| 'md' \| 'lg'`                                | `'md'`     | Size                                          |
| `type`     | `'button' \| 'submit' \| 'reset'`                     | `'button'` | Native button type                            |
| `iconOnly` | `boolean`                                             | `false`    | Square button holding only an icon            |
| `block`    | `boolean`                                             | `false`    | Fill the width of the container               |
| `pill`     | `boolean`                                             | `false`    | Render with rounded ends                      |
| `loading`  | `boolean`                                             | `false`    | Whether it is loading                         |
| `disabled` | `boolean`                                             | `false`    | Whether it is disabled                        |
| `ripple`   | `boolean`                                             | `true`     | Enable the press ripple; no effect on `link`  |
| `class`    | `string`                                              | —          | Classes appended to the root                  |

### Slots {#slots}

| Slot       | Description                                               |
| ---------- | --------------------------------------------------------- |
| `default`  | The button content                                        |
| `icon`     | Leading icon, replaced by the spinner while loading       |
| `trailing` | Trailing icon, replaced only when there is no leading one |
