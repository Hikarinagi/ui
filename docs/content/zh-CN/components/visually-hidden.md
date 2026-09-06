---
title: VisuallyHidden
description: 只对屏幕阅读器可见的文字。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/visually-hidden/VisuallyHidden.vue
  - label: VisuallyHidden
    href: https://reka-ui.com/docs/utilities/visually-hidden
---

<Demo name="visually-hidden/hero" />

## 用法 {#usage}

```ts
import { VisuallyHidden } from '@hina-ui/vue'
```

`VisuallyHidden` 把内容从画面上移开，但保留在无障碍树中：屏幕阅读器照常读出，视觉上不占位置。

它用于视觉上已经表达清楚、但辅助技术拿不到的信息。最常见的是只有图标的控件——图形对屏幕阅读器没有意义，需要另给一段文字。

<Demo name="visually-hidden/basic" />

它不是用来藏东西的。真正不需要被感知的内容用 `aria-hidden` 或者干脆不渲染；把无用信息塞进这里，只会让屏幕阅读器的用户听到更多噪音。

## 行为 {#behavior}

- 内容被压缩到一像素并裁去可见部分，不占据布局空间，也不影响周围文字的排版。
- 它不改变焦点行为：内部若有可聚焦元素，仍会进入 tab 序列。

## 无障碍 {#a11y}

- 内容留在无障碍树中，屏幕阅读器按正常顺序读出。
- 与 `aria-label` 的取舍：`aria-label` 会替换掉元素原有的可读名称，适合整块替换；`VisuallyHidden` 是往可读内容里补一段，适合与可见文字连读。
- 补充的文字要能与前后内容连成通顺的一句，例如「当前评分 8.9，满分 10 分」，而不是孤立的词。

## API {#api}

### Slots {#slots}

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `default` | 只对屏幕阅读器可见的内容 |
