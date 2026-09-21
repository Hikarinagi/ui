# @hina-ui/vue

## [1.7.4](https://github.com/Hikarinagi/ui/compare/@hina-ui/vue@1.7.3...@hina-ui/vue@1.7.4) (2026-09-21)

### Added

- **Affix** Add a native sticky container with top and bottom placement, offsets, disabled state, and affixed-state slots and events. Preserve document flow, focus, and server-rendered layout, with automatic support for nested scroll containers and parent boundaries.
- **Autocomplete** Add a free-text Autocomplete with typed suggestions, caret and selection context, caller-defined range replacement, and optional continued completion. Support remote loading and empty states, leading and trailing slots, accessible keyboard navigation, optional Tab acceptance, and Enter submission without a highlighted suggestion. Preserve text on blur and respect IME composition. Include bilingual query-builder, remote-search, and form validation examples.
- **Carousel** Add a carousel with responsive item layouts, grouped navigation, dragging, looping, controlled snap selection, accessible rotation controls and caller-owned content. Render default slide positions, indicators and navigation state during SSR, including nonzero initial indices. Provide compact capsule indicators with fixed click targets, slots for individual indicators or the whole indicator group, custom controls, vertical layouts and an optional measurement placeholder for custom layouts. Keep styles and initial layout calculations in the shared layer and the motion engine behind a Vue adapter.
- **DataList** Add DataList with structured media, title, description, metadata, and action slots; responsive list and card layouts; optional layout controls; and typed custom item rendering. Coordinate local and remote pagination, unknown totals, initial skeletons, refresh overlays, and empty states. Support measured virtualization in both lists and grids, server rendering, accessible scroll containers, and programmatic scrolling. Keep content styling consistent across rendering modes. Preserve ancestor scroll positions when results arrive or pages change, and keep explicit item alignment inside bounded lists.
- **Editable** Add inline text editing with separate draft and committed values, click and double-click activation, multiline input, configurable submission, and save/cancel controls. Support asynchronous saving with error recovery, form field semantics, and custom preview and action slots. Include bilingual documentation and form examples.
- **FloatButton, ScrollTop** Add floating actions with logical placement, safe-area spacing, visible labels, tooltips, loading states, and visibility transitions. Add a back-to-top control for pages and custom scroll containers with display thresholds, reduced-motion support, and keyboard focus handling. Include bilingual documentation and interactive examples.
- **Masonry** Add responsive masonry layouts with stable item keys, shortest-column and sequential placement, automatic height measurement, RTL, and loading and empty slots. Add an optional pending slot for SSR and initial client layout: keep real items measurable but hidden and inert until positioned, and preserve existing content during append loading. Include bilingual documentation and interactive examples.
- **MonthGrid** Add an SSR-ready monthly display table with caller-owned day content and actions, controlled month navigation, month and year shortcuts, date bounds, localized week headings, and visible-range events. Share calendar header controls while preserving existing date-selection behavior.

  Support per-date cell and content classes, independent content height and padding, supplementary date content, header actions and header visibility. Preserve date semantics when customizing its label and expose localized day text, weekday and relative-date metadata. Include schedule, check-in and room-rate examples.
- **QRCode** Add SSR-rendered SVG QR codes with error correction, quiet zones, custom colors and logos, localized loading and expiry states, a custom status slot, and standalone SVG or PNG export. Keep encoding and visual contracts in the shared layer.
- **SplitButton** Add a primary action joined to an accessible dropdown menu. Support independent action and menu disabling, loading, form submission, links, responsive width, RTL, and menu composition through existing DropdownMenu items. Include bilingual examples and documentation.
- **Text** Add size="inherit" to inherit the parent font size and line height while keeping tone and weight independently configurable. Preserve the default body size.
- **Select, MultiSelect, Combobox, MultiCombobox, Listbox, CommandPalette** Add optional virtualize support with measured row heights and configurable estimates and overscan. Keep search, grouped labels, keyboard navigation, disabled-item skipping and selection working across the complete dataset. Preserve focused rows and native form values without rendering every option, including when dropdowns are closed.
- **VirtualList** Add VirtualList with typed item slots, fixed and dynamic item sizes, horizontal and RTL layouts, programmatic scrolling, visible-range events, loading and empty states, and server-rendered initial content. Preserve focused items while scrolling and share presentation styles across framework packages.
- **Tree, TreeSelect** Add optional virtualize support for expanded tree nodes, with measured heights, complete-data search, RTL keyboard navigation and focus restoration after collapsing a focused descendant. Preserve cascading checks and indeterminate states independently of rendered nodes. Add maxHeight to configure the virtual Tree viewport.

### Changed

