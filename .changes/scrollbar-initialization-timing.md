---
type: fixed
scope: ScrollArea
---

Initialize custom scrollbars on the next frame after mounting instead of waiting for idle time and repeatedly postponing initialization during scrolling. Dialogs, drawers, sheets, and other overlays now initialize their scrollbars promptly when opened or reopened, preserving any native scrolling that occurred before initialization.
