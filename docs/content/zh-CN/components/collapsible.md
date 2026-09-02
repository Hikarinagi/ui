---
title: Collapsible
description: 由一个触发器控制展开与收起的区域。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/collapsible/Collapsible.vue
---

<Demo name="collapsible/hero" />

## 用法 {#usage}

```ts
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@hikarinagi/ui'
```

组件由三部分构成：`Collapsible` 持有开合状态，`CollapsibleTrigger` 是切换开合的控件，`CollapsibleContent` 是被折叠的内容。

触发器本身即为完整的控件，并自带随开合旋转的指示物。只需写入文字，无需组合按钮，也无需处理过渡。

<Demo name="collapsible/basic" />

触发器的外观固定为一种克制的样式，因为它只需表达展开与收起两种状态。正文中的「展开全部」这类需要文字链外观的场合，通过 `as-child` 更换整个触发器，详见下文。

仅有一处内容需要折叠时使用该组件。同一组内多段内容互斥展开时，应使用 `Accordion`。

## 示例 {#examples}

### 受控 {#controlled}

`v-model:open` 将开合状态交由外部持有，页面上的其他控件也可操作同一区域。无需外部控制时，用 `default-open` 指定初始状态即可。

<Demo name="collapsible/controlled" />

### 禁用 {#disabled}

设置 `disabled` 后触发器不再响应点击，内容保持当前状态。

<Demo name="collapsible/disabled" />

### 更换字形与自带触发器 {#custom}

`icon` 插槽仅替换指示物的字形，旋转仍由组件负责；将 `icon` 设为 `false` 则不显示指示物。

`as-child` 将行为借给唯一的子元素，触发器的外观与指示物随之交由调用方决定。文字链、描边、整宽带图标位等外观变化均通过该方式实现；如需箭头，自行放置一个 `DisclosureIcon` 即可，它仍能获取状态。本页顶部的示例采用的正是 `variant="link"` 的文字链外观。

<Demo name="collapsible/custom" />

组件不转发 `variant` 等外观属性：展开开关只需表达展开与收起，若引入按钮的全部外观维度，该 API 将逐渐演变为第二个 Button。需要更换外观时，应当整体替换触发器。

## 行为 {#behavior}

- 展开与收起时内容区的高度随之变化，两个方向使用同一组过渡参数。
- 收起时内容从无障碍树中移除，键盘焦点不会进入其中。

## API {#api}

### Collapsible {#props}

| 属性          | 类型      | 默认值  | 说明                          |
| ------------- | --------- | ------- | ----------------------------- |
| `open`        | `boolean` | —       | 是否展开，支持 `v-model:open` |
| `defaultOpen` | `boolean` | `false` | 初始是否展开                  |
| `disabled`    | `boolean` | `false` | 是否不可操作                  |
| `class`       | `string`  | —       | 追加至根元素的类名            |

| 事件          | 参数            | 说明         |
| ------------- | --------------- | ------------ |
| `update:open` | `open: boolean` | 开合状态变化 |

### CollapsibleTrigger {#trigger}

| 属性      | 类型      | 默认值  | 说明                                   |
| --------- | --------- | ------- | -------------------------------------- |
| `icon`    | `boolean` | `true`  | 是否显示展开指示物                     |
| `asChild` | `boolean` | `false` | 不渲染自带的按钮，把行为借给唯一子元素 |
| `class`   | `string`  | —       | 追加至触发器的类名                     |

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 触发器的文字     |
| `icon`    | 替换指示物的字形 |

### CollapsibleContent {#content}

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `class` | `string` | —      | 追加至内容区的类名 |
