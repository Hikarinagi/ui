---
title: Tour
description: 逐步高亮页面元素的新手引导。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/tour/Tour.vue
---

<Demo name="tour/hero" />

## 用法 {#usage}

```ts
import { Tour } from '@hina-ui/vue'
```

`steps` 是步骤列表，每一步用 `target` 指向页面上的元素，再给出 `title` 与 `description`。打开后遮罩盖住页面，只露出目标，卡片贴在目标旁边并用箭头指向它；`target` 为空或找不到元素时，卡片显示在视口中央。`open` 与 `step` 都支持双向绑定，`step` 从 1 开始。

`target` 可以是 CSS 选择器、元素，或者返回元素的函数，在步骤切换时取值，可以指向打开引导之后才渲染的元素。

## 示例 {#examples}

### 挡住目标与切换校验 {#interactive}

高亮的目标默认可以点击和输入，焦点在卡片与目标之间循环。`blockTarget` 挡住目标，可以设在整个引导或单个步骤上。`beforeChange` 在切换前调用，返回 `false` 时停在当前步骤；返回 Promise 时卡片等它结束，期间「下一步」显示加载指示。

<Demo name="tour/interactive" />

### 信标 {#beacon}

`beacon` 让引导打开时先在第一步目标的右上角显示一个脉冲圆点，点击后才打开卡片和遮罩；之后点「下一步」「上一步」在卡片之间直接切换。步骤上的 `beacon: true` 让导航到这一步时也先停在信标上，`beacon: false` 让这一步作为入口时不显示信标。没有目标的步骤不显示信标。

<Demo name="tour/beacon" />

### 自定义内容 {#custom}

`content` 插槽替换说明，`footer` 插槽替换底部的进度与按钮，两者都会拿到当前步骤与 `next`、`prev`、`skip`。`locked` 隐藏关闭按钮，Esc 也不再跳过引导。

<Demo name="tour/custom" />

### 不使用遮罩 {#plain}

`:mask="false"` 去掉遮罩，页面在引导期间仍可操作，卡片不再是模态对话框。

<Demo name="tour/plain" />

## 行为 {#behavior}

::: vue

- 打开时焦点移到卡片上，关闭后回到打开前的位置。
- 有遮罩时卡片是模态的：页面其余部分对读屏器隐藏，Tab 只在卡片内循环；目标没有被 `blockTarget` 挡住时也算进循环。
- ← 与 → 切换上一步与下一步，在 RTL 下互换；Esc 跳过引导并触发 `skip` 事件。点击遮罩不会关闭引导。
- 最后一步的按钮是「完成」，点击后触发 `finish` 事件并关闭。
- 切换步骤时，不在视口内的目标会被滚动到中央；`scroll: false` 关闭这一行为。目标移动、尺寸变化或页面滚动时，遮罩与卡片跟随更新。
- 高亮区域出现时从目标中心展开，切换目标时滑到下一个目标，切到没有目标的步骤时在原处收拢。
- 页面不会停止滚动；引导在服务端不输出内容。

:::

::: react

- 打开时焦点移到卡片上，关闭后回到打开前的位置。
- 有遮罩时卡片是模态的：页面其余部分对读屏器隐藏，Tab 只在卡片内循环；目标没有被 `blockTarget` 挡住时也算进循环。
- ← 与 → 切换上一步与下一步，在 RTL 下互换；Esc 跳过引导并调用 `onSkip`。点击遮罩不会关闭引导。
- 最后一步的按钮是「完成」，点击后调用 `onFinish` 并关闭。
- 切换步骤时，不在视口内的目标会被滚动到中央；`scroll: false` 关闭这一行为。目标移动、尺寸变化或页面滚动时，遮罩与卡片跟随更新。
- 高亮区域出现时从目标中心展开，切换目标时滑到下一个目标，切到没有目标的步骤时在原处收拢。
- 页面不会停止滚动；引导在服务端不输出内容。

:::

## 无障碍 {#a11y}

