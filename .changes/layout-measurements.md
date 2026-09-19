---
type: fixed
scope: AppShell, ScrollArea
---

Reduce repeated measurements during sidebar transitions while preserving the existing layout animation and scroll position. Pause descendant ScrollArea measurements before layout changes and resume after the final transition, including interrupted and nested layouts. Add AppShell's `size-stable` event for expensive resize consumers. Use a single grid track for ScrollArea sizing, coalesce animation updates, and skip unchanged scrollbar attributes.
