---
title: NavigationMenu
description: Composes navigation links and dropdown content panels.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/navigation-menu/NavigationMenu.vue
  - label: Reka Navigation Menu
    href: https://reka-ui.com/docs/components/navigation-menu
---

<Demo name="navigation-menu/hero" />

## Usage {#usage}

```ts
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@hina-ui/vue'
```

`NavigationMenu` provides the navigation landmark, list, and shared content viewport. Wrap each top-level entry in `NavigationMenuItem`, containing either a `NavigationMenuLink` or a pair of `NavigationMenuTrigger` and `NavigationMenuContent`. Name the navigation with `label` or `aria-labelledby`.

`active` marks the current page and sets `aria-current="page"`. The current page and expanded item are independent states.

<Demo name="navigation-menu/basic" />

## Examples {#examples}

### Click and controlled state {#controlled}

Mouse hover and click both open panels by default. `trigger="click"` disables hover activation and keeps the panel open when the pointer leaves. `v-model` binds the expanded item's `value`; an empty string closes all panels. Give panel items stable, unique values when controlling expansion.

Selecting a link closes the panel. `@select.prevent` keeps it open without preventing link navigation. Use `@click.prevent` to prevent navigation itself.

<Demo name="navigation-menu/controlled" />

### Custom content {#content}

`NavigationMenuContent` accepts arbitrary content through its default slot. Set its width and layout with `class`, and remove the default padding with `:padded="false"`.

`NavigationMenuLink` provides `icon`, `description`, and `trailing` slots. This example combines [Text](/components/text), [Divider](/components/divider), and [Tag](/components/tag). Use `NavigationMenuLink` for links inside panels as well, preserving keyboard navigation and dismissal after selection.

<Demo name="navigation-menu/content" />

### Vertical {#vertical}

`orientation="vertical"` arranges entries vertically and opens panels toward the inline end. Panels use the opposite side and limit their width when space is insufficient. `align` controls alignment with the trigger.

<Demo name="navigation-menu/vertical" />

### Sizes {#sizes}

`size` sets the size of links, triggers, and icons together. It supports `sm`, `md`, and `lg`, and follows the global density. Icons measure 14, 16, and 18px respectively.

<Demo name="navigation-menu/sizes" />

### States {#states}

Both triggers and links support `disabled`. Disabled entries cannot activate and are skipped by arrow navigation.

<Demo name="navigation-menu/states" />

### Router links {#routing}

`NavigationMenuLink` with `as-child` forwards attributes and behavior to its single child, including `RouterLink` or `NuxtLink`. Alternatively, pass a component through `as`. Set `active` from your route state.

<Demo name="navigation-menu/routing" />

### RTL {#rtl}

Direction inherits from an ancestor's `dir` or Reka's global configuration, or can be set explicitly with `dir="rtl"`. Layout, alignment, disclosure arrows, and keyboard direction follow it.

<Demo name="navigation-menu/rtl" />

## Behavior {#behavior}

- One panel is expanded at a time. The shared viewport transitions between content sizes, while panels transition in the switching direction.
- Content renders inside the navigation element, above the normal document flow. Ancestors need visible overflow so they do not clip the panels.
- Panel widths and horizontal positions account for the browser and scrolling or clipping ancestors. Allow vertical space for expanded content. Compose [ScrollArea](/components/scroll-area) inside a panel for long content.
- Hover menus close after leaving both the navigation and its content. Exiting panels stop receiving pointer events.
- Outside pointer interaction, focus leaving the navigation, and `Esc` dismiss the panel. Set `:unmount-on-hide="false"` to preserve hidden component state.
- The component uses `nav`, `ul`, `li`, and link semantics. For menu commands, use [Menubar](/components/menubar) or [DropdownMenu](/components/dropdown-menu).

## Accessibility {#a11y}

