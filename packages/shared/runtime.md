# Runtime style properties

These internal presentation properties carry live measurements or interaction state, not theme tokens. They are shared between framework adapters and Hina styles, rather than exposed as a stable consumer customization API.

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
