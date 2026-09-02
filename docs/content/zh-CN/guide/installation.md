---
title: 安装
description: Hina UI 以源码分发，依赖 Tailwind CSS v4 与 Vue 3.5。
links:
  - label: 样式入口
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/styles/tokens.css
  - label: 导出清单
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/index.ts
---

## 安装依赖 {#install}

```bash
pnpm add @hina-ui/vue
```

`vue` 是 peer 依赖，版本要求 `^3.5.0`。其余依赖会随包安装，不需要手动声明。

## 样式入口 {#styles}

```css
@import 'tailwindcss';
@import '@hina-ui/vue/styles/tokens.css';

@source '../node_modules/@hina-ui/vue/src/**/*.{vue,ts}';
```

`tokens.css` 是唯一的样式入口，不需要再引入其他文件。

本库以源码形式分发，Tailwind 需要扫描到库的源码才能生成相应的样式，因此 `@source` 这一行不能省略。它的路径相对于该 CSS 文件计算。

## 字体 {#fonts}

西文采用 Plus Jakarta Sans，中文采用 Noto Sans SC，等宽采用 JetBrains Mono，由应用负责加载。

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

字体名称定义在 `--hn-font-*` 变量中，自动扫描无法识别它们，需要显式声明，并将 `global` 设置为 `true`。

## 在最外层挂载 {#root}

```vue
<template>
  <TooltipProvider>
    <NuxtPage />
    <Toaster />
  </TooltipProvider>
</template>
```

Tooltip 与 Toast 各自需要一个根节点，在应用入口挂载一次即可。使用 `AppShell` 时，它已经内置了 `TooltipProvider`。

## 单例约束 {#singletons}

`vue`、`reka-ui`、`@hina-ui/vue` 在同一个应用中各自只能存在一份实例。如果存在多份，会导致浮层行为异常、焦点管理失效。

```bash
pnpm why vue reka-ui @hina-ui/vue
```

## 深色模式 {#dark}

```html
<html lang="zh-CN" class="dark">
  <!-- 深色模式下的整个文档 -->
</html>
```

深色模式由根元素上的 `dark` 类切换，语义颜色随之翻转。使用 `@nuxtjs/color-mode` 时，需要将 `classSuffix` 设置为空字符串。

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

```ts
import { enUS, provideUiLocale } from '@hina-ui/vue'

provideUiLocale(enUS)
```

组件的内置文字默认为简体中文，在应用的最外层调用一次即可切换。也可以只传入一部分内容，覆盖个别文字，未覆盖的部分仍然使用中文。

## 验证安装 {#verify}

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

如果按钮显示为强调色底色，悬停时变色，按下时出现波纹，说明依赖与样式都已经就位。如果只有结构而没有样式，通常是 `@source` 的路径有误。
