---
title: Color
description: Organize content with neutrals and express state with semantic colors. Themes change; meaning stays consistent.
---

<script setup lang="ts">
  import DesignColors from '~/components/design/Colors.vue'
</script>

## Color system {#system}

Hina combines achromatic neutrals, a teal brand palette and five semantic colors. The default brand color, `brand-500`, is `#39c5bb`. Prefer semantic tokens so the same component structure works in light and dark themes.

These swatches read the current theme directly. Each pair shows a solid fill with its foreground on the left and a soft fill with its text color on the right. Use the theme control in the header to compare them.

<DesignColors />

## Roles and emphasis {#roles}

| Role    | Meaning                                      | Guidance                                                                                |
| ------- | -------------------------------------------- | --------------------------------------------------------------------------------------- |
| accent  | Primary actions, selection and current state | Establish a clear primary action within each group; avoid decorating everything with it |
| success | Success, completion and valid state          | Include text or an icon that explains the result                                        |
| warning | Attention required; proceeding is possible   | Explain the impact and distinguish it from destructive actions                          |
| danger  | Errors and destructive actions               | Reserve it for identifiable risks and failures                                          |
| info    | Neutral information                          | Does not imply success or failure                                                       |
| neutral | Everyday content and secondary actions       | Use for most of the interface to keep emphasis meaningful                               |

For [Button](/components/button), `tone` conveys meaning and `variant` determines visual weight. [Tag](/components/tag), [Alert](/components/alert) and [Text](/components/text) use corresponding roles. Communicate state through a readable label, icon or error message as well as color.

## Color pairings {#pairing}

| Purpose         | Background                            | Foreground                              |
| --------------- | ------------------------------------- | --------------------------------------- |
| Solid accent    | `--hn-accent` / `bg-accent`           | `--hn-accent-on` / `text-accent-on`     |
| Soft accent     | `--hn-accent-soft` / `bg-accent-soft` | `--hn-accent-text` / `text-accent-text` |
| Content surface | `--hn-surface` / `bg-surface`         | `--hn-fg-default` / `text-fg`           |
| Supporting text | Inherit the surrounding surface       | `--hn-fg-muted` / `text-muted`          |

`success`, `warning`, `danger` and `info` also have solid, `-on`, `-soft` and `-text` tokens. Do not use a solid fill as small text or assume that solid buttons always need white text. Use `text-faint` for nonessential details and `text-disabled` for disabled content.

## Surfaces and borders {#surfaces}

`bg-canvas` is the page background, `bg-surface` holds content, `bg-subtle` provides gentle separation and `bg-inset` defines more pronounced inset areas. The surface is pure white in light mode and pure black in dark mode. These roles are not a numbered brightness scale.

Use `border-line` for regular boundaries and `border-line-strong` for stronger outlines. Overlay scrims use `--hn-bg-scrim`, independently of content surfaces. Avoid expressing every layer through progressively darker backgrounds.

## Theme customization {#customization}

Override CSS variables after importing the stylesheet. Define the fill, its foreground, text, soft fill and focus color together, and check their readability in both themes. Overriding `--hn-accent` alone does not update the other roles.

```css
:root {
  --hn-accent: #39c5bb;
  --hn-accent-on: #0a0a0a;
  --hn-accent-text: #1f827b;
  --hn-accent-soft: color-mix(in oklab, var(--hn-accent) 12%, var(--hn-surface));
  --hn-accent-border: color-mix(in oklab, var(--hn-accent) 34%, transparent);
  --hn-focus-ring: #2ba79e;
}

.dark {
  --hn-accent: #45d4c9;
  --hn-accent-on: #000000;
  --hn-accent-text: #45d4c9;
  --hn-accent-soft: color-mix(in oklab, var(--hn-accent) 24%, var(--hn-surface));
  --hn-accent-border: color-mix(in oklab, var(--hn-accent) 30%, transparent);
  --hn-focus-ring: #45d4c9;
}
```

These are the default accent pairings, provided as a starting point. See [Installation](/guide/installation) for setup and [Interaction & motion](/design/motion) for focus and interaction states.
