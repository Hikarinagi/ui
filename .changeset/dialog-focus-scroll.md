---
'@hina-ui/vue': patch
---

Fix Dialog and AlertDialog scrolling their opener into view when restoring focus on close, including openers still mounted during a list item leave transition. Skip disconnected focus targets.