- **Styles** Isolate primitive CSS variables in the Vue adapter so shared component styles and motion use Hina-owned runtime properties.
- **Architecture** Extract shared styles, variants, class utilities and motion helpers into a framework-independent internal layer while preserving the Vue package API and CSS entry.
- **VirtualList, DataTable** Share virtual window measurement, scroll positioning and spacer calculations between VirtualList and DataTable while preserving their existing APIs. Export VirtualizeOptions for consistent optional virtualization across collection components.

### Fixed

- **Anchor** Keep the current entry visible in a scrollable table of contents, including ScrollArea, without scrolling a shared article viewport or moving focus. Add `autoScroll` to opt out, a `change` event, and a read-only exposed `current` id. Respect reduced motion and directory viewport resizing.
- **DropdownMenu** Refresh anchored menu positioning after the reading direction changes so logical start and end alignment follow the updated layout while the menu stays open.
- **AvatarGroup** Apply overlap spacing and separator rings to direct DOM children through container selectors so wrapped avatars no longer need to forward injected classes to their outer element. Preserve size-specific spacing, stacking order and overflow counts. Export `useAvatarGroup` and `AvatarGroupContext` for custom avatar components.
- **Combobox** Render the selected label in the input during SSR, including remote selections supplied through `selectedOption`, without waiting for client updates. Preserve active search input and clearing behavior.
- **DataTable** Keep column style declarations portable when generating the published package's types, without exposing the package manager's internal dependency paths.
- **DataTable** Keep responsive column calculations within the column group instead of invalidating every cell's inherited styles. Preserve server-rendered geometry, pinned columns, resizing, and editing feedback while avoiding body rerenders and unnecessary header measurements during container resizing.
- **Image** Prevent images sized by height and aspect ratio from expanding shrink-to-fit ancestors to their intrinsic width in WebKit. Preserve full-width images, natural height, preview sizing, and server-rendered layout without requiring width overrides on the inner image.
- **Inline, Flex, Stack** Accept Vue components in the `as` prop alongside tag names, allowing component roots without TypeScript errors or invalid-prop warnings. Preserve layout classes and attribute, event, and default-slot forwarding.
- **AppShell, ScrollArea** Reduce repeated measurements during sidebar transitions while preserving the existing layout animation and scroll position. Pause descendant ScrollArea measurements before layout changes and resume after the final transition, including interrupted and nested layouts. Add AppShell's `size-stable` event for expensive resize consumers. Use a single grid track for ScrollArea sizing, coalesce animation updates, and skip unchanged scrollbar attributes.
- **ScrollArea** Mirror horizontal edge gradients in RTL and apply explicit content direction to both the viewport and shadow layers.
- **ScrollArea** Redirect vertical wheel input along the logical horizontal axis in RTL and release outward wheel events at both scroll boundaries.
- **ScrollArea** Initialize custom scrollbars on the next frame after mounting instead of waiting for idle time and repeatedly postponing initialization during scrolling. Dialogs, drawers, sheets, and other overlays now initialize their scrollbars promptly when opened or reopened, preserving any native scrolling that occurred before initialization.
- **State layer** Only suppress a state layer's press feedback when it owns a direct Ripple child. Nested controls with their own ripples no longer suppress press feedback on the surrounding row, including selected and grouped states.
- **Toggle** Preserve normal button padding when a text toggle also provides an accessible label. Apply square, icon-only sizing only when no default text slot is present.
- **Listbox, Tree** Render visible initial rows during SSR when a virtualized collection has a distant selected item. Preserve the initial DOM during hydration, then scroll to the selection after the viewport is ready. Popup collections continue to open around the selected item.
- **VirtualList** Update item positions in the same frame as animated size changes to avoid overlaps while expanding and gaps while collapsing.
- **VirtualList** Show loading feedback in a centered overlay without shrinking the scroll viewport or shifting its edge shadows. Preserve existing items and scroll position while loading.
- **VirtualList** Clip scroll shadows and content to the outer border radius.
- **Select, MultiSelect, Combobox, MultiCombobox, TreeSelect, ScrollArea, VirtualList** Prevent blank virtualized popups when opening at a distant selection. Keep initial rendering bounded before positioning completes and calculate list offsets independently of entrance transforms.
- **Select, MultiSelect, Combobox, MultiCombobox, Listbox, Tree, TreeSelect** Center the selected item when opening or reopening a virtualized popup, clamping at the first and last items. Keep variable-height options fully visible and retain minimal scrolling during keyboard navigation. Initialize the rendered range around the selection and remove the intermediate native-viewport binding now that scrollbars initialize on the next frame.

## [1.7.3](https://github.com/Hikarinagi/ui/compare/@hina-ui/vue@1.7.2...@hina-ui/vue@1.7.3) (2026-09-16)

### Added

