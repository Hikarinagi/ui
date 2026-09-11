---
title: Popover
description: 点击触发器后浮出的面板。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/popover/Popover.vue
  - label: Popover
    href: https://reka-ui.com/docs/components/popover
---

<Demo name="popover/hero" />

## 用法 {#usage}

```ts
import { Popover } from '@hina-ui/vue'
```

默认插槽是触发器，`content` 插槽是浮出的内容。点击触发器打开面板，再次点击触发器或点击面板外部关闭。面板中的内容可以自由排布，也可以获得焦点。

<Demo name="popover/basic" />

## 示例 {#examples}

### 位置 {#placement}

`side` 指定面板朝哪个方向浮出，`align` 指定它与触发器的对齐方式。默认在正下方，空间不足时翻转到相反一侧。

<Demo name="popover/placement" />

### 间距 {#offset}

`sideOffset` 是面板与触发器之间的距离，单位为像素。

<Demo name="popover/offset" />

### 受控 {#controlled}

`open` 支持双向绑定，既可以从外部打开或关闭面板，面板内部的按钮也可以关闭它。

<Demo name="popover/controlled" />

### 外部锚点 {#anchor}

`anchor` 接受 `HTMLElement | null`。设置后可以省略默认插槽，通过 `v-model:open` 控制开关。锚点尚未就绪时面板不显示；打开期间更换锚点会更新位置，关闭时清空锚点会保留退场位置。

同时提供默认插槽与 `anchor` 时，插槽负责触发，`anchor` 负责定位。外部元素的点击与键盘行为、`aria-haspopup` 和 `aria-expanded` 由调用方设置。

<Demo name="popover/anchor" />

### 模态 {#modal}

`modal` 默认为 `true`，打开时锁定页面滚动并限制外部交互。设置 `:modal="false"` 后，页面可以继续滚动和交互，点击外部仍会关闭面板。

### 焦点与关闭 {#focus}

`openAutoFocus`、`closeAutoFocus` 可以通过 `event.preventDefault()` 取消默认聚焦。没有默认触发器时，关闭后恢复打开前的焦点；锚点仅用于定位。调用方已经将焦点移到面板外时，不会再次恢复旧焦点。

通过 `interactOutside` 可以取消外部点击或焦点移出引起的关闭，`escapeKeyDown` 可以取消 Esc 关闭。`aria-label`、`aria-describedby` 和 `data-*` 属性会传给面板。

### 自定义内边距 {#padded}

面板默认带内边距。内容需要延伸到边缘时设置 `padded="false"`，由内容自行安排留白。

<Demo name="popover/padded" />

### 触发器 {#trigger}

触发器不限于按钮，任何能获得焦点的元素都可以。用图标按钮作为触发器时，关闭它自带的提示，以免两层浮层叠在一起。

<Demo name="popover/trigger" />

## 行为 {#behavior}

- 默认模态下，面板打开期间页面停止滚动。
- 触发器在面板打开期间保持按下时的样式。
- 面板打开后焦点移入面板，按 Esc 关闭并把焦点交还给触发器。
- 默认模态下，点击面板外部关闭面板，这次点击不会传到下层的元素上。

## 无障碍 {#a11y}

- 触发器带有 `aria-haspopup="dialog"` 和 `aria-expanded`，面板是 `role="dialog"`。
- 面板中的标题、说明和表单控件都按普通页面内容处理，屏幕阅读器逐项播报。
- 没有默认触发器时，通过 `aria-label` 为面板提供名称；关闭后默认恢复打开前的焦点。

## API {#api}

### Popover {#props}

| 属性         | 类型                                     | 默认值     | 说明                   |
| ------------ | ---------------------------------------- | ---------- | ---------------------- |
| `open`       | `boolean`                                | —          | 是否打开，支持双向绑定 |
| `anchor`     | `HTMLElement \| null`                    | —          | 外部定位元素           |
| `modal`      | `boolean`                                | `true`     | 是否限制外部交互并锁滚 |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 朝哪个方向浮出         |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'` | 与触发器的对齐方式     |
| `sideOffset` | `number`                                 | `8`        | 与触发器的距离         |
| `padded`     | `boolean`                                | `true`     | 面板是否带内边距       |
| `class`      | `string`                                 | —          | 追加到面板上的类名     |

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 可选触发器   |
| `content` | 面板中的内容 |

| 事件                 | 参数                                           | 说明                                 |
| -------------------- | ---------------------------------------------- | ------------------------------------ |
| `openAutoFocus`      | `Event`                                        | 打开时聚焦前触发，可取消             |
| `closeAutoFocus`     | `Event`                                        | 关闭时恢复焦点前触发，可取消         |
| `escapeKeyDown`      | `KeyboardEvent`                                | 按 Esc 时触发，可取消关闭            |
| `pointerDownOutside` | `PointerDownOutsideEvent`                      | 外部按下时触发，可取消关闭           |
| `focusOutside`       | `FocusOutsideEvent`                            | 焦点移到外部时触发，可取消关闭       |
| `interactOutside`    | `PointerDownOutsideEvent \| FocusOutsideEvent` | 外部按下或焦点移出时触发，可取消关闭 |
