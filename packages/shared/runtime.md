# Runtime style properties

These internal presentation properties carry live measurements or interaction state, not theme tokens. They are shared between framework adapters and Hina styles, rather than exposed as a stable consumer customization API.

QRCode encodes data with `shared/src/lib/qr-code.ts` and renders one SVG background rectangle and a module path during SSR. `--hn-qr-size` supplies the requested pixel width; the square can shrink to its container. The semantic foreground/background tokens stay dark-on-light in both themes. Adapters retain the quiet zone, hide inactive codes entirely, expose caller-controlled status and refresh behavior, and snapshot computed SVG colors and embedded logo data when exporting. Encoding has no browser dependency and is reusable by other adapters.

| Property                                          | Meaning                                          | Binding element                        |
| ------------------------------------------------- | ------------------------------------------------ | -------------------------------------- |
| `--hn-overlay-anchor-width`                       | Anchor width as a CSS length                     | Select, Combobox or TreeSelect content |
| `--hn-overlay-available-height`                   | Available content height as a CSS length         | Select, Combobox or TreeSelect content |
| `--hn-collapse-h`                                 | Measured expanded height                         | Accordion or Collapsible content       |
| `--hn-rating-step-width`                          | Width of a selectable rating step                | Rating indicator                       |
| `--hn-rating-step-opacity`                        | Visibility of a rating step                      | Rating indicator                       |
| `--hn-rating-step-z-index`                        | Order of overlapping rating steps                | Rating indicator                       |
| `--hn-slider-thumb-transform`                     | Thumb centering transform, including RTL         | Slider thumb                           |
| `--hn-toast-swipe-move-x`                         | Current horizontal swipe distance                | Toast item                             |
| `--hn-toast-swipe-end-x`                          | Horizontal distance at swipe completion          | Toast item                             |
| `--hn-navigation-width`, `--hn-navigation-height` | Measured panel dimensions                        | Navigation viewport                    |
| `--hn-navigation-left`, `--hn-navigation-top`     | Physical offsets relative to the navigation root | Navigation viewport                    |

Define CSS aliases on the element where the primitive supplies the source variables. CSS resolves variable references before inheritance; hoisting aliases to a provider or document root can lose measurements. Nested overlays must retain their own geometry.

Rating properties describe the current layered rendering structure. An adapter using another structure must adapt that presentation or supply its own compatible parts; these properties do not define the rating's public value model.

Masonry uses a root, a list and keyed items that stay in data order. The framework adapter observes item border-box heights and container width, then uses `shared/src/lib/masonry.ts` to calculate placement. The list stays a responsive grid until `data-ready` is set; this is also its SSR and no-observer fallback.

| Property                                   | Meaning                                                          | Binding element |
| ------------------------------------------ | ---------------------------------------------------------------- | --------------- |
| `--hn-masonry-gap`, `--hn-masonry-row-gap` | Horizontal and vertical spacing from Hina tokens                 | Root            |
| `--hn-masonry-min-width`                   | Preferred minimum column width                                   | List            |
| `--hn-masonry-fixed-columns`               | Optional explicit column count, paired with `data-fixed-columns` | List            |
| `--hn-masonry-columns`                     | Measured effective column count                                  | List            |
| `--hn-masonry-height`                      | Total measured layout height without a trailing gap              | List            |
| `--hn-masonry-column`                      | Zero-based logical column index                                  | Item            |
| `--hn-masonry-top`                         | Block offset as a CSS length                                     | Item            |

Adapters must keep item order, batch measurements, preserve surviving focus on reordering, and release observers on unmount. A hidden size probe observes inherited spacing changes. Only measured geometry changes should write runtime styles; scrolling does not require remeasurement.

When a pending slot is provided, wrap the list and placeholder in a relative content-width stage. Set `data-pending`, `inert` and `aria-hidden` on the real list while awaiting the first nonempty layout. The shared pending style removes the list from flow and hides it without preventing measurement. Only clear pending after positions and total height have been written. Initial empty requests may keep the placeholder; append loading and subsequent reflow retain the visible list. Clients without ResizeObserver reveal the Grid fallback.

