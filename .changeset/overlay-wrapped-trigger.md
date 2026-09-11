---
'@hina-ui/vue': patch
---

Fix DropdownMenu and Popover failing to open with fragment-root triggers such as IconButton. Resolve the actual trigger element through Reka UI, preserving positioning, keyboard interaction, and focus restoration with or without TooltipProvider.
