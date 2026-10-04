---
title: Installation
::: vue
description: Hina UI ships as source and depends on Tailwind CSS v4 and Vue 3.5.
:::
::: react
description: Hina UI ships as source and depends on Tailwind CSS v4 and React 19.
:::
links:
  - label: Style entry
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/styles/tokens.css
  - label: Exports
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/index.ts
---

## Install {#install}

::: vue

```bash
pnpm add @hina-ui/vue
```

`vue` is a peer dependency and must satisfy `^3.5.0`. Everything else is installed with the package and does not need to be declared.

:::

::: react

```bash
pnpm add @hina-ui/react
```

`react` and `react-dom` are peer dependencies and must satisfy `^19.0.0`. Everything else is installed with the package and does not need to be declared.

:::

## Style entry {#styles}

```css
@import 'tailwindcss';
@import '@hina-ui/vue/styles/tokens.css';
```

`tokens.css` is the only style entry; no other file needs to be imported, and no `@source` line is needed for the library, since the entry already registers the paths to scan.

## Fonts {#fonts}

Body text uses Noto Sans for Latin and Noto Sans SC for Chinese, and monospace uses JetBrains Mono. Loading them is the application's responsibility.

When the root element's `lang` is Chinese, Noto Sans SC comes first, so the Latin text on the page uses Noto Sans SC as well. Quotation marks, ellipses and dashes are shared between Chinese and Latin, and putting the Chinese font first keeps them full-width.

::: vue

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/fonts'],
  fonts: {
    families: [
      { name: 'Noto Sans', provider: 'google', weights: [400, 500, 600, 700], global: true },
      { name: 'Noto Sans SC', provider: 'google', weights: [400, 500, 600, 700], global: true },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500], global: true },
    ],
  },
})
```

The font names live in the `--hn-font-*` variables, which automatic scanning cannot detect, so they must be declared explicitly with `global` set to `true`.

:::

::: react

In Next.js, load them with `next/font`. It self-hosts the files and generates hashed family names, exposed as CSS variables through `variable`:

```tsx
import type { ReactNode } from 'react'
import { JetBrains_Mono, Noto_Sans, Noto_Sans_SC } from 'next/font/google'
import './globals.css'

const latin = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
})
const sans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-sc',
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${latin.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

Then put those variables first in `--hn-font-latin`, `--hn-font-cjk` and `--hn-font-mono` so the components pick up the loaded fonts:

```css
:root {
  --hn-font-latin: var(--font-noto-sans), 'Noto Sans';
  --hn-font-cjk: var(--font-noto-sans-sc), 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei';
  --hn-font-mono:
    var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas,
    monospace;
}
```

Do not name the variables `--font-sans` or `--font-mono`; the style entry already maps those to `--hn-font-*`.

:::

## Mount at the root {#root}

::: vue

```vue
<template>
  <TooltipProvider>
    <NuxtPage />
    <Toaster />
  </TooltipProvider>
</template>
```

:::

::: react

```tsx
import type { ReactNode } from 'react'
import { Toaster, TooltipProvider } from '@hina-ui/react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
```

:::

Tooltip and Toast each need one root node, mounted once at the application entry. `AppShell` already includes `TooltipProvider`.

::: react

## Server Components {#server-components}

The components work directly in React Server Components; `app/layout.tsx` and your pages do not need `'use client'`. Static components such as `Text`, `Stack` and `Card` render on the server only and send no JavaScript to the browser. Modules with state, handlers or context carry their own `'use client'`, and only those hydrate on the client.

A Server Component cannot pass functions to a Client Component. When you pass callbacks, render functions or components (for example `onClick`, `renderFooter` or `as={Link}`), move that part into a component that starts with `'use client'`. To render a link without that, use `asChild` in the Server Component and pass the link element as the only child.

Overlay and toast content renders only after mounting on the client; the server output contains the triggers.

:::

## Single instances {#singletons}

::: vue

`vue`, `reka-ui` and `@hina-ui/vue` must each resolve to a single instance within one application. Duplicates cause overlays to misbehave and focus management to break.

```bash
pnpm why vue reka-ui @hina-ui/vue
```

:::

::: react

`react`, `react-dom`, `radix-ui` and `@hina-ui/react` must each resolve to a single instance within one application. Duplicates cause overlays to misbehave and focus management to break.

```bash
pnpm why react react-dom radix-ui @hina-ui/react
```

:::

## Dark mode {#dark}

```html
<html lang="en" class="dark">
  <!-- the whole document in dark mode -->
</html>
```

::: vue

Dark mode is toggled by the `dark` class on the root element, and the semantic colours flip with it. With `@nuxtjs/color-mode`, set `classSuffix` to an empty string.

:::

::: react

Dark mode is toggled by the `dark` class on the root element, and the semantic colours flip with it. With server rendering, an inline script has to set the theme on `<html>` before hydration, or the first paint flashes; with `next-themes`, set `attribute` to `"class"` and add `suppressHydrationWarning` to `<html>`.

:::

## Density {#density}

```html
<section data-density="compact">
  <!-- every control inside this container tightens up -->
</section>
```

Control height, padding and spacing all come from the density variables, which default to `comfortable`. Density is declared on a container and applies to every control inside it.

<Demo name="guide/density" />

`size` and density are independent: `size` sets the size of a single control, density scales the whole group. Density does not follow the device type, so if a touch screen needs larger hit targets, use the default density explicitly.

## Language {#locale}

::: vue

```ts
import { enUS, provideUiLocale } from '@hina-ui/vue'

provideUiLocale(enUS)
```

Built-in wording defaults to Simplified Chinese and is switched with one call at the application root. A partial object also works, overriding individual strings while the rest stay in Chinese.

:::

::: react

```tsx
'use client'

import type { ReactNode } from 'react'
import { ConfigProvider, UiLocaleProvider, enUS } from '@hina-ui/react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider dir="ltr">
      <UiLocaleProvider messages={enUS}>{children}</UiLocaleProvider>
    </ConfigProvider>
  )
}
```

Built-in wording defaults to Simplified Chinese and is switched by wrapping the application root in `UiLocaleProvider` once. A partial object also works, overriding individual strings while the rest stay in Chinese. Message packs contain formatting functions, which a Server Component cannot pass to a Client Component, so `Providers` starts with `'use client'` and the root layout wraps `children` in it.

`ConfigProvider` sets the global text direction `dir`, which every component without its own `dir` inherits; `teleportTo` chooses the container that overlays mount into.

:::

## Verify the install {#verify}

::: vue

```vue
<script setup lang="ts">
  import { Button, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center" class="p-10">
    <Button>Installed</Button>
  </Stack>
</template>
```

:::

::: react

```tsx
import { Button, Stack } from '@hina-ui/react'

export default function Page() {
  return (
    <Stack align="center" className="p-10">
      <Button>Installed</Button>
    </Stack>
  )
}
```

:::

If the button shows the accent background, changes colour on hover and ripples on press, both the dependencies and the styles are in place. Structure without styling usually means the style entry is not imported.
