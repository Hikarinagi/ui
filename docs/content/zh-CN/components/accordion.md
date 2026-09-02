---
title: Accordion
description: 多段内容依次展开与收起的折叠列表。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/accordion/Accordion.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/accordion/accordion.variants.ts
---

<Demo name="accordion/hero" />

## 用法 {#usage}

```ts
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@hikarinagi/ui'
```

组件由四部分构成：`Accordion` 持有展开状态，`AccordionItem` 是一段内容，`AccordionTrigger` 是该段的标题与切换控件，`AccordionContent` 是被折叠的正文。每一段以 `value` 标识。

默认一次只展开一段，点击另一段时当前段收起。触发器自带随开合旋转的指示物。

<Demo name="accordion/basic" />

只有一处内容需要折叠时使用 `Collapsible`。

## 示例 {#examples}

### 允许全部收起 {#collapsible}

默认展开的一段不能再次点击收起。设置 `collapsible` 后可以收起当前段，列表可以处于全部收起的状态。`defaultValue` 指定初始展开的段。

<Demo name="accordion/collapsible" />

### 多段同时展开 {#multiple}

`type` 设为 `multiple` 后各段独立开合，`v-model` 与 `defaultValue` 的值为数组。

<Demo name="accordion/multiple" />

### 受控 {#controlled}

`v-model` 将展开状态交由外部持有，页面上的其他控件也可以切换展开的段。

<Demo name="accordion/controlled" />

### 禁用 {#disabled}

`AccordionItem` 的 `disabled` 禁用单段，`Accordion` 的 `disabled` 禁用整组。

<Demo name="accordion/disabled" />

### 标题层级 {#level}

触发器渲染在标题元素内，默认为 `h3`。`level` 可以改为其他层级，以符合页面的标题结构。

<Demo name="accordion/level" />

### 更换指示物 {#icon}

`icon` 插槽仅替换指示物的字形，旋转仍由组件负责；将 `icon` 设为 `false` 则不显示指示物。

<Demo name="accordion/icon" />

## 行为 {#behavior}

- 展开与收起时内容区的高度随之变化，两个方向使用同一组过渡参数。
- 收起时内容从无障碍树中移除，键盘焦点不会进入其中。
- 各段之间以细线分隔。组件本身没有底色与边框，需要卡片外观时放入 `Card`。

## 无障碍 {#a11y}

- 触发器是标题中的按钮，带 `aria-expanded` 与 `aria-controls`。
- 上下方向键在触发器之间移动焦点，`Home` 与 `End` 跳到首尾。
- 内容区带 `region` 角色，屏幕阅读器按区域朗读。

## API {#api}

### Accordion {#props}

| 属性           | 类型                     | 默认值     | 说明                            |
| -------------- | ------------------------ | ---------- | ------------------------------- |
| `type`         | `'single' \| 'multiple'` | `'single'` | 一次展开一段或者多段            |
| `collapsible`  | `boolean`                | `false`    | `single` 模式下是否允许全部收起 |
| `modelValue`   | `string \| string[]`     | —          | 展开的段，支持 `v-model`        |
| `defaultValue` | `string \| string[]`     | —          | 初始展开的段                    |
| `disabled`     | `boolean`                | `false`    | 是否禁用整组                    |
| `class`        | `string`                 | —          | 追加至根元素的类名              |

| 事件                | 参数                        | 说明         |
| ------------------- | --------------------------- | ------------ |
| `update:modelValue` | `value: string \| string[]` | 展开的段变化 |

### AccordionItem {#item}

| 属性       | 类型      | 默认值  | 说明             |
| ---------- | --------- | ------- | ---------------- |
| `value`    | `string`  | —       | 该段的标识，必填 |
| `disabled` | `boolean` | `false` | 是否禁用该段     |
| `class`    | `string`  | —       | 追加至该段的类名 |

### AccordionTrigger {#trigger}

| 属性    | 类型                    | 默认值 | 说明               |
| ------- | ----------------------- | ------ | ------------------ |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `3`    | 标题层级           |
| `icon`  | `boolean`               | `true` | 是否显示展开指示物 |
| `class` | `string`                | —      | 追加至触发器的类名 |

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 触发器的文字     |
| `icon`    | 替换指示物的字形 |

### AccordionContent {#content}

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `class` | `string` | —      | 追加至内容区的类名 |
