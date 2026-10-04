# Hina UI for React — documentation

Next.js App Router site for `@hina-ui/react`, served from `react.hinaui.dev` on Cloudflare Workers through OpenNext. The Vue documentation (`docs/vue`, Nuxt, GitHub Pages) stays the reference site; both sites render the same written content (`docs/content`) and use the framework-free modules, locale strings and public assets in `docs/shared`.

## Principles

- **One body of prose.** Pages are read from `docs/content/<locale>/**/*.md` at render time; nothing is copied. Framework differences are applied when rendering, not by forking the text.
- **Server Components first.** Every page is a React Server Component: it reads Markdown and demo sources from disk, renders Markdown into Hina components and highlights code with shiki on the server. Static Hina components (`Text`, `Stack`, `Table`, `Card`…) render without shipping JavaScript; only interactive components and demos that use state hydrate. This is the SSR showcase the site exists to make.
- **Demos are parity fixtures.** Every demo in `demos/<locale>/<component>/<name>.tsx` mirrors `docs/vue/app/demos/<locale>/<component>/<name>.vue`. `packages/parity/test/demos.test.ts` renders both on the server and requires identical markup, so documenting a component also proves it behaves like the Vue one in every documented usage.

## Deployment

`pnpm --filter @hina-ui/docs-react deploy` builds the site with OpenNext and deploys the `hina-ui-docs-react` Worker to `react.hinaui.dev`. It uses the local Wrangler login; `pnpm --filter @hina-ui/docs-react preview` runs the same build locally. Configuration lives in `wrangler.jsonc` and `open-next.config.ts`.

## Rendering pipeline

`lib/markdown.tsx` parses with markdown-it (same plugins as the Nuxt pipeline) and maps tokens to components exactly as `docs/vue/markdown.ts` does: headings → `Heading`, paragraphs → `Text tone="muted"`, inline code → `Code`, tables → `Table variant="secondary"` with the same minimum column widths, lists → `List`, blockquotes → `Blockquote`, rules → `Divider`, h2/h3 regions → `Section`, fences → `CodeBlock` with server-side highlighting, internal links → `Link asChild` + `next/link` with the locale prefix, `<Demo name>` → `DemoBox`.

Framework-specific passages live in `::: vue` / `::: react` blocks in the shared Markdown (a line `:::` closes a block; blank lines just inside a block belong to it). `docs/shared/framework.ts` implements them: `frameworkView(source, framework)` keeps one framework's blocks unwrapped and drops the other's, and `frameworkBlocks(framework)` registers the same transform as a markdown-it plugin. The Nuxt pipeline (`docs/vue/markdown.ts`, the `.md` middleware and the search index) keeps the vue blocks, so its output is byte-identical to the content without blocks; this site keeps the react blocks in `lib/markdown.tsx`, the `.md` route (`lib/raw.ts`), `lib/content.ts` (frontmatter) and the search index. Blocks also work inside the frontmatter, without blank lines. `node scripts/check-vue-content.ts [ref]` (repo root) proves that the Vue view of every content file is unchanged against a git ref.

`lib/api.ts` then adapts the remaining shared wording, following the API mapping in `packages/react/ARCHITECTURE.md`. `pageApi` reads the page's props, slots and events tables, so prose and tables use the same names (`CONTENT_SLOTS`, `SLOT_NAMES`, `EVENT_NAMES`, `MODEL_PROPS` hold the per-component exceptions):

| Vue documentation                                                      | React documentation                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| props table: `modelValue`, `class`                                     | `value`, `className`                                             |
| slots table (`插槽` / `Slots`)                                         | content props: `children`, `foo`, `renderFoo`, `fooContent`      |
| events table: `update:modelValue`, `update:foo`                        | callbacks: `onValueChange`, `onFooChange`                        |
| events table: `foo-bar`                                                | `onFooBar`                                                       |
| inline `v-model`, `v-model:foo`, `:foo="x"`, `foo-bar="x"`, `@foo`     | `value / onValueChange`, `foo / onFooChange`, `foo={x}`…         |
| "默认插槽", "the default slot"                                         | `children`                                                       |
| "`foo` 插槽", "the `foo` slot" (scoped: `renderFoo`)                   | "`foo` 属性", "the `foo` prop"                                   |
| "触发 `change` 事件", "emits `change`", "the `change` event"           | "调用 `onChange`", "calls `onChange`", "the `onChange` callback" |
| "支持双向绑定", "supports two-way binding", "模板引用", "template ref" | "可受控", "can be controlled", "ref"                             |
| "Reka 的全局方向配置", "Reka's global direction configuration"         | `ConfigProvider`                                                 |
| API headings (`插槽`, `Events`, `Expose`…)                             | `内容属性`, `Callbacks`, `Ref`…                                  |
| `@hina-ui/vue` in code, `packages/vue/src/**/*.vue` source links       | `@hina-ui/react`, `packages/react/src/**/*.tsx`                  |

Frontmatter links to reka-ui.com are not shown, since the React package does not use Reka at runtime (`lib/links.ts`). The changelog is rendered without adaptation; a react block labels it as the `@hina-ui/vue` release history.

`pnpm test` runs `test/api.test.ts` (the rules) and `test/residue.test.ts`, which renders every page through `rawMarkdown` and fails on Vue vocabulary (`vue` fences, `<script setup>`, `<template #…>`, `v-if` / `v-for` / `v-model`, `#slot`, `defineExpose`, 插槽 / slot, emit, Nuxt, Reka, `@hina-ui/vue`…). Intentional exceptions are listed in its `ALLOWED` table with a reason.

## Routing and locales

The URLs mirror the Nuxt site: Chinese at the root (`/components/button`), English under `/en`. Each locale has its own root layout (`app/(zh)/layout.tsx`, `app/en/layout.tsx`) that does not depend on the page, so the shell (sidebar, header, scroll position) stays mounted while navigating within a locale; switching locale is a full navigation, as in Nuxt.

Every documentation page is its own static route. `scripts/generate.mjs` reads `docs/content/<locale>/**/*.md` and writes `app/<group>/<path>/page.tsx` plus `demos/pages/<locale>/<path>.ts`, which imports exactly the demos (`<Demo name>`, category heroes) and playgrounds that page renders. A route therefore only ships the client code of its own demos; one catch-all route would ship every demo to every page. The generated files are git-ignored and rebuilt before `dev`, `build` and `typecheck`.

## Demos

A demo that uses state, handlers or passes functions or components as data starts with `'use client'`; static demos stay Server Components. `packages/parity/test/client-directive.test.ts` checks this, and `next build` prerenders every page through React Server Components, which catches anything the check misses. Each `Playground` gets a generated client wrapper that imports only its own component. Demo data that both sites use lives in `docs/shared/demos`; `demos/<name>.ts` re-exports it, as `docs/vue/app/demos/<name>.ts` does for the Vue demos, so a demo and its twin import the same relative path.

## Status

Done: content loading and Markdown rendering with API rewriting, server highlighting, `DemoBox` with collapsible source, per-page routes and demo maps, site chrome (`AppShell`, sidebar from `docs/shared/nav.ts`, table of contents via `Anchor`, prev/next, banner, GitHub stars, `Toaster`), landing page and wall, category grids, components overview, design pages, changelog, `Playground`, `.md` endpoints, shared `docs/shared/public` assets, zero-native-tags lint, the Cloudflare deployment and the CI job. Demos are checked for `'use client'` by `packages/parity/test/client-directive.test.ts`.

Next: theme and locale toggles, search on `CommandPalette`, Copy Markdown, SSR showcase pages, the remaining demo twins, React release notes in the changelog.
