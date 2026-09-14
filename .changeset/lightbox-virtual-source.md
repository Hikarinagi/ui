---
'@hina-ui/vue': patch
---

Allow LightboxItem.source to return a viewport rectangle as well as an image element, and export the LightboxSource type. Decode images before opening from a virtual source so first-time blob previews expand from the supplied bounds and return to the latest bounds on close.
