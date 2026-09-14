# @hina-ui/vue

## 1.5.0

### Minor Changes

- 74f7a8b: Expose the built-in content scroll viewport on Sheet, Drawer, and Dialog component refs as `viewport: HTMLElement | undefined`. The element becomes available after ScrollArea initialization, remains available during exit, clears when content unmounts, and updates when reopened. Dialog with a custom `body` slot does not expose a built-in viewport.
- c077db3: Add virtual anchors and an explicit `updatePositionStrategy` to Popover, DropdownMenu, and HoverCard, with public `OverlayAnchor` and `OverlayPositionStrategy` types. Support continuous coordinate tracking through exit, retain the last position when an anchor is cleared or detached, and stop measurement after unmount. Virtual HoverCard anchors remain open during scrolling and pointer departure, with visibility controlled by `v-model:open`, outside clicks, and Escape.
- 124153b: Add icon, title, and body slots to Sheet and Drawer with the same semantics as Dialog. Add Drawer header visibility and a closable option for both panels while preserving their default behavior. Custom body content controls layout and scrolling; Sheet handles remain independently configurable. Keep accessible titles and descriptions when the visible header is replaced or hidden, and expose no built-in viewport in body mode.
- 04e214d: Add a `header` option to Sheet, matching Dialog. Hiding the header removes the visible title, description, and header close button while preserving the accessible name and description. The handle remains independently configurable; disabling both removes the top drag region without leaving an empty header gap.

### Patch Changes

- 297da6b: Fix Sheet and Drawer stacking in component mount order instead of opening order. Mount each portal when opened and retain it until content finishes exiting, so a later-opened panel and its scrim appear above earlier overlays. Preserve exit animations, content when reopened during exit, and custom portal targets.

## 1.4.0

### Minor Changes

- 1d2b055: Add an external anchor to HoverCard so multiple trigger elements can share one controlled card. Preserve hover transit, delayed closing and stable exit positioning, clean up listeners and timers when switching anchors, and close when the anchor is cleared or removed.
- 18052c6: Add `positionerClass` to HoverCard for styling the outer positioning element independently of the card content. This enables custom movement transitions when switching external anchors while preserving the existing enter and exit animations.
- f0aef8c: Add optional previewSize metadata to Image and LightboxItem. Known intrinsic dimensions determine the initial preview fit and zoom limits before loading, keeping the frame stable when the larger image arrives and allowing rectangle-source transitions to start without waiting for decoding. Invalid or omitted dimensions retain automatic sizing.
- ba56696: Expand Pagination with a bound page size, size selector, page input, range information, composable controls, pending list overlay and single-page hiding. Emit one coherent change payload per effective update.
  
  Add interactive ellipses with group skipping, scrollable omitted-page choices, mouse, touch and keyboard interaction, bounded rendering for large ranges, stable positioning through exit and focus restoration. Support RTL throughout.
- 1aa57ca: Add Pagination with controlled page selection, page ranges and ellipses, optional first and last controls, size and disabled states, and custom page content. It supports RTL and keeps the current page within bounds when totals or page sizes change.
- 1587748: Add the v-tooltip directive for existing elements, with reactive text, placement and disabled options. It shares Tooltip styling and provider delays, preserves existing descriptions, and removes its listeners and popup when the element unmounts.
- a10bbbd: Add optional TreeSelect search with ancestor-preserving filtering, a controlled search value, and keyboard navigation between the search field and tree. Clearing search restores the previous expansion state without changing the selection.

### Patch Changes

- b352b3a: Make Badge overlays ignore pointer events by default so they no longer block clicks on the host beneath them, including bare badges and custom content.
- 4a3514b: Prevent HoverCard from reopening when the pointer enters its content during the exit animation. Exiting content is no longer interactive, while returning during the close delay and reopening from the trigger remain supported.
- 2a5d3b6: Keep HoverCard aligned with its external anchor while scrolling during the exit animation. Fall back to the latest recorded position when the anchor is cleared or removed, and stop tracking once the card has unmounted.
- 4da6c24: Isolate Image's internal stacking order so the image and skeleton no longer cover sibling overlay controls or intercept their clicks.
- a579c18: Remove the transparent button borders from the Lightbox source demos and disable background image repetition to prevent one-pixel edge artifacts.
- 499c97d: Fit image previews within the available area without enlarging small images. Base zoom targets and limits on intrinsic image dimensions, add actual-size and fit-to-window controls, and adapt tall and panoramic images to the available width or height. Reserve space for controls and smoothly update sizing when higher-resolution previews load or the viewport changes, while preserving source transitions and paging gestures.
- 0d6557c: Allow LightboxItem.source to return a viewport rectangle as well as an image element, and export the LightboxSource type. Decode images before opening from a virtual source so first-time blob previews expand from the supplied bounds and return to the latest bounds on close.
- 83c26e6: Keep Pagination ellipsis popups aligned with their triggers throughout exit animations, including scrolling and layout changes. Retain the latest position if a trigger is removed, and stop tracking once the popup unmounts.
- 3166ee2: Remove the trailing row gap from Pagination ellipsis popups so the top and bottom spacing match. Keep virtual list height and keyboard scrolling aligned with the actual item bounds.
- 96f0b71: Keep Pagination page buttons square at every size and density by removing text-button padding and fixing their width to their height. Long page labels and custom content no longer widen the buttons; overflowing content is truncated while the complete page number remains available through its accessible name.
- f79856d: Replace Pagination's native hover titles with Tooltip hints for content that is actually truncated. Show the full page label, including custom text, on hover or keyboard focus when a TooltipProvider is present. Update hints when content or dimensions change and dismiss them when pagination is disabled or pending.
- 46dc0ac: Fix RTL support in Slider and RangeSlider. Add dir configuration with inherited direction support, keep pointer and keyboard interactions consistent with the track, and align thumbs, fill and mark labels across sizes and direction changes.
- 2c8663c: Fix v-tooltip remaining open after the pointer leaves its trigger or content. Keep the hover boundary associated with the actual host element, including after disabling and re-enabling the directive.

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
