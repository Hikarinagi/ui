---
'@hina-ui/vue': minor
---

Expose the built-in content scroll viewport on Sheet, Drawer, and Dialog component refs as `viewport: HTMLElement | undefined`. The element becomes available after ScrollArea initialization, remains available during exit, clears when content unmounts, and updates when reopened. Dialog with a custom `body` slot does not expose a built-in viewport.