- **NavigationMenu** Add composable navigation menus with links, triggers, custom content panels, controlled expansion, hover and click activation, horizontal and vertical layouts, and router integration. Include shared panel transitions, keyboard navigation, disabled states, RTL support, and bilingual documentation with interactive examples.
- **Rating** Add a `stars` prop to separate the displayed star count from the maximum score. Pointer and keyboard selection, read-only fill, accessible labels, and form values use the configured score scale. Existing ratings keep their current behavior when `stars` is omitted.
- **Stepper** Add Stepper with horizontal and vertical layouts, linear and non-linear navigation, completion and error states, typed slots, and RTL keyboard support. Provide guarded asynchronous navigation, duplicate-request protection, localized progress announcements, and exposed navigation methods.
- **Timeline** Add Timeline with vertical and horizontal layouts, alternate alignment, semantic node colors, reversible item order, opposite time labels, and typed slots for markers and content. Include RTL support and accessible ordered-list markup.
- **Toolbar** Add Toolbar with buttons, links, single and multiple toggle groups, separators, and custom control composition. Support horizontal and vertical layouts, RTL, roving keyboard focus, inherited sizing and disabled state, and bare styling.

### Changed

- **CI** Run browser tests across four independent shards and run static checks, unit tests, documentation builds, and package checks in parallel. Preserve failure screenshots for each browser shard.

### Fixed

- **Ripple** Keep the ripple drawing coordinate system consistent in RTL layouts so pointer ripples follow the clicked position and keyboard ripples stay centered, without changing the host control's reading direction.
- **Sidebar** Align the first desktop navigation item's icon with the AppShell header toggle by correcting navigation padding. Keep the alignment consistent between expanded and rail states and across density modes.
- **Stepper** Remove hover and pressed color feedback and ripples from step triggers while preserving keyboard focus indicators and step status styling.
- **Docs** Correct internal links in the English Toolbar documentation to prevent duplicate locale prefixes and static prerender failures.
- **Docs** Reduce documentation build memory by disabling redundant server bundle tree-shaking and production source maps, preventing prerender initialization from exhausting the CI heap.
- **Docs** Use client-side routing for internal links in component demos and preserve the current documentation language when navigating between pages.
- **CI** Verify the final rendered Lightbox hero geometry after unmount instead of relying on the last animation-frame sample, preventing intermittent browser test failures under load.

## [1.7.2](https://github.com/Hikarinagi/ui/compare/@hina-ui/vue@1.7.1...@hina-ui/vue@1.7.2) (2026-09-16)

### Fixed

- **Anchor** Keep observed sections separate from fallback and hash locations so scrolling through gaps cannot leave stale entries in the highlighted range. Preserve highlighting of multiple sections when they are actually visible together.
- **DataTable** Resolve constrained column widths against the container before hydration, preserving width limits, pinned columns and explicit overrides without an initial layout jump. Keep resizing and responsive width allocation consistent with the initial layout.
- **Table** Allow cell and header padding utilities to override Table defaults, including DataTable cellClass and headerClass, while preserving default row density.

## [1.7.1](https://github.com/Hikarinagi/ui/compare/@hina-ui/vue@1.7.0...@hina-ui/vue@1.7.1) (2026-09-16)

### Added

- **Combobox** Add a loading prop to Combobox, sharing the loading indicator and icon transitions with MultiCombobox. Expose loading through aria-busy while allowing input, selection and clearing; selected labels remain independent of request state.
- **DataTable** Add DataTable with typed columns, slots and instance methods; local and remote sorting, global and column filtering, known and unknown-total pagination, cross-page single and multiple selection, tree rows and expansion, grouping and aggregation, multilevel headers and summaries, column visibility, pinning, resizing and reordering, row reordering, asynchronous cell and row editing, virtual scrolling, CSV export, and accessible keyboard controls. Additional controls are enabled individually.
- **Table** Allow TableHead to represent grouped column and row headers through the native colgroup and rowgroup scopes.

### Changed

- **DataTable** Unify alignment and embedded styling for built-in and custom DataTable editors. Highlight only the focused field during row editing. Show a failed save once below the row, keep field validation errors separate, and preserve error visibility during horizontal and virtual scrolling.
- **DataTable** Identify both columns sharing a resize boundary in fit mode through hover hints and accessible labels, and show both widths while dragging. Retain single-column feedback in expand mode.
- **DataTable** Improve DataTable resizing, reordering and inline actions. Start resizing from rendered widths, support fit and expand modes, show full-height boundary guides and allow Escape to cancel. Drag column headers directly with a preview and insertion marker without triggering sorting. Keep sorting, expansion, grouping and editing controls compact and preserve row height and alignment.

### Fixed

