# Porting a component to React

This is the procedure for bringing one Vue component to `@hina-ui/react`. Read [README.md](./README.md) first; it defines the layering, the primitive policy and the API mapping that this procedure applies.

The Vue component is the specification. Its source, its tests and its documentation page (`docs/content/zh-CN/components/<name>.md`) together define what the React component must do. Do not improve, simplify or redesign while porting. If the Vue behavior looks wrong, port it faithfully and report it; a fix lands in both packages at once, Vue first.

## 1. Read the reference

- Every file in `packages/vue/src/components/<name>/`, including composables, utils, types and tests.
- The shared variants it uses: `packages/shared/src/variants/<name>.ts` and any shared CSS in `packages/shared/src/styles/` that targets its classes or data attributes.
- The components it imports from sibling directories. If one of them is not yet available in React, stop and report the dependency instead of inlining a substitute.
- The docs page, in particular the prose under "行为" and the demos in `docs/app/demos/zh-CN/<name>/`, which show supported combinations.
- For Reka primitives: the Reka source in `packages/vue/node_modules/reka-ui/dist/<Primitive>/`. The DOM Reka produces is part of the specification.

## 2. Move framework-free logic to shared

Logic that computes results without Vue reactivity moves to `packages/shared/src` so both adapters run the same code:

- pure functions → `shared/src/lib/` (or `shared/src/lib/<component>/` for component-specific groups);
- framework-free stateful controllers (DOM listeners, timers, state machines exposing callbacks) → `shared/src/behavior/`. `shared/src/behavior/ripple.ts` is the model: a `create*` function taking getters and callbacks, returning `connect` / `disconnect` or equivalent.

Move with `git mv`, then leave the Vue file at its old path as a one-line re-export (`export * from '../../../../shared/src/lib/...'`), so Vue imports and tests stay untouched. Shared code may only import relative shared paths or the dependencies allowed by `shared/test/boundary.test.mjs`. Never move code that imports `vue`, `reka-ui`, `@vueuse/*` or `motion-v`; split it first only if the split is mechanical. Run the affected Vue tests after every move.

## 3. Write the component

Location: `packages/react/src/components/<name>/`, one `.tsx` per Vue `.vue` file, same base names (`Select.vue` → `Select.tsx`). Variants: `<name>.variants.ts` containing the same one-line re-export as Vue's. Component-private hooks go in `hooks/`, private pure helpers in `utils/` (only if they cannot live in shared).

Rules that follow from the API mapping:

- Props keep Vue names, types and defaults. `class` becomes `className`. Props typed in Vue as `string` that are also slots become `ReactNode`.
- `defineModel()` → `value` / `defaultValue` / `onValueChange`; `defineModel('open')` → `open` / `defaultOpen` / `onOpenChange`. Use `useControllableState` from `radix-ui/internal` so both controlled and uncontrolled use work. Callbacks fire with exactly the values Vue emits, at the same moments.
- Exception: `Checkbox` and `Switch` map `defineModel()` to `checked` / `defaultChecked` / `onCheckedChange`, because their `value` is the native form value that Vue forwards to Reka through `$attrs`.
- Emits → `on<Event>` callbacks with the Vue payload.
- Slots without props → `ReactNode` props named after the slot; default slot → `children`; scoped slots → `render<Slot>(props)`. Where Vue checks `slots.foo` to decide whether to render a wrapper, React checks `hasContent(foo)` from `lib/content.ts`.
- `defineExpose` → a `ref` prop handled with `useImperativeHandle`, exposing the same members.
- `inject`/`provide` → React context in a `context.ts` next to the component, mirroring Vue's `context.ts`.
- Fallthrough attributes: Vue forwards `$attrs` to the root, or to the element bound with `v-bind="$attrs"` when `inheritAttrs: false`. Spread the rest props onto the same element.

Class, style and attribute merging must reproduce Vue's result exactly. Vue merges bindings in order of appearance, later winning for the same attribute or style property, and appends root fallthrough attributes last:

