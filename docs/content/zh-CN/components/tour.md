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

`target` 可以是 CSS 选择器、元素、返回目标的函数、`{ x, y, width, height }` 形式的矩形（例如 `DOMRect`）、带 `getBoundingClientRect()` 的虚拟元素，或者由这些组成的数组，数组的高亮区域是所有目标的外接矩形。目标在步骤切换时取值，可以指向打开引导之后才渲染的元素。矩形使用视口坐标；元素与虚拟元素在页面滚动、尺寸变化时跟随更新。

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

`:mask="false"` 去掉遮罩，页面在引导期间仍可操作，卡片不再是模态对话框。`mask="dim"` 保留遮罩，只把页面变暗，不做模糊。

<Demo name="tour/plain" />

### 演示脚本 {#play}

步骤的 `play` 在进入这一步时执行，可以是异步函数，用来在真实界面上演示操作：打开面板、移动高亮、驱动虚拟指针。它收到的上下文：

- `signal`：离开这一步或关闭引导时中止。
- `defer(cleanup)`：登记清理函数。离开这一步、关闭引导或重新演示时，先中止 `signal`，再按登记的逆序执行清理。
- `spotlight(target?, options?)`：在这一步内把高亮移到另一个目标，卡片跟随移动；省略 `target` 时回到步骤的目标，传 `null` 时收起高亮、卡片居中。`options` 可以带 `padding`、`radius` 与 `wait`，高亮停稳后 Promise 完成。
- `pointer`：虚拟指针，见下文。
- `waitFor(target, timeout?)`：等待目标出现，返回是否出现，默认最多等 5000ms。
- `sleep(ms)`：等待一段时间。

`signal` 中止后，`sleep`、`spotlight`、`waitFor` 与指针方法以 `AbortError` 拒绝，脚本随之停止，引导忽略这个错误。

带 `play` 的步骤在卡片底部显示「重新演示」按钮。它与 `replay()` 相同：执行清理，把高亮移回步骤的目标，再重新运行脚本。

`blockPage` 让整个页面（包括高亮区域）在这一步不响应点击与输入，卡片仍然可以操作，可以设在整个引导或单个步骤上。

<Demo name="tour/play" />

### 虚拟指针 {#pointer}

`pointer` 在引导上方画出一个不拦截点击的指针。它只做展示，不派发事件；需要真实操作时由脚本完成，例如修改状态或调用 `click()`。

| 方法                               | 说明                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `move(target, duration?)`          | 移到目标中心或 `{ x, y }`，默认 600ms；隐藏时从目标右下方淡入移入         |
| `tap()`                            | 按下再松开，带涟漪                                                        |
| `press(duration?)`                 | 长按，默认 800ms，期间显示扩散的圆                                        |
| `drag(target, duration?, onMove?)` | 按住拖到目标，默认 800ms；`onMove` 每帧收到指针坐标，可以据此派发真实事件 |
| `key(key, duration?)`              | 显示按键提示，默认 700ms；指针可见时显示在指针旁，否则显示在视口底部      |
| `hide()`                           | 隐藏指针                                                                  |

移动与拖动的终点每帧重新读取，目标在移动时指针跟着它走。目标不存在时方法以错误拒绝，要等界面更新后才出现的目标先用 `waitFor()` 等它出现。

指针外观默认按 `(pointer: coarse)` 选择：精确指针显示鼠标箭头，触屏显示手指圆点；`pointer` 属性可以固定为 `'mouse'` 或 `'touch'`。开启减少动态效果时，移动与拖动直接到达终点，`onMove` 只收到终点坐标。离开这一步时指针隐藏。

### 等待目标 {#wait}

`wait` 是等待目标出现的最长毫秒数。切换到这一步时目标还不存在，例如要等脚本打开面板，卡片先隐藏，高亮停在上一步的位置；目标出现后卡片直接出现在新位置。超时仍未出现时卡片居中显示。

### 与模态浮层共存 {#overlays}

引导叠放在 Dialog、Drawer、Sheet、菜单等浮层之上，层级为 `--hn-z-overlay` 加 1。脚本打开的模态浮层把引导当作自身的一部分：点击卡片或遮罩不会关闭浮层，卡片不会对读屏器隐藏，焦点留在卡片上。页面上自绘的其他图层可以用 [OverlayBranch](/components/overlay-branch) 得到同样的处理。