Affix uses one in-flow root with native sticky positioning. `--hn-affix-offset` is a CSS length on that root; shared variants select the block-start or block-end inset. Disabled roots restore relative positioning and automatic insets. Keep `data-position`, `data-disabled` and `data-affixed` on the root. The adapter reports whether the root is at its chosen scrollport edge, batches state measurements, and releases observers and listeners on unmount. Positioning must work before hydration and must not depend on per-frame JavaScript writes, portals, placeholder cloning or content remounts.

MonthGrid renders a native table with column headers and caller-owned day content. `shared/src/lib/month-grid.ts` computes Gregorian dates without framework or browser dependencies. The root supplies `--hn-month-grid-cell` (minimum day-content block size) and the shared calendar control size. It is a named `hn-month-grid` size-query container for narrow layouts. Day cells expose `data-date`, `data-today`, `data-outside` and `data-disabled`; they must not add selection semantics or intercept the nested controls' events. Month/year pickers belong to the framework adapter. Date content and table layout must be available during SSR without measurements.

An optional root `--hn-month-grid-padding` overrides day padding; absent values use the content wrapper's responsive `--hn-month-grid-default-padding`. Apply caller cell classes to `td` and content classes to the inner layout wrapper, merging them after defaults. Date-label renderers stay inside the semantic `time`; supplementary date content sits beside it. Full-day renderers replace both but retain the table cell and layout wrapper. Header actions preserve default navigation; replacing or hiding the header takes precedence. Derive localized day text and past/future flags from the same locale and today snapshot used by the adapter.

Carousel uses a root, a clipping viewport, one flex track and keyed slide wrappers. Shared variants and styles define the native scroll fallback, logical gutters via `--hn-carousel-gap`, orientation and the initial measurement placeholder. Slide dimensions come from CSS and container queries rather than adapter breakpoints. After initialization, the adapter sets `data-ready`, takes ownership of track translation and preserves the original DOM nodes. A pending viewport stays measurable but hidden and inert until the first layout is ready.

Default indicators use fixed hit areas and animate only their inner mark with shared motion tokens. Adapters may replace an indicator's contents while retaining its button semantics, focus, accessible name and navigation, or replace the whole indicator group while keeping the standard arrows. A full controls replacement takes precedence over either indicator customization. Indicator indices refer to scroll snaps, which may each contain multiple slides.

For default full-viewport slides advancing one item at a time, `shared/src/lib/carousel.ts` derives snap count, selected index, navigation bounds and visible content from data during SSR. Render those controls and accessibility states immediately. Before initialization, `data-initial-index` on the root and `--hn-carousel-initial-index` on the track supply the initial CSS percentage translation, including logical direction and vertical layouts. No placeholder is necessary for this layout. When callers provide arbitrary item classes or multi-item steps, the adapter defers geometry-dependent state to measurement rather than parsing CSS classes or guessing widths.

Set the root's `data-engine` synchronously when handing positioning to the engine. It disables the SSR transform before engine measurement, since a CSS transform changes offset-parent coordinates. The engine must measure and write its initial transform in that same synchronous operation, before a frame is painted. Preserve engine-owned inline styles when removing the initial index variable; do not remove the whole style attribute. Remove `data-engine` when destroying the engine. Pending content remains an opt-in for custom geometry, not a requirement for ordinary SSR.

The framework adapter owns the gesture engine, snap-index model, localized controls, visibility, keyboard handling and autoplay lifecycle. It must translate Hina's motion scale to the engine's motion model, honor reduced motion, stop autoplay on user interaction, pause while hidden, keep offscreen content inert and release observers and timers on unmount. Snap indices and item indices are distinct. Shared styles and public types must not depend on an engine's CSS variables or expose its API. A React adapter can reuse these styles and behavior contracts with its own lifecycle.
