---
type: fixed
scope: CI
---

Verify the final rendered Lightbox hero geometry after unmount instead of relying on the last animation-frame sample, preventing intermittent browser test failures under load.
