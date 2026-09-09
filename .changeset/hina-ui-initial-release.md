---
'@hina-ui/vue': major
---

First public release.

An elegant, restrained Vue 3 component library built on Reka UI and Tailwind CSS v4, covering
typography, layout, forms, overlays and page scaffolding.

- Dark and compact modes driven by a single attribute on an outer container
- Colours, radii and motion durations exposed as CSS variables for theming
- Focus management, keyboard operation and screen reader semantics built in
- Chinese and English locales out of the box

The package now ships a compiled ESM bundle with type declarations alongside its source, so it
works in both SSR and client-only setups. Import `@hina-ui/vue/styles/tokens.css` from your
Tailwind entry to pull in the tokens and register the component sources for class scanning.
