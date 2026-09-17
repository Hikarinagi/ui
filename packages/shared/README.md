# Shared presentation layer

This internal workspace contains Hina's CSS tokens, component variants, class merging and framework-independent motion helpers. Vue and future React components can consume the same source. It has no Vue, React or primitive-library dependency.

| Layer                     | Owns                                                                             |
| ------------------------- | -------------------------------------------------------------------------------- |
| `packages/shared`         | Styling, motion definitions, variant options and presentation contracts          |
| `packages/vue`            | SFCs, reactive state, slots, refs, accessibility wiring and primitive adapters   |
| Future framework packages | Their own components, state and adapters consuming the shared presentation layer |

## Source and distribution

Variants live in `src/variants`. Existing Vue variant and utility modules re-export these files, preserving component imports without duplicating implementations. Relative source imports let declaration emit retain a self-contained tree for the published Vue package.

Framework packages should use relative source imports while this layer is private. Published declarations must not leave unresolved `@hina-ui/shared` imports for consumers.

The shared package is private and is not published separately. Vue bundles shared JavaScript, emits shared declarations and copies shared source into its distribution for Tailwind scanning. Consumers continue to import `@hina-ui/vue` and `@hina-ui/vue/styles/tokens.css`; no workspace dependency is required after installation. The shared CSS entry scans shared variants, while each framework's CSS entry adds its component source paths.

## Presentation contract

Shared styles consume Hina-owned runtime CSS properties. Framework adapters provide the values at the element that consumes them. The [runtime property contract](./runtime.md) defines their meanings and placement. Primitive-specific variable names and DOM queries belong to framework adapters.

Shared selectors also depend on element roles, part structure and state attributes. An adapter must preserve those semantics or translate its primitive's output. Existing attribute names do not require a new prefix to become a Hina contract:

- `data-state` carries the state appropriate to that part, such as open/closed or checked/unchecked.
- `data-disabled`, `data-highlighted`, `data-orientation`, `data-side` and `dir` drive interaction and directional styling.
- Navigation content uses `data-motion` values `from-start`, `from-end`, `to-start` and `to-end`; adapters must preserve the existing direction semantics and RTL behavior.
- `data-hn-ready` on the navigation viewport requires measured dimensions and position. Preserve it during exit, clear it when geometry becomes unavailable, and prevent interaction with closing content.
- Keep exiting elements mounted until their animation completes. Keyboard navigation, focus restoration, portals and scroll locking remain framework responsibilities.

Component-specific DOM structure is currently expressed by each variant and its Vue implementation. This extraction does not claim that a React adapter has been implemented or that every part can use different markup with identical styling. Validate representative React components against the same behavior before expanding the contract.

`test/boundary.test.mjs` checks dependency direction and framework isolation. Vue's constraint tests include this layer, so moving source does not bypass token, motion, SSR or interaction rules.
