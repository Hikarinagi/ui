# OverlayScrollbars 2.16.0

The patch skips unchanged attribute writes and overflow tokens, and defers observer measurements while an initialized instance is sleeping. Waking the instance performs the backend's existing forced update, including changes received during sleep.

The Vue library bundles this patched runtime. A pnpm workspace patch alone would not reach npm consumers. The dependency stays pinned for the matching CSS and public instance types. `scripts/package-shared.mjs` includes the upstream MIT license in the published distribution.

When updating OverlayScrollbars, review each patched entry point and run the ScrollArea and AppShell browser regressions together with the package consumer check.

# Nuxt and Nuxt Nitro server 4.5.2

Production import protection uses Impound's lazy trace mode. Forbidden imports are still rejected with an import trace, but successful builds no longer collect source maps and an additional import graph for every module. Development keeps eager tracing for immediate feedback.

The patches only affect the documentation build, covering both Vite and Nitro. When updating Nuxt, check whether this behavior is available upstream and run `pnpm test:docs` to verify that production guards still reject application imports from server code.
