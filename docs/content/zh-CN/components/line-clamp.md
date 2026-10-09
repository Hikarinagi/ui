---
title: LineClamp
description: 把长内容折叠到指定行数，超出时显示展开按钮。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/line-clamp/LineClamp.vue
---

<Demo name="line-clamp/hero" />

## 用法 {#usage}

```ts
import { LineClamp } from '@hina-ui/vue'
```

把内容放入默认插槽。超过 3 行的部分被折叠，底部渐隐，下方出现「展开全部」按钮；展开后按钮变为「收起」。内容没有超过行数时不显示按钮。

::: vue

```vue
<LineClamp>{{ synopsis }}</LineClamp>
```

:::

::: react

```tsx
<LineClamp>{synopsis}</LineClamp>
```

:::

宽度由容器或 `class` 决定。遮住剧透内容使用 [Spoiler](/components/spoiler)，展开与收起一整块区域使用 [Collapsible](/components/collapsible)。

## 示例 {#examples}

### 行数 {#lines}

`lines` 设置折叠后保留的行数，默认为 3。小数向下取整，小于 1 时按 1 处理。

<Demo name="line-clamp/lines" />

### 块级内容 {#content}

默认插槽可以放 `Text` 段落或 `Prose` 等块级内容。行数跨段落累计，按内部文字的行高计算。

<Demo name="line-clamp/content" />

### 受控 {#controlled}

::: vue

`v-model:expanded` 绑定展开状态，页面上的其他控件可以展开或收起同一段内容。

:::

::: react

`expanded` 与 `onExpandedChange` 将展开状态交由外部持有，页面上的其他控件可以展开或收起同一段内容。不需要外部控制时，用 `defaultExpanded` 指定初始状态。`LineClamp` 自身是客户端组件，可以直接在 Server Component 中渲染；传入 `onExpandedChange` 的模块需要声明 `'use client'`。

:::

<Demo name="line-clamp/controlled" />

### 自定义文案 {#labels}

按钮文案默认取自界面语言的 `lineClamp.expand` 与 `lineClamp.collapse`。`expand-label` 与 `collapse-label` 替换单个组件的文案。

<Demo name="line-clamp/labels" />

## 行为 {#behavior}

- 折叠高度由 CSS 按行截断得出。按钮始终由服务端输出，是否显示按钮与渐隐由 CSS 按内容是否溢出决定，首帧就是最终状态，激活前后的布局与外观一致。
- 不支持滚动驱动动画（`animation-timeline`）的浏览器在激活前按内容超出处理：显示按钮，不显示渐隐，末行以省略号结尾；激活后按测量结果修正。
- `expanded` 初始为 `true` 时，激活前显示「收起」；激活后内容不超过行数则移除按钮。
- 激活后，容器宽度、内容或 `lines` 变化时重新测量，字体加载完成后再测量一次。按钮随测量结果显示或隐藏，展开状态下的「收起」同样如此。
- 展开与收起带高度过渡，底部的渐隐随之淡出与淡入；过渡途中再次切换时，从当前高度折回。系统开启减少动态效果时不播放过渡。
- 渐隐用遮罩实现，不依赖背景色；最多覆盖 1.5 行，行数较少时按比例缩短。展开稳定后移除遮罩。
- 通过按钮收起后，过渡结束时组件滚动回可视范围内。
- 折叠只裁切显示范围，完整内容始终保留在 DOM 中。

## 无障碍 {#a11y}

- 按钮是原生 `button`，可以聚焦，回车键与空格键都能触发。
- `aria-expanded` 反映当前是否展开，`aria-controls` 指向内容区域。
- 被裁切的文字不对辅助技术隐藏。
- 内容不超过行数时，按钮不显示，也不进入焦点顺序与无障碍树。

## API {#api}

### Props {#props}

::: vue

| 属性            | 类型      | 默认值       | 说明                                 |
| --------------- | --------- | ------------ | ------------------------------------ |
| `lines`         | `number`  | `3`          | 折叠后保留的行数，向下取整，最小为 1 |
| `expanded`      | `boolean` | `false`      | 是否展开，支持 `v-model:expanded`    |
| `expandLabel`   | `string`  | 取自界面语言 | 展开按钮的文案                       |
| `collapseLabel` | `string`  | 取自界面语言 | 收起按钮的文案                       |
| `class`         | `string`  | —            | 追加至根元素的类名                   |

未声明的属性都会传给根元素。

:::

::: react

| 属性              | 类型      | 默认值       | 说明                                 |
| ----------------- | --------- | ------------ | ------------------------------------ |
| `lines`           | `number`  | `3`          | 折叠后保留的行数，向下取整，最小为 1 |
| `expanded`        | `boolean` | —            | 是否展开，传入后受控                 |
| `defaultExpanded` | `boolean` | `false`      | 非受控时的初始状态                   |
| `expandLabel`     | `string`  | 取自界面语言 | 展开按钮的文案                       |
| `collapseLabel`   | `string`  | 取自界面语言 | 收起按钮的文案                       |
| `className`       | `string`  | —            | 追加至根元素的类名                   |

未声明的属性都会传给根元素的 `div`，`ref` 指向该元素。

:::

### 插槽 {#slots}

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 被折叠的内容 |

### 事件 {#events}

| 事件              | 参数                | 说明         |
| ----------------- | ------------------- | ------------ |
| `update:expanded` | `expanded: boolean` | 展开状态变化 |
