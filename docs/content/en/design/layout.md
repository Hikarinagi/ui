---
title: Layout & density
description: Organize interfaces with consistent spacing, control sizes and surface hierarchy. Containers pass density to their children.
---

<script setup lang="ts">
  import DesignGeometry from '~/components/design/Geometry.vue'
</script>

## Size and density {#density}

`size` changes an individual component. `data-density` changes control heights, padding and gaps throughout a region. The default is `comfortable`; `compact` increases information density without changing text hierarchy or automatically responding to viewport width.

Both groups below use the default component size and inherit different densities.

<DesignGeometry />

| Token               | comfortable | compact |
| ------------------- | ----------- | ------- |
| `--hn-control-h-sm` | 28px        | 24px    |
| `--hn-control-h-md` | 36px        | 30px    |
| `--hn-control-h-lg` | 44px        | 36px    |
| `--hn-control-gap`  | 6px         | 4px     |
| `--hn-field-gap`    | 8px         | 6px     |
| `--hn-stack-gap`    | 16px        | 12px    |
| `--hn-inline-gap`   | 12px        | 8px     |
| `--hn-panel-p`      | 20px        | 14px    |
| `--hn-row-h`        | 44px        | 34px    |

Pixel values assume a 16px root font size. Compact layouts still need clear interaction targets; do not shrink every button simply to fit more content. When an overlay uses Portal, its destination must also inherit the density. Set global density on the root element; check the actual overlay destination when using a local density.

## Spacing and alignment {#spacing}

Use [Stack](/components/stack) and [Inline](/components/inline) for groups, and [Grid](/components/grid) for columns. Space within a group should be smaller than space between groups. Avoid combining a parent's gap with equivalent margins on its children.

Default gaps use density tokens. Explicit `xs`, `sm`, `lg` and `xl` values use the fixed spacing defined by each component. Let [FormField](/components/form-field) arrange labels, descriptions and controls. Use [Page](/components/page) or [AppShell](/components/app-shell) for page structure.

Prefer logical directions such as `ms`, `me`, `ps`, `pe`, `start` and `end` to preserve alignment in RTL. On narrow screens, adjust columns, wrapping and region order before compressing spacing.

## Radii {#radius}

| Token              | Default |
| ------------------ | ------- |
| `--hn-radius-xs`   | 4px     |
| `--hn-radius-sm`   | 6px     |
| `--hn-radius-md`   | 8px     |
| `--hn-radius-lg`   | 8px     |
| `--hn-radius-xl`   | 14px    |
| `--hn-radius-full` | 9999px  |

Radii describe shape, not interaction state. Use existing component radii or `pill` options instead of changing corner shapes for hover, selection or errors. Check nested radii together with their spacing so inner outlines do not crowd outer corners.

## Elevation {#elevation}

`shadow-sm`, `shadow-md` and `shadow-lg` map to theme-specific shadows. Separate content through spacing and borders first, then use shadows for raised surfaces. Nested containers do not each need a shadow.

[Card](/components/card) provides a content surface. Overlays such as [Popover](/components/popover) and [Dialog](/components/dialog) handle their own positioning, stacking and focus. Avoid arbitrary application-level z-index additions to repair overlay order.