| Key                                       | Behavior                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Tab` / `Shift+Tab`                       | Move through navigation and expanded content                                                  |
| `Enter` / `Space`                         | Toggle the focused trigger                                                                    |
| Horizontal `←` / `→`, vertical `↑` / `↓`  | Move between top-level entries, skipping disabled items; horizontal direction reverses in RTL |
| `Home` / `End`                            | Focus the first or last available top-level entry                                             |
| Horizontal `↓`, vertical `→` (`←` in RTL) | Enter content from an expanded trigger                                                        |
| `Esc`                                     | Close content and restore focus to its trigger                                                |

## API {#api}

### NavigationMenu {#root-api}

| Prop                | Type                           | Default        | Description                                                                         |
| ------------------- | ------------------------------ | -------------- | ----------------------------------------------------------------------------------- |
| `modelValue`        | `string`                       | `''`           | Expanded item; empty string closes all panels                                       |
| `label`             | `string`                       | —              | Accessible navigation name                                                          |
| `orientation`       | `'horizontal' \| 'vertical'`   | `'horizontal'` | Layout direction                                                                    |
| `dir`               | `'ltr' \| 'rtl'`               | Inherited      | Reading direction                                                                   |
| `size`              | `'sm' \| 'md' \| 'lg'`         | `'md'`         | Control size                                                                        |
| `trigger`           | `'hover' \| 'click'`           | `'hover'`      | Hover and click, or click only                                                      |
| `delayDuration`     | `number`                       | `200`          | Initial hover opening delay, in milliseconds                                        |
| `skipDelayDuration` | `number`                       | `300`          | Window after closing during which re-entry skips the initial delay, in milliseconds |
| `align`             | `'start' \| 'center' \| 'end'` | `'center'`     | Panel alignment with the trigger                                                    |
| `unmountOnHide`     | `boolean`                      | `true`         | Unmount hidden content                                                              |
| `class`             | `string`                       | —              | Navigation root classes                                                             |
| `listClass`         | `string`                       | —              | List classes                                                                        |
| `viewportClass`     | `string`                       | —              | Shared content viewport classes                                                     |

The `update:modelValue(value: string)` event returns the expanded item. The default slot receives `{ value: string }`.

### NavigationMenuItem {#item-api}

`value?: string` identifies the item in the expanded state and is generated when omitted. The default slot contains a link or a trigger and content pair.

### NavigationMenuTrigger {#trigger-api}

| Prop       | Type      | Default | Description         |
| ---------- | --------- | ------- | ------------------- |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `class`    | `string`  | —       | Trigger classes     |

The default slot provides the label, `icon` provides a leading icon, and `trailing` can replace the default [DisclosureIcon](/components/disclosure-icon). The arrow rotates with the open state and points toward inline end in vertical layouts. Renders with `type="button"` to avoid submitting forms.

### NavigationMenuContent {#content-api}

| Prop     | Type      | Default | Description                                 |
| -------- | --------- | ------- | ------------------------------------------- |
| `padded` | `boolean` | `true`  | Apply default padding                       |
| `class`  | `string`  | —       | Content classes, including width and layout |

The default slot provides the content. Forwards `escapeKeyDown`, `pointerDownOutside`, `focusOutside`, `interactOutside`, and `dismiss` events. Call `preventDefault()` on the corresponding interaction event to prevent dismissal.

### NavigationMenuLink {#link-api}

| Prop          | Type                  | Default | Description                                       |
| ------------- | --------------------- | ------- | ------------------------------------------------- |
| `as`          | `string \| Component` | `'a'`   | Element or router component                       |
| `asChild`     | `boolean`             | `false` | Forward attributes and behavior to a single child |
| `active`      | `boolean`             | `false` | Current page                                      |
| `disabled`    | `boolean`             | `false` | Disable the link                                  |
| `description` | `string`              | —       | Description below the label                       |
| `class`       | `string`              | —       | Link classes                                      |

`href`, `target`, `rel`, router props, and other undeclared attributes reach the link. The `select(event)` event can prevent panel dismissal.

| Slot          | Description                                   |
| ------------- | --------------------------------------------- |
| `default`     | Label; the single child when using `as-child` |
| `icon`        | Leading icon                                  |
| `description` | Replace the description text                  |
| `trailing`    | Trailing content                              |

With `as-child`, the child owns its content layout and the other content slots are not rendered.
