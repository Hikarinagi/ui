# OverlayScrollbars 2.16.0

The patch skips unchanged attribute writes and overflow tokens, and defers observer measurements while an initialized instance is sleeping. Waking the instance performs the backend's existing forced update, including changes received during sleep.

The Vue library bundles this patched runtime. A pnpm workspace patch alone would not reach npm consumers. The dependency stays pinned for the matching CSS and public instance types. `scripts/package-shared.mjs` includes the upstream MIT license in the published distribution.

When updating OverlayScrollbars, review each patched entry point and run the ScrollArea and AppShell browser regressions together with the package consumer check.
