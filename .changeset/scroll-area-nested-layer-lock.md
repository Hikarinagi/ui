---
'@hina-ui/vue': patch
---

Fix ScrollArea allowing background wheel and touch scrolling when a nested modal overlay opens. Evaluate the layer state when each event arrives, preserve scrolling in the active layer, and prevent horizontal wheel redirection from bypassing the lock.
