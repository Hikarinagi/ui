---
title: Link
description: 文字链接，可渲染为原生链接或者路由组件。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/link/Link.vue
---

<Demo name="link/hero" />

## 用法 {#usage}

```ts
import { Link } from '@hina-ui/vue'
```

组件默认渲染为原生的 `a`，属性原样传递，因此 `href`、`target`、`rel` 都照常书写。默认使用强调色，不带下划线。

<Demo name="link/basic" />

## 示例 {#examples}

### 色调 {#tones}

`accent` 用于正文与导航中的普通链接，`neutral` 用于本身已在强调区域内、不需要再次着色的链接，例如面包屑。

<Demo name="link/tones" />

### 下划线 {#underline}

设置 `underline` 显示下划线，静止时线条较淡，悬停时加深。正文中密集出现的链接建议开启，便于与普通文字区分。

<Demo name="link/underline" />

### 路由链接 {#router}

`as` 接受组件，可以渲染为 `NuxtLink` 或者其他路由组件，此时按该组件的属性书写，例如 `to`。

<Demo name="link/router" />

### 正文中的链接 {#prose}

`Prose` 会为其中的原生 `a` 应用强调色与下划线。渲染 Markdown 或者富文本时不需要替换标签。

<Demo name="link/prose" />

## 无障碍 {#a11y}

- 链接文字应当说明目的地，避免使用“点击这里”。
- 在新标签页打开时补上 `rel="noreferrer"`。

## API {#api}

### Props {#props}

| 属性        | 类型                    | 默认值     | 说明                           |
| ----------- | ----------------------- | ---------- | ------------------------------ |
| `tone`      | `'accent' \| 'neutral'` | `'accent'` | 语义色调                       |
| `underline` | `boolean`               | `false`    | 是否显示下划线                 |
| `as`        | `string \| Component`   | `'a'`      | 渲染的元素或组件               |
| `asChild`   | `boolean`               | `false`    | 不渲染自身，合并至唯一的子元素 |
| `class`     | `string`                | —          | 追加至根元素的类名             |

### Slots {#slots}

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 链接文字 |
