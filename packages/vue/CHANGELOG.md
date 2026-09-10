# @hina-ui/vue

## 1.1.0

### Minor Changes

- c39a405: Add `controlPlacement` and `block` to Checkbox, Switch, CheckboxGroup and RadioGroup for full-width settings rows with trailing controls. Descriptions stay with their labels, logical placement follows text direction, and horizontal block groups divide the available width equally. Existing layouts remain the default.
- 73b040e: Add horizontal and container-responsive FormField layouts, configurable label/control description placement, and label column widths. FormLayout supplies reactive shared defaults with per-field and nested-layout overrides. Errors remain with controls, label and description associations are preserved, and the existing vertical layout stays the default.

### Patch Changes

- b7cda5a: Keep disabled field styling scoped to the field's own state.
  
  - Reaching a NumberInput limit or using readonly mode no longer dims the entire input or removes its hover feedback.
  - Disabled actions in input adornments and partially disabled InputGroup children no longer affect enabled controls around them.
  - Preserve disabled styling inherited from FormField and InputGroup, with a single opacity layer for embedded fields.

## 1.0.0

### Major Changes

- 2fdb412: First public release.
  
  An elegant, restrained Vue 3 component library built on Reka UI and Tailwind CSS v4, covering
  typography, layout, forms, overlays and page scaffolding.
  
  - Dark and compact modes driven by a single attribute on an outer container
  - Colours, radii and motion durations exposed as CSS variables for theming
  - Focus management, keyboard operation and screen reader semantics built in
  - Chinese and English locales out of the box
  
  The package now ships a compiled ESM bundle with type declarations alongside its source, so it
  works in both SSR and client-only setups. Import `@hina-ui/vue/styles/tokens.css` from your
  Tailwind entry to pull in the tokens and register the component sources for class scanning.
