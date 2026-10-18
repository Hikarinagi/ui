# @hina-ui/react

## [1.7.15](https://github.com/Hikarinagi/ui/compare/@hina-ui/react@1.7.14...@hina-ui/react@1.7.15) (2026-10-18)

### Changed

- **SegmentedControl** The control now sits in a scroll container that draws the background and takes class (className in React); the other attributes still land on the role="group" element.

### Fixed

- **SegmentedControl** Options that do not fit the container now scroll sideways like Tabs: no scrollbar, edge shadows mark the scroll position, the mouse wheel scrolls the row and an option reached with the arrow keys scrolls into view. A vertical control scrolls up and down within the height of its parent. They used to overflow the container.

## [1.7.14](https://github.com/Hikarinagi/ui/compare/@hina-ui/react@1.7.13...@hina-ui/react@1.7.14) (2026-10-17)

### Added

- **Tour** A virtual pointer for scripts: move, tap, press, drag with a per-frame position callback and key hints, drawn as a mouse arrow or a fingertip after (pointer: coarse) or the pointer prop, and jumping to the end with reduced motion.
- **Tour** Targets can be rectangles, virtual elements with getBoundingClientRect() or arrays highlighted together, wait waits for a target that appears later, blockPage keeps the whole page except the card from responding, mask="dim" darkens without blur, and the tour emits stepEnter, stepLeave and close with the reason.
- **Tour** Steps can run a play script when they become active, with an AbortSignal, deferred cleanups that run in reverse when the step is left or the tour closes, spotlight() to move the highlight within the step, waitFor() and sleep(). Steps with a script show a Replay button, also available as replay().
- **OverlayBranch** Add OverlayBranch, which marks an outside layer such as a hand-built guide as part of every open overlay. While a Dialog, Drawer, Sheet, modal Popover or menu is open, pressing or focusing inside the branch does not close the overlay, the branch stays visible to screen readers, keeps its own pointer-events and can take focus.
- **Dialog** Dialog, Drawer and Sheet emit interactOutside (onInteractOutside in React) before a press or focus outside closes them; calling preventDefault() keeps them open.
- **Image** Add thumbhash, which takes a base64 ThumbHash and shows the blurred thumbnail decoded from it in place of the skeleton while the image loads, including in server-rendered HTML. Once decoded, the image and the thumbnail crossfade, so the thumbnail around a transparent image fades out together with the image fading in.

### Changed

- **Tour** Between steps the card now fades out in place while the highlight waits for an animating target to stop and springs to it, then reappears there instead of sliding along. The arrow keys and Escape work while focus is outside the card, the tour stacks above dialogs, drawers and menus and coexists with modal overlays opened by a script, and a card that does not fit next to its target shifts into the viewport.

### Fixed

- **Tour** Close the highlight onto the centre of its target over 300ms with an ease-in-out curve when moving to a step without a target, mirroring how it opens. It used to take 200ms on an accelerating curve and seemed to vanish in the last frame.
- **Styles** Switch the LoadingOverlay veil colour (--hn-bg-veil) to dark inside a container with the dark class while the page root stays light, like the other semantic colours. It used to keep the light theme's translucent white.
- **Button** Let a truncated Text in the default slot shrink and show its ellipsis inside a width-limited button.

## [1.7.13](https://github.com/Hikarinagi/ui/compare/@hina-ui/react@1.7.12...@hina-ui/react@1.7.13) (2026-10-16)

### Added

- **Tour** Add Tour, a step-by-step guide. A mask highlights each target and a card with an arrow sits next to it, or in the centre when a step has no target. Targets stay clickable unless blockTarget is set, beforeChange can hold a step until async validation finishes, and beacon starts the tour from a pulsing dot on the first target before moving between cards with Next and Back. The content and footer can be replaced, arrow keys move between steps, Escape skips unless the tour is locked, and focus stays in the card and returns afterwards.
- **NavLink** Add trailing for content after the label, such as a page count, which stays whole when a long label is truncated and hides with the label in a rail sidebar.

### Fixed

- **NavLink** Truncate long labels with an ellipsis and let the link shrink, so it no longer overflows lists and panels outside a sidebar.

## [1.7.12](https://github.com/Hikarinagi/ui/compare/@hina-ui/react@1.7.11...@hina-ui/react@1.7.12) (2026-10-12)

### Changed

- **PinInput** Rebuild PinInput on a single input that covers the cells, so letters, input methods, paste, autofill and selection behave like a native field. The cells are now presentational, and `aria-label`, `aria-labelledby`, `aria-describedby` and `id` are applied to the input instead of the root.