## 行为 {#behavior}

::: vue

- 打开时焦点移到卡片上，关闭后回到打开前的位置。
- 有遮罩时卡片是模态的：页面其余部分对读屏器隐藏，Tab 只在卡片内循环；目标没有被 `blockTarget` 挡住时也算进循环。
- ← 与 → 切换上一步与下一步，在 RTL 下互换；Esc 跳过引导并触发 `skip` 与 `close` 事件。按键在引导打开期间全局生效，焦点不必在卡片上；输入框里的方向键不受影响。没有 `play` 与 `blockPage` 的步骤里，从目标打开的浮层先处理按键。点击遮罩不会关闭引导。
- 最后一步的按钮是「完成」，点击后触发 `finish` 事件并关闭。
- 切换步骤时，不在视口内的目标会被滚动到中央；`scroll: false` 关闭这一行为。目标移动、尺寸变化或页面滚动时，遮罩与卡片跟随更新。
- 切换步骤时卡片先隐藏，高亮以弹簧动画移到新目标，停稳后卡片直接出现在新位置；同一步内用 `spotlight()` 移动高亮时，卡片跟随移动。
- 高亮区域出现时从目标中心展开，切到没有目标的步骤时在原处收拢到目标中心，展开与收拢都用 300ms。
- 卡片在目标一侧放不下时翻到另一侧，仍放不下时平移进视口，必要时压在目标上。
- 页面不会停止滚动；引导在服务端不输出内容。

:::

::: react

- 打开时焦点移到卡片上，关闭后回到打开前的位置。
- 有遮罩时卡片是模态的：页面其余部分对读屏器隐藏，Tab 只在卡片内循环；目标没有被 `blockTarget` 挡住时也算进循环。
- ← 与 → 切换上一步与下一步，在 RTL 下互换；Esc 跳过引导并调用 `onSkip` 与 `onClose`。按键在引导打开期间全局生效，焦点不必在卡片上；输入框里的方向键不受影响。没有 `play` 与 `blockPage` 的步骤里，从目标打开的浮层先处理按键。点击遮罩不会关闭引导。
- 最后一步的按钮是「完成」，点击后调用 `onFinish` 并关闭。
- 切换步骤时，不在视口内的目标会被滚动到中央；`scroll: false` 关闭这一行为。目标移动、尺寸变化或页面滚动时，遮罩与卡片跟随更新。
- 切换步骤时卡片先隐藏，高亮以弹簧动画移到新目标，停稳后卡片直接出现在新位置；同一步内用 `spotlight()` 移动高亮时，卡片跟随移动。
- 高亮区域出现时从目标中心展开，切到没有目标的步骤时在原处收拢到目标中心，展开与收拢都用 300ms。
- 卡片在目标一侧放不下时翻到另一侧，仍放不下时平移进视口，必要时压在目标上。
- 页面不会停止滚动；引导在服务端不输出内容。

:::

## 无障碍 {#a11y}

- 卡片是 `role="dialog"`，有遮罩时带 `aria-modal`，名称取自步骤标题，说明关联到 `aria-describedby`。
- 等待 `beforeChange` 期间卡片带有 `aria-busy`。
- 信标是一个按钮，名称包含步骤序号与标题。
- 虚拟指针与按键提示对读屏器隐藏。
- 按钮文字、进度与信标名称取自当前语言，可以替换。

## API {#api}

### Props {#props}

| 属性           | 类型                           | 默认值   | 说明                                       |
| -------------- | ------------------------------ | -------- | ------------------------------------------ |
| `steps`        | `TourStep[]`                   | 必填     | 步骤列表                                   |
| `v-model:open` | `boolean`                      | `false`  | 是否打开                                   |
| `v-model:step` | `number`                       | `1`      | 当前步骤，从 1 开始                        |
| `mask`         | `boolean \| 'dim'`             | `true`   | 显示遮罩，卡片为模态；`'dim'` 只变暗不模糊 |
| `locked`       | `boolean`                      | `false`  | 隐藏关闭按钮，Esc 不跳过引导               |
| `beacon`       | `boolean`                      | `false`  | 打开时先显示信标，点击后打开卡片           |
| `blockTarget`  | `boolean`                      | `false`  | 挡住所有步骤的目标                         |
| `blockPage`    | `boolean`                      | `false`  | 整个页面不响应点击与输入，卡片除外         |
| `pointer`      | `'auto' \| 'mouse' \| 'touch'` | `'auto'` | 虚拟指针的外观                             |
| `beforeChange` | `TourBeforeChange`             | —        | 切换前调用，返回 `false` 时停在当前步骤    |
| `nextText`     | `string`                       | 当前语言 | 「下一步」按钮的文字                       |
| `prevText`     | `string`                       | 当前语言 | 「上一步」按钮的文字                       |
| `finishText`   | `string`                       | 当前语言 | 最后一步按钮的文字                         |
| `skipText`     | `string`                       | 当前语言 | 关闭按钮的名称                             |
| `replayText`   | `string`                       | 当前语言 | 「重新演示」按钮的名称                     |
| `dir`          | `'ltr' \| 'rtl'`               | 继承     | 阅读方向                                   |
| `class`        | `string`                       | —        | 追加至卡片的类名                           |

