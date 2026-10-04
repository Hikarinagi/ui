<h1 align="center">Hina UI for React</h1>
<p align="center">The design system behind Hikarinagi, open source for React.</p>

Built on React 19 and [Tailwind CSS v4](https://tailwindcss.com), with the same components, styles and behavior as [`@hina-ui/vue`](https://www.npmjs.com/package/@hina-ui/vue). The components cover typography, layout, overlays and page scaffolding.

- **Server Components first** Static components render as React Server Components; interactive ones are marked `'use client'`.
- **Dark and compact modes** Set one attribute on an outer container and the whole interface follows.
- **Adjustable appearance** Colours, radii and motion durations are CSS variables; override them to customise the look.
- **Accessible** Focus management, keyboard operation and screen reader semantics work out of the box.

## Documentation

[react.hinaui.dev](https://react.hinaui.dev)

## Installation

```bash
pnpm add @hina-ui/react
```

`react` and `react-dom` are peer dependencies and must satisfy `^19.0.0`.

Import the style entry once, after Tailwind CSS:

```css
@import 'tailwindcss';
@import '@hina-ui/react/styles/tokens.css';
```

`tokens.css` is the only style entry; it already registers the paths Tailwind needs to scan.

## License

[MIT](https://github.com/Hikarinagi/ui/blob/main/LICENSE)