### Fixed

- **LineClamp** Fix the jump at the end of expanding and at the start of collapsing when the content is made of several blocks, such as paragraphs or blocks with their own margins.
- **Image** Start the image fade-in in the same frame as the skeleton fade-out. The image used to start one frame late, which left a blank frame between the skeleton and the image.
- **Image** Keep the skeleton fading out together with the image when a build tool rewrites the duration tokens from milliseconds to seconds, as Next.js and Lightning CSS do. The skeleton used to vanish at once and the background flashed through before the image appeared.
- **ScrollArea** Leave the content in place while the scrollbars initialize. It used to be detached and inserted again, which restarted CSS animations inside the scroll area and ended running transitions at once.

## [1.7.11](https://github.com/Hikarinagi/ui/compare/@hina-ui/react@1.7.10...@hina-ui/react@1.7.11) (2026-10-10)

### Fixed

- **Spoiler** An unrevealed Spoiler no longer keeps the main thread busy. The noise clock is a stepped animation instead of a requestAnimationFrame loop per instance, and every input of the paint worklet now always has a value; an unset one made Chromium run the worklet on the main thread. The clock also pauses while the Spoiler is outside the viewport and stops after a reveal has faded, and particles that draw nothing are skipped.
- **DataList** DataList no longer renders again each time its own height changes, for example while an item animates its height. The last height is still kept while loading.
- **Kbd** Kbd and inline Code stay readable on solid surfaces such as the Tooltip bubble and solid Button, Tag, Badge and Banner. They used to keep the page surface as their background while inheriting the inverted text colour, which left the key text invisible. Inside an element that uses an on-colour text utility they now drop the fill and draw their edge from the current text colour, so their text has the same contrast as the text around them.
- **LoadingOverlay** LoadingOverlay no longer stays visible when loading ends at almost the same moment as its delay. The delayed show could fire after the component had rendered the hidden state but before its timer was cleared, which left the overlay shown with nothing to hide it.
- **Collapsible** The content of Collapsible and Accordion can no longer be scrolled while it is shorter than what it holds, for example when a field inside takes focus during the expand animation. The collapse animation now clips with overflow: clip and keeps its own formatting context.

## [1.7.10](https://github.com/Hikarinagi/ui/compare/@hina-ui/react@1.7.9...@hina-ui/react@1.7.10) (2026-10-09)

### Added

- **CommandPalette** The heading slot (Vue) or renderHeading (React) replaces the content of a group heading row and receives the group, so a row can carry an action such as a clear button. The heading row is rendered outside the option list: its controls are reachable with Tab, clicking them leaves focus in the input, and the group keeps its label as its accessible name. It also works with virtualize.

## [1.7.9](https://github.com/Hikarinagi/ui/compare/@hina-ui/react@1.7.8...@hina-ui/react@1.7.9) (2026-10-09)

### Added

- **AppShell** keepScrollPosition() keeps the scroll position of the main area across the next page change instead of starting at the top. Call it right before a navigation that changes the path or the query without leaving the view, such as switching tabs, filtering or sorting. It applies once, takes an optional restoreKey to address one shell, and leaves back and forward to their saved positions.

### Fixed

- **Form** A Form submits again when its rules are recreated while it validates, for example a schema built during render inside a Dialog, Drawer or Sheet. Since 1.7.8 those overlays re-render when the form starts submitting; the new rules object made the form discard its own validation, so submitting did nothing and reported no error.

## [1.7.8](https://github.com/Hikarinagi/ui/compare/@hina-ui/react@1.7.7...@hina-ui/react@1.7.8) (2026-10-09)

### Added

