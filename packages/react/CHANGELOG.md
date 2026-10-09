# @hina-ui/react

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
