---
'@hina-ui/vue': patch
---

Fix Sheet and Drawer stacking in component mount order instead of opening order. Mount each portal when opened and retain it until content finishes exiting, so a later-opened panel and its scrim appear above earlier overlays. Preserve exit animations, content when reopened during exit, and custom portal targets.
