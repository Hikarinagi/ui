---
'@hina-ui/vue': patch
---

Reduce AppShell main-content measurement work during sidebar width transitions by deferring repeated scrollbar updates until the transition finishes or is cancelled. Native scrolling remains available, and scrollbar geometry is refreshed when updates resume.
