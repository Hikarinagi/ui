<h1 align="center">Hina UI for Vue</h1>
<p align="center">The design system behind Hikarinagi, open source for Vue.</p>

Built on Vue 3, [Reka UI](https://reka-ui.com) and [Tailwind CSS v4](https://tailwindcss.com), with the same components, styles and behavior as [`@hina-ui/react`](https://www.npmjs.com/package/@hina-ui/react). The components cover typography, layout, overlays and page scaffolding.

- **Dark and compact modes** Set one attribute on an outer container and the whole interface follows.
- **Adjustable appearance** Colours, radii and motion durations are CSS variables; override them to customise the look.
- **Accessible** Focus management, keyboard operation and screen reader semantics work out of the box.

## Documentation

[hinaui.dev](https://hinaui.dev)

## Installation

```bash
pnpm add @hina-ui/vue
```

`vue` is a peer dependency and must satisfy `^3.5.0`.

Import the style entry once, after Tailwind CSS:

```css
@import 'tailwindcss';
@import '@hina-ui/vue/styles/tokens.css';
```

`tokens.css` is the only style entry; it already registers the paths Tailwind needs to scan.

## License

[MIT](https://github.com/Hikarinagi/ui/blob/main/LICENSE)
