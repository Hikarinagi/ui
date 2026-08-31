---
title: Installation
description: Hina UI ships as source and depends on Tailwind CSS v4 and Vue 3.5.
links:
  - label: Style entry
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/styles/tokens.css
  - label: Exports
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/index.ts
---

## Install {#install}

```bash
pnpm add @hikarinagi/ui
```

`vue` is a peer dependency and must satisfy `^3.5.0`. Everything else is installed with the package and does not need to be declared.

## Style entry {#styles}

```css
@import 'tailwindcss';
@import '@hikarinagi/ui/styles/tokens.css';

@source '../node_modules/@hikarinagi/ui/src/**/*.{vue,ts}';
```

`tokens.css` is the only style entry; no other file needs to be imported.

The library ships as source, and Tailwind has to scan that source to generate the matching styles, so the `@source` line cannot be omitted. Its path is resolved relative to the CSS file.

## Fonts {#fonts}

Latin text uses Plus Jakarta Sans, Chinese uses Noto Sans SC and monospace uses JetBrains Mono. Loading them is the application's responsibility.

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/fonts'],
  fonts: {
    families: [
      {
        name: 'Plus Jakarta Sans',
        provider: 'google',
        weights: [400, 500, 600, 700],
        global: true,
      },
      { name: 'Noto Sans SC', provider: 'google', weights: [400, 500, 700], global: true },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500], global: true },
    ],
  },
})
```

The font names live in the `--hn-font-*` variables, which automatic scanning cannot detect, so they must be declared explicitly with `global` set to `true`.

## Mount at the root {#root}

```vue
<template>
  <TooltipProvider>
    <NuxtPage />
    <Toaster />
  </TooltipProvider>
</template>
```

Tooltip and Toast each need one root node, mounted once at the application entry. `AppShell` already includes `TooltipProvider`.

## Single instances {#singletons}

`vue`, `reka-ui` and `@hikarinagi/ui` must each resolve to a single instance within one application. Duplicates cause overlays to misbehave and focus management to break.

```bash
pnpm why vue reka-ui @hikarinagi/ui
```

## Dark mode {#dark}

```html
<html lang="en" class="dark">
  <!-- the whole document in dark mode -->
</html>
```

Dark mode is toggled by the `dark` class on the root element, and the semantic colours flip with it. With `@nuxtjs/color-mode`, set `classSuffix` to an empty string.

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

```ts
import { enUS, provideUiLocale } from '@hikarinagi/ui'

provideUiLocale(enUS)
```

Built-in wording defaults to Simplified Chinese and is switched with one call at the application root. A partial object also works, overriding individual strings while the rest stay in Chinese.

## Verify the install {#verify}

```vue
<script setup lang="ts">
  import { Button, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack align="center" class="p-10">
    <Button>Installed</Button>
  </Stack>
</template>
```

If the button shows the accent background, changes colour on hover and ripples on press, both the dependencies and the styles are in place. Structure without styling usually means the `@source` path is wrong.
