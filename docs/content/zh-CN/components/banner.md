---
title: Banner
description: 横贯页面顶部的一条公告。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/banner/Banner.vue
---

<Demo name="banner/hero" />

## 用法 {#usage}

```ts
import { Banner } from '@hina-ui/vue'
```

公告条贯穿页面整个宽度，通常放在页面最顶部，用于版本发布、停机维护、活动通知这类面向全站的信息。它是实底色块，没有圆角与边框。针对某次操作的消息使用 [Alert](/components/alert)，写在内容里的固定提示使用 [Callout](/components/callout)。需要随页面滚动固定在顶部时，加上 `sticky top-0`。

<Demo name="banner/basic" />

## 示例 {#examples}

### 色调 {#tones}

共六种色调，默认为 `accent`。图标随色调变化，`icon` 设为 `false` 时不显示图标。

<Demo name="banner/tones" />

### 自定义图标 {#icon}

`icon` 插槽替换默认的图标。

<Demo name="banner/icon" />

### 链接 {#link}

正文与 [Link](/components/link) 并列放在默认插槽里，链接沿用公告条的文字颜色，以下划线区分。

<Demo name="banner/link" />

### 操作 {#actions}

`actions` 插槽位于正文之后，用于放置一个按钮。

<Demo name="banner/actions" />

### 可关闭 {#closable}

设置 `closable` 后末端显示关闭按钮，关闭时触发 `close` 事件。`v-model:open` 控制显示与隐藏，是否记住用户关闭过由应用自行保存。

<Demo name="banner/closable" />

### 多条公告 {#items}

`items` 传入多条公告，`item` 插槽决定每条的内容。多于一条时末端出现上一条、下一条按钮与计数，到末尾后回到开头，`v-model:index` 绑定当前是第几条。每条可以带自己的 `tone` 与 `icon`，没有的沿用公告条的。切换时图标与正文作为一个整体按方向滑动，底色与字色平滑过渡。关闭按钮关闭的是整条公告栏。

<Demo name="banner/items" />

### 自动轮播 {#autoplay}

`autoplay` 传入毫秒数后按此间隔自动切到下一条。指针悬停、焦点在公告条内或页面不可见时暂停，离开后继续；用户在系统中选择了减少动态效果时不自动切换。

<Demo name="banner/autoplay" />

### 在 AppShell 里 {#app-shell}

[AppShell](/components/app-shell) 的 `banner` 插槽位于最顶部，横贯侧栏与主区域。公告条关闭后，下方的侧栏与主区域一起上移补满。

<Demo name="app-shell/banner" />

## 行为 {#behavior}

- 视口宽度达到 640 像素时正文相对整条居中；更窄时正文靠起始边、占满关闭按钮之外的整行，按普通段落换行。
- 关闭时收合并淡出，下方内容平滑上移。
- 首次渲染时不播放出现动画。
- 多条公告之间切换时，图标与正文一起按方向滑动：下一条从末端进入，上一条从起端进入，从右到左的书写方向下镜像。旧内容滑出后新内容滑入，公告条高度不变。
- 切到色调不同的一条时，底色与字色平滑过渡。

## 无障碍 {#a11y}

- 公告条不是实时区域，屏幕阅读器按文档顺序朗读它。
- 图标只是装饰，对辅助技术隐藏。
- 多条公告手动切换时，内容所在的区域是礼貌级实时区域，屏幕阅读器会朗读新内容；自动轮播时不朗读，避免反复打断。
- 关闭按钮的名称来自语言包的 `close` 条目，上一条、下一条按钮的名称来自 `banner.prev` 与 `banner.next`。

## API {#api}

### Props {#props}

| 属性       | 类型                                                                    | 默认值     | 说明                                                    |
| ---------- | ----------------------------------------------------------------------- | ---------- | ------------------------------------------------------- |
| `tone`     | `'neutral' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'accent'` | 色调                                                    |
| `icon`     | `boolean`                                                               | `true`     | 是否显示图标                                            |
| `closable` | `boolean`                                                               | `false`    | 是否显示关闭按钮                                        |
| `open`     | `boolean`                                                               | `true`     | 是否显示，支持 `v-model:open`                           |
| `items`    | `T[]`                                                                   | —          | 多条公告，由 `item` 插槽渲染；每条可带 `tone` 与 `icon` |
| `index`    | `number`                                                                | `0`        | 当前公告的序号，支持 `v-model:index`                    |
| `autoplay` | `number`                                                                | —          | 自动切换的间隔，毫秒                                    |
| `class`    | `string`                                                                | —          | 追加至公告条的类名                                      |

### Events {#events}

| 事件           | 参数            | 说明           |
| -------------- | --------------- | -------------- |
| `update:open`  | `open: boolean` | 显示状态变化   |
| `update:index` | `index: number` | 当前公告变化   |
| `close`        | —               | 点击了关闭按钮 |

### Slots {#slots}

| 插槽      | 参数                         | 说明                   |
| --------- | ---------------------------- | ---------------------- |
| `default` | —                            | 正文                   |
| `item`    | `{ item: T, index: number }` | 多条公告时每一条的内容 |
| `icon`    | —                            | 替换图标               |
| `actions` | —                            | 正文之后的操作区       |
