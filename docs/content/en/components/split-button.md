---
title: SplitButton
description: A primary action joined to a menu of alternatives, with separate click targets.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/split-button/SplitButton.vue
---

<Demo name="split-button/hero" />

## Usage {#usage}

```ts
import { SplitButton, DropdownMenuItem } from '@hina-ui/vue'
```

The primary button emits `click`; the trailing arrow opens the menu. Place alternatives in `#content` and handle each `DropdownMenuItem` through `select`. Use this when one action is the clear default, such as publishing with a save-draft alternative or exporting in a chosen format.

```vue
<SplitButton menu-label="More saving options" @click="save">
  Save
  <template #content>
    <DropdownMenuItem @select="saveCopy">Save a copy</DropdownMenuItem>
  </template>
</SplitButton>
```

Use `ButtonGroup` for equally common actions, or `DropdownMenu` when there is no default action. Selecting a menu item does not automatically change the primary action; the application decides whether to remember the choice.

## Examples {#examples}

### Variants and tones {#variants}

Both buttons share `variant` and `tone`, with joined inner corners. Solid, soft, and ghost variants include a divider; the outline variant shares one border at the join.

<Demo name="split-button/variants" />

### Sizes and rounded ends {#sizes}

`size` sets the height of both buttons. `pill` rounds the outer ends of the group. Neither joined button scales when pressed.

<Demo name="split-button/sizes" />

### Loading and disabled states {#states}

`loading` displays a progress indicator, disables both buttons, and closes an open menu. `disabled` disables the whole group. Use `primary-disabled` or `menu-disabled` to disable either side separately, such as allowing a draft to be saved when publishing is unavailable.

<Demo name="split-button/states" />

### Remembering the chosen format {#formats}

Compose the menu with existing `DropdownMenu` children, including groups, radio items, checkbox items, and submenus. Here the application stores the format and uses it for the primary button's label and action.

<Demo name="split-button/formats" />

### Full width {#block}

`block` makes the primary button fill the available space while the arrow stays square. Long default labels truncate. Both `class` and `style` apply to the group container.

<Demo name="split-button/block" />

### Form submission {#form}

`type="submit"` applies only to the primary button. The menu trigger always uses `type="button"`; opening the menu or selecting an item does not accidentally submit the form. Native attributes such as `name`, `value`, and `form` pass through to the primary button.

This example simulates asynchronous publishing. Publishing runs `Form` validation, while saving a draft is a separate menu action that accepts an unfinished title.

<Demo name="split-button/form" />

### Right-to-left layout {#rtl}

`dir="rtl"` controls button order, joined corners, and menu direction together. The menu aligns to the logical end of the whole button group.

<Demo name="split-button/rtl" />

### A link as the primary action {#link}

`as` changes only the primary button. Use your router's link component for in-app navigation; attributes such as `to` pass through to it. The menu trigger remains a button.

```vue
<SplitButton
  :as="NuxtLink"
  :to="localePath('/components/button')"
  menu-label="Related documentation"
>
  View Button
  <template #content>
    <DropdownMenuItem @select="navigateTo(localePath('/components/button-group'))">
      View ButtonGroup
    </DropdownMenuItem>
  </template>
</SplitButton>
```

## Behavior and accessibility {#behavior}

- `Tab` reaches the primary action and menu trigger separately. On the primary button, `Enter` or Space runs the action and `ArrowDown` opens the menu. A link keeps native link keyboard behavior.
- On the menu trigger, `Enter`, Space, or `ArrowDown` opens the menu. Keyboard opening focuses the first available item. Menu navigation, first/last item keys, and typeahead follow `DropdownMenu`.
- `Escape` closes the menu and returns focus to its trigger. Selecting a regular item also closes it; use `@select.prevent` on that item to keep the menu open.
- Give `menu-label` a name describing the alternatives. It defaults to the current locale's “More actions”. `label` optionally names the whole group.
- `#icon` and `#trailing` belong to the primary action. The menu arrow uses `DisclosureIcon` and follows the open state.