- `:class="cn(variant(...), props.class)"` → `className={cn(variant(...), className)}`.
- Root fallthrough (`inheritAttrs` left on): caller attributes and style properties override the component's own, and a caller `class` is concatenated. Spread rest props after the component's attributes, and write `style={{ ...own, ...style }}`.
- `inheritAttrs: false` with `v-bind="$attrs"` followed by the component's own bindings: the component's bindings win and classes concatenate without tailwind-merge. Spread rest props first, write `style={{ ...style, ...own }}` and `className={clsx(className, cn(...))}`.
- Static `class="a"` plus dynamic `:class` concatenate.

Primitives:

- Reka `Primitive` with `as` / `asChild` → `Primitive` from `lib/primitive.tsx`.
- Reka components with a Radix equivalent → `radix-ui` (`import { Dialog } from 'radix-ui'`) when the live parity cases pass; otherwise port Reka's primitive (see the README's primitive policy and `src/primitives/tooltip` as the model). Building blocks (`Presence`, `DismissableLayer`, `FocusScope`, `RovingFocus`, `Collection`, `useControllableState`, `composeEventHandlers`, `useComposedRefs`) come from `radix-ui/internal`; floating content uses the Reka `Popper` port in `src/primitives/popper`, never Radix's `Popper`.
- Reka-only primitives are ported into `src/primitives/<name>/` following Reka's implementation and DOM. Keep the Reka MIT notice in a `LICENSE` file in that directory.
- When Radix renders different DOM from Reka (attributes, wrappers, inline styles), the React component must reproduce Reka's output. The markup parity test is the judge.
- `--reka-*` CSS variables are mapped in Vue's `lib/reka/styles.ts`; the React equivalents map `--radix-*` in `src/lib/radix/styles.ts` onto the same `--hn-*` names. No other React file may mention `--radix-*`.

Icons: built-in icons use `lucide-react` wrapped with `lucide(Icon)` from `lib/icon.tsx`, which reproduces `@lucide/vue` output (its extra `lucide-<name>-icon` class, no automatic `aria-hidden`). `lucide-react` and `motion` are pinned to the releases the Vue package resolves; `packages/parity/test/engines.test.ts` fails when they drift.

Dismissable layers: every primitive built on Radix `DismissableLayer` wraps the `onPointerDownOutside`, `onFocusOutside` and `onInteractOutside` handlers it passes with `guardLayer(() => layerElement, handler)` from `src/primitives/utils/dismissable.ts`. Reka treats interaction inside any later `[data-dismissable-layer]` in document order as inside; Radix only follows the React tree, so overlays that are not React descendants would otherwise dismiss each other.

Motion:

- Vue `<Transition enter-*-class leave-*-class>` around a `v-if` → `Transition` from `lib/transition/Transition.tsx` with the same classes and `show` set to the `v-if` condition. Hooks (`v-on="hooks"`) map to `onBeforeEnter`, `onAfterEnter`, `onBeforeLeave`, `onAfterLeave`.
- Reka `Presence` / `forceMount` patterns → Radix `Presence`.
- `motion-v` → `motion/react` with the same values from `motion.ts`.

Timing: Vue watchers run in a microtask after the change that triggers them, so a listener that Vue attaches in `watch(element, ...)` exists before the next task. A React `useEffect` keyed on state set outside an event runs a render and a paint later. When Vue attaches listeners to an element created imperatively (OverlayScrollbars' viewport, a floating element), attach them in the same callback that creates the element (`useOverlayScrollbars`' `attach` argument), not in an effect keyed on stored state.

Same-task updates: Vue applies a state change and patches the DOM in a microtask, inside the task that caused it. React renders updates scheduled from native event listeners, observers (`IntersectionObserver`, `ResizeObserver`, `MutationObserver`), composition events and timers in a later task, so a frame, a pointer event or a layout read can land between the state change and the DOM that reflects it. Where Vue's behavior depends on the DOM being current in the same task (highlighting after filtering, geometry read right after a state flip, closing a dialog in the click that confirmed it), apply the update with `flushSync` inside that callback. Cross-engine runs expose these: Firefox and WebKit schedule frames and IME events differently from Chromium.

StrictMode: React mounts, unmounts and remounts every effect in development (Next.js enables StrictMode by default), and refs survive the replay. A `mounted`/`first` ref that skips the first effect run therefore lets the replay through as if the value had changed, which re-runs enter transitions, focuses and scrolls. Mirror Vue's `watch` by comparing with the previous value kept in a ref (`if (Object.is(previous.current, value)) return`), and reset state that a cleanup tears down inside that cleanup.

