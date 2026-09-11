---
'@hina-ui/vue': patch
---

Fix CodeBlock scrolling when height or max-height is set through class or style. Move code padding inside the scrolling content so edge shadows meet the viewport, preserve fixed copy controls, and prevent Prose from adding another code-block surface or scroll container.
