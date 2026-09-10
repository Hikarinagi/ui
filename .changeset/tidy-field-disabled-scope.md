---
'@hina-ui/vue': patch
---

Keep disabled field styling scoped to the field's own state.

- Reaching a NumberInput limit or using readonly mode no longer dims the entire input or removes its hover feedback.
- Disabled actions in input adornments and partially disabled InputGroup children no longer affect enabled controls around them.
- Preserve disabled styling inherited from FormField and InputGroup, with a single opacity layer for embedded fields.
