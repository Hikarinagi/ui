---
title: Callout
description: 写入内容之中的一段标注。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/callout/Callout.vue
---

<Demo name="callout/hero" />

## 用法 {#usage}

```ts
import { Callout } from '@hina-ui/vue'
```

标注是写入内容之中的一段文字，用于补充说明、提示技巧或标示需要留意之处。它随内容一同存在，不会自行出现或消失。

<Demo name="callout/basic" />

三者的分工：固定写在文档或说明中的提示使用 `Callout`；操作之后才出现的消息使用 `Alert`；短暂浮出、数秒后自动消失的反馈使用 `Toast`。

## 示例 {#examples}

### 色调 {#tones}

共六种色调，默认为 `neutral`，图标随色调变化。

`accent` 用于给出建议或技巧，其余五种的含义与站内其他组件一致：`info` 补充背景信息，`success` 表示推荐的做法，`warning` 提示需要留意，`danger` 标示不可恢复的后果。

<Demo name="callout/tones" />

### 标题 {#title}

`title` 显示在正文之前，以一句短语概括整段。正文较长时应当加上标题，读者可据此判断该段内容是否与自己相关。

<Demo name="callout/title" />

### 图标 {#icon}

将 `icon` 设为 `false` 可隐藏图标。需要替换为其他图标时使用 `icon` 插槽，并保持 `size-5` 与 `mt-0.5` 的尺寸与位置，以便与正文首行对齐。

<Demo name="callout/icon" />

## 无障碍 {#a11y}

- 标注的角色为 `note`，屏幕阅读器按普通内容朗读，不会打断当前的朗读。需要主动播报的消息应使用 `Alert`。
- 颜色不能作为唯一的区分方式，正文本身需说明这是提示还是警告。
- 图标不参与朗读。

## API {#api}

### Props {#props}

| 属性    | 类型                                                                    | 默认值      | 说明               |
| ------- | ----------------------------------------------------------------------- | ----------- | ------------------ |
| `tone`  | `'neutral' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | 色调               |
| `title` | `string`                                                                | —           | 标题               |
| `icon`  | `boolean`                                                               | `true`      | 是否显示图标       |
| `class` | `string`                                                                | —           | 追加至根元素的类名 |

### Slots {#slots}

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 正文     |
| `icon`    | 替换图标 |
