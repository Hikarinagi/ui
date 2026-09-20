---
title: ScrollTop
description: 滚动超过阈值后出现，返回页面或指定容器的顶部。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/scroll-top/ScrollTop.vue
---

<Demo name="scroll-top/hero" />

## 用法 {#usage}

```ts
import { ScrollTop } from '@hina-ui/vue'
```

不传 `target` 时监听页面 `window`，默认滚动超过 300px 后显示。点击只改变纵向位置，保留横向位置。

```vue
<ScrollTop />
```

页面由 `AppShell`、`ScrollArea` 或 Dialog 内部容器滚动时，传入它们暴露的 viewport。**滚动目标与按钮定位是独立的**：`target` 决定滚动哪个元素，`position` 决定按钮摆在哪里。

```vue
<Card class="relative" :padded="false">
  <ScrollArea ref="area" class="h-72">…</ScrollArea>
  <ScrollTop :target="() => area?.viewport" position="absolute" />
</Card>
```

`AppShell` 对应 `() => shell?.mainViewport`。默认固定定位时，将按钮放在应用壳外层；局部使用则放在滚动区域的外面、定位容器里面，避免按钮跟着内容一起滚走。

## 示例 {#examples}

### 外观、滚动方式与焦点 {#custom}

沿用 `FloatButton` 的尺寸、形状、文字和定位。默认平滑滚动；`behavior="instant"` 立即定位。系统开启减少动态效果时，总是立即定位。

默认保留键盘用户的按钮焦点，直到焦点离开才隐藏。也可以通过 `focus-target` 将焦点明确移到顶部标题；目标需可聚焦，例如设置 `tabindex="-1"` 的标题。

<Demo name="scroll-top/custom" />

### 延迟挂载的目标 {#target}

传入 getter 可以跟随 `ScrollArea` 的初始化、卸载和替换。getter 返回空值时按钮隐藏，不会回退到页面滚动。切换目标时旧监听器会被移除，新目标立即按自己的滚动位置决定显隐。

<Demo name="scroll-top/target" />

## 行为 {#behavior}

- 只监听目标的被动 `scroll` 事件，不逐帧轮询或扫描内容。
- 服务端不读取目标 getter，也不渲染回顶按钮；挂载后读取真实滚动位置。
- 按钮在纵向滚动位置严格大于 `threshold` 时显示。数值变化可以动态生效。
- `loading` / `disabled` 阻止点击和暴露方法触发滚动。
- `@click.prevent` 可取消默认回顶行为。`click` 表示操作被触发，不代表平滑滚动已经结束。

## API {#api}

### Props {#props}

| 属性          | 类型                                                                                  | 默认值               | 说明                                                |
| ------------- | ------------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------- |
| `target`      | `HTMLElement \| Window \| null \| (() => HTMLElement \| Window \| null \| undefined)` | `window`             | 滚动目标；传 getter 等待异步容器                    |
| `threshold`   | `number`                                                                              | `300`                | 按钮显示的纵向阈值，单位 px                         |
| `behavior`    | `'smooth' \| 'instant' \| 'auto'`                                                     | `'smooth'`           | 滚动方式；`auto` 遵循目标的 CSS 滚动行为            |
| `focusTarget` | `HTMLElement \| (() => HTMLElement \| null \| undefined)`                             | —                    | 激活时聚焦此节点，使用 `preventScroll` 避免额外跳动 |
| `label`       | `string`                                                                              | 当前语言的“返回顶部” | 按钮名称                                            |
| `variant`     | `'solid' \| 'soft' \| 'outline'`                                                      | `'outline'`          | 按钮外观                                            |
| `tone`        | `'accent' \| 'neutral' \| 'danger'`                                                   | `'neutral'`          | 按钮色调                                            |

另外支持 [FloatButton](/components/float-button) 的 `position`、`placement`、`offset`、`size`、`shape`、`extended`、`tooltip`、`tooltipSide`、`loading`、`disabled`、`ripple`、`class` 和 `style`，默认值相同。显隐由滚动状态决定，不接收 `visible`。

### Slots {#slots}

| 插槽      | 默认内容 | 说明         |
| --------- | -------- | ------------ |
| `default` | 向上箭头 | 替换按钮图标 |

### Events {#events}

| 事件    | 参数         | 说明                         |
| ------- | ------------ | ---------------------------- |
| `click` | `MouseEvent` | 点击回顶按钮；可阻止默认行为 |

### Expose {#expose}

| 名称          | 类型         | 说明                       |
| ------------- | ------------ | -------------------------- |
| `visible`     | `boolean`    | 当前显示状态（只读）       |
| `scrollToTop` | `() => void` | 使用当前配置滚动到目标顶部 |
