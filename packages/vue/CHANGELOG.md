# @hina-ui/vue

## 1.3.1

### Patch Changes

- a9fbf56: Fix Dialog and AlertDialog scrolling their opener into view when restoring focus on close, including openers still mounted during a list item leave transition. Skip disconnected focus targets.
- 280d8b7: Apply Image style to the outer container, matching class, and add imageStyle for inline styles on the img element. Explicit style.aspectRatio overrides ratio. Move existing img-specific style bindings to imageStyle.
- 0e9c5d8: Fade lazy-loaded images in above their placeholder while the placeholder fades out, using the existing duration and easing tokens. Keep the image fade when the skeleton is disabled and preserve loading, decoding, and fallback behavior.
- 81a0e7f: Keep Image container sizing consistent with and without preview. Fill the available width by default so ratio-based placeholders retain their dimensions before the image loads, while preserving explicit width classes.
- 009f0ad: Preserve rounded clipping from image ancestors during Lightbox opening and closing. Account for clipping bounds, individual corners, border widths and percentage radii without applying unrelated container corners to every image in a grid.
- 6ef5171: Keep the current image scale when dismissing a lightbox downward without a visible source image, preventing the exit animation from growing the image again after release.
- ef6ecbd: Export Lightbox and the LightboxItem type from the package root. Allow consumers to control image previews directly with items, open and index, including blob URLs without a source Image element.
- 73b2700: Align Dialog, AlertDialog, and Popover portal mounting with opening order. Prevent older popovers from rendering above newer dialogs and their scrims or leaving dialogs hidden from assistive technology, while preserving exit animations and focus restoration.
- 7004b20: Fix DropdownMenu and Popover failing to open with fragment-root triggers such as IconButton. Resolve the actual trigger element through Reka UI, preserving positioning, keyboard interaction, and focus restoration with or without TooltipProvider.
- 03e446a: Fix ScrollArea allowing background wheel and touch scrolling when a nested modal overlay opens. Evaluate the layer state when each event arrives, preserve scrolling in the active layer, and prevent horizontal wheel redirection from bypassing the lock.
- b19db0d: Replace Skeleton's background pulse with a gradient shimmer. Adjust highlight opacity for light and dark themes, reverse the animation in RTL layouts, and keep reduced-motion placeholders static. Use the existing motion tokens with a 1.2-second default cycle.

## 1.3.0

### Minor Changes

- 3920ea8: Add an optional confirmDelay in seconds to AlertDialog. Show the remaining time on the disabled confirm button, restart the countdown on each opening, and allow cancellation while waiting.
- 6fc603a: Add external HTMLElement anchors and optional triggers to DropdownMenu. Expose modal and cancellable focus-restoration and dismissal events, forward panel accessibility attributes, and preserve menu keyboard navigation and exit positioning.
- 3b903e3: Add external HTMLElement anchors and optional triggers to Popover. Expose modal and cancellable focus and dismissal events, forward panel accessibility attributes, and preserve positioning through exit transitions.

### Patch Changes

- 3ad480c: Catch synchronous and asynchronous AlertDialog confirmation failures internally, keep the dialog open for retry, and emit an error event with the original reason. Await PromiseLike results and prevent duplicate confirmation while pending.
- 451054d: Fix CodeBlock scrolling when height or max-height is set through class or style. Move code padding inside the scrolling content so edge shadows meet the viewport, preserve fixed copy controls, and prevent Prose from adding another code-block surface or scroll container.
- 13ac5f9: Fix Highlight animating across the perpendicular axis when its container moves. Add an axis prop for translation, and apply the matching direction in Tabs, SegmentedControl, Anchor, and lightbox thumbnails while preserving size transitions.
- b2c72ad: Fix focusable ScrollArea keyboard scrolling by moving its tab stop and accessible region to the actual viewport after initialization. Preserve existing focus during enhancement and keep CodeBlock focus outlines visible.

## 1.2.0

### Minor Changes