## API {#api}

### Props {#props}

| Prop              | Type                                        | Default                  | Description                                         |
| ----------------- | ------------------------------------------- | ------------------------ | --------------------------------------------------- |
| `variant`         | `'solid' \| 'soft' \| 'outline' \| 'ghost'` | `'solid'`                | Shared appearance                                   |
| `tone`            | `'accent' \| 'neutral' \| 'danger'`         | `'accent'`               | Shared tone                                         |
| `size`            | `'sm' \| 'md' \| 'lg'`                      | `'md'`                   | Button size                                         |
| `block`           | `boolean`                                   | `false`                  | Fill the container width                            |
| `pill`            | `boolean`                                   | `false`                  | Fully rounded outer ends                            |
| `ripple`          | `boolean`                                   | `true`                   | Enable ripple feedback                              |
| `loading`         | `boolean`                                   | `false`                  | Show progress and disable both buttons              |
| `disabled`        | `boolean`                                   | `false`                  | Disable both buttons                                |
| `primaryDisabled` | `boolean`                                   | `false`                  | Disable only the primary action                     |
| `menuDisabled`    | `boolean`                                   | `false`                  | Disable only the menu                               |
| `as`              | `string \| Component`                       | `'button'`               | Primary action element or component                 |
| `type`            | `'button' \| 'submit' \| 'reset'`           | `'button'`               | Primary button type                                 |
| `label`           | `string`                                    | —                        | Accessible name for the group                       |
| `menuLabel`       | `string`                                    | Localized “More actions” | Accessible name for the menu trigger and menu       |
| `modal`           | `boolean`                                   | `true`                   | Restrict outside interaction while the menu is open |
| `dir`             | `'ltr' \| 'rtl'`                            | Inherited                | Button and menu direction                           |
| `side`            | `'top' \| 'right' \| 'bottom' \| 'left'`    | `'bottom'`               | Preferred menu side                                 |
| `align`           | `'start' \| 'center' \| 'end'`              | `'end'`                  | Menu alignment relative to the whole group          |
| `sideOffset`      | `number`                                    | `8`                      | Gap between the group and menu                      |
| `class`           | `string`                                    | —                        | Group container classes                             |
| `style`           | `StyleValue`                                | —                        | Group container styles                              |
| `menuClass`       | `string`                                    | —                        | Menu content classes                                |

Other attributes and listeners, including `id`, `aria-label`, `href`, `to`, and `keydown`, pass through to the primary button.

### Models {#models}

| Model          | Type      | Default | Description                                                        |
| -------------- | --------- | ------- | ------------------------------------------------------------------ |
| `v-model:open` | `boolean` | `false` | Menu open state; closes while loading or when the menu is disabled |

### Events {#events}

| Event         | Payload      | Description                                                    |
| ------------- | ------------ | -------------------------------------------------------------- |
| `click`       | `MouseEvent` | Primary action click; menu interactions do not emit this event |
| `update:open` | `boolean`    | Menu open state changed                                        |

### Slots {#slots}

| Slot       | Props                   | Description                                                                 |
| ---------- | ----------------------- | --------------------------------------------------------------------------- |
| `default`  | —                       | Primary action label                                                        |
| `icon`     | —                       | Leading primary action icon                                                 |
| `trailing` | —                       | Trailing primary action content                                             |
| `content`  | `{ close: () => void }` | Menu content, usually composed of `DropdownMenuItem` and related components |

### Expose {#expose}

| Method      | Type                  | Description                                                             |
| ----------- | --------------------- | ----------------------------------------------------------------------- |
| `focus`     | `() => void`          | Focus the primary action when enabled                                   |
| `openMenu`  | `() => Promise<void>` | Focus the menu trigger and open the menu; does nothing when unavailable |
| `closeMenu` | `() => void`          | Close the menu                                                          |
