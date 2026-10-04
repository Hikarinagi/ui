<h1 align="center">Hina UI</h1>
<p align="center">The design system behind Hikarinagi, open source for Vue and React.</p>
<p align="center">English | <a href="./README.zh-CN.md">中文</a></p>

Built on [Tailwind CSS v4](https://tailwindcss.com), with one design language and the same components, styles and behavior in both frameworks. The components cover typography, layout, overlays and page scaffolding.

- **Dark and compact modes** Set one attribute on an outer container and the whole interface follows.
- **Adjustable appearance** Colours, radii and motion durations are CSS variables; override them to customise the look.
- **Accessible** Focus management, keyboard operation and screen reader semantics work out of the box.
- **Typography and scaffolding included** Build pages without native tags.

## Documentation

- Vue: [hinaui.dev](https://hinaui.dev)
- React: [react.hinaui.dev](https://react.hinaui.dev)

## Installation

```bash
pnpm add @hina-ui/vue
# or
pnpm add @hina-ui/react
```

## Contributing

See [change records and releases](./.changes/README.md) for versioning and the release workflow.

The [shared presentation layer](./packages/shared/README.md) owns styles, variants and motion helpers. Framework components and primitive adapters stay in their respective packages.

## License

[MIT](./LICENSE)