- 卡片是 `role="dialog"`，有遮罩时带 `aria-modal`，名称取自步骤标题，说明关联到 `aria-describedby`。
- 等待 `beforeChange` 期间卡片带有 `aria-busy`。
- 信标是一个按钮，名称包含步骤序号与标题。
- 按钮文字、进度与信标名称取自当前语言，可以替换。

## API {#api}

### Props {#props}

| 属性           | 类型               | 默认值   | 说明                                    |
| -------------- | ------------------ | -------- | --------------------------------------- |
| `steps`        | `TourStep[]`       | 必填     | 步骤列表                                |
| `v-model:open` | `boolean`          | `false`  | 是否打开                                |
| `v-model:step` | `number`           | `1`      | 当前步骤，从 1 开始                     |
| `mask`         | `boolean`          | `true`   | 显示遮罩，卡片为模态                    |
| `locked`       | `boolean`          | `false`  | 隐藏关闭按钮，Esc 不跳过引导            |
| `beacon`       | `boolean`          | `false`  | 打开时先显示信标，点击后打开卡片        |
| `blockTarget`  | `boolean`          | `false`  | 挡住所有步骤的目标                      |
| `beforeChange` | `TourBeforeChange` | —        | 切换前调用，返回 `false` 时停在当前步骤 |
| `nextText`     | `string`           | 当前语言 | 「下一步」按钮的文字                    |
| `prevText`     | `string`           | 当前语言 | 「上一步」按钮的文字                    |
| `finishText`   | `string`           | 当前语言 | 最后一步按钮的文字                      |
| `skipText`     | `string`           | 当前语言 | 关闭按钮的名称                          |
| `dir`          | `'ltr' \| 'rtl'`   | 继承     | 阅读方向                                |
| `class`        | `string`           | —        | 追加至卡片的类名                        |

`TourBeforeChange` 为 `(step: number, previousStep: number) => boolean | void | Promise<boolean | void>`。

### TourStep {#step}

| 字段          | 类型                                                           | 默认值     | 说明                         |
| ------------- | -------------------------------------------------------------- | ---------- | ---------------------------- |
| `target`      | `string \| HTMLElement \| (() => HTMLElement \| null) \| null` | —          | 高亮的元素，为空时卡片居中   |
| `title`       | `string`                                                       | —          | 标题                         |
| `description` | `string`                                                       | —          | 说明                         |
| `side`        | `'top' \| 'right' \| 'bottom' \| 'left'`                       | `'bottom'` | 卡片相对目标的方向           |
| `align`       | `'start' \| 'center' \| 'end'`                                 | `'center'` | 卡片与目标的对齐方式         |
| `padding`     | `number`                                                       | `8`        | 高亮区域向外扩展的距离，像素 |
| `radius`      | `number`                                                       | `8`        | 高亮区域的圆角，像素         |
| `scroll`      | `boolean`                                                      | `true`     | 目标不在视口内时滚动到中央   |
| `blockTarget` | `boolean`                                                      | 继承       | 挡住这一步的目标             |
| `beacon`      | `boolean`                                                      | —          | 见[信标](#beacon)            |

### 插槽 {#slots}

| 插槽      | 参数            | 说明                 |
| --------- | --------------- | -------------------- |
| `content` | `TourSlotProps` | 替换说明             |
| `footer`  | `TourSlotProps` | 替换底部的进度与按钮 |

`TourSlotProps` 为 `{ step, current, total, busy, next, prev, skip }`。

### 事件 {#events}

| 事件          | 参数            | 说明                   |
| ------------- | --------------- | ---------------------- |
| `update:open` | `open: boolean` | 打开或关闭             |
| `update:step` | `step: number`  | 切换步骤               |
| `finish`      | —               | 在最后一步点击「完成」 |
| `skip`        | —               | 点击关闭按钮或按 Esc   |

### Expose {#expose}

::: vue

`next()`、`prev()`、`goTo(step)` 与 `close()` 可通过组件引用访问。前三个会经过 `beforeChange`；`close()` 直接关闭，不触发 `finish` 与 `skip`。

:::

::: react

`next()`、`prev()`、`goTo(step)` 与 `close()` 可通过 ref 访问。前三个会经过 `beforeChange`；`close()` 直接关闭，不调用 `onFinish` 与 `onSkip`。

:::
