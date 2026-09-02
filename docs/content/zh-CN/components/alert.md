---
title: Alert
description: 操作之后出现在页面内的消息条。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/alert/Alert.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/callout/callout.variants.ts
---

<Demo name="alert/hero" />

## 用法 {#usage}

```ts
import { Alert } from '@hikarinagi/ui'
```

消息条用于告知刚刚发生的事情，例如保存成功、发布失败、需要重新登录。它出现在页面内容中，屏幕阅读器会主动朗读。写在内容里的固定提示用 `Callout`，短暂浮出的反馈用 `Toast`。

<Demo name="alert/basic" />

## 示例 {#examples}

### 色调 {#tones}

共六种色调，默认为 `neutral`。图标随色调变化，`icon` 设为 `false` 可以去掉。

<Demo name="alert/tones" />

### 标题 {#title}

`title` 显示在正文之前。

<Demo name="alert/title" />

### 可关闭 {#closable}

设置 `closable` 后右侧有关闭按钮，关闭时触发 `close` 事件。`v-model:open` 可以控制显示与隐藏。

<Demo name="alert/closable" />

### 操作 {#actions}

`actions` 插槽放在正文之后，用于放置一两个按钮。

<Demo name="alert/actions" />

## 行为 {#behavior}

- 消息条出现时展开并淡入，关闭时收合并淡出，周围内容平滑移动。
- 首次渲染时不播放出现动画。

## 无障碍 {#a11y}

- `danger` 与 `warning` 的消息条角色为 `alert`，屏幕阅读器立即朗读；其余色调角色为 `status`，在当前朗读结束后再读。
- 关闭按钮的名称为“关闭”。

## API {#api}

### Props {#props}

| 属性       | 类型                                                                    | 默认值      | 说明                          |
| ---------- | ----------------------------------------------------------------------- | ----------- | ----------------------------- |
| `tone`     | `'neutral' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | 色调                          |
| `title`    | `string`                                                                | —           | 标题                          |
| `icon`     | `boolean`                                                               | `true`      | 是否显示图标                  |
| `closable` | `boolean`                                                               | `false`     | 是否显示关闭按钮              |
| `open`     | `boolean`                                                               | `true`      | 是否显示，支持 `v-model:open` |
| `class`    | `string`                                                                | —           | 追加至消息条的类名            |

### Events {#events}

| 事件          | 参数            | 说明           |
| ------------- | --------------- | -------------- |
| `update:open` | `open: boolean` | 显示状态变化   |
| `close`       | —               | 点击了关闭按钮 |

### Slots {#slots}

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 正文             |
| `icon`    | 替换图标         |
| `actions` | 正文之后的操作区 |
