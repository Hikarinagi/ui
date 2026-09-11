---
'@hina-ui/vue': minor
---

Make SelectOption extensible with typed extra fields and preserve complete option types through SelectItems, groups, Select, MultiSelect, Combobox, MultiCombobox, Listbox, CheckboxGroup, RadioGroup and SegmentedControl. Their slots now infer business fields directly from options, including Select's value slot and Listbox's trailing slot. Values still use string or number IDs. Group detection now distinguishes groups from options that carry their own options metadata.
