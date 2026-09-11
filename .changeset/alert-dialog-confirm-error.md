---
'@hina-ui/vue': patch
---

Catch synchronous and asynchronous AlertDialog confirmation failures internally, keep the dialog open for retry, and emit an error event with the original reason. Await PromiseLike results and prevent duplicate confirmation while pending.