- **DataTable** Fix moving containers, extra overflow from the last resize handle, and incorrect pinned-column, zoom and scroll coordinates during DataTable resizing. Apply consistent width constraints while preserving automatic sizing until dragging begins. Update widths and pinned offsets through CSS variables without rerendering custom cells on every frame. Truncate narrow headers to prevent height changes.
- **DataTable** Fix clearing a DataTable column filter through Select leaving a null filter, an empty table and a stale clear button.
- **DataTable** Prevent expand-mode resizing from shrinking the DataTable below its container width and leaving blank space. Apply the same minimum width to pointer and keyboard resizing while preserving other column widths.
- **DataTable** Mount DataTable drag previews and resize guides through Portal, respecting the ConfigProvider teleportTo setting.
- **Form** Discard stale asynchronous Form validation results, prevent duplicate submissions while validation is pending, and invalidate pending errors and submissions on reset.
- **Types** Declare vue-component-type-helpers as a dependency of public types so declaration checks succeed in clean consumer projects.
- **Table** Fix Table header alignment so explicit center and end alignment override the default heading style, including in RTL layouts.
- **DataTable** Keep DataTable resize handles within their visible headers so pinned columns cannot cover them. Exclude hidden handles from pointer and keyboard interaction, show the column name on hover and its width while dragging, and limit pinned-region expansion to retain usable space for center columns.

## 1.7.0

### Minor Changes

- 1a8ce61: Add an Anchor trailing slot with the original typed item and its current-location state. Preserve link navigation, nested indentation and visible-range highlighting, and keep the current location when only entry metadata changes.
- e6d2ac8: Add a Sidebar closable prop to hide the mobile drawer close button without reserving an empty header row.

### Patch Changes

- 2a1b076: Reduce AppShell main-content measurement work during sidebar width transitions by deferring repeated scrollbar updates until the transition finishes or is cancelled. Native scrolling remains available, and scrollbar geometry is refreshed when updates resume.
- 4db9048: Fix the AppShell mobile sidebar to fill the drawer height, keeping the header and footer fixed while navigation scrolls independently. Remove the duplicate visible drawer title and place the close button in the sidebar header; `mobileTitle` remains the accessible name.
- 04d68ed: Fix Sidebar footer content retaining its expanded width in rail mode, which clipped interactive backgrounds and positioned tooltips beyond the sidebar.
- a6c3acc: Disable edge shadows in the Sidebar navigation scroll area.

## 1.6.0

### Minor Changes

- eb6062e: Add AppShell `mobileTitle` to customize the mobile sidebar drawer heading and accessible name, with the existing localized title as the default.
- f103554: Add selectedOption to Combobox and selectedOptions to MultiCombobox so selected names can be supplied independently of dropdown candidates. Remote results can replace or clear options without adding prefilled selections to the list or losing their labels. Both components remember option names and reflect asynchronous label updates while preserving active search input and value-based models.
- 45089f0: Add Sidebar `icon` and `wordmark` slots for a default brand header. Icons fit a fixed square box and remain visible in rail form; wordmarks fade out automatically while preserving the header height. Wordmark-only headers fade out in full, and a custom `header` takes priority over both brand slots.
- e692e34: Stabilize Sidebar collapse and expansion by keeping header and footer content at their expanded width and preserving SidebarGroup heading space. Coordinate label and width transitions with Hina motion tokens, support immediate switching with reduced motion, and prevent keyboard focus inside fully hidden sidebars.
  
  Add SidebarLabel for custom header and footer text and secondary actions to follow the same visibility transition as NavLink labels. Expand the documentation demos with logos, grouped navigation and account footers.
- b0cbed8: Add Tree with single selection, cascading checkbox multiselection, and indeterminate parent states. Support controlled expansion, disabled subtrees, node and trailing slots, empty content, FormField integration, keyboard navigation, and RTL. Check states include collapsed descendants and update from externally supplied values; fully checked nodes are emitted while indeterminate parents remain derived state.

### Patch Changes

- 041f47d: Keep the selected Combobox value when closing a remote search whose results no longer contain that value. Clear the selection only when the user deletes the input text or uses the clear button, rather than when the displayed search text resets internally.
- db84a5c: Keep the Sidebar header, navigation and footer vertically padded inside the mobile drawer while leaving horizontal padding to its container.
- 65651c4: Align Sidebar icons and wordmarks on a shared horizontal centerline. Use flex alignment for inline wordmark content and center the documentation wordmark instead of aligning it by its text baseline.
- 6a058f8: Collapse the entire Sidebar brand region, including vertical padding, in rail form when only a wordmark is provided. Navigation fills the vacated space, and expanding the sidebar restores the header. Headers with an icon, custom headers, and mobile drawers retain their existing layout.

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
