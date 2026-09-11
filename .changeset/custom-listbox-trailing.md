---
'@hina-ui/vue': minor
---

Add a Listbox `trailing` slot receiving `{ option, selected }` and expose `selected` to the existing `option` slot. Custom trailing content replaces the complete indicator area and can use its natural width; empty content removes both the indicator space and adjacent gap. Without the slot, the existing indicator remains. Grouped and plain options share the same rendering and selection state.