`TourBeforeChange` 为 `(step: number, previousStep: number) => boolean | void | Promise<boolean | void>`。

### TourStep {#step}

| 字段          | 类型                                                  | 默认值     | 说明                                         |
| ------------- | ----------------------------------------------------- | ---------- | -------------------------------------------- |
| `target`      | `TourTarget`                                          | —          | 高亮的目标，见[用法](#usage)，为空时卡片居中 |
| `title`       | `string`                                              | —          | 标题                                         |
| `description` | `string`                                              | —          | 说明                                         |
| `side`        | `'top' \| 'right' \| 'bottom' \| 'left'`              | `'bottom'` | 卡片相对目标的方向                           |
| `align`       | `'start' \| 'center' \| 'end'`                        | `'center'` | 卡片与目标的对齐方式                         |
| `padding`     | `number`                                              | `8`        | 高亮区域向外扩展的距离，像素                 |
| `radius`      | `number`                                              | `8`        | 高亮区域的圆角，像素                         |
| `scroll`      | `boolean`                                             | `true`     | 目标不在视口内时滚动到中央                   |
| `blockTarget` | `boolean`                                             | 继承       | 挡住这一步的目标                             |
| `blockPage`   | `boolean`                                             | 继承       | 这一步锁定整个页面                           |
| `wait`        | `number`                                              | `0`        | 等待目标出现的最长毫秒数                     |
| `play`        | `(context: TourPlayContext) => void \| Promise<void>` | —          | 进入这一步时执行的演示脚本                   |
| `beacon`      | `boolean`                                             | —          | 见[信标](#beacon)                            |

### 插槽 {#slots}

| 插槽      | 参数            | 说明                 |
| --------- | --------------- | -------------------- |
| `content` | `TourSlotProps` | 替换说明             |
| `footer`  | `TourSlotProps` | 替换底部的进度与按钮 |

`TourSlotProps` 为 `{ step, current, total, busy, playing, next, prev, skip, replay }`，`playing` 表示脚本正在运行。

### 事件 {#events}

| 事件          | 参数                      | 说明                                                                                   |
| ------------- | ------------------------- | -------------------------------------------------------------------------------------- |
| `update:open` | `open: boolean`           | 打开或关闭                                                                             |
| `update:step` | `step: number`            | 切换步骤                                                                               |
| `finish`      | —                         | 在最后一步点击「完成」                                                                 |
| `skip`        | —                         | 点击关闭按钮或按 Esc                                                                   |
| `stepEnter`   | `step: number`            | 进入一个步骤，在脚本开始前                                                             |
| `stepLeave`   | `step: number`            | 离开一个步骤，在清理之后                                                               |
| `close`       | `reason: TourCloseReason` | 引导关闭，原因为 `'finish'`、`'skip'`、`'escape'` 或 `'close'`（`close()` 或外部关闭） |

### Expose {#expose}

::: vue

`next()`、`prev()`、`goTo(step)`、`close()` 与 `replay()` 可通过组件引用访问。前三个会经过 `beforeChange`；`close()` 直接关闭，不触发 `finish` 与 `skip`；`replay()` 重新运行当前步骤的脚本。

:::

::: react

`next()`、`prev()`、`goTo(step)`、`close()` 与 `replay()` 可通过 ref 访问。前三个会经过 `beforeChange`；`close()` 直接关闭，不调用 `onFinish` 与 `onSkip`；`replay()` 重新运行当前步骤的脚本。

:::
