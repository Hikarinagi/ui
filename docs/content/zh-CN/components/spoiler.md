---
title: Spoiler
description: 遮住剧透内容，点击或者悬停后揭示。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/spoiler/Spoiler.vue
---

<Demo name="spoiler/hero" />

## 用法 {#usage}

```ts
import { Spoiler } from '@hina-ui/vue'
```

把要遮住的文字放入默认插槽。遮住时内容被噪点覆盖，并且无法选中，点击后从指针位置向外展开。

<Demo name="spoiler/basic" />

## 示例 {#examples}

### 悬停揭示 {#hover}

设置 `reveal-on="hover"` 后，指针移入即揭示，移出重新遮住。键盘聚焦与失焦同样触发。

<Demo name="spoiler/hover" />

### 受控 {#controlled}

`hidden` 支持双向绑定，可以由外部统一控制一段内容的显隐。

<Demo name="spoiler/controlled" />

### 跨行内容 {#multiline}

一段跨越多行的文字可以整段遮住。揭示时以指针位置为中心，逐行展开。

<Demo name="spoiler/multiline" />

### 降级形态 {#fallback}

噪点遮罩依赖浏览器的绘制工作单元。不支持时自动降级为底色加模糊，行为完全一致。设置 `force-fallback` 可以强制使用降级形态。

<Demo name="spoiler/fallback" />

## 行为 {#behavior}

- 遮住时文字无法选中，也无法被复制。
- 揭示的展开中心取自指针落点，键盘触发时取几何中心。

## 无障碍 {#a11y}

- 点击模式下渲染为 `role="button"`，可以聚焦，回车键与空格键都能揭示。
- 无障碍名称随状态变化，遮住时为“剧透内容，点击显示”，揭示后为“隐藏剧透”。
- `aria-expanded` 反映当前是否已揭示。

## API {#api}

### Props {#props}

| 属性            | 类型                 | 默认值    | 说明                   |
| --------------- | -------------------- | --------- | ---------------------- |
| `hidden`        | `boolean`            | `true`    | 是否遮住，支持双向绑定 |
| `revealOn`      | `'click' \| 'hover'` | `'click'` | 揭示方式               |
| `forceFallback` | `boolean`            | `false`   | 强制使用降级形态       |
| `class`         | `string`             | —         | 追加至根元素的类名     |

### Slots {#slots}

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 被遮住的内容 |
