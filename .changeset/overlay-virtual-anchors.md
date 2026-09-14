---
'@hina-ui/vue': minor
---

Add virtual anchors and an explicit `updatePositionStrategy` to Popover, DropdownMenu, and HoverCard, with public `OverlayAnchor` and `OverlayPositionStrategy` types. Support continuous coordinate tracking through exit, retain the last position when an anchor is cleared or detached, and stop measurement after unmount. Virtual HoverCard anchors remain open during scrolling and pointer departure, with visibility controlled by `v-model:open`, outside clicks, and Escape.
