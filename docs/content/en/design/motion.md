---
title: Interaction & motion
description: Make state changes clear and continuous. Motion explains where content comes from and goes without delaying an action.
---

<script setup lang="ts">
  import DesignMotion from '~/components/design/Motion.vue'
</script>

## Interaction states {#states}

Semantic colors express meaning, state layers express hover and press, and focus outlines identify keyboard focus. Do not replace the entire semantic palette on hover or use a focus outline as a selection indicator.

Default hover-layer opacity is 6% in light mode and 9% in dark mode; pressed opacity is 10% and 13%. Use existing interactive components such as [Button](/components/button) and [NavLink](/components/nav-link) for consistent feedback.

Disabled means an action is unavailable and needs a semantic disabled state. Loading means work is in progress; whether it blocks interaction depends on the component and operation. Loading does not always mean disabled.

## Timing {#timing}

<DesignMotion />

| Token                | Default duration | Purpose                                   |
| -------------------- | ---------------- | ----------------------------------------- |
| `--hn-duration-fast` | 200ms            | Brief state feedback                      |
| `--hn-duration-base` | 300ms            | Regular transitions                       |
| `--hn-duration-slow` | 450ms            | Transitions explaining structural changes |
| `--hn-duration-exit` | 200ms            | Exit transitions                          |

Choose easing by direction: `--hn-ease-enter` for entry, `--hn-ease-exit` for exit and `--hn-ease-move` for movement. Small travel distances are `--hn-travel-sm` (4px) and `--hn-travel-md` (10px). Feedback should begin immediately, and repeated interactions should interrupt or continue the current transition.

## Continuity and performance {#continuity}

Prefer opacity and transform animations. For size transitions, check long content and complex subtrees; avoid measuring layout or rerendering every child on every frame. Keep overlays spatially connected to their triggers, and prevent exiting content from receiving interactions that reopen it accidentally.

Check the control offered by [Accordion](/components/accordion), [Dialog](/components/dialog) and [Highlight](/components/highlight) before using them. Avoid adding duplicate outer transitions to components that already animate.

## Focus, keyboard and reduced motion {#accessibility}

Every action needs a clear name. Supply `label` on [IconButton](/components/icon-button) and use [FormField](/components/form-field) to associate labels and errors with controls. Keep focus visible and avoid implementing controls with mouse events alone.

Hina's default focus outline uses `--hn-focus-ring`, a 2px width and a 2px offset. Preserve its distinction from adjacent surfaces when customizing colors. After an overlay closes, focus should return to an appropriate target that still exists; check this especially when removing its trigger item.

With `prefers-reduced-motion: reduce`, regular duration tokens become 1ms and travel and stagger tokens become zero. Continuous loading animations have their own reduced-motion handling. Custom animations must also respect the system preference, and essential information must remain available without motion.