- 384e415: Add variant="bare" to Input, Textarea, SearchInput, PasswordInput, NumberInput and InputGroup. Bare inputs render without a background, border, shadow, hover fill or container focus ring, while preserving size, padding, disabled state, validation semantics and action-button feedback. InputGroup and NumberInput also omit their internal dividers. Textarea keeps its row sizing and autosize behaviour when the border is removed.
- 2a74da4: Add `variant="bare"` to Listbox. The bare root has no background, border, shadow or corner radius, while option styling, selection and scrolling are preserved. The default remains `primary`.
- 124c96f: Add clearable to Select. The clear button resets the value to null, emits clear and restores focus to the trigger without opening the list. The trigger and clear action are separate native buttons within one field surface, preserving keyboard access, field sizing and native form validation.
- cc1ad5d: Add a Listbox `trailing` slot receiving `{ option, selected }` and expose `selected` to the existing `option` slot. Custom trailing content replaces the complete indicator area and can use its natural width; empty content removes both the indicator space and adjacent gap. Without the slot, the existing indicator remains. Grouped and plain options share the same rendering and selection state.
- 5d5e858: Add a body slot to Dialog that replaces the default header, content and footer without internal padding, gaps or a ScrollArea wrapper. The slot receives close and controls its own layout and scrolling. A visually hidden title and optional description preserve accessible naming, while size, placement, focus containment, scroll locking and dismissal behaviour remain managed by Dialog.
- 4dfb9be: Add xl (42rem) and 2xl (56rem) sizes to Dialog. Existing sizes and the md default are unchanged. Custom max-width classes continue to override the preset while preserving viewport constraints and responsive placement.
- 7da17e5: Add header and closable props to Dialog, both enabled by default. Hiding the header preserves a visually hidden accessible title and description. Hiding the close button does not disable Escape or outside-click dismissal; locked continues to control those behaviours. Omit aria-describedby when no description is provided.
- 34419be: Add icon and title slots to Dialog. Icons are decorative, while custom title content preserves heading semantics and the dialog's accessible name. The title prop remains the default title content.
- 802b480: Add placement="top" to Dialog. The panel stays aligned to the top on all screen widths, slides in from above and retains the existing viewport spacing, width constraints and internal scrolling behaviour.
- d72e95e: Make SelectOption extensible with typed extra fields and preserve complete option types through SelectItems, groups, Select, MultiSelect, Combobox, MultiCombobox, Listbox, CheckboxGroup, RadioGroup and SegmentedControl. Their slots now infer business fields directly from options, including Select's value slot and Listbox's trailing slot. Values still use string or number IDs. Group detection now distinguishes groups from options that carry their own options metadata.
- 8e604e6: Add a `padded` prop to Listbox, defaulting to `true`. Set it to `false` to remove the inner list's surrounding padding without changing row padding, group label padding, root width or scrolling. Padding is independent of the surface variant.

### Patch Changes

- b579d55: Keep component sources and tests comment-free. Preserve template type checks with explicit assertions and configure the SSR test environment in Vitest instead of source directives.
- 44b280b: Animate Select's clear button with the same scale and opacity transitions as other input controls. Keep its position and text spacing until the leave transition finishes, and disable the action while it exits.
- 91ed07d: Keep component SFCs focused on composition: move Select transition state, Textarea sizing and caret scrolling, MultiCombobox selection state, AvatarGroup child traversal, ImageGroup registration and ordering, and shared collapse measurements into TypeScript modules. Centralize Select and Dialog layout variants without changing their public APIs or interaction behavior.

## 1.1.0

### Minor Changes

- c39a405: Add `controlPlacement` and `block` to Checkbox, Switch, CheckboxGroup and RadioGroup for full-width settings rows with trailing controls. Descriptions stay with their labels, logical placement follows text direction, and horizontal block groups divide the available width equally. Existing layouts remain the default.
- 73b040e: Add horizontal and container-responsive FormField layouts, configurable label/control description placement, and label column widths. FormLayout supplies reactive shared defaults with per-field and nested-layout overrides. Errors remain with controls, label and description associations are preserved, and the existing vertical layout stays the default.

### Patch Changes

- b7cda5a: Keep disabled field styling scoped to the field's own state.
  
  - Reaching a NumberInput limit or using readonly mode no longer dims the entire input or removes its hover feedback.
  - Disabled actions in input adornments and partially disabled InputGroup children no longer affect enabled controls around them.
  - Preserve disabled styling inherited from FormField and InputGroup, with a single opacity layer for embedded fields.

## 1.0.0

### Major Changes

- 2fdb412: First public release.
  
  An elegant, restrained Vue 3 component library built on Reka UI and Tailwind CSS v4, covering
  typography, layout, forms, overlays and page scaffolding.
  
  - Dark and compact modes driven by a single attribute on an outer container
  - Colours, radii and motion durations exposed as CSS variables for theming
  - Focus management, keyboard operation and screen reader semantics built in
  - Chinese and English locales out of the box
  
  The package now ships a compiled ESM bundle with type declarations alongside its source, so it
  works in both SSR and client-only setups. Import `@hina-ui/vue/styles/tokens.css` from your
  Tailwind entry to pull in the tokens and register the component sources for class scanning.