- **AppShell** The header height is available as the CSS variable --hn-app-shell-header-h on the root element. Overriding it resizes the header.
- **Form** Form state can be read from outside the form. The Vue template ref exposes submitting, submitted, invalid, errors and error; React adds the useFormHandle hook and the form prop, and its ref handle reads the same fields.
- **AppShell** restoreKey now makes the shell save and restore the scroll position of its main area by itself: the position is kept in history.state per history entry, restored on reload, back and forward, and a new page starts at the top or at its #hash target. Server output carries an inline script that sets the position before hydration. createScrollRestoreSession and scrollRestoreScript are exported for scroll containers outside AppShell.
- **Button** Add the xs size, 24px high (20px in the compact density), with the --hn-control-h-xs and --hn-control-px-xs tokens. IconButton, CopyButton and SplitButton accept it as well.
- **Locale** Add the Japanese message pack jaJP.
- **DescriptionList** Add orientation="horizontal", which puts names in one column and values in another. --hn-dl-term-width gives the name column a fixed width.
- **CommandPalette** closeOnSelect, on the palette or on a single item, keeps the palette open after a selection: the search text is kept and focus returns to the input. loading shows a loading row, customised through the loading slot (Vue) or loadingContent (React), and the empty slot (Vue) or renderEmpty (React) replaces the empty content and receives the current search text. The loading and empty content now sit outside the listbox with role="status".
- **CommandPalette** Item content can be rendered through the item slot (Vue) or renderItem (React), which receive the item and the matched range of its label. Items carry typed data through `CommandItem<T>`. The input row can be replaced through the input slot (Vue) or the input prop (React) using the new CommandPaletteInput.
- **LineClamp** Add LineClamp, which folds long content to a number of lines and shows a button to expand it when the content exceeds them.
- **Tag** Add the lg size, 28px high.

### Changed

- **Dialog** Dialog, Drawer and Sheet lock themselves while a Form inside them is submitting, and their body, content and footer slots receive submitting next to close.

### Fixed

- **Anchor** The directory keeps the current entry visible when it changes while a previous smooth follow is still travelling. The follow used to judge the entry by the directory's momentary position, treat it as visible, and let the earlier scroll carry it out of view.

## [1.7.7](https://github.com/Hikarinagi/ui/compare/@hina-ui/react@1.7.6...@hina-ui/react@1.7.7) (2026-10-09)

### Added

- **FloatButton** offset on FloatButton and ScrollTop accepts { x, y } to set the horizontal and vertical spacing separately, for example to lift the button above a fixed footer.

### Changed

- **Time** With format="relative", the absolute time is no longer set as a native title. Inside a TooltipProvider it is shown in a Tooltip on hover and focus, and the new tooltip prop turns that off.
- **React** Drop the radix-ui dependency. Dismissable layers, focus scopes, focus guards, presence, portals and collections now use Hina UI's own primitives with the same behavior as @hina-ui/vue: a tap outside an overlay dismisses it after the click instead of on pointer down, Escape is handled on window without preventing its default, and focus guards and toast items carry data-reka-focus-guard and data-reka-collection-item instead of their data-radix-* names.

### Fixed

- **FloatButton** The exit animation of FloatButton and ScrollTop now always plays in full. Hiding the button while its press was still settling, for example ScrollTop with behavior="instant" or a short scroll distance, used to end the animation early and make the button disappear at once.
- **Statistic** The loading skeletons now match the line height of the value and the delta, so the height no longer changes when loading ends.
- **Panel** A Panel without body content now keeps the bottom padding below its header.
- **Time** Hydration no longer reports a text mismatch when the browser formats a different text than the server, for example a relative time that has moved on. The browser's text is applied.
- **Section** A Section with a title is now labelled by its heading through aria-labelledby, unless aria-label or aria-labelledby is passed.
- **MultiSelect** Inside a FormField, the trigger is now named by the field label through aria-labelledby. Previously it had no accessible name unless aria-label was passed.
- **Toast** Toasts stay available to assistive technology while a modal dialog is open. The toast list now carries aria-live="off", so it is no longer given aria-hidden together with the rest of the page.
- **PinInput** With otp enabled, typing a character now moves focus to the next cell instead of taking a second keystroke and overwriting the current cell.
- **NavLink** With asChild, the child element now becomes the link itself and receives the link attributes, with the icon and the label rendered inside it. Previously the attributes were merged onto the icon or the label and the child element ended up nested inside the label.
- **NavLink** Only NavLinks inside a Sidebar collapse when the AppShell sidebar becomes a rail. NavLinks in the header or the main content keep their text and no longer get a tooltip.
- **Toast** Removing a toast that holds focus no longer logs "flushSync was called from inside a lifecycle method".

## [1.7.6](https://github.com/Hikarinagi/ui/tree/@hina-ui/react@1.7.6) (2026-10-04)

### Added

- **React** First release of @hina-ui/react: the Hina UI components for React 19, with the same components, styles and behavior as @hina-ui/vue.

### Changed

- **Styles** Latin text now uses Noto Sans; when the root element's lang is Chinese, Noto Sans SC stays first. The new --hn-font-latin and --hn-font-cjk tokens set the two parts of --hn-font-sans. Applications need to load Noto Sans.

### Fixed

- **Ripple** Clear pending press timers when the ripple unmounts.
