# @hina-ui/react

React adapter for Hina UI. It renders the same components as `@hina-ui/vue`, from the same shared presentation layer, with the same markup, styles and interaction behavior. The Vue package is the reference implementation: when the two disagree and no exception is recorded below, the React package is wrong.

The package stays `private` until the parity gate at the end of this document passes.

## Layering

| Layer             | Owns                                                                                   | Depends on                    |
| ----------------- | -------------------------------------------------------------------------------------- | ----------------------------- |
| `packages/shared` | Tokens, CSS, variants, motion values, locale messages, pure behavior cores, contracts  | Framework-independent libs    |
| `packages/vue`    | Vue components, reactivity, slots, Reka adapter                                        | shared, `reka-ui`             |
| `packages/react`  | React components, hooks, render props, Radix adapter                                   | shared, `radix-ui`            |
| `packages/parity` | Cross-framework conformance: style constraints, markup parity, export and API coverage | vue, react, shared (dev only) |

Neither framework package imports the other. Shared code never imports a framework, a primitive library or a framework package; `packages/shared/test/boundary.test.mjs` enforces the direction.

### What belongs in shared

Anything whose output must be identical in both frameworks and that does not need a framework to compute it:

- styles, variants and motion values (already shared);
- built-in copy: `UiMessages`, `zhCN`, `enUS` and the merge rules;
- pure algorithms: date parsing and formatting, caret and field focus, pagination ranges, tree selection, command matching, lightbox geometry, column sizing, CSV export, completion, masonry, carousel and month-grid math;
- behavior cores for stateful logic that is not supplied by the primitive library, written as plain functions or framework-free stores that adapters subscribe to.

Logic moves into shared when the React port needs it, never speculatively. The Vue module keeps its path as a one-line re-export, as the variants already do, so Vue imports and tests are unchanged. Vue tests stay green after every move; that is how a move proves it changed nothing.

## Primitive policy

Reka UI is the Vue port of Radix UI. Their components share structure, keyboard maps, dismissal order and the `data-state` / `data-highlighted` / `data-disabled` / `data-side` / `data-orientation` attribute vocabulary that the shared styles consume. React therefore uses Radix:

1. If Radix has the primitive and renders the same DOM and behavior, use `radix-ui`, adding the attributes and handlers Reka adds when Radix accepts them as props.
2. If only Reka has it, or Radix's output differs from Reka's in markup or behavior that props cannot correct, port Reka's implementation into `src/primitives/<name>`, composed from the building blocks Reka itself mirrors, exported by `radix-ui/internal` (`Primitive`, `Presence`, `DismissableLayer`, `FocusScope`, `RovingFocus`, `Collection`, `useControllableState`), and from the Reka building blocks ported into `src/primitives/` where Radix's differ. Reka is MIT; ported files keep its notice. Tooltip is ported this way: Reka always renders an `aria-hidden` visually hidden label, never puts `role="tooltip"` on the content, adds `data-grace-area-trigger` and supports `disabled` and `ignoreNonKeyboardFocus`.
3. Never mix in a second behavior library for one component. Two keyboard models in one design system is the regression this policy prevents.

