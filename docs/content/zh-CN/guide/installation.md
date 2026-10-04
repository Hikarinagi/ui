---
title: 安装
::: vue
description: Hina UI 以源码分发，依赖 Tailwind CSS v4 与 Vue 3.5。
:::
::: react
description: Hina UI 以源码分发，依赖 Tailwind CSS v4 与 React 19。
:::
links:
  - label: 样式入口
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/styles/tokens.css
  - label: 导出清单
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/index.ts
---

## 安装依赖 {#install}

::: vue

```bash
pnpm add @hina-ui/vue
```

`vue` 是 peer 依赖，版本要求 `^3.5.0`。其余依赖会随包安装，不需要手动声明。

:::

::: react

```bash
pnpm add @hina-ui/react
```

`react` 与 `react-dom` 是 peer 依赖，版本要求 `^19.0.0`。其余依赖会随包安装，不需要手动声明。

:::

## 样式入口 {#styles}

```css
@import 'tailwindcss';
@import '@hina-ui/vue/styles/tokens.css';
```

`tokens.css` 是唯一的样式入口，不需要再引入其他文件，也不需要为本库另写 `@source`，需要扫描的路径已经由这个入口登记。

## 字体 {#fonts}

正文的西文采用 Noto Sans，中文采用 Noto Sans SC；等宽采用 JetBrains Mono。字体由应用负责加载。

根元素的 `lang` 为中文时，Noto Sans SC 排在前面，页面里的西文也使用 Noto Sans SC。

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

字体名称定义在 `--hn-font-*` 变量中，自动扫描无法识别它们，需要显式声明，并将 `global` 设置为 `true`。

:::

::: react

Next.js 中用 `next/font` 加载。它会自托管字体文件，并生成带哈希的字体名，通过 `variable` 暴露为 CSS 变量：

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
    <html lang="zh-CN" className={`${latin.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

再把这些变量分别放到 `--hn-font-latin`、`--hn-font-cjk` 和 `--hn-font-mono` 的最前面，组件就会使用加载好的字体：

```css
:root {
  --hn-font-latin: var(--font-noto-sans), 'Noto Sans';
  --hn-font-cjk: var(--font-noto-sans-sc), 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei';
  --hn-font-mono:
    var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas,
    monospace;
}
```

变量名不要用 `--font-sans` 或 `--font-mono`，它们已经由样式入口映射到 `--hn-font-*`。

:::

## 在最外层挂载 {#root}

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
    <html lang="zh-CN">
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

Tooltip 与 Toast 各自需要一个根节点，在应用入口挂载一次即可。使用 `AppShell` 时，它已经内置了 `TooltipProvider`。

::: react

## 服务端组件 {#server-components}

组件可以直接在 React Server Components 中使用，`app/layout.tsx` 与页面不需要加 `'use client'`。`Text`、`Stack`、`Card` 等静态组件只在服务端渲染，不向浏览器发送 JavaScript；带状态、事件或上下文的组件模块自带 `'use client'`，只有它们会在客户端水合。

服务端组件不能把函数传给客户端组件。传入事件回调、渲染函数或组件（例如 `onClick`、`renderFooter`、`as={Link}`）时，把这部分写进一个以 `'use client'` 开头的组件。只需要渲染为链接时，在服务端组件中使用 `asChild`，把链接元素作为唯一的子元素传入。

浮层与 Toast 的内容只在客户端挂载后渲染，服务端输出中只有触发器。

:::

## 单例约束 {#singletons}

::: vue

`vue`、`reka-ui`、`@hina-ui/vue` 在同一个应用中各自只能存在一份实例。如果存在多份，会导致浮层行为异常、焦点管理失效。

```bash
pnpm why vue reka-ui @hina-ui/vue
```

:::

::: react

`react`、`react-dom`、`radix-ui`、`@hina-ui/react` 在同一个应用中各自只能存在一份实例。如果存在多份，会导致浮层行为异常、焦点管理失效。

```bash
pnpm why react react-dom radix-ui @hina-ui/react
```

:::

## 深色模式 {#dark}

```html
<html lang="zh-CN" class="dark">
  <!-- 深色模式下的整个文档 -->
</html>
```

::: vue

深色模式由根元素上的 `dark` 类切换，语义颜色随之翻转。使用 `@nuxtjs/color-mode` 时，需要将 `classSuffix` 设置为空字符串。

:::

::: react

深色模式由根元素上的 `dark` 类切换，语义颜色随之翻转。服务端渲染时，主题需要在水合前由内联脚本写到 `<html>` 上，否则首屏会闪烁；使用 `next-themes` 时，将 `attribute` 设为 `"class"`，并给 `<html>` 加上 `suppressHydrationWarning`。

:::

## 密度 {#density}

```html
<section data-density="compact">
  <!-- 该容器内的控件整体收紧 -->
</section>
```

控件的高度、内边距与间距均取自密度变量，默认为 `comfortable`。密度在容器上声明，对容器内的所有控件生效。

<Demo name="guide/density" />

`size` 与密度相互独立：`size` 决定单个控件的尺寸，密度控制整体的缩放。密度不随设备类型变化，如果触摸屏上需要更大的点击目标，应当显式使用默认密度。

## 语言 {#locale}

::: vue

```ts
import { enUS, provideUiLocale } from '@hina-ui/vue'

provideUiLocale(enUS)
```

组件的内置文字默认为简体中文，在应用的最外层调用一次即可切换。也可以只传入一部分内容，覆盖个别文字，未覆盖的部分仍然使用中文。

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

组件的内置文字默认为简体中文，在应用的最外层用 `UiLocaleProvider` 包裹一次即可切换。也可以只传入一部分内容，覆盖个别文字，未覆盖的部分仍然使用中文。语言包中含有格式化函数，不能从服务端组件传给客户端组件，因此 `Providers` 以 `'use client'` 开头，再由根布局包住 `children`。

`ConfigProvider` 设置全局的文字方向 `dir`，组件未单独设置 `dir` 时都会继承它；`teleportTo` 可以指定浮层挂载的容器。

:::

## 验证安装 {#verify}

::: vue

```vue
<script setup lang="ts">
  import { Button, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="center" class="p-10">
    <Button>安装成功</Button>
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
      <Button>安装成功</Button>
    </Stack>
  )
}
```

:::

如果按钮显示为强调色底色，悬停时变色，按下时出现波纹，说明依赖与样式都已经就位。如果只有结构而没有样式，通常是样式入口没有引入。
