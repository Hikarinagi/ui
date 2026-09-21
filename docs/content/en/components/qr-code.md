---
title: QRCode
description: Turn a link or text into a scannable, exportable QR code.
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/qr-code/QRCode.vue
---

<Demo name="qr-code/hero" />

## Usage {#usage}

```vue
<script setup lang="ts">
  import { QRCode } from '@hina-ui/vue'
</script>

<template>
  <QRCode value="https://hinaui.dev" label="Hina UI documentation" />
</template>
```

`value` is the original string to encode, including links, Unicode and plain text. The component neither visits links nor interprets their parameters. Use `label` to describe the purpose to assistive technology, and provide a separate accessible link when appropriate.

The complete SVG and its dimensions render during SSR. Hydration needs no measurement, canvas or QR image request. Empty strings show an empty state; data exceeding QR capacity shows an error and emits `error`. Correcting the value restores the code.

## Examples {#examples}

### Size, colors and logo {#appearance}

Size includes the quiet zone. The square shrinks proportionally inside narrower containers. `color` and `background` accept CSS colors or tokens. The dedicated default tokens stay dark-on-light in both themes, without automatic inversion.

Use `logo` for a center image. Without an explicit `level`, codes with a logo use `H`; other codes use `M`. `logoSize` and `logoMargin` are pixels within the design size and scale with the code. The logo side is capped at a quarter of the total side. If the image fails to load, its backing is also removed, restoring the full code and emitting `logo-error`.

<Demo name="qr-code/appearance" />

Keep dark modules on a light background with sufficient contrast, use a small logo, and verify with actual scanning devices. A higher correction level cannot guarantee recovery from arbitrary obstruction. The default four-module `margin` follows the [official QR Code quiet-zone requirement](https://www.qrcode.com/en/howto/code.html); it is not pixel padding.

### Status and refresh {#status}

The application controls `status`. The component has no expiry timer, polling or request logic. Loading, expired and scanned states hide the old code while preserving its square. The expired-state button only emits `refresh`; the application updates `value` and `status` after its request.

<Demo name="qr-code/status" />

### Custom status {#custom}

`#status` replaces the inactive content and receives `{ status, error, refresh }`. Use it for application copy and actions, such as regenerating an expired share link. `error` represents encoding failures; handle request failures in the application.

<Demo name="qr-code/custom" />

### Export {#export}

Call `toBlob()` on the component ref to export PNG, or request `type: 'image/svg+xml'` for SVG. The component creates file contents; the application owns the filename and download action.

Export snapshots the current colors and embeds the logo, so the file needs no page CSS or remote logo URL. Remote logos require CORS permission. Failure to read a logo rejects the Promise rather than silently dropping it. Inactive codes cannot be exported.

<Demo name="qr-code/export" />

```ts
import { ref } from 'vue'
import type { QRCodeExpose } from '@hina-ui/vue'

const code = ref<QRCodeExpose>()
const png = await code.value?.toBlob({ scale: 3 })
const svg = await code.value?.toBlob({ type: 'image/svg+xml' })
```

## API {#api}

### Props {#props}

| Prop         | Type                                              | Default                      | Description                                                                           |
| ------------ | ------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| `value`      | `string`                                          | —                            | Required content to encode                                                            |
| `label`      | `string`                                          | Localized “QR code”          | Accessible SVG name                                                                   |
| `size`       | `number`                                          | `192`                        | Design side including quiet zone, in px; capped at 4096; shrinks in narrow containers |
| `level`      | `'L' \| 'M' \| 'Q' \| 'H'`                        | `H` with logo, otherwise `M` | Error correction level                                                                |
| `margin`     | `number`                                          | `4`                          | Quiet zone on each side, in modules; integer 0–64                                     |
| `color`      | `string`                                          | `--hn-qr-foreground`         | Module color                                                                          |
| `background` | `string`                                          | `--hn-qr-background`         | Code and logo backing color                                                           |
| `bordered`   | `boolean`                                         | `true`                       | Outer outline                                                                         |
| `logo`       | `string`                                          | —                            | Center image URL, including data URLs                                                 |
| `logoSize`   | `number`                                          | `32`                         | Logo side in px, capped at 25% of the design size                                     |
| `logoMargin` | `number`                                          | `2`                          | Logo backing padding in px, capped at 1/32 of the design size                         |
| `status`     | `'active' \| 'loading' \| 'expired' \| 'scanned'` | `'active'`                   | Application-controlled state                                                          |
| `class`      | `string`                                          | —                            | Root classes                                                                          |

### Slots {#slots}

| Slot     | Scope              | Description                                    |
| -------- | ------------------ | ---------------------------------------------- |
| `status` | `QRCodeStatusSlot` | Inactive content: `{ status, error, refresh }` |

The resolved `QRCodeState` also includes `empty` and `error`, derived from encoding. The root exposes `data-state` and adds `aria-busy` during loading.

### Events {#events}

| Event        | Payload | Description                              |
| ------------ | ------- | ---------------------------------------- |
| `refresh`    | —       | Requests refresh without changing status |
| `error`      | `Error` | Encoding failed                          |
| `logo-error` | `Event` | Center image failed to load              |

### Expose {#expose}

| Name               | Type                         | Description                        |
| ------------------ | ---------------------------- | ---------------------------------- |
| `element`          | `HTMLElement \| undefined`   | Root element                       |
| `svg`              | `SVGSVGElement \| undefined` | Active SVG                         |
| `toBlob(options?)` | `Promise<Blob>`              | Browser export; rejects on failure |

`QRCodeExportOptions` provides `type` (default `'image/png'`) and PNG `scale` (default 2, range 1–8). PNG uses `size × scale`, capped at 8192px per side; SVG uses `size`. `QRCodeProps`, `QRCodeLevel`, `QRCodeStatus`, `QRCodeState`, `QRCodeStatusSlot`, `QRCodeExportOptions` and `QRCodeExpose` are exported from the package root.