Shared building blocks for ported primitives live in `src/primitives/`: `popper/` (Reka's `Popper` ported onto `@floating-ui/react-dom`: Reka's middleware order with `prioritizePosition`, `sideFlip` / `alignFlip`, direction-aware transform-origin, `reference`, `positionStrategy`, `updatePositionStrategy`, `disableUpdateOnLayoutShift`, Reka's arrow SVG and nearest-root context without Radix scopes; `@floating-ui/react-dom` is pinned to the release whose `@floating-ui/dom` matches Reka's `@floating-ui/vue`) and `visually-hidden.tsx` (Reka's `VisuallyHidden` with its `feature` semantics, distinct from the public `VisuallyHidden` component).

Reka-only primitives used by the Vue package: Calendar, RangeCalendar, DateField, DateRangeField, TimeField, Combobox, Listbox, NumberField, Pagination, PinInput, Rating, Splitter, Stepper, TagsInput, Tree.

Only `src/lib/radix` and `src/primitives` may reference `--radix-*` variables; it maps them onto the Hina runtime properties defined in [`shared/runtime.md`](../shared/runtime.md), mirroring `vue/src/lib/reka`.

Other engines follow the Vue package: `motion` (the engine behind `motion-v`) for layout animation, `@tanstack/react-table` and `@tanstack/react-virtual` for data and virtualization, `overlayscrollbars` behind `ScrollArea` only, `embla-carousel`, `shiki` and `uqr` as in Vue, `lucide-react` for built-in icons.

## API mapping

React components expose the Vue component's API under React conventions. The mapping is mechanical so that documentation, types and tests can be derived from the Vue reference:

| Vue                                                                           | React                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prop `foo`                                                                    | prop `foo`, same type and default                                                                                                                                                                                               |
| `class`                                                                       | `className` (string, merged last with `cn`)                                                                                                                                                                                     |
| `v-model` (`modelValue`)                                                      | `value`, `defaultValue`, `onValueChange`                                                                                                                                                                                        |
| `v-model:foo`                                                                 | `foo`, `defaultFoo`, `onFooChange`                                                                                                                                                                                              |
| `v-model` on `Checkbox` / `Switch`                                            | `checked`, `defaultChecked`, `onCheckedChange`; `value` is the form value                                                                                                                                                       |
| emit `foo-bar` / `fooBar`                                                     | `onFooBar`, same payload                                                                                                                                                                                                        |
| emit whose `onX` collides with a model callback                               | a descriptive name (DataList `pageChange` → `onPaginationChange`)                                                                                                                                                               |
| default slot                                                                  | `children`                                                                                                                                                                                                                      |
| scoped default slot                                                           | `children` as a render function receiving the same slot props                                                                                                                                                                   |
| named slot `foo` without slot props                                           | `foo?: ReactNode`                                                                                                                                                                                                               |
| prop `foo: string` paired with slot `foo`                                     | one `foo?: ReactNode` prop when the slot only replaces where the prop renders; when the prop has another job (Dialog's `title` also names the dialog when the header is hidden), keep the prop and map the slot to `fooContent` |
| prop `foo: boolean` paired with slot `foo` (`icon` on Alert, Callout, Empty…) | one `foo?: ReactNode` prop: `true` keeps the default content, `false` hides it, a node replaces it                                                                                                                              |
| scoped slot `foo` with slot props                                             | `renderFoo?: (props) => ReactNode`, same props object                                                                                                                                                                           |
| slot whose name collides with a prop (`loading`)                              | `<name>Content` (`loadingContent`)                                                                                                                                                                                              |
| dynamic slots (`cell-<key>`)                                                  | `renderCell?: (props) => ReactNode` keyed by the same identifier in props                                                                                                                                                       |
| `as` / `asChild`                                                              | `as` (tag or component) / `asChild` (Radix `Slot`)                                                                                                                                                                              |
| attributes Vue forwards through `as` (`href`, `target`, `rel`, `download`)    | typed on every component whose `as` accepts any tag                                                                                                                                                                             |
| `defineExpose`                                                                | `ref` handle with the same members (`useImperativeHandle`)                                                                                                                                                                      |
| no `defineExpose`                                                             | `ref` reaches the root element; Vue and React must expose the same members, so a handle React inherits from an inner component is added to Vue too                                                                              |
| `provide` helpers (`provideUiLocale`, resolvers)                              | context providers (`UiLocaleProvider`, …) and the same `use*` readers                                                                                                                                                           |
| directives (`v-tooltip`)                                                      | not ported; use the component (`Tooltip`)                                                                                                                                                                                       |
| standalone functions (`toast`)                                                | same function and signature                                                                                                                                                                                                     |

Components forward unknown props to the element that receives `$attrs` in Vue. Controlled and uncontrolled state both work everywhere Vue's `defineModel` works with and without a binding.

## Markup contract

For equal inputs the server-rendered HTML of a React component equals the Vue component's after normalization (comments, whitespace between tags, attribute order, class order, style declaration order, generated ids wherever they appear, primitive library prefixes such as `data-reka-*` / `data-radix-*`, and vendor-prefixed style properties that Vue's server renderer writes without the leading dash). React DOM's image preload hints (`<link rel="preload" as="image">`), which a document hoists into `<head>`, are dropped before comparing. Live snapshots also leave out the scrollbar measurements OverlayScrollbars computes for scroll areas that are not rendered (a 0×0 host, such as the desktop sidebar in a mobile layout), because they depend on when the instance happened to initialise and are never visible. Equal markup with the same classes is what makes the shared CSS produce equal pixels, so this single check covers styles, ARIA wiring and state attributes. `packages/parity` runs it for every ported component; intentional differences are listed per case with a reason.

Server markup covers what renders without interaction. Overlays, portals and positioned content render only on the client, so `packages/parity` also mounts each live case in Chromium, once through Vue and once through React, performs the same interaction (hover, keyboard, click), waits for positioning, and compares the normalized `document.body`. Inline styles from positioning take part in the comparison; both adapters run in the same browser and must place content identically.

Behavior parity is checked by translating every Vue browser test into a React browser test with the same assertions: keyboard paths, focus movement and restoration, dismissal order, emitted values and computed styles.

## Runtime rules

- Every module may run on the server. No top-level `window` / `document` access; effects touch the DOM.
- Every module that uses hooks, creates a context or binds event handlers starts with `'use client'`; everything else stays a server component. The build preserves modules and their directives, so `Text`, `Stack`, `Card` and the other static components render in React Server Components without shipping JavaScript, while interactive components hydrate. `packages/parity/test/client-directive.test.ts` enforces the boundary and `pnpm --filter @hina-ui/parity directives:fix` adds missing directives.
- Polymorphic `as` takes a component only inside client code: a Server Component cannot pass a function such as `next/link` across the client boundary. In Server Components use `asChild` with the link element as the child, or move the composition into a small client component. Note that `Button` with `asChild` renders only its child, as in Vue.
- ids come from `useId`; portals render only on the client, after mount, through Radix `Portal`.
- No module-level mutable state outside `REQUIRED_SINGLETONS`.
- Style constraints are the Vue ones, applied to `.tsx` sources by the parity package: tokens only, no `dark:`, logical properties only, no literal durations or curves, no `transition-all`, weights 400/500/600, no bare portals.

## Directory layout

```
src/
  index.ts                 public exports, mirroring vue/src/index.ts order
  lib/                     cn, tv, a11y and dev warnings, controllable state, direction, overlay helpers
  lib/radix/               --radix-* → Hina runtime property mapping
  locale/                  UiLocaleProvider, useUiLocale
  primitives/<name>/       Reka-only primitives ported onto Radix building blocks
  components/<name>/
    <Name>.tsx             thin component: props, refs, primitive assembly
    <name>.variants.ts     one-line re-export from shared
    hooks/                 component-private stateful logic
    <Name>.test.tsx        happy-dom unit tests
    <Name>.ssr.test.tsx    server rendering
    <Name>.browser.test.tsx  real-browser behavior
```

## Package output

`dist/esm` (one ES module per source module, shared code included, `'use client'` directives preserved), `dist/types` (declarations for React and shared sources), `dist/shared` (shared sources for Tailwind scanning) and `dist/styles/tokens.css`. Consumers import `@hina-ui/react` and `@hina-ui/react/styles/tokens.css`, and need no workspace package.

## Parity gate

The package becomes public, versioned in lockstep with `@hina-ui/vue`, when:

1. every public Vue export has a React counterpart or a recorded exception;
2. every component's props, callbacks, content props and ref handle match its Vue counterpart under the API mapping (`packages/parity/test/api.test.ts`, with `coverage/api-pending.json` empty);
3. every component passes markup parity for its documented demos and behavior parity for its keyboard and focus scenarios;
4. the constraint suite, unit, SSR and browser tests pass on Chromium, Firefox and WebKit, with engine differences that also affect Vue recorded rather than skipped;
5. `pnpm test:package` verifies the packed React package in an isolated consumer, including SSR.
