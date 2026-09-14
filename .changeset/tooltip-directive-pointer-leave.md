---
'@hina-ui/vue': patch
---

Fix v-tooltip remaining open after the pointer leaves its trigger or content. Keep the hover boundary associated with the actual host element, including after disabling and re-enabling the directive.