Client boundary: a module that calls hooks, creates a context or binds `on*` handlers must start with `'use client'`; static components must not, so they remain React Server Components. `pnpm --filter @hina-ui/parity directives:fix` inserts missing directives and `packages/parity/test/client-directive.test.ts` checks them.

Runtime constraints are enforced by `packages/parity/test/constraints.test.ts` and apply to React sources: tokens only, no `dark:`, no literal durations or curves, no `transition-all`, logical properties, no top-level `window` / `document`, no `createPortal` (use Radix `Portal`). Sources and tests contain no comments, matching the repository convention.

## 4. Export

Add the component and its public types to the barrel for its documentation category in `src/exports/<category>.ts` (the category is the one in `docs/app/nav.ts`). Export the same names and types as `packages/vue/src/index.ts`, renamed only as the README's mapping table says (`provide*` → `*Provider`). Do not edit `src/index.ts` or `packages/parity/coverage/pending.json`.

## 5. Prove parity

Markup: add `packages/parity/cases/<name>.cases.tsx`. Each case renders the same input through Vue (`h()`) and React (JSX). Cover every variant, size, state flag and slot combination exercised by the Vue unit tests and the docs demos, closed and open states for components whose content renders on the server, and the default locale text. `ignoreAttributes` needs a written `reason` and is reserved for primitive-generated values that cannot match, never for styling or ARIA. Generated ids (`reka-v-N`, React's `_R_N_`) are already mapped like `id` in every attribute, so they never need ignoring.

Live markup: overlays and anything rendered only after mount or interaction need `packages/parity/cases/<name>.live.tsx` (see `cases/tooltip.live.tsx`). Each live case mounts Vue, then React, in Chromium, runs `interact`, waits in `settle` (for example until the popper wrapper is positioned) and compares the whole body. Run with `cd packages/parity && npx vitest run -c vitest.browser.config.ts`.

Demos: for every Vue demo in `docs/app/demos/<locale>/<name>/*.vue` (both `zh-CN` and `en`), write the React twin at `docs-react/demos/<locale>/<name>/<same name>.tsx`. Use the public `@hina-ui/react` API exactly as a user would, `lucide-react` icons directly, and `'use client'` only when the demo has state or handlers. `packages/parity/test/demos.test.ts` renders each pair on the server and requires identical markup (user-supplied lucide icons are compared by their paths). Demos that depend on Nuxt-only APIs are skipped by that test but still need a twin for the documentation site.

Behavior: translate every Vue browser test (`*.browser.test.ts`) into `<Name>.browser.test.tsx` with the same `describe` / `it` titles and the same assertions; only the mounting changes (`test/mount.tsx`). Translate Vue unit tests that assert behavior not visible in markup (emitted values, controlled state, keyboard handlers under happy-dom) into `<Name>.test.tsx` with `@testing-library/react`. A Vue assertion that cannot hold in React is a parity failure to report, not a test to delete.

## 6. Verify

From the repository root:

```bash
pnpm --filter @hina-ui/react typecheck
pnpm --filter @hina-ui/react test
pnpm --filter @hina-ui/react exec vitest run -c vitest.browser.config.ts src/components/<name>
pnpm --filter @hina-ui/parity test
pnpm --filter @hina-ui/parity test:browser
```

`packages/parity/test/api.test.ts` compares the API surface: it reads each public Vue component's props, emits, slots and exposed members with `vue-component-meta`, renames them by the README's API mapping (`packages/parity/src/api/mapping.ts`, shared with the React documentation) and checks them against the React props and ref handle types. Fix what it reports, or record the difference with a reason in `packages/parity/src/api/coverage.ts`. `packages/parity/coverage/api-pending.json` lists known gaps and may only shrink; `pnpm --filter @hina-ui/parity api:update` removes the ones you fixed.

If Vue files were touched, also run `pnpm --filter @hina-ui/vue typecheck` and the Vue unit and browser tests of every component that imports the moved module. The export coverage test in `@hina-ui/parity` reports newly ported names as removable from the pending list; that failure is expected until the pending list is regenerated.
