# @hina-ui/react

## [1.7.6](https://github.com/Hikarinagi/ui/tree/@hina-ui/react@1.7.6) (2026-10-04)

### Added

- **React** First release of @hina-ui/react: the Hina UI components for React 19, with the same components, styles and behavior as @hina-ui/vue.

### Changed

- **Styles** Latin text now uses Noto Sans; when the root element's lang is Chinese, Noto Sans SC stays first. The new --hn-font-latin and --hn-font-cjk tokens set the two parts of --hn-font-sans. Applications need to load Noto Sans.

### Fixed

- **Ripple** Clear pending press timers when the ripple unmounts.
